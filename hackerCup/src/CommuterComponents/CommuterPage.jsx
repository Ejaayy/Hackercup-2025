import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import 'leaflet-routing-machine';
import RoutingMachine from './../RoutingMachine';
import L from "leaflet";
import './CommuterPageStyle.css';
import carIconImg from '/src/assets/vehicle.png'; // your custom car image

// Define the custom car icon
const carIcon = L.icon({
    iconUrl: carIconImg,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
});

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

function CommuterPage() {
    const navigate = useNavigate();
    const [selectedRouteKey, setSelectedRouteKey] = useState(routeOptions[0].key);
    const [driverPosition, setDriverPosition] = useState(markersDB[selectedRouteKey][0].geocode);

    // Simulate AI car moving along the selected route
    useEffect(() => {
        let i = 0;
        const points = markersDB[selectedRouteKey].map(m => m.geocode);
        const interval = setInterval(() => {
            i = (i + 1) % points.length;
            setDriverPosition(points[i]);
        }, 2000); // moves every 2 seconds

        return () => clearInterval(interval);
    }, [selectedRouteKey]);

    return (
        <div id="commuterApp" className="main-app">
            <div className="app-header">
                <h2>🚌 Commuter Map</h2>
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            </div>

            <div className="app-content">
                <div className="commuter-controls">
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

                <MapContainer
                    center={driverPosition}
                    zoom={13}
                    style={{ height: "500px", width: "100%" }}
                >
                    <TileLayer
                        url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
                        attribution='&copy; OpenStreetMap &copy; CARTO'
                    />

                    <RoutingMachine route={markersDB[selectedRouteKey]} />

                    {/* Simulated AI car */}
                    <Marker
                        position={driverPosition}
                        icon={carIcon}
                    >
                        <Popup>🚗 Driver (Simulated)</Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );


}

export default CommuterPage;
