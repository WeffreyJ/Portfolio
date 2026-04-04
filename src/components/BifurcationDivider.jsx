import { useEffect, useRef, useState } from "react";

const HEIGHT = 68;
const R_MIN = 2.5;
const R_MAX = 4.0;
const R_SAMPLES = 1000;
const ITERATIONS = 300;
const TRANSIENT = 100;

export function BifurcationDivider() {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches) {
      setRevealed(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;

    if (!canvas || !wrapper) {
      return undefined;
    }

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.floor(wrapper.offsetWidth));
      const height = HEIGHT;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(194, 96, 58, 0.15)";

      for (let ri = 0; ri < R_SAMPLES; ri += 1) {
        const r = R_MIN + (ri / (R_SAMPLES - 1)) * (R_MAX - R_MIN);
        let x = 0.5;

        for (let i = 0; i < ITERATIONS; i += 1) {
          x = r * x * (1 - x);

          if (i <= TRANSIENT) {
            continue;
          }

          const px = Math.floor((ri / (R_SAMPLES - 1)) * (canvas.width - 1));
          const py = Math.floor((1 - x) * (canvas.height - 1));
          ctx.fillRect(px, py, Math.max(1, Math.ceil(dpr * 0.85)), Math.max(1, Math.ceil(dpr * 0.85)));
        }
      }
    };

    render();
    const resizeObserver = new ResizeObserver(render);
    resizeObserver.observe(wrapper);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`bifurcation-divider ${revealed ? "is-revealed" : ""}`.trim()}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="bifurcation-divider__canvas" />
    </div>
  );
}
