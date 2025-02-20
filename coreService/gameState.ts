// ./coreService/gameState.ts
export interface GameState {
  ball: { x: number; y: number; vx: number; vy: number };
  leftPaddle: number;
  rightPaddle: number;
  width: number;
  height: number;
  paddleHeight: number;
}

export const state: GameState = {
  ball: { x: 400, y: 300, vx: 2, vy: 2 },
  leftPaddle: 250,
  rightPaddle: 250,
  width: 800,
  height: 600,
  paddleHeight: 100,
};

export function updatePaddle(side: "left" | "right", direction: "up" | "down") {
  const delta = direction === "up" ? -10 : 10;
  if (side === "left") {
    state.leftPaddle += delta;
    if (state.leftPaddle < 0) state.leftPaddle = 0;
    if (state.leftPaddle > state.height - state.paddleHeight) {
      state.leftPaddle = state.height - state.paddleHeight;
    }
  } else {
    state.rightPaddle += delta;
    if (state.rightPaddle < 0) state.rightPaddle = 0;
    if (state.rightPaddle > state.height - state.paddleHeight) {
      state.rightPaddle = state.height - state.paddleHeight;
    }
  }
}
