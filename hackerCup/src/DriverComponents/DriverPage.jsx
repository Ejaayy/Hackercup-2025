import './driverPageStyle.css';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useRef } from 'react';
import RoutingMachine from './../RoutingMachine';
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

const VehicleIcon = new L.Icon({
    iconUrl: "/src/assets/vehicle.png",
    iconSize: [38,38]
});

// Component to animate the driver along the route
function AnimatedRoute({ routeWaypoints, setDriverPosition }) {
    const map = useMap();
    const routeCoordsRef = useRef([]);
    const animRef = useRef({ index: 0, direction: 1 });

    useEffect(() => {
        if (!map) return;

        const waypoints = routeWaypoints.map(p => L.latLng(p.geocode[0], p.geocode[1]));

        const routingControl = L.Routing.control({
            waypoints,
            createMarker: () => null, // endpoints handled separately
            routeWhileDragging: false,
            addWaypoints: false,
        }).addTo(map);

        routingControl.on('routesfound', (e) => {
            const route = e.routes[0];
            routeCoordsRef.current = route.coordinates;
        });

        return () => map.removeControl(routingControl);
    }, [map, routeWaypoints]);

    useEffect(() => {
        const coords = routeCoordsRef.current;
        if (!coords.length) return;

        const interval = setInterval(() => {
            let { index, direction } = animRef.current; // read the latest values

            index += 0.0001 * direction; // slower movement

            if (index >= coords.length - 1) { index = coords.length - 1; direction *= -1; }
            if (index <= 0) { index = 0; direction *= -1; }

            const lower = Math.floor(index);
            const upper = Math.ceil(index);
            const factor = index - lower;
            const lat = coords[lower].lat + factor * (coords[upper].lat - coords[lower].lat);
            const lng = coords[lower].lng + factor * (coords[upper].lng - coords[lower].lng);

            setDriverPosition([lat, lng]);
            animRef.current = { index, direction }; // save updated values
        }, 100); // you can adjust this interval too

        return () => clearInterval(interval);
    }, [setDriverPosition]);



    return null;
}

function DriverPage() {
    const navigate = useNavigate();
    const [selectedRouteKey, setSelectedRouteKey] = useState(routeOptions[0].key);
    const [driverPosition, setDriverPosition] = useState(markersDB[selectedRouteKey][0].geocode);

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
                            <select id="driverStatus">
                                <option value="Van">Van</option>
                                <option value="Jeep">Jeep</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>👥 Passenger Capacity</label>
                            <input type="number" id="capacity" value="20" min="1" max="50" readOnly />
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
                    center={driverPosition}
                    zoom={13}
                    style={{ height: "500px", width: "100%" }}
                >
                    <TileLayer
                        url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
                        attribution='&copy; OpenStreetMap &copy; CARTO'
                    />

                    <AnimatedRoute routeWaypoints={markersDB[selectedRouteKey]} setDriverPosition={setDriverPosition} />

                    {/* Driver marker */}
                    <Marker position={driverPosition} icon={VehicleIcon}>
                        <Popup>🚗 Driver (Following Route)</Popup>
                    </Marker>

                    {/* Endpoint markers */}
                    {markersDB[selectedRouteKey].map((m, idx) => (
                        <Marker key={idx} position={m.geocode}>
                            <Popup>{m.popUp}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}

export default DriverPage;
