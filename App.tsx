import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { VideoFeed } from './components/VideoFeed';
import { Controls } from './components/Controls';
import { MapWidget } from './components/MapWidget';
import { RobotMode, RobotStatus, API_CONFIG } from './types';
import { robotService } from './services/robotService';

function App() {
  const [status, setStatus] = useState<RobotStatus>({
    online: false,
    batteryVoltage: 0,
    cpuTemp: 0,
    mode: RobotMode.MANUAL,
    gps: { lat: 0, lng: 0, satellites: 0 },
    heading: 0
  });

  // Poll for status updates
  useEffect(() => {
    const fetchStatus = async () => {
      const newStatus = await robotService.getStatus();
      setStatus(prev => ({ ...prev, ...newStatus }));
    };

    fetchStatus(); // Initial fetch
    const interval = setInterval(fetchStatus, 2000); // Poll every 2s

    return () => clearInterval(interval);
  }, []);

  const handleModeChange = (mode: RobotMode) => {
    setStatus(prev => ({ ...prev, mode }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-slate-200 selection:bg-cyan-500 selection:text-white">
      
      <Header status={status} setMode={handleModeChange} />

      <main className="flex-grow p-4 sm:p-6 lg:p-8 flex flex-col gap-8 max-w-[1600px] mx-auto w-full">
        
        {/* Video Feed Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VideoFeed 
            src={API_CONFIG.ENDPOINTS.VIDEO_MAIN} 
            title="Visual Optic Feed" 
            type="visual" 
          />
          <VideoFeed 
            src={API_CONFIG.ENDPOINTS.VIDEO_THERMAL} 
            title="Thermal Infrared Feed" 
            type="thermal" 
          />
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 opacity-30">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent w-full"></div>
          <div className="text-xs font-mono whitespace-nowrap">MISSION CONTROL</div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent w-full"></div>
        </div>

        {/* Dashboard Grid: Controls & Map */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Controls take up 2 columns on large screens */}
          <div className="xl:col-span-2">
            <Controls mode={status.mode} className="h-full" />
          </div>

          {/* Map takes up 1 column */}
          <div className="h-full min-h-[350px]">
             <MapWidget 
                lat={status.gps.lat} 
                lng={status.gps.lng} 
                heading={status.heading}
                satellites={status.gps.satellites}
             />
          </div>

        </section>

      </main>

      <footer className="border-t border-gray-800 bg-gray-950 p-6 text-center">
        <p className="text-gray-600 text-xs font-mono">
          SYSTEM READY • WAITING FOR INPUT • LATENCY: &lt;50ms
        </p>
      </footer>
    </div>
  );
}

export default App;