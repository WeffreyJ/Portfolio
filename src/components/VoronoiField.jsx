import { useEffect, useRef } from "react";

const SEED_COUNT = 40;
const SAMPLE_STEP = 12;

function distanceSquared(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

export function VoronoiField() {
  const canvasRef = useRef(null);
  const seedsRef = useRef([]);
  const rafRef = useRef(null);
  const hoverRef = useRef(null);
  const impulseRef = useRef(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const initSeeds = () => {
      const W = canvas.width;
      const H = canvas.height;
      seedsRef.current = Array.from({ length: SEED_COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
      }));
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.offsetWidth * dpr);
      canvas.height = Math.floor(canvas.offsetHeight * dpr);
      initSeeds();
      draw();
    };

    const nearestSeedIndex = (x, y) => {
      let nearest = 0;
      let minDistance = Infinity;
      seedsRef.current.forEach((seed, index) => {
        const dist = distanceSquared(x, y, seed.x, seed.y);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = index;
        }
      });
      return nearest;
    };

    const draw = () => {
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, W, H);

      const hoverPoint = hoverRef.current;
      const highlighted = hoverPoint ? nearestSeedIndex(hoverPoint.x, hoverPoint.y) : -1;

      for (let y = 0; y < H; y += SAMPLE_STEP * dpr) {
        for (let x = 0; x < W; x += SAMPLE_STEP * dpr) {
          let nearest = Infinity;
          let second = Infinity;
          let nearestIndex = -1;

          seedsRef.current.forEach((seed, index) => {
            const dist = distanceSquared(x, y, seed.x, seed.y);
            if (dist < nearest) {
              second = nearest;
              nearest = dist;
              nearestIndex = index;
            } else if (dist < second) {
              second = dist;
            }
          });

          const boundary = Math.abs(Math.sqrt(second) - Math.sqrt(nearest));
          if (nearestIndex === highlighted) {
            ctx.fillStyle = "rgba(194, 96, 58, 0.08)";
            ctx.fillRect(x, y, SAMPLE_STEP * dpr, SAMPLE_STEP * dpr);
          }
          if (boundary < 1.8 * dpr) {
            ctx.fillStyle =
              nearestIndex === highlighted
                ? "rgba(194, 96, 58, 0.28)"
                : "rgba(194, 96, 58, 0.075)";
            ctx.fillRect(x, y, SAMPLE_STEP * dpr, SAMPLE_STEP * dpr);
          }
        }
      }
    };

    const animate = () => {
      if (visibleRef.current && !mediaQuery.matches) {
        const W = canvas.width;
        const H = canvas.height;

        seedsRef.current.forEach((seed) => {
          seed.x += seed.vx;
          seed.y += seed.vy;

          if (seed.x < 0 || seed.x > W) seed.vx *= -1;
          if (seed.y < 0 || seed.y > H) seed.vy *= -1;

          seed.x = Math.max(0, Math.min(W, seed.x));
          seed.y = Math.max(0, Math.min(H, seed.y));

          const impulse = impulseRef.current;
          if (impulse) {
            const dx = seed.x - impulse.x;
            const dy = seed.y - impulse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < impulse.radius && dist > 0.001) {
              const strength = (1 - dist / impulse.radius) * 0.32;
              seed.vx += (dx / dist) * strength;
              seed.vy += (dy / dist) * strength;
            }
          }

          seed.vx *= 0.992;
          seed.vy *= 0.992;
        });

        if (impulseRef.current) {
          impulseRef.current.life -= 1;
          if (impulseRef.current.life <= 0) impulseRef.current = null;
        }
      }

      draw();
      rafRef.current = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      hoverRef.current = {
        x: (event.clientX - rect.left) * dpr,
        y: (event.clientY - rect.top) * dpr,
      };
    };

    const handlePointerLeave = () => {
      hoverRef.current = null;
    };

    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      impulseRef.current = {
        x: (event.clientX - rect.left) * dpr,
        y: (event.clientY - rect.top) * dpr,
        radius: 96 * dpr,
        life: 22,
      };
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

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("click", handleClick);

    if (mediaQuery.matches) {
      draw();
    } else {
      rafRef.current = window.requestAnimationFrame(animate);
    }

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  return <canvas ref={canvasRef} className="voronoi-field" aria-hidden="true" />;
}
