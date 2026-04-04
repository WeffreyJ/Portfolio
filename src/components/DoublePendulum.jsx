import { useEffect, useRef } from "react";

const DT = 0.01;
const SUBSTEPS = 3;
const TRAIL_LENGTH = 220;
const EPSILONS = [0, 1e-6, 2e-6, -1e-6, -2e-6];
const COLORS = [
  "rgba(194, 96, 58, 0.95)",
  "rgba(194, 96, 58, 0.8)",
  "rgba(194, 96, 58, 0.64)",
  "rgba(139, 155, 175, 0.5)",
  "rgba(139, 155, 175, 0.32)",
];

function derivatives([theta1, omega1, theta2, omega2]) {
  const m1 = 1;
  const m2 = 1;
  const l1 = 1;
  const l2 = 1;
  const g = 9.81;
  const delta = theta1 - theta2;
  const denom = 2 * m1 + m2 - m2 * Math.cos(2 * theta1 - 2 * theta2);

  const alpha1 =
    (-g * (2 * m1 + m2) * Math.sin(theta1) -
      m2 * g * Math.sin(theta1 - 2 * theta2) -
      2 *
        Math.sin(delta) *
        m2 *
        (omega2 * omega2 * l2 + omega1 * omega1 * l1 * Math.cos(delta))) /
    (l1 * denom);

  const alpha2 =
    (2 *
      Math.sin(delta) *
      (omega1 * omega1 * l1 * (m1 + m2) +
        g * (m1 + m2) * Math.cos(theta1) +
        omega2 * omega2 * l2 * m2 * Math.cos(delta))) /
    (l2 * denom);

  return [omega1, alpha1, omega2, alpha2];
}

function rk4Step(state, dt) {
  const k1 = derivatives(state);
  const k2 = derivatives(state.map((value, index) => value + (dt / 2) * k1[index]));
  const k3 = derivatives(state.map((value, index) => value + (dt / 2) * k2[index]));
  const k4 = derivatives(state.map((value, index) => value + dt * k3[index]));

  return state.map(
    (value, index) =>
      value + (dt / 6) * (k1[index] + 2 * k2[index] + 2 * k3[index] + k4[index]),
  );
}

export function DoublePendulum() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const systemsRef = useRef([]);
  const visibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const initializeSystems = () => {
      systemsRef.current = EPSILONS.map((epsilon) => ({
        state: [Math.PI / 2 + epsilon, 0, Math.PI / 2 + 0.16, 0],
        trail: [],
      }));
    };

    initializeSystems();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.offsetWidth * dpr);
      canvas.height = Math.floor(canvas.offsetHeight * dpr);
    };

    const drawFrame = () => {
      const ctx = canvas.getContext("2d");
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H * 0.18;
      const L1 = H * 0.22;
      const L2 = H * 0.22;

      ctx.save();
      ctx.strokeStyle = "rgba(242, 236, 228, 0.05)";
      ctx.lineWidth = 0.8 * (window.devicePixelRatio || 1);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, H);
      ctx.moveTo(0, cy);
      ctx.lineTo(W, cy);
      ctx.stroke();
      ctx.restore();

      systemsRef.current.forEach((system, index) => {
        const [theta1, , theta2] = system.state;
        const x1 = cx + Math.sin(theta1) * L1;
        const y1 = cy + Math.cos(theta1) * L1;
        const x2 = x1 + Math.sin(theta2) * L2;
        const y2 = y1 + Math.cos(theta2) * L2;

        system.trail.push({ x: x2, y: y2 });

        if (system.trail.length > TRAIL_LENGTH) {
          system.trail.shift();
        }

        ctx.save();
        ctx.lineWidth = (1.2 + index * 0.08) * (window.devicePixelRatio || 1);

        for (let i = 1; i < system.trail.length; i += 1) {
          const alpha = i / system.trail.length;
          ctx.strokeStyle = COLORS[index].replace(/[\d.]+\)$/u, `${Math.max(alpha * 0.9, 0.02)})`);
          ctx.beginPath();
          ctx.moveTo(system.trail[i - 1].x, system.trail[i - 1].y);
          ctx.lineTo(system.trail[i].x, system.trail[i].y);
          ctx.stroke();
        }

        ctx.restore();

        if (index === 0) {
          ctx.save();
          ctx.strokeStyle = "rgba(242, 236, 228, 0.42)";
          ctx.lineWidth = 1.3 * (window.devicePixelRatio || 1);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          ctx.fillStyle = "rgba(242, 236, 228, 0.88)";
          ctx.beginPath();
          ctx.arc(cx, cy, 3.5 * (window.devicePixelRatio || 1), 0, Math.PI * 2);
          ctx.arc(x1, y1, 4.2 * (window.devicePixelRatio || 1), 0, Math.PI * 2);
          ctx.arc(x2, y2, 4.8 * (window.devicePixelRatio || 1), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      ctx.save();
      ctx.font = `${8.5 * (window.devicePixelRatio || 1)}px "IBM Plex Mono", monospace`;
      ctx.fillStyle = "rgba(139, 155, 175, 0.32)";
      ctx.fillText("Δθ₀ = 10⁻⁶ · Lyapunov says hi", 14 * (window.devicePixelRatio || 1), H - 16 * (window.devicePixelRatio || 1));
      ctx.restore();
    };

    const animate = () => {
      if (visibleRef.current) {
        for (let substep = 0; substep < SUBSTEPS; substep += 1) {
          systemsRef.current = systemsRef.current.map((system) => ({
            ...system,
            state: rk4Step(system.state, DT),
          }));
        }
      }

      drawFrame();
      rafRef.current = window.requestAnimationFrame(animate);
    };

    resize();
    drawFrame();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      drawFrame();
      return () => resizeObserver.disconnect();
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.1 },
    );
    intersectionObserver.observe(canvas);

    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="double-pendulum" aria-hidden="true" />;
}
