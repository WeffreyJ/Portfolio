import { useEffect, useRef } from "react";

const SIM_W = 140;
const SIM_H = 96;
const DU = 0.2097;
const DV = 0.105;
const F = 0.0545;
const K = 0.062;

function idx(x, y) {
  return y * SIM_W + x;
}

export function ReactionDiffusionBackdrop() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const temp = document.createElement("canvas");
    temp.width = SIM_W;
    temp.height = SIM_H;
    const tempCtx = temp.getContext("2d");
    let U = new Float32Array(SIM_W * SIM_H).fill(1);
    let V = new Float32Array(SIM_W * SIM_H);
    let nextU = new Float32Array(SIM_W * SIM_H);
    let nextV = new Float32Array(SIM_W * SIM_H);

    for (let y = SIM_H / 2 - 8; y < SIM_H / 2 + 8; y += 1) {
      for (let x = SIM_W / 2 - 8; x < SIM_W / 2 + 8; x += 1) {
        U[idx(x, y)] = 0.5 + Math.random() * 0.08;
        V[idx(x, y)] = 0.22 + Math.random() * 0.08;
      }
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.offsetWidth * dpr);
      canvas.height = Math.floor(canvas.offsetHeight * dpr);
      draw();
    };

    const laplacian = (field, x, y) => {
      let sum = -field[idx(x, y)];
      sum += field[idx((x - 1 + SIM_W) % SIM_W, y)] * 0.2;
      sum += field[idx((x + 1) % SIM_W, y)] * 0.2;
      sum += field[idx(x, (y - 1 + SIM_H) % SIM_H)] * 0.2;
      sum += field[idx(x, (y + 1) % SIM_H)] * 0.2;
      sum += field[idx((x - 1 + SIM_W) % SIM_W, (y - 1 + SIM_H) % SIM_H)] * 0.05;
      sum += field[idx((x + 1) % SIM_W, (y - 1 + SIM_H) % SIM_H)] * 0.05;
      sum += field[idx((x - 1 + SIM_W) % SIM_W, (y + 1) % SIM_H)] * 0.05;
      sum += field[idx((x + 1) % SIM_W, (y + 1) % SIM_H)] * 0.05;
      return sum;
    };

    const step = () => {
      for (let y = 0; y < SIM_H; y += 1) {
        for (let x = 0; x < SIM_W; x += 1) {
          const i = idx(x, y);
          const u = U[i];
          const v = V[i];
          const uvv = u * v * v;
          const du = DU * laplacian(U, x, y) - uvv + F * (1 - u);
          const dv = DV * laplacian(V, x, y) + uvv - (F + K) * v;
          nextU[i] = Math.max(0, Math.min(1, u + du));
          nextV[i] = Math.max(0, Math.min(1, v + dv));
        }
      }
      [U, nextU] = [nextU, U];
      [V, nextV] = [nextV, V];
    };

    const draw = () => {
      const ctx = canvas.getContext("2d");
      const image = ctx.createImageData(SIM_W, SIM_H);
      for (let i = 0; i < U.length; i += 1) {
        const t = Math.max(0, Math.min(1, V[i] * 1.65));
        const r = 194 + (139 - 194) * t;
        const g = 96 + (155 - 96) * t;
        const b = 58 + (175 - 58) * t;
        const base = i * 4;
        image.data[base] = r;
        image.data[base + 1] = g;
        image.data[base + 2] = b;
        image.data[base + 3] = 255 * Math.max(0.05, t * 0.65);
      }

      tempCtx.putImageData(image, 0, 0);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(temp, 0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
      if (visibleRef.current && !mediaQuery.matches) {
        step();
        step();
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
      for (let i = 0; i < 18; i += 1) step();
      draw();
    }

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="reaction-diffusion-backdrop" aria-hidden="true" />;
}
