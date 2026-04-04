import { useEffect, useRef } from "react";

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function ContactBodePlot() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let rafId = null;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.offsetWidth * dpr);
      canvas.height = Math.floor(canvas.offsetHeight * dpr);
      draw();
    };

    const progressForPage = () => {
      const rect = canvas.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      return Math.max(0, Math.min(1, 1 - (rect.top + rect.height * 0.15) / (viewport + rect.height)));
    };

    const draw = () => {
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, W, H);

      const progress = mediaQuery.matches ? 0.9 : progressForPage();
      const K = lerp(0.5, 8, progress);
      const a = 0.7;
      const marginX = 24 * dpr;
      const marginTop = 18 * dpr;
      const gap = 18 * dpr;
      const plotH = (H - marginTop * 2 - gap) / 2;
      const plotW = W - marginX * 2;
      const wMin = 0.01;
      const wMax = 100;
      const samples = 64;

      const magPoints = [];
      const phasePoints = [];
      let crossover = null;

      for (let i = 0; i < samples; i += 1) {
        const t = i / (samples - 1);
        const omega = wMin * Math.pow(wMax / wMin, t);
        const magnitude = K / Math.sqrt(omega * omega + a * a);
        const db = 20 * Math.log10(magnitude);
        const phase = (-Math.atan(omega / a) * 180) / Math.PI;
        const x = marginX + t * plotW;
        const yMag = marginTop + (1 - (db + 30) / 36) * plotH;
        const yPhase = marginTop + plotH + gap + (1 - (phase + 100) / 100) * plotH;
        magPoints.push([x, yMag]);
        phasePoints.push([x, yPhase]);

        if (crossover === null && db <= 0) {
          crossover = { x, phase };
        }
      }

      ctx.save();
      ctx.strokeStyle = "rgba(194, 96, 58, 0.12)";
      ctx.lineWidth = 0.8 * dpr;
      for (let i = 0; i <= 2; i += 1) {
        const yTop = marginTop + (plotH / 2) * i;
        const yBottom = marginTop + plotH + gap + (plotH / 2) * i;
        ctx.beginPath();
        ctx.moveTo(marginX, yTop);
        ctx.lineTo(marginX + plotW, yTop);
        ctx.moveTo(marginX, yBottom);
        ctx.lineTo(marginX + plotW, yBottom);
        ctx.stroke();
      }
      ctx.restore();

      const drawPath = (points, color, width) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width * dpr;
        ctx.beginPath();
        points.forEach(([x, y], index) => {
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.restore();
      };

      drawPath(magPoints, "rgba(139, 155, 175, 0.65)", 1.5);
      drawPath(phasePoints, "rgba(139, 155, 175, 0.48)", 1.3);

      if (crossover) {
        const pm = Math.max(0, 180 + crossover.phase);
        ctx.save();
        ctx.strokeStyle = "rgba(194, 96, 58, 0.22)";
        ctx.setLineDash([5 * dpr, 7 * dpr]);
        ctx.beginPath();
        ctx.moveTo(crossover.x, marginTop);
        ctx.lineTo(crossover.x, marginTop + plotH * 2 + gap);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.font = `${8 * dpr}px "IBM Plex Mono", monospace`;
        ctx.fillStyle = "rgba(194, 96, 58, 0.38)";
        ctx.fillText(`PM: ${pm.toFixed(0)}°`, crossover.x + 6 * dpr, marginTop + plotH + gap + 12 * dpr);
        ctx.fillStyle = "rgba(139, 155, 175, 0.34)";
        ctx.fillText("GM: adequate", marginX + plotW - 66 * dpr, marginTop + 12 * dpr);
        ctx.restore();
      }

      ctx.save();
      ctx.font = `${8 * dpr}px "IBM Plex Mono", monospace`;
      ctx.fillStyle = "rgba(139, 155, 175, 0.3)";
      ctx.fillText("overthinking", marginX, H - 8 * dpr);
      ctx.fillText("first draft", marginX + plotW * 0.43, H - 8 * dpr);
      ctx.fillText("send it", marginX + plotW - 34 * dpr, H - 8 * dpr);
      ctx.restore();
    };

    const onScroll = () => {
      if (!mediaQuery.matches) {
        draw();
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    if (!mediaQuery.matches) {
      const loop = () => {
        draw();
        rafId = window.requestAnimationFrame(loop);
      };
      rafId = window.requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className="contact-bode-plot" aria-hidden="true" />;
}
