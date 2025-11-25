import { API_CONFIG, MoveCommand, RobotMode, RobotStatus } from '../types';

// Helper to simulate network delay for the mock
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// MOCK MODE: Set to false when connecting to the actual Pi
const IS_MOCK = true; 

export const robotService = {
  /**
   * Sends a movement command to the robot
   */
  async sendCommand(command: MoveCommand): Promise<void> {
    console.log(`[RobotService] Sending command: ${command}`);
    if (IS_MOCK) {
      await delay(100);
      return;
    }

    try {
      await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTROL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });
    } catch (error) {
      console.error("Failed to send command:", error);
    }
  },

  /**
   * Sets the camera servo angle (0-150)
   */
  async setServoAngle(angle: number): Promise<void> {
    // Clamp value just in case
    const safeAngle = Math.max(0, Math.min(150, angle));
    console.log(`[RobotService] Setting servo: ${safeAngle}°`);
    
    if (IS_MOCK) return;

    try {
      await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SERVO}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ angle: safeAngle }),
      });
    } catch (error) {
      console.error("Failed to set servo:", error);
    }
  },

  /**
   * Toggles the robot's operating mode
   */
  async setMode(mode: RobotMode): Promise<void> {
    console.log(`[RobotService] Setting mode: ${mode}`);
    
    if (IS_MOCK) return;

    try {
      await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MODE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
    } catch (error) {
      console.error("Failed to set mode:", error);
    }
  },

  /**
   * Fetches current telemetry
   */
  async getStatus(): Promise<RobotStatus> {
    if (IS_MOCK) {
      // Return simulated data
      return {
        online: true,
        batteryVoltage: 12.4, // Volts
        cpuTemp: 45.2, // Celsius
        mode: RobotMode.MANUAL,
        gps: {
          lat: 40.7128, // Mock Lat (New York)
          lng: -74.0060, // Mock Lng
          satellites: 8
        },
        heading: 45 // North-East
      };
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STATUS}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      // Fallback if offline
      return {
        online: false,
        batteryVoltage: 0,
        cpuTemp: 0,
        mode: RobotMode.MANUAL,
        gps: { lat: 0, lng: 0, satellites: 0 },
        heading: 0
      };
    }
  }
};