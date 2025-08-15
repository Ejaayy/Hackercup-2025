import './driverPageStyle.css';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import 'leaflet-routing-machine';
import RoutingMachine from './../RoutingMachine';

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
    { label: "SM MOLINO to PITX", key: "SmMolinoToMOA" },
];

function DriverPage() {
    const navigate = useNavigate();
    const [selectedRouteKey, setSelectedRouteKey] = useState(routeOptions[0].key);

    // Example user location (replace with geolocation if needed)
    const [userLatitude, setUserLatitude] = useState(null);
    const [userLongitude, setUserLongitude] = useState(null);

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
                    center={[14.5995, 120.9842]} 
                    zoom={13} 
                    style={{ height: "500px", width: "100%" }}
                >
                    <TileLayer
                        url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
                        attribution='&copy; OpenStreetMap &copy; CARTO'
                    />

                    <RoutingMachine route={markersDB[selectedRouteKey]} />

                    {userLatitude && userLongitude && (
                        <Marker position={[userLatitude, userLongitude]}>
                            <Popup>Current User Location</Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
}

export default DriverPage;
