import React, { useState, useEffect } from 'react';

const DriverButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="group relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 hover:from-blue-500 hover:via-blue-600 hover:to-purple-700 text-white font-bold py-8 px-12 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out hover:shadow-blue-500/25 min-w-[300px] min-h-[200px] flex flex-col items-center justify-center space-y-4"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🚗</div>
    <div className="text-2xl font-extrabold tracking-wide">DRIVER</div>
    <div className="text-sm opacity-90 text-center max-w-xs">
      Manage your route, accept passengers, and optimize your earnings
    </div>
    <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
    {children}
  </button>
);

const CommuterButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 hover:from-emerald-400 hover:via-teal-500 hover:to-cyan-600 text-white font-bold py-8 px-12 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out hover:shadow-emerald-500/25 min-w-[300px] min-h-[200px] flex flex-col items-center justify-center space-y-4"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">👥</div>
    <div className="text-2xl font-extrabold tracking-wide">COMMUTER</div>
    <div className="text-sm opacity-90 text-center max-w-xs">
      Find your ride, track vehicles, and get real-time arrival updates
    </div>
    <div className="absolute top-4 right-4 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
    {children}
  </button>
);

const FloatingElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Animated background elements */}
    <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
    <div className="absolute top-40 right-20 w-16 h-16 bg-emerald-500/10 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
    <div className="absolute bottom-40 left-20 w-12 h-12 bg-purple-500/10 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
    <div className="absolute bottom-20 right-32 w-24 h-24 bg-cyan-500/10 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
  </div>
);

const StatsCard = ({ icon, number, label, delay = 0 }) => (
  <div 
    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="text-4xl mb-2">{icon}</div>
    <div className="text-3xl font-bold text-white mb-1">{number}</div>
    <div className="text-white/80 text-sm">{label}</div>
  </div>
);

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate stats counter
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % 4);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDriverClick = () => {
    console.log('Driver selected');
    // Add your navigation logic here
  };

  const handleCommuterClick = () => {
    console.log('Commuter selected');
    // Add your navigation logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <FloatingElements />
      
      {/* Header */}
      <div className="relative z-10 pt-12 pb-8">
        <div className={`text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex justify-center items-center mb-6">
            <div className="text-8xl mr-4 animate-pulse">🚌</div>
            <div>
              <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
                San Sakay
              </h1>
              <div className="text-xl md:text-2xl text-white/80 mt-2 font-light tracking-wide">
                Smart Commuting Platform
              </div>
            </div>
          </div>
          
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed px-4">
            Connecting passengers, drivers, and transport operators with real-time ride tracking, 
            accurate arrival estimates, and seamless route matching.
          </p>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className={`flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-4 mb-16 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
        <DriverButton onClick={handleDriverClick} />
        <div className="text-2xl text-white/50 font-light">OR</div>
        <CommuterButton onClick={handleCommuterClick} />
      </div>

      {/* Features Section */}
      <div className={`max-w-6xl mx-auto px-4 mb-12 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          Why Choose San Sakay?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="text-5xl mb-4">⏱️</div>
            <h3 className="text-xl font-bold text-white mb-3">Real-Time Updates</h3>
            <p className="text-white/70">Get accurate arrival times and live vehicle tracking for better planning</p>
          </div>
          
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-3">Smart Matching</h3>
            <p className="text-white/70">Intelligent route matching connects you with the perfect ride</p>
          </div>
          
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-white mb-3">Easy to Use</h3>
            <p className="text-white/70">Simple, intuitive interface designed for Filipino commuters</p>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard icon="🚗" number="150+" label="Active Drivers" delay={0} />
          <StatsCard icon="👥" number="2.5K+" label="Daily Commuters" delay={200} />
          <StatsCard icon="🛣️" number="25+" label="Routes Covered" delay={400} />
          <StatsCard icon="⭐" number="4.8" label="User Rating" delay={600} />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-white/50 border-t border-white/10">
        <p className="text-sm">
          © 2024 San Sakay. Making commuting faster, safer, and more predictable.
        </p>
      </footer>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
    </div>
  );
}

export default App;