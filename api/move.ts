// ./api/move.ts
import { updatePaddle } from "../coreService/gameState.ts";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  try {
    const { side, direction } = await req.json();
    if ((side !== "left" && side !== "right") || (direction !== "up" && direction !== "down")) {
      return new Response("Invalid parameters", { status: 400 });
    }
    updatePaddle(side, direction);
    return new Response("OK");
  } catch (error) {
    return new Response("Bad Request: " + error.message, { status: 400 });
  }
}
