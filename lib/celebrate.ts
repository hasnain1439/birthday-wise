"use client";

import confetti from "canvas-confetti";

const COLORS = ["#a855f7", "#c084fc", "#f472b6", "#f5c86a", "#22d3ee", "#ffffff"];

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Small burst from a point on screen (e.g. a candle). */
export function burstAt(x: number, y: number) {
  if (reducedMotion()) return;
  confetti({
    particleCount: 40,
    spread: 60,
    startVelocity: 28,
    scalar: 0.8,
    ticks: 120,
    origin: { x: x / window.innerWidth, y: y / window.innerHeight },
    colors: COLORS,
    disableForReducedMotion: true,
  });
}

/** The big one: side cannons + center fireworks for ~3 seconds. */
export function megaCelebration() {
  if (reducedMotion()) {
    confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 }, colors: COLORS });
    return;
  }

  const balloon = confetti.shapeFromText({ text: "🎈", scalar: 2 });
  const cake = confetti.shapeFromText({ text: "🎂", scalar: 2 });

  confetti({ particleCount: 180, spread: 100, startVelocity: 55, origin: { y: 0.65 }, colors: COLORS });

  const end = Date.now() + 2800;
  const frame = () => {
    confetti({ particleCount: 6, angle: 60, spread: 60, startVelocity: 60, origin: { x: 0, y: 0.8 }, colors: COLORS });
    confetti({ particleCount: 6, angle: 120, spread: 60, startVelocity: 60, origin: { x: 1, y: 0.8 }, colors: COLORS });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();

  [400, 900, 1500].forEach((delay, i) =>
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 140,
        startVelocity: 35,
        scalar: 2,
        shapes: [balloon, cake],
        origin: { x: 0.2 + i * 0.3, y: 0.3 },
        flat: true,
      });
      confetti({
        particleCount: 120,
        spread: 360,
        startVelocity: 40,
        ticks: 200,
        gravity: 0.8,
        origin: { x: 0.2 + i * 0.3, y: 0.3 },
        colors: COLORS,
      });
    }, delay),
  );
}
