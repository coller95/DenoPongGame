// ./api/game.ts
import { state } from "../coreService/gameState.ts";

const encoder = new TextEncoder();
// A list to hold connected SSE client controllers
let clients: ReadableStreamDefaultController[] = [];

/**
 * Broadcast the current game state (as JSON) to all connected SSE clients.
 */
function broadcastState() {
  const data = JSON.stringify(state);
  const message = `data: ${data}\n\n`;
  clients.forEach((controller) => {
    try {
      controller.enqueue(encoder.encode(message));
    } catch (_e) {
      // If enqueuing fails, the client will be cleaned up when cancel is called.
    }
  });
}

/**
 * The game loop: update ball physics and handle paddle collisions.
 */
function gameLoop() {
  // Update ball position
  state.ball.x += state.ball.vx;
  state.ball.y += state.ball.vy;

  // Bounce off top and bottom edges
  if (state.ball.y <= 0 || state.ball.y >= state.height) {
    state.ball.vy = -state.ball.vy;
  }

  // Define fixed x positions for paddles
  const paddleXLeft = 50;
  const paddleXRight = state.width - 50;

  // Left paddle collision check
  if (state.ball.x <= paddleXLeft) {
    if (state.ball.y >= state.leftPaddle && state.ball.y <= state.leftPaddle + state.paddleHeight) {
      state.ball.vx = -state.ball.vx;
      state.ball.x = paddleXLeft; // reposition to avoid multiple collisions
    } else {
      state.ball.x = state.width / 2;
      state.ball.y = state.height / 2;
    }
  }

  // Right paddle collision check
  if (state.ball.x >= paddleXRight) {
    if (state.ball.y >= state.rightPaddle && state.ball.y <= state.rightPaddle + state.paddleHeight) {
      state.ball.vx = -state.ball.vx;
      state.ball.x = paddleXRight;
    } else {
      state.ball.x = state.width / 2;
      state.ball.y = state.height / 2;
    }
  }

  // Broadcast the updated state to all clients
  broadcastState();
}

// Start the game loop – updating roughly every 30ms (~33 FPS)
setInterval(gameLoop, 30);

// SSE endpoint: clients connect here to receive game state updates.
export default async function handler(_req: Request): Promise<Response> {
  let myController: ReadableStreamDefaultController;
  const stream = new ReadableStream({
    start(controller) {
      myController = controller;
      clients.push(controller);
    },
    cancel(_reason) {
      // Remove this controller from the global list when the client disconnects
      clients = clients.filter((c) => c !== myController);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
