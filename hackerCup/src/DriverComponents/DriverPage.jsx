function DriverPage() {
    return (
        <>
            <div id="driverApp" class="main-app">
                <div class="app-header">
                    <h2>🚗 Driver Dashboard</h2>
                    <button class="back-btn" onclick="goBack()">← Back</button>
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

                    <div class="passenger-requests">
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
