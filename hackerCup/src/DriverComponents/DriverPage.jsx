import './driverPageStyle.css';
import {useNavigate} from 'react-router-dom';

function DriverPage() {
    const navigate = useNavigate();

    return (
        <>
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
                                <select id="driverRoute">
                                    <option>EDSA - Cubao to Makati</option>
                                    <option>Commonwealth Ave</option>
                                    <option>Katipunan Ave</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>👥 Passenger Capacity</label>
                                <input type="number" id="capacity" value="20" min="1" max="50"></input>
                            </div>
                            <div className="filter-group">
                                <label>📍 Current Status</label>
                                <select id="driverStatus" onChange="updateDriverStatus()">
                                    <option value="active">🟢 Active</option>
                                    <option value="busy">🟡 Almost Full</option>
                                    <option value="full">🔴 Full</option>
                                    <option value="offline">⚫ Offline</option>
                                </select>
                            </div>
                            <div className="filter-group">
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

                    <div className="passenger-requests">
                        <h3>📋 Passenger Requests Along Route</h3>
                        <div id="passengerRequests">
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DriverPage;
