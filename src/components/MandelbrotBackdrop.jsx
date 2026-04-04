import { useEffect, useRef } from "react";

const W = 220;
const H = 140;
const MAX_ITER = 68;

function palette(t) {
  if (t < 0.5) {
    const u = t / 0.5;
    return [
      194 + (139 - 194) * u,
      96 + (155 - 96) * u,
      58 + (175 - 58) * u,
    ];
  }
  const u = (t - 0.5) / 0.5;
  return [
    139 + (24 - 139) * u,
    155 + (23 - 155) * u,
    175 + (22 - 175) * u,
  ];
}

export function MandelbrotBackdrop() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const temp = document.createElement("canvas");
    temp.width = W;
    temp.height = H;
    const tempCtx = temp.getContext("2d");
    let zoom = 1.8;
    const center = { re: -0.7269, im: 0.1889 };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.offsetWidth * dpr);
      canvas.height = Math.floor(canvas.offsetHeight * dpr);
      draw();
    };

    const draw = () => {
      const ctx = canvas.getContext("2d");
      const image = ctx.createImageData(W, H);
      for (let py = 0; py < H; py += 1) {
        for (let px = 0; px < W; px += 1) {
          let zx = 0;
          let zy = 0;
          const cr = center.re + ((px / W) - 0.5) * (2.7 / zoom);
          const ci = center.im + ((py / H) - 0.5) * (1.8 / zoom);
          let iter = 0;

          while (zx * zx + zy * zy <= 4 && iter < MAX_ITER) {
            const nextX = zx * zx - zy * zy + cr;
            zy = 2 * zx * zy + ci;
            zx = nextX;
            iter += 1;
          }

          const base = (py * W + px) * 4;
          if (iter === MAX_ITER) {
            image.data[base] = 18;
            image.data[base + 1] = 17;
            image.data[base + 2] = 16;
            image.data[base + 3] = 255;
          } else {
            const smooth = iter + 1 - Math.log(Math.log(Math.sqrt(zx * zx + zy * zy))) / Math.log(2);
            const [r, g, b] = palette(Math.max(0, Math.min(1, smooth / MAX_ITER)));
            image.data[base] = r;
            image.data[base + 1] = g;
            image.data[base + 2] = b;
            image.data[base + 3] = 255;
          }
        }
      }

      tempCtx.putImageData(image, 0, 0);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(temp, 0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
      if (visibleRef.current && !mediaQuery.matches) {
        zoom *= 1.00035;
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
      draw();
    }

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="mandelbrot-backdrop" aria-hidden="true" />;
}
