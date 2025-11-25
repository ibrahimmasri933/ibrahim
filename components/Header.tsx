import React from 'react';
import { Cpu, Battery, Wifi, WifiOff, Activity } from 'lucide-react';
import { RobotMode, RobotStatus } from '../types';
import { robotService } from '../services/robotService';

interface HeaderProps {
  status: RobotStatus;
  setMode: (mode: RobotMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ status, setMode }) => {
  
  const toggleMode = () => {
    const newMode = status.mode === RobotMode.MANUAL ? RobotMode.AUTOMATIC : RobotMode.MANUAL;
    setMode(newMode);
    robotService.setMode(newMode);
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Cpu className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">PI-BOT <span className="text-cyan-400">COMMANDER</span></h1>
            <p className="text-[10px] text-gray-400 font-mono tracking-widest mt-1">RASPBERRY PI 5 • SYSTEM V1.0</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end bg-gray-900/50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
           
           {/* Telemetry Group */}
           <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-gray-300" title="Connection Status">
                 {status.online ? <Wifi size={14} className="text-emerald-500" /> : <WifiOff size={14} className="text-rose-500" />}
                 <span className={status.online ? "text-emerald-500" : "text-rose-500"}>{status.online ? "ONLINE" : "OFFLINE"}</span>
              </div>
              
              <div className="h-4 w-px bg-gray-700"></div>
              
              <div className="flex items-center gap-1.5 text-gray-300" title="Battery Voltage">
                 <Battery size={14} className={status.batteryVoltage < 11 ? "text-yellow-500" : "text-emerald-500"} />
                 <span>{status.batteryVoltage.toFixed(1)}V</span>
              </div>

              <div className="h-4 w-px bg-gray-700 hidden sm:block"></div>

              <div className="flex items-center gap-1.5 text-gray-300 hidden sm:flex" title="CPU Temp">
                 <Activity size={14} className={status.cpuTemp > 70 ? "text-rose-500" : "text-blue-400"} />
                 <span>{status.cpuTemp.toFixed(1)}°C</span>
              </div>
           </div>

           {/* Mode Toggle Switch */}
           <button 
              onClick={toggleMode}
              className={`relative inline-flex h-8 w-32 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900
                ${status.mode === RobotMode.MANUAL ? 'bg-gray-700 border-gray-600' : 'bg-cyan-900/50 border-cyan-500'}
              `}
           >
              <span className="sr-only">Use setting</span>
              <span className={`absolute left-0 top-0 flex h-full w-1/2 items-center justify-center text-[9px] font-bold font-mono transition-opacity duration-200 ${status.mode === RobotMode.MANUAL ? 'opacity-100 text-white' : 'opacity-50 text-gray-400'}`}>
                MANUAL
              </span>
              <span className={`absolute right-0 top-0 flex h-full w-1/2 items-center justify-center text-[9px] font-bold font-mono transition-opacity duration-200 ${status.mode === RobotMode.AUTOMATIC ? 'opacity-100 text-cyan-300' : 'opacity-50 text-gray-400'}`}>
                AUTO
              </span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-[26px] w-[50%] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-[1px] ml-[2px]
                  ${status.mode === RobotMode.AUTOMATIC ? 'translate-x-[96%] bg-cyan-400' : 'translate-x-0'}
                `}
              />
           </button>
        </div>

      </div>
    </header>
  );
};