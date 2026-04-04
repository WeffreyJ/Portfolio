import { useEffect, useRef } from "react";

const SIGMA = 10;
const RHO = 28;
const BETA = 8 / 3;
const DT = 0.005;
const TRAIL_LENGTH = 800;

function stepLorenz([x, y, z]) {
  const f = (a, b, c) => [
    SIGMA * (b - a),
    a * (RHO - c) - b,
    a * b - BETA * c,
  ];

  const k1 = f(x, y, z);
  const k2 = f(x + (DT / 2) * k1[0], y + (DT / 2) * k1[1], z + (DT / 2) * k1[2]);
  const k3 = f(x + (DT / 2) * k2[0], y + (DT / 2) * k2[1], z + (DT / 2) * k2[2]);
  const k4 = f(x + DT * k3[0], y + DT * k3[1], z + DT * k3[2]);

  return [
    x + (DT / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
    y + (DT / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    z + (DT / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
  ];
}

function colorForZ(z, alpha) {
  const t = Math.max(0, Math.min(1, z / 50));
  const r = 194 + (139 - 194) * t;
  const g = 96 + (155 - 96) * t;
  const b = 58 + (175 - 58) * t;
  return `rgba(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)}, ${alpha})`;
}

export function LorenzAttractor() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const trajectoriesRef = useRef([]);
  const visibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    trajectoriesRef.current = Array.from({ length: 6 }, (_, index) => {
      const offset = (index - 2.5) * 0.0007;
      return {
        state: [1 + offset, 1 - offset * 0.4, 1 + offset * 0.75],
        trail: [],
      };
    });

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.offsetWidth * dpr);
      canvas.height = Math.floor(canvas.offsetHeight * dpr);
      draw();
    };

    const project = ([x, y, z], W, H) => {
      const px = W * 0.5 + x * (W * 0.013) + y * (W * 0.0035);
      const py = H * 0.46 + z * (H * 0.0086) - y * (H * 0.0034);
      return [px, py];
    };

    const draw = () => {
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, W, H);

      trajectoriesRef.current.forEach((trajectory) => {
        const { trail } = trajectory;
        for (let i = 1; i < trail.length; i += 1) {
          const alpha = (i / trail.length) * 0.22;
          ctx.strokeStyle = colorForZ(trail[i].z, alpha);
          ctx.lineWidth = 1.05 * dpr;
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx.lineTo(trail[i].x, trail[i].y);
          ctx.stroke();
        }
      });

      ctx.save();
      ctx.font = `${8.5 * dpr}px "IBM Plex Mono", monospace`;
      ctx.fillStyle = "rgba(139, 155, 175, 0.32)";
      ctx.fillText("σ=10  ρ=28  β=8/3", W - 112 * dpr, 18 * dpr);
      ctx.restore();
    };

    const animate = () => {
      if (visibleRef.current && !mediaQuery.matches) {
        trajectoriesRef.current = trajectoriesRef.current.map((trajectory) => {
          const nextState = stepLorenz(trajectory.state);
          const [x, y] = project(nextState, canvas.width, canvas.height);
          const nextTrail = [...trajectory.trail, { x, y, z: nextState[2] }].slice(-TRAIL_LENGTH);
          return {
            state: nextState,
            trail: nextTrail,
          };
        });
      }

      draw();
      rafRef.current = window.requestAnimationFrame(animate);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.05 },
    );
    intersectionObserver.observe(canvas);

    if (!mediaQuery.matches) {
      rafRef.current = window.requestAnimationFrame(animate);
    } else {
      for (let i = 0; i < 420; i += 1) {
        trajectoriesRef.current = trajectoriesRef.current.map((trajectory) => {
          const nextState = stepLorenz(trajectory.state);
          const [x, y] = project(nextState, canvas.width, canvas.height);
          const nextTrail = [...trajectory.trail, { x, y, z: nextState[2] }].slice(-TRAIL_LENGTH);
          return {
            state: nextState,
            trail: nextTrail,
          };
        });
      }
      draw();
    }

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="lorenz-attractor" aria-hidden="true" />;
}
