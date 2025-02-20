import { getServerUptime } from "../coreService/uptimeService.ts";

export default async function handler(req: Request): Promise<Response> {
  const uptimeMilliseconds = getServerUptime();

  if (uptimeMilliseconds === null) {
    return new Response(
      JSON.stringify({ error: "Uptime service not initialized" }),
      {
        status: 500, // Internal Server Error
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const uptimeSeconds = uptimeMilliseconds / 1000;
  const uptimeMinutes = uptimeSeconds / 60;
  const uptimeHours = uptimeMinutes / 60;

  const responseData = {
    uptimeMilliseconds: uptimeMilliseconds,
    uptimeSeconds: uptimeSeconds,
    uptimeMinutes: uptimeMinutes,
    uptimeHours: uptimeHours,
  };

  return new Response(
    JSON.stringify(responseData),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}