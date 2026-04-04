import { useEffect, useRef } from "react";

const AXIOM = "X";
const RULES = {
  X: "F+[[X]-X]-F[-FX]+X",
  F: "FF",
};
const ITERATIONS = 5;

function buildString() {
  let current = AXIOM;
  for (let i = 0; i < ITERATIONS; i += 1) {
    current = current
      .split("")
      .map((char) => RULES[char] ?? char)
      .join("");
  }
  return current;
}

export function LSystemBackdrop() {
  const canvasRef = useRef(null);
  const commandStringRef = useRef(buildString());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const totalDuration = 2000;
    let rafId;
    let start = null;
    let currentProgress = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.offsetWidth * dpr);
      canvas.height = Math.floor(canvas.offsetHeight * dpr);
      draw(currentProgress);
    };

    const draw = (amount) => {
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, W, H);

      const chars = commandStringRef.current;
      const limit = Math.floor(chars.length * amount);
      const baseLength = Math.min(W, H) * 0.018;
      const length = baseLength * Math.pow(0.57, ITERATIONS - 1);
      const angle = (25 * Math.PI) / 180;
      const stack = [];
      let x = W * 0.78;
      let y = H * 0.88;
      let theta = -Math.PI / 2;

      ctx.save();
      ctx.strokeStyle = "rgba(139, 155, 175, 0.11)";
      ctx.lineWidth = 0.7 * dpr;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 0; i < limit; i += 1) {
        const char = chars[i];
        if (char === "F") {
          const nextX = x + Math.cos(theta) * length;
          const nextY = y + Math.sin(theta) * length;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();
          x = nextX;
          y = nextY;
        } else if (char === "+") {
          theta += angle;
        } else if (char === "-") {
          theta -= angle;
        } else if (char === "[") {
          stack.push([x, y, theta]);
        } else if (char === "]" && stack.length) {
          [x, y, theta] = stack.pop();
        }
      }

      ctx.restore();
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    if (mediaQuery.matches) {
      currentProgress = 1;
      draw(1);
      return () => resizeObserver.disconnect();
    }

    const animate = (ts) => {
      if (start === null) start = ts;
      const next = Math.min((ts - start) / totalDuration, 1);
      currentProgress = next;
      draw(next);

      if (next < 1) {
        rafId = window.requestAnimationFrame(animate);
      }
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="lsystem-backdrop" aria-hidden="true" />;
}
