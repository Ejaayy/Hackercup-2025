import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure to create this CSS file
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import DriverPage from './DriverComponents/DriverPage';
//import CommuterPage from './CommuterPage';


const DriverButton = ({children, onClick}) => (
    <button onClick={onClick} className="driver-button">
        <div className="button-shimmer"></div>
        <div className="button-icon">🚗</div>
        <div className="button-title">DRIVER</div>
        <div className="button-description">
            Manage your route, accept passengers, and optimize your earnings
        </div>
        <div className="status-indicator status-green"></div>
        {children}
    </button>
);

const CommuterButton = ({children, onClick}) => (
    <button onClick={onClick} className="commuter-button">
        <div className="button-shimmer"></div>
        <div className="button-icon">👥</div>
        <div className="button-title">COMMUTER</div>
        <div className="button-description">
            Find your ride, track vehicles, and get real-time arrival updates
        </div>
        <div className="status-indicator status-orange"></div>
        {children}
    </button>
);

const FloatingElements = () => (
    <div className="floating-elements">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="floating-circle circle-4"></div>
    </div>
);

const StatsCard = ({icon, number, label, delay = 0}) => (
    <div className="stats-card" style={{animationDelay: `${delay}ms`}}>
        <div className="stats-icon">{icon}</div>
        <div className="stats-number">{number}</div>
        <div className="stats-label">{label}</div>
    </div>
);

function HomePage() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const navigate = useNavigate();

    const handleDriverClick = () => {
        console.log('Driver selected');
        navigate('/driver');
    };

    const handleCommuterClick = () => {
        console.log('Commuter selected');
        // Add your navigation logic here
    };

    return (
        <div className="app-container">
            <FloatingElements/>

            {/* Header */}
            <div className="header-section">
                <div className={`header-content ${isVisible ? 'fade-in' : ''}`}>
                    <div className="logo-section">
                        <div className="bus-emoji">🚌</div>
                        <div className="title-section">
                            <h1 className="main-title">San Sakay</h1>
                            <div className="subtitle">Smart Commuting Platform</div>
                        </div>
                    </div>

                    <p className="description">
                        Connecting passengers, drivers, and transport operators with real-time ride tracking,
                        accurate arrival estimates, and seamless route matching.
                    </p>
                </div>
            </div>

            {/* Main Action Buttons */}
            <div className={`buttons-section ${isVisible ? 'fade-in-delayed' : ''}`}>
                <DriverButton onClick={handleDriverClick}/>
                <div className="or-divider">OR</div>
                <CommuterButton onClick={handleCommuterClick}/>
            </div>

            {/* Features Section */}
            <div className={`features-section ${isVisible ? 'fade-in-more-delayed' : ''}`}>
                <h2 className="features-title">Why Choose San Sakay?</h2>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">⏱️</div>
                        <h3 className="feature-title">Real-Time Updates</h3>
                        <p className="feature-description">Get accurate arrival times and live vehicle tracking for
                            better planning</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h3 className="feature-title">Smart Matching</h3>
                        <p className="feature-description">Intelligent route matching connects you with the perfect
                            ride</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3 className="feature-title">Easy to Use</h3>
                        <p className="feature-description">Simple, intuitive interface designed for Filipino
                            commuters</p>
                    </div>
                </div>

                {/* Live Stats */}
                <div className="stats-grid">
                    <StatsCard icon="🚗" number="0+" label="Active Drivers" delay={0}/>
                    <StatsCard icon="👥" number="0+" label="Daily Commuters" delay={200}/>
                    <StatsCard icon="🛣️" number="0+" label="Routes Covered" delay={400}/>
                    <StatsCard icon="⭐" number="0" label="User Rating" delay={600}/>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <p>© 2024 San Sakay. Making commuting faster, safer, and more predictable.</p>
            </footer>
        </div>
    );
}

export default function App(){
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/driver" element={<DriverPage />} />
            </Routes>
        </Router>
    );
};