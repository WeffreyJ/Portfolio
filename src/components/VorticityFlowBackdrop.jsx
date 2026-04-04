import { useEffect, useRef } from "react";

function makeParticle(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    age: Math.random() * 200,
  };
}

export function VorticityFlowBackdrop() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const vorticesRef = useRef([]);
  const particlesRef = useRef([]);
  const visibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lastShed = 0;
    let phase = 1;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.offsetWidth * dpr);
      canvas.height = Math.floor(canvas.offsetHeight * dpr);
      particlesRef.current = Array.from({ length: 170 }, () => makeParticle(canvas.width, canvas.height));
      draw();
    };

    const wing = () => ({
      x: canvas.width * 0.28,
      y: canvas.height * 0.47,
      width: canvas.width * 0.12,
      height: canvas.height * 0.02,
    });

    const flowAt = (x, y) => {
      const g = wing();
      let u = canvas.width * 0.0009;
      let v = 0;

      vorticesRef.current.forEach((vortex) => {
        const dx = x - vortex.x;
        const dy = y - vortex.y;
        const r2 = dx * dx + dy * dy + 1600;
        u += (-vortex.strength * dy) / r2;
        v += (vortex.strength * dx) / r2;
      });

      if (x > g.x && x < g.x + g.width && y > g.y - g.height * 3 && y < g.y + g.height * 3) {
        u *= 0.1;
        v *= 0.1;
      }

      return { u, v };
    };

    const draw = () => {
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      const g = wing();

      ctx.clearRect(0, 0, W, H);

      vorticesRef.current.forEach((vortex) => {
        const radius = 54 * dpr;
        const gradient = ctx.createRadialGradient(vortex.x, vortex.y, 0, vortex.x, vortex.y, radius);
        if (vortex.strength > 0) {
          gradient.addColorStop(0, "rgba(194, 96, 58, 0.14)");
          gradient.addColorStop(1, "rgba(194, 96, 58, 0)");
        } else {
          gradient.addColorStop(0, "rgba(139, 155, 175, 0.14)");
          gradient.addColorStop(1, "rgba(139, 155, 175, 0)");
        }
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(vortex.x, vortex.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.save();
      ctx.fillStyle = "rgba(242, 236, 228, 0.06)";
      ctx.beginPath();
      ctx.moveTo(g.x, g.y);
      ctx.lineTo(g.x + g.width, g.y - g.height);
      ctx.lineTo(g.x + g.width, g.y + g.height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.save();
      particlesRef.current.forEach((particle) => {
        ctx.fillStyle = "rgba(242, 236, 228, 0.12)";
        ctx.fillRect(particle.x, particle.y, 1.4 * dpr, 1.4 * dpr);
      });
      ctx.restore();
    };

    const animate = (ts) => {
      if (visibleRef.current && !mediaQuery.matches) {
        if (ts - lastShed > 900) {
          const g = wing();
          vorticesRef.current.push({
            x: g.x + g.width + canvas.width * 0.012,
            y: g.y + phase * canvas.height * 0.034,
            strength: phase * canvas.width * 0.42,
            age: 0,
          });
          phase *= -1;
          lastShed = ts;
        }

        vorticesRef.current = vorticesRef.current
          .map((vortex) => ({
            ...vortex,
            x: vortex.x + canvas.width * 0.0012,
            age: vortex.age + 1,
            strength: vortex.strength * 0.996,
          }))
          .filter((vortex) => vortex.x < canvas.width + 120 && vortex.age < 500);

        particlesRef.current = particlesRef.current.map((particle) => {
          const flow = flowAt(particle.x, particle.y);
          let nextX = particle.x + flow.u;
          let nextY = particle.y + flow.v;
          let nextAge = particle.age + 1;
          if (
            nextX < 0 ||
            nextX > canvas.width ||
            nextY < 0 ||
            nextY > canvas.height ||
            nextAge > 260
          ) {
            const replacement = makeParticle(canvas.width, canvas.height);
            replacement.x = Math.random() * canvas.width * 0.08;
            replacement.y = Math.random() * canvas.height;
            return replacement;
          }
          return { x: nextX, y: nextY, age: nextAge };
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
      draw();
    }

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="vorticity-flow-backdrop" aria-hidden="true" />;
}
