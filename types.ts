export enum RobotMode {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC'
}

export enum MoveCommand {
  FORWARD = 'FORWARD',
  BACKWARD = 'BACKWARD',
  ROTATE_CW = 'ROTATE_CW',
  ROTATE_CCW = 'ROTATE_CCW',
  STOP = 'STOP'
}

export interface RobotStatus {
  online: boolean;
  batteryVoltage: number;
  cpuTemp: number;
  mode: RobotMode;
  gps: {
    lat: number;
    lng: number;
    satellites: number;
  };
  heading: number; // 0-360 degrees
}

// Configuration for the Flask API endpoints
export const API_CONFIG = {
  BASE_URL: 'http://raspberrypi.local:5000', // Default, likely needs to be changed by user or proxied
  ENDPOINTS: {
    CONTROL: '/api/control',
    MODE: '/api/mode',
    SERVO: '/api/servo',
    STATUS: '/api/status',
    VIDEO_MAIN: '/video_feed',
    VIDEO_THERMAL: '/thermal_feed'
  }
};