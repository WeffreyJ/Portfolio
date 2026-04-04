import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

function rootsForK(K) {
  const discriminant = (3 + K) * (3 + K) - 4 * (2 + 2 * K);
  if (discriminant >= 0) {
    const sqrt = Math.sqrt(discriminant);
    return [
      { re: (-(3 + K) + sqrt) / 2, im: 0 },
      { re: (-(3 + K) - sqrt) / 2, im: 0 },
    ];
  }

  const sqrt = Math.sqrt(-discriminant) / 2;
  return [
    { re: -(3 + K) / 2, im: sqrt },
    { re: -(3 + K) / 2, im: -sqrt },
  ];
}

export function RootLocusStrip() {
  const canvasRef = useRef(null);
  const [unstablePulse, setUnstablePulse] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.offsetWidth * dpr);
      canvas.height = Math.floor(canvas.offsetHeight * dpr);
    };

    const draw = () => {
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, W, H);

      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = clamp(window.scrollY / maxScroll, 0, 1);
      const K = progress * 20;
      const roots = rootsForK(K);
      const unstable = roots.some((root) => root.re > 0);

      setUnstablePulse((previous) => (previous !== unstable ? unstable : previous));

      const xAxis = W * 0.52;
      const yAxis = H / 2;
      const reScale = 14 * dpr;
      const imScale = 18 * dpr;
      const toCanvas = (root) => [xAxis + root.re * reScale, yAxis - root.im * imScale];

      ctx.save();
      ctx.strokeStyle = "rgba(242, 236, 228, 0.08)";
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      ctx.moveTo(xAxis, 0);
      ctx.lineTo(xAxis, H);
      ctx.moveTo(0, yAxis);
      ctx.lineTo(W, yAxis);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = "rgba(139, 155, 175, 0.28)";
      ctx.lineWidth = 0.8 * dpr;
      ctx.beginPath();
      for (let sampleK = 0; sampleK <= K; sampleK += 0.2) {
        const [r1, r2] = rootsForK(sampleK);
        const [x1, y1] = toCanvas(r1);
        const [x2, y2] = toCanvas(r2);
        if (sampleK === 0) {
          ctx.moveTo(x1, y1);
        } else {
          ctx.lineTo(x1, y1);
        }
        ctx.moveTo(x2, y2);
        if (sampleK !== 0) ctx.lineTo(x2, y2);
      }
      ctx.stroke();
      ctx.restore();

      const drawCross = (x, y, color, size = 4.8) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5 * dpr;
        ctx.beginPath();
        ctx.moveTo(x - size * dpr, y - size * dpr);
        ctx.lineTo(x + size * dpr, y + size * dpr);
        ctx.moveTo(x + size * dpr, y - size * dpr);
        ctx.lineTo(x - size * dpr, y + size * dpr);
        ctx.stroke();
        ctx.restore();
      };

      drawCross(...toCanvas({ re: -1, im: 0 }), "rgba(194, 96, 58, 0.4)");
      drawCross(...toCanvas({ re: -2, im: 0 }), "rgba(194, 96, 58, 0.4)");

      ctx.save();
      ctx.strokeStyle = "rgba(139, 155, 175, 0.42)";
      ctx.lineWidth = 1.4 * dpr;
      ctx.beginPath();
      const [zx, zy] = toCanvas({ re: -2, im: 0 });
      ctx.arc(zx, zy, 5.8 * dpr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      roots.forEach((root) => {
        drawCross(...toCanvas(root), "rgba(194, 96, 58, 0.92)", 5.2);
      });

      ctx.save();
      ctx.font = `${7.5 * dpr}px "IBM Plex Mono", monospace`;
      ctx.fillStyle = "rgba(139, 155, 175, 0.38)";
      ctx.fillText(`K=${K.toFixed(1)}`, 6 * dpr, 12 * dpr);
      ctx.restore();

      canvas.parentElement?.classList.toggle("root-locus-strip--unstable", unstable);
      canvas.parentElement?.classList.toggle("root-locus-strip--stable", !unstable);
    };

    resize();
    draw();

    const onScroll = () => draw();
    const onResize = () => {
      resize();
      draw();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    if (mediaQuery.matches) {
      draw();
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [location.pathname]);

  return (
    <div className={`root-locus-strip ${unstablePulse ? "root-locus-strip--pulse" : ""}`.trim()} aria-hidden="true">
      <canvas ref={canvasRef} className="root-locus-strip__canvas" />
    </div>
  );
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
