// coreService/uptimeService.ts
let serverStartTime: number | null = null;

async function initializeUptimeService() {
  serverStartTime = Date.now();
  console.log("Uptime Service: Server start time recorded.");
}

// Function to get the server uptime in milliseconds
export function getServerUptime(): number | null {
  if (serverStartTime === null) {
    console.error("Uptime Service: Server start time not yet initialized."); 
    return null;
  }
  return Date.now() - serverStartTime;
}

// Call initializeUptimeService to initialize logger and server start time
await initializeUptimeService();