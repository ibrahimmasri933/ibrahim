import React, { useEffect, useState, useCallback } from 'react';
import { ArrowUp, ArrowDown, RotateCw, RotateCcw, Crosshair } from 'lucide-react';
import { MoveCommand, RobotMode } from '../types';
import { robotService } from '../services/robotService';

interface ControlsProps {
  mode: RobotMode;
  className?: string;
}

export const Controls: React.FC<ControlsProps> = ({ mode, className = "" }) => {
  const [activeKey, setActiveKey] = useState<MoveCommand | null>(null);
  const [servoAngle, setServoAngle] = useState(75); // Start at middle (0-150)

  const handleCommand = useCallback((cmd: MoveCommand, isStart: boolean) => {
    if (mode === RobotMode.AUTOMATIC) return; // Disable manual controls in auto mode

    if (isStart) {
      setActiveKey(cmd);
      robotService.sendCommand(cmd);
    } else {
      setActiveKey(null);
      robotService.sendCommand(MoveCommand.STOP);
    }
  }, [mode]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      switch (e.key.toLowerCase()) {
        case 'w': handleCommand(MoveCommand.FORWARD, true); break;
        case 's': handleCommand(MoveCommand.BACKWARD, true); break;
        case 'a': handleCommand(MoveCommand.ROTATE_CCW, true); break;
        case 'd': handleCommand(MoveCommand.ROTATE_CW, true); break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 's':
        case 'a':
        case 'd':
          handleCommand(MoveCommand.STOP, false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleCommand]);

  const handleServoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setServoAngle(val);
    robotService.setServoAngle(val);
  };

  const isDisabled = mode === RobotMode.AUTOMATIC;

  const ButtonBase = ({ cmd, icon: Icon, label, className }: { cmd: MoveCommand, icon: any, label: string, className?: string }) => (
    <button
      className={`relative group flex items-center justify-center p-4 rounded-xl transition-all duration-150 transform active:scale-95 shadow-lg border border-gray-700
        ${activeKey === cmd ? 'bg-cyan-600 border-cyan-400 text-white shadow-cyan-500/20' : 'bg-gray-800 text-gray-300 hover:bg-gray-750 hover:border-gray-600'}
        ${isDisabled ? 'opacity-30 cursor-not-allowed grayscale' : ''}
        ${className}
      `}
      onMouseDown={() => !isDisabled && handleCommand(cmd, true)}
      onMouseUp={() => !isDisabled && handleCommand(cmd, false)}
      onMouseLeave={() => !isDisabled && activeKey === cmd && handleCommand(cmd, false)}
      onTouchStart={(e) => { e.preventDefault(); !isDisabled && handleCommand(cmd, true); }}
      onTouchEnd={(e) => { e.preventDefault(); !isDisabled && handleCommand(cmd, false); }}
      disabled={isDisabled}
      aria-label={label}
    >
      <Icon size={32} strokeWidth={2} />
      <span className="absolute bottom-1 text-[9px] font-mono opacity-50 uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 w-full ${className}`}>
      
      {/* Movement D-PAD */}
      <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center relative">
         <h3 className="absolute top-4 left-4 text-xs font-mono text-gray-500 flex items-center gap-2">
            <Crosshair size={14} /> LOCOMOTION
         </h3>
         
         {isDisabled && (
             <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-950/60 rounded-2xl backdrop-blur-[2px]">
                 <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1 rounded text-xs font-mono">
                     CONTROLS LOCKED (AUTO MODE)
                 </span>
             </div>
         )}

         <div className="grid grid-cols-3 gap-3 w-full max-w-[280px] mt-6">
            <div className="col-start-2">
              <ButtonBase cmd={MoveCommand.FORWARD} icon={ArrowUp} label="FWD" className="w-full aspect-square" />
            </div>
            
            <div className="col-start-1 row-start-2">
              <ButtonBase cmd={MoveCommand.ROTATE_CCW} icon={RotateCcw} label="CCW" className="w-full aspect-square" />
            </div>
            
            <div className="col-start-2 row-start-2">
              <ButtonBase cmd={MoveCommand.BACKWARD} icon={ArrowDown} label="BWD" className="w-full aspect-square" />
            </div>
            
            <div className="col-start-3 row-start-2">
              <ButtonBase cmd={MoveCommand.ROTATE_CW} icon={RotateCw} label="CW" className="w-full aspect-square" />
            </div>
         </div>
         <div className="mt-4 text-xs font-mono text-gray-600">
            KEYBOARD: WASD
         </div>
      </div>

      {/* Camera Servo Control */}
      <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 flex flex-col justify-center relative min-h-[250px]">
         <h3 className="absolute top-4 left-4 text-xs font-mono text-gray-500">CAMERA GIMBAL</h3>
         
         <div className="flex flex-col items-center w-full px-4">
            <div className="w-full flex justify-between mb-2 text-xs font-mono text-gray-400">
                <span>0° (DOWN)</span>
                <span className="text-cyan-400 font-bold text-lg">{servoAngle}°</span>
                <span>150° (UP)</span>
            </div>
            
            <div className="relative w-full h-12 flex items-center">
                {/* Custom Range Track */}
                <div className="absolute w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                     <div 
                        className="h-full bg-gradient-to-r from-cyan-900 to-cyan-500 transition-all duration-100 ease-out" 
                        style={{ width: `${(servoAngle / 150) * 100}%` }}
                     ></div>
                </div>
                
                <input 
                    type="range" 
                    min="0" 
                    max="150" 
                    value={servoAngle}
                    onChange={handleServoChange}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                />
                
                {/* Custom Thumb Visual (follows the value) */}
                <div 
                    className="absolute h-6 w-6 bg-white rounded-full shadow-lg shadow-cyan-500/50 border-2 border-cyan-400 z-10 pointer-events-none transition-all duration-75 ease-out"
                    style={{ left: `calc(${ (servoAngle / 150) * 100 }% - 12px)` }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-900 rounded-full"></div>
                </div>
            </div>
            
            <div className="mt-8 grid grid-cols-3 gap-2 w-full text-xs font-mono">
                <button onClick={() => { setServoAngle(0); robotService.setServoAngle(0); }} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded border border-gray-700 text-gray-400">RESET 0°</button>
                <button onClick={() => { setServoAngle(75); robotService.setServoAngle(75); }} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded border border-gray-700 text-gray-400">CENTER 75°</button>
                <button onClick={() => { setServoAngle(150); robotService.setServoAngle(150); }} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded border border-gray-700 text-gray-400">MAX 150°</button>
            </div>
         </div>
      </div>
    </div>
  );
};