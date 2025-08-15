import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CommuterPageStyle.css';
import 'leaflet-routing-machine';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import RoutingMachine from './../RoutingMachine';

function CommuterPage() {
  const navigate = useNavigate();
  const [selectedRouteKey, setSelectedRouteKey] = useState("");

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

  return (
    <div id="commuterApp" className="main-app">
      <div className="app-header">
        <h2>🚌 Find Your Ride</h2>
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="app-content">
        {/* Example corrected input */}
        <label htmlFor="pickup">📍 Pick-up Location</label>
        <input type="text" id="pickup" placeholder="Enter your starting point" />

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
          <Marker position={[userLatitude, userLongitude]} icon={PersonIcon}>
            <Popup>
              {"Current User Location"}
            </Popup>
          </Marker>
        )}

        </MapContainer>
      </div>
    </div>
  );
}

export default CommuterPage;
