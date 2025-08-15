import './driverPageStyle.css';
import {useNavigate} from 'react-router-dom';
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import 'leaflet/dist/leaflet.css';

function DriverPage() {
    const navigate = useNavigate();

    return (
        <>
            <div id="driverApp" class="main-app">
                <div class="app-header">
                    <h2>🚗 Driver Dashboard</h2>
                    <button class="back-btn" onclick={() => navigate(-1)}>← Back</button>
                </div>
                <div class="app-content">
                    <div class="driver-controls">
                        <div class="control-grid">
                            <div class="filter-group">
                                <label>🛣️ Current Route</label>
                                <select id="driverRoute">
                                    <option>EDSA - Cubao to Makati</option>
                                    <option>Commonwealth Ave</option>
                                    <option>Katipunan Ave</option>
                                </select>
                            </div>
                            <div class="filter-group">
                                <label>👥 Passenger Capacity</label>
                                <input type="number" id="capacity" value="20" min="1" max="50"></input>
                            </div>
                            <div class="filter-group">
                                <label>📍 Current Status</label>
                                <select id="driverStatus" onchange="updateDriverStatus()">
                                    <option value="active">🟢 Active</option>
                                    <option value="busy">🟡 Almost Full</option>
                                    <option value="full">🔴 Full</option>
                                    <option value="offline">⚫ Offline</option>
                                </select>
                            </div>
                            <div class="filter-group">
                                <label>🧭 Direction</label>
                                <select id="direction">
                                    <option>Northbound</option>
                                    <option>Southbound</option>
                                    <option>Eastbound</option>
                                    <option>Westbound</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <MapContainer center={[14.5995, 120.9842]} zoom ={13}>
                    <TileLayer
                        attribution={
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, ' +
                        '&copy; <a href="https://carto.com/">CARTO</a>'
                        }
                        url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
                    />
                    
                    </MapContainer>


                </div>
            </div>
        </>
    )
}

export default DriverPage;
