import { useEffect, useRef } from "react";

const SAMPLE_COUNT = 420;
const TERMS = 48;

function dft(points) {
  const N = points.length;
  const coeffs = [];

  for (let n = 0; n < N; n += 1) {
    let re = 0;
    let im = 0;

    for (let k = 0; k < N; k += 1) {
      const phi = (-2 * Math.PI * n * k) / N;
      const cos = Math.cos(phi);
      const sin = Math.sin(phi);
      re += points[k].re * cos - points[k].im * sin;
      im += points[k].re * sin + points[k].im * cos;
    }

    re /= N;
    im /= N;

    coeffs.push({
      freq: n <= N / 2 ? n : n - N,
      amp: Math.hypot(re, im),
      phase: Math.atan2(im, re),
    });
  }

  return coeffs.sort((a, b) => b.amp - a.amp).slice(0, TERMS);
}

export function FourierEpicycles() {
  const canvasRef = useRef(null);
  const pathRef = useRef(null);
  const coeffsRef = useRef([]);
  const trailRef = useRef([]);
  const rafRef = useRef(null);
  const visibleRef = useRef(true);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const path = pathRef.current;
    const canvas = canvasRef.current;

    if (!path || !canvas) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mediaQuery.matches;

    const length = path.getTotalLength();
    const samples = [];

    for (let i = 0; i < SAMPLE_COUNT; i += 1) {
      const point = path.getPointAtLength((i / SAMPLE_COUNT) * length);
      samples.push({ re: point.x, im: point.y });
    }

    const centerRe = samples.reduce((sum, point) => sum + point.re, 0) / samples.length;
    const centerIm = samples.reduce((sum, point) => sum + point.im, 0) / samples.length;
    const normalized = samples.map((point) => ({
      re: point.re - centerRe,
      im: point.im - centerIm,
    }));

    coeffsRef.current = dft(normalized);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.offsetWidth * dpr);
      canvas.height = Math.floor(canvas.offsetHeight * dpr);
      drawFrame(performance.now() / 1000);
    };

    const drawFrame = (seconds) => {
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const dpr = window.devicePixelRatio || 1;
      const cx = W / 2;
      const cy = H / 2 - 8 * dpr;
      const scale = Math.min(W, H) * 0.0075;
      const t = (seconds * 0.85) % (Math.PI * 2);

      let x = 0;
      let y = 0;

      coeffsRef.current.forEach((term, index) => {
        const prevX = x;
        const prevY = y;
        const angle = term.freq * t + term.phase;
        x += term.amp * Math.cos(angle);
        y += term.amp * Math.sin(angle);

        const radius = term.amp * scale;
        if (radius < 1.25 * dpr) {
          return;
        }

        ctx.save();
        ctx.strokeStyle =
          index % 4 === 0 ? "rgba(194, 96, 58, 0.18)" : "rgba(139, 155, 175, 0.16)";
        ctx.lineWidth = 0.85 * dpr;
        ctx.beginPath();
        ctx.arc(cx + prevX * scale, cy + prevY * scale, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(242, 236, 228, 0.16)";
        ctx.beginPath();
        ctx.moveTo(cx + prevX * scale, cy + prevY * scale);
        ctx.lineTo(cx + x * scale, cy + y * scale);
        ctx.stroke();
        ctx.restore();
      });

      trailRef.current.unshift({ x: cx + x * scale, y: cy + y * scale });
      if (trailRef.current.length > 420) {
        trailRef.current.pop();
      }

      ctx.save();
      for (let i = 1; i < trailRef.current.length; i += 1) {
        const alpha = 1 - i / trailRef.current.length;
        ctx.strokeStyle = `rgba(194, 96, 58, ${alpha * 0.7})`;
        ctx.lineWidth = 1.25 * dpr;
        ctx.beginPath();
        ctx.moveTo(trailRef.current[i - 1].x, trailRef.current[i - 1].y);
        ctx.lineTo(trailRef.current[i].x, trailRef.current[i].y);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.fillStyle = "rgba(139, 155, 175, 0.6)";
      ctx.font = `${10 * dpr}px "IBM Plex Mono", monospace`;
      ctx.textAlign = "center";
      ctx.fillText("ℱ{ JW }", W / 2, H - 14 * dpr);
      ctx.restore();
    };

    const animate = (ts) => {
      if (visibleRef.current && !reducedMotionRef.current) {
        drawFrame(ts / 1000);
      }
      rafRef.current = window.requestAnimationFrame(animate);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = Boolean(entry?.isIntersecting);
        if (entry?.isIntersecting && reducedMotionRef.current) {
          drawFrame(performance.now() / 1000);
        }
      },
      { threshold: 0.1 },
    );
    intersectionObserver.observe(canvas);

    if (!reducedMotionRef.current) {
      rafRef.current = window.requestAnimationFrame(animate);
    }

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <div className="fourier-epicycles">
      <canvas ref={canvasRef} className="fourier-epicycles__canvas" aria-hidden="true" />
      <svg className="fourier-epicycles__svg" viewBox="0 0 200 120" aria-hidden="true">
        <path
          ref={pathRef}
          d="M20 24 C42 20, 64 20, 74 26 C82 31, 80 43, 70 49 C60 55, 54 59, 54 74 C54 90, 66 96, 84 95 C102 94, 114 84, 116 68 M122 22 L136 96 L154 46 L170 96 L184 22"
          fill="none"
          stroke="transparent"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
