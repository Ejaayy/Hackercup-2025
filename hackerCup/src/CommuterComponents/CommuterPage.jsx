import { useNavigate } from 'react-router-dom';

function CommuterPage() {
    const navigate = useNavigate();

    return(
        <>
            <div id="commuterApp" className="main-app">
                <div className="app-header">
                    <h2>🚌 Find Your Ride</h2>
                    <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
                </div>
                <div className="app-content">
                    <div className="filter-section">
                        <div className="filter-grid">
                            <div className="filter-group">
                                <label for="pickup">📍 Pick-up Location</label>
                                <input type="text" id="pickup" placeholder="Enter your starting point" oninput="updateRoutes()"></input>
                            </div>
                            <div className="filter-group">
                                <label for="destination">🎯 Destination (Optional)</label>
                                <input type="text" id="destination" placeholder="Where are you going?"></input>
                            </div>
                            <div className="filter-group">
                                <label>🚌 Transportation Type</label>
                                <div className="transport-types">
                                    <div className="transport-chip active" onClick="toggleTransport(this, 'all')">All</div>
                                    <div className="transport-chip" onClick="toggleTransport(this, 'jeepney')">Jeepney</div>
                                    <div className="transport-chip" onClick="toggleTransport(this, 'bus')">Bus</div>
                                    <div className="transport-chip" onClick="toggleTransport(this, 'tricycle')">Tricycle</div>
                                    <div className="transport-chip" onClick="toggleTransport(this, 'rideshare')">Ride Share</div>
                                </div>
                            </div>
                            <div className="filter-group">
                                <label for="sortBy">📊 Sort By</label>
                                <select id="sortBy" onChange="sortRoutes()">
                                    <option value="time">Earliest Arrival</option>
                                    <option value="cost">Lowest Cost</option>
                                    <option value="distance">Shortest Distance</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <h3>🛣️ Available Routes</h3>
                    <div id="routeList" className="route-list">
                     
                    </div>
                </div>
            </div>
        </>
    )
}

export default CommuterPage;