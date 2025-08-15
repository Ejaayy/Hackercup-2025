import './driverPageStyle.css';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useRef } from 'react';
import L from "leaflet";
import 'leaflet-routing-machine';

const markersDB = {
    DLSUtoUST: [
        { geocode: [14.564098, 120.994498], popUp: "DLSU Manila" },
        { geocode: [14.607594, 120.990500], popUp: "University of Santo Tomas" },
    ],
    SmMolinoToMOA: [
        { geocode: [14.3840, 120.9770], popUp: "SM City Molino, Bacoor, Cavite" },
        { geocode: [14.5353, 120.9822], popUp: "SM Mall of Asia, Pasay City" },
    ]
};

const routeOptions = [
    { label: "DLSU Manila to UST", key: "DLSUtoUST" },
    { label: "SM MOLINO to MOA", key: "SmMolinoToMOA" },
];

function getVehicleIcon(passengers) {
    return L.divIcon({
        className: "vehicle-icon",
        html: `<div style="background: rgba(255,0,0,0.8); color: white; border-radius: 50%; width: 38px; height: 38px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:14px;">${passengers}</div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
    });
}

// Animate vehicles along the route
function AnimatedVehicles({ routeWaypoints, vehicles, setVehicles, routeCoordsRef }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;
        const waypoints = routeWaypoints.map(p => L.latLng(p.geocode[0], p.geocode[1]));
        const routingControl = L.Routing.control({
            waypoints,
            createMarker: () => null,
            routeWhileDragging: false,
            addWaypoints: false,
        }).addTo(map);

        routingControl.on('routesfound', (e) => {
            const route = e.routes[0];
            routeCoordsRef.current = route.coordinates;
        });

        return () => map.removeControl(routingControl);
    }, [map, routeWaypoints, routeCoordsRef]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!routeCoordsRef.current.length) return;

            setVehicles(prev => prev.map(v => {
                let { index, direction } = v;
                const coords = routeCoordsRef.current;

                index += 0.02 * direction;
                if (index >= coords.length - 1) { index = coords.length - 1; direction *= -1; }
                if (index <= 0) { index = 0; direction *= -1; }

                const lower = Math.floor(index);
                const upper = Math.ceil(index);
                const factor = index - lower;
                const lat = coords[lower].lat + factor * (coords[upper].lat - coords[lower].lat);
                const lng = coords[lower].lng + factor * (coords[upper].lng - coords[lower].lng);

                return { ...v, index, direction, position: [lat, lng] };
            }));
        }, 50);

        return () => clearInterval(interval);
    }, [setVehicles, routeCoordsRef]);

    return null;
}

function DriverPage() {
    const navigate = useNavigate();
    const [selectedRouteKey, setSelectedRouteKey] = useState(routeOptions[0].key);
    const [vehicles, setVehicles] = useState([]);
    const [users, setUsers] = useState([]);
    const [vehicleMaxCapacity, setVehicleMaxCapacity] = useState(20);
    const routeCoordsRef = useRef([]);

    // Initialize vehicles
    useEffect(() => {
        const initialVehicles = [0,1,2].map(id => ({
            id,
            position: markersDB[selectedRouteKey][0].geocode,
            index: 0,
            direction: 1,
            capacity: 0
        }));
        setVehicles(initialVehicles);
    }, [selectedRouteKey]);

    // Spawn users near the route
    useEffect(() => {
        const spawnInterval = setInterval(() => {
            const coords = routeCoordsRef.current;
            if (!coords.length) return;

            // Pick a random point along the route
            const randomIndex = Math.floor(Math.random() * coords.length);
            const base = coords[randomIndex];

            // Random small offset in meters (~20m max)
            const offsetLat = (Math.random() - 0.5) * 0.0002;
            const offsetLng = (Math.random() - 0.5) * 0.0002;

            setUsers(prev => [...prev, { id: Date.now(), position: [base.lat + offsetLat, base.lng + offsetLng] }]);
        }, 2000);

        return () => clearInterval(spawnInterval);
    }, [selectedRouteKey]);

    // Check for pickups
    useEffect(() => {
        const interval = setInterval(() => {
            setVehicles(prevVehicles => {
                return prevVehicles.map(v => {
                    let newCapacity = v.capacity;
                    const remainingUsers = users.filter(u => {
                        const distance = mapDistance(v.position, u.position);
                        if (distance <= 50 && newCapacity < vehicleMaxCapacity) {
                            newCapacity += 1;
                            return false; // picked up
                        }
                        return true;
                    });
                    setUsers(remainingUsers);
                    return { ...v, capacity: newCapacity };
                });
            });
        }, 500);
        return () => clearInterval(interval);
    }, [users, vehicleMaxCapacity]);

    const mapDistance = ([lat1, lng1], [lat2, lng2]) => {
        const R = 6371000; // meters
        const dLat = (lat2-lat1)*Math.PI/180;
        const dLng = (lng2-lng1)*Math.PI/180;
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
        const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R*c;
    };

    return (
        <div id="driverApp" className="main-app">
            <div className="app-header">
                <h2>🚗 Driver Dashboard</h2>
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            </div>

            <div className="app-content">
                <div className="driver-controls">
                    <div className="control-grid">
                        <div className="filter-group">
                            <label>🛣️ Current Route</label>
                            <select
                                value={selectedRouteKey}
                                onChange={(e) => setSelectedRouteKey(e.target.value)}
                            >
                                {routeOptions.map(r => (
                                    <option key={r.key} value={r.key}>{r.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Vehicle Type</label>
                            <select id="driverType">
                                <option value=""></option>
                                <option value="Van">Van</option>
                                <option value="Jeep">Jeep</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>👥 Passenger Capacity</label>
                            <input type="number" value={vehicleMaxCapacity} min="1" max="50"
                                   onChange={(e)=>setVehicleMaxCapacity(Number(e.target.value))}
                            />
                        </div>
                        <div className="filter-group">
                            <label>📍 Current Status</label>
                            <select id="driverStatus">
                                <option value="active">🟢 Active</option>
                                <option value="busy">🟡 Almost Full</option>
                                <option value="full">🔴 Full</option>
                                <option value="offline">⚫ Offline</option>
                            </select>
                        </div>
                    </div>
                </div>

                <MapContainer
                    center={markersDB[selectedRouteKey][0].geocode}
                    zoom={13}
                    style={{ height: "500px", width: "100%" }}
                >
                    <TileLayer
                        url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
                        attribution='&copy; OpenStreetMap &copy; CARTO'
                    />

                    <AnimatedVehicles
                        routeWaypoints={markersDB[selectedRouteKey]}
                        vehicles={vehicles}
                        setVehicles={setVehicles}
                        routeCoordsRef={routeCoordsRef}
                    />

                    {vehicles.map(v => (
                        <Marker key={v.id} position={v.position} icon={getVehicleIcon(v.capacity)}>
                            <Popup>Vehicle ID: {v.id} | Passengers: {v.capacity}</Popup>
                        </Marker>
                    ))}

                    {markersDB[selectedRouteKey].map((m, idx) => (
                        <Marker key={idx} position={m.geocode}>
                            <Popup>{m.popUp}</Popup>
                        </Marker>
                    ))}

                    {users.map(u => (
                        <Marker key={u.id} position={u.position} icon={L.divIcon({className:"user-icon", html:"<div style='background:blue;color:white;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;'>U</div>", iconSize:[20,20], iconAnchor:[10,10]})}>
                            <Popup>User</Popup>
                        </Marker>
                    ))}

                </MapContainer>
            </div>
        </div>
    );
}

export default DriverPage;

