import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useRef } from 'react';
import L from "leaflet";
import 'leaflet-routing-machine';
import './CommuterPageStyle.css';

// Sample routes database
const markersDB = {
    DLSUtoUST: [
        { geocode: [14.564098, 120.994498], popUp: "DLSU Manila", info: "Main campus with engineering and business programs" },
        { geocode: [14.607594, 120.990500], popUp: "University of Santo Tomas", info: "Historic university founded in 1611" },
    ],
    SmMolinoToMOA: [
        { geocode: [14.3840, 120.9770], popUp: "SM City Molino, Bacoor, Cavite", info: "Major shopping center in Cavite" },
        { geocode: [14.5353, 120.9822], popUp: "SM Mall of Asia, Pasay City", info: "One of the largest malls in the Philippines" },
    ]
};

// Vehicle types
const vehicleTypes = ["Van", "Jeep"];

// Route options
const routeOptions = [
    { label: "DLSU Manila to UST", key: "DLSUtoUST" },
    { label: "SM MOLINO to MOA", key: "SmMolinoToMOA" },
];

// Custom vehicle icon with passenger count
function getVehicleIcon(passengers, vehicleType) {
    const color = vehicleType === "Van" ? "#ff4444" : "#4444ff";
    return L.divIcon({
        className: "vehicle-icon",
        html: `<div
            style="
                background: ${color}; 
                color: white; 
                border-radius: 50%; 
                width: 38px; 
                height: 38px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-weight: bold;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                font-size: 12px;
            ">${passengers}</div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
    });
}

// Custom stop icon
const getStopIcon = () => L.divIcon({
    className: "stop-icon",
    html: `<div
        style="
            background: #28a745; 
            color: white; 
            border-radius: 50%; 
            width: 30px; 
            height: 30px; 
            display: flex;
            align-items: center; 
            justify-content: center; 
            font-weight: bold;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">📍</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
});

// Custom user location icon
const getUserIcon = () => L.divIcon({
    className: "user-location-icon",
    html: `<div
        style="
            background: #007bff;
            color: white;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            font-size: 10px;
        ">You</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
});


// A component to handle both the routing line and the vehicle animation
function RouteAndAnimate({ routeWaypoints, vehicles, setVehicles }) {
    const map = useMap();
    const routeCoordsRef = useRef([]);

    // Get the detailed route coordinates
    useEffect(() => {
        if (!map) return;
        const waypoints = routeWaypoints.map(p => L.latLng(p.geocode[0], p.geocode[1]));
        const routingControl = L.Routing.control({
            waypoints,
            createMarker: () => null,
            routeWhileDragging: false,
            addWaypoints: false,
            // To prevent the control from showing on the map
            // Use this if you only want the polyline without the panel
            lineOptions: {
                styles: [{ color: 'blue', weight: 4, opacity: 0.7 }]
            }
        }).addTo(map);

        routingControl.on('routesfound', (e) => {
            const route = e.routes[0];
            routeCoordsRef.current = route.coordinates;
            // Fit map to the new route
            map.fitBounds(route.coordinates.map(c => [c.lat, c.lng]), { padding: [50, 50] });
        });

        return () => map.removeControl(routingControl);
    }, [map, routeWaypoints]);

    // Animate vehicles along the route
    useEffect(() => {
        const interval = setInterval(() => {
            if (!routeCoordsRef.current.length) return;

            setVehicles(prev => prev.map(v => {
                let { index, direction } = v;
                const coords = routeCoordsRef.current;

                // Adjust speed for realism (0.005 is a good starting point)
                index += 0.005 * direction;

                // Check if vehicle has reached the end of the route
                if (direction === 1 && index >= coords.length - 1) {
                    index = coords.length - 1;
                    direction = -1; // Reverse direction
                } else if (direction === -1 && index <= 0) {
                    index = 0;
                    direction = 1; // Reverse direction
                }

                // Interpolate position between two closest points on the route
                const lower = Math.floor(index);
                const upper = Math.min(Math.ceil(index), coords.length - 1);
                const factor = index - lower;

                // Handle the case where the vehicle is at the last point
                if (lower === upper) {
                    return { ...v, index, direction, position: [coords[lower].lat, coords[lower].lng] };
                }

                const lat = coords[lower].lat + factor * (coords[upper].lat - coords[lower].lat);
                const lng = coords[lower].lng + factor * (coords[upper].lng - coords[lower].lng);

                return { ...v, index, direction, position: [lat, lng] };
            }));
        }, 50);

        return () => clearInterval(interval);
    }, [setVehicles]);

    return null;
}

// Helper function to calculate distance between two lat/lng points (in meters)
function calculateDistance([lat1, lng1], [lat2, lng2]) {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Calculate ETA in minutes (assuming average speed of 25 km/h in traffic)
function calculateETA(currentPos, targetPos) {
    const distance = calculateDistance(currentPos, targetPos);
    const averageSpeedKmH = 25; // Realistic city traffic speed
    const averageSpeedMS = averageSpeedKmH * 1000 / 3600;
    const etaSeconds = distance / averageSpeedMS;
    const etaMinutes = etaSeconds / 60;

    if (etaMinutes < 1) {
        return "< 1 min";
    } else {
        return `${Math.round(etaMinutes)} min`;
    }
}

function CommuterPage() {
    const navigate = useNavigate();
    const [selectedRouteKey, setSelectedRouteKey] = useState(routeOptions[0].key);
    const [vehicles, setVehicles] = useState([]);
    const [filterType, setFilterType] = useState("All");
    const [userLocation, setUserLocation] = useState(null);

    // Get user's current location when the component mounts
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error("Error getting user location:", error);
                }
            );
        }
    }, []);

    // Initialize vehicles when route changes
    useEffect(() => {
        const initialVehicles = Array.from({ length: 6 }, (_, id) => ({
            id,
            type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
            // Note: position and progress will be set by RouteAndAnimate
            position: markersDB[selectedRouteKey][0].geocode,
            index: Math.random() * 10, // Start with a random index along the route
            direction: Math.random() > 0.5 ? 1 : -1,
            capacity: Math.floor(Math.random() * 20) + 1, // 1-20 passengers
        }));
        setVehicles(initialVehicles);
    }, [selectedRouteKey]);

    // Filtered vehicles for display
    const displayedVehicles = filterType === "All"
        ? vehicles
        : vehicles.filter(v => v.type === filterType);

    const selectedRoute = markersDB[selectedRouteKey];

    return (
        <div id="commuterApp" className="main-app">
            <div className="app-header">
                <h2>🚌 Commuter Map</h2>
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            </div>

            <div className="app-content">
                <div className="commuter-controls">
                    <div className="filter-group">
                        <label>🛣️ Select Route</label>
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
                        <label>🚗 Vehicle Type Filter</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="All">All Vehicles ({vehicles.length})</option>
                            {vehicleTypes.map(t => (
                                <option key={t} value={t}>
                                    {t} ({vehicles.filter(v => v.type === t).length})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Vehicle Stats Display */}
                <div className="filter-section">
                    <h3>📊 Live Vehicle Status</h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '10px',
                        marginTop: '10px'
                    }}>
                        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                            Active Vehicles: <strong>{displayedVehicles.length}</strong>
                        </div>
                        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                            Total Passengers: <strong>{displayedVehicles.reduce((sum, v) => sum + v.capacity, 0)}</strong>
                        </div>
                        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                            Route: <strong>{routeOptions.find(r => r.key === selectedRouteKey)?.label}</strong>
                        </div>
                    </div>
                </div>

                <MapContainer
                    center={userLocation || selectedRoute[0].geocode}
                    zoom={12}
                    style={{
                        height: "500px",
                        width: "100%",
                        borderRadius: "10px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
                    }}
                    key={selectedRouteKey} // Force re-render when route changes
                >
                    <TileLayer
                        url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
                        attribution='&copy; OpenStreetMap &copy; CARTO'
                    />

                    <RouteAndAnimate
                        routeWaypoints={selectedRoute}
                        vehicles={vehicles}
                        setVehicles={setVehicles}
                    />

                    {/* User Location Marker */}
                    {userLocation && (
                        <Marker position={userLocation} icon={getUserIcon()}>
                            <Popup>
                                <div style={{ textAlign: 'center' }}>
                                    <strong>You are here!</strong><br />
                                    <small>Your current location</small>
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {/* Vehicle Markers */}
                    {displayedVehicles.map(vehicle => (
                        <Marker
                            key={vehicle.id}
                            position={vehicle.position}
                            icon={getVehicleIcon(vehicle.capacity, vehicle.type)}
                        >
                            <Popup>
                                <div style={{ textAlign: 'center', minWidth: '150px' }}>
                                    <strong>
                                        {vehicle.type === "Van" ? "🚐" : "🚙"}
                                        {vehicle.type} #{vehicle.id + 1}
                                    </strong>
                                    <hr style={{ margin: '8px 0' }} />
                                    <div style={{ marginBottom: '5px' }}>
                                        👥 <strong>Passengers:</strong> {vehicle.capacity}
                                    </div>
                                    <div style={{ marginBottom: '5px' }}>
                                        📍 <strong>Next Stop:</strong> {selectedRoute[vehicle.direction === 1 ? selectedRoute.length - 1 : 0].popUp.split(',')[0]}
                                    </div>
                                    <div style={{
                                        background: '#e3f2fd',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        color: '#1976d2',
                                        fontWeight: 'bold'
                                    }}>
                                        ⏱️ ETA: {calculateETA(vehicle.position, selectedRoute[vehicle.direction === 1 ? selectedRoute.length - 1 : 0].geocode)}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Route Stop Markers - Clickable with more info */}
                    {selectedRoute.map((marker, idx) => (
                        <Marker
                            key={`stop-${idx}`}
                            position={marker.geocode}
                            icon={getStopIcon()}
                        >
                            <Popup>
                                <div style={{ textAlign: 'center', minWidth: '200px' }}>
                                    <h4 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>
                                        📍 {marker.popUp}
                                    </h4>
                                    <hr style={{ margin: '8px 0' }} />
                                    <div style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>
                                        <strong>Stop #{idx + 1}</strong> {idx === 0 ? '(Origin)' : '(Destination)'}
                                    </div>
                                    <div style={{
                                        background: '#f5f5f5',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        fontSize: '13px',
                                        marginBottom: '8px'
                                    }}>
                                        {marker.info || "Major transit point"}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#888' }}>
                                        <strong>Coordinates:</strong><br />
                                        {marker.geocode[0].toFixed(4)}, {marker.geocode[1].toFixed(4)}
                                    </div>
                                    <div style={{
                                        marginTop: '8px',
                                        padding: '4px 8px',
                                        background: '#4caf50',
                                        color: 'white',
                                        borderRadius: '12px',
                                        fontSize: '11px'
                                    }}>
                                        🚌 Active Stop
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}

export default CommuterPage;