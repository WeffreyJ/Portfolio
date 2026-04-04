import { useEffect, useRef, useCallback } from "react";

// Stable spiral: ẋ = Ax, A = [[-α, -ω], [ω, -α]]
// Eigenvalues: -α ± iω  →  stable equilibrium at origin
const ALPHA = 0.085;
const OMEGA = 0.62;
const EQ_PULSE_PERIOD = 3.0; // seconds — slow breathe on equilibrium dot

const PALETTE = [
  "rgba(210, 120, 67,",   // terracotta
  "rgba(142, 161, 168,",  // steel
  "rgba(225, 150, 105,",  // warm accent
  "rgba(105, 128, 138,",  // cool muted
  "rgba(185, 95, 48,",    // deep terracotta
];

export function PhasePortrait({ className = "" }) {
  const canvasRef = useRef(null);
  const trajsRef = useRef([]);
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);
  const tTotalRef = useRef(0);       // wall time for equilibrium pulse
  const visibleRef = useRef(true);   // IntersectionObserver gate

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
  }, []);

  // Pause RAF when canvas is off-screen
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const obs = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    obs.observe(canvas);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resize();

    const N = 13;
    trajsRef.current = Array.from({ length: N }, (_, i) => ({
      r: 1.5 + (i / N) * 1.8,
      phi: (i / N) * Math.PI * 2 + 0.4,
      t: -(i / N) * 8,          // stagger so trails are pre-warmed
      colorIdx: i % PALETTE.length,
    }));

    function draw(ts) {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.04);
      lastTsRef.current = ts;

      // Off-screen: skip heavy drawing, just requeue
      if (!visibleRef.current) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      tTotalRef.current += dt;

      const dpr = window.devicePixelRatio || 1;
      const W = canvas.width;
      const H = canvas.height;
      const ctx = canvas.getContext("2d");

      // Phase-plane to canvas
      const scale = Math.min(W, H) / 7.8;
      const cx = W / 2;
      const cy = H / 2;
      const toC = (x1, x2) => [cx + x1 * scale, cy - x2 * scale];

      ctx.clearRect(0, 0, W, H);

      // ── Vector field ──────────────────────────────────────────────────────────
      ctx.save();
      ctx.strokeStyle = "rgba(242, 236, 228, 0.05)";
      ctx.lineWidth = 0.75 * dpr;
      const gstep = 0.72;
      for (let x1 = -3.6; x1 <= 3.6; x1 += gstep) {
        for (let x2 = -3.6; x2 <= 3.6; x2 += gstep) {
          const d1 = -ALPHA * x1 - OMEGA * x2;
          const d2 = OMEGA * x1 - ALPHA * x2;
          const mag = Math.sqrt(d1 * d1 + d2 * d2);
          if (mag < 0.01) continue;
          const L = 0.16;
          const [sx, sy] = toC(x1, x2);
          const [ex, ey] = toC(x1 + (d1 / mag) * L, x2 + (d2 / mag) * L);
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }
      }
      ctx.restore();

      // ── Axes (dashed) ─────────────────────────────────────────────────────────
      const [ox, oy] = toC(0, 0);
      ctx.save();
      ctx.strokeStyle = "rgba(210, 120, 67, 0.1)";
      ctx.lineWidth = 1 * dpr;
      ctx.setLineDash([5 * dpr, 9 * dpr]);
      ctx.beginPath();
      ctx.moveTo(0, oy); ctx.lineTo(W, oy);
      ctx.moveTo(ox, 0); ctx.lineTo(ox, H);
      ctx.stroke();
      ctx.restore();

      // ── Equilibrium point + slow breathing glow (~3s period) ─────────────────
      // pulse: 0..1 with sin, one full cycle every EQ_PULSE_PERIOD seconds
      const pulse = 0.5 + 0.5 * Math.sin((tTotalRef.current / EQ_PULSE_PERIOD) * Math.PI * 2);
      const glowR = (18 + 10 * pulse) * dpr;
      const glowInnerOp = 0.18 + 0.28 * pulse;
      ctx.save();
      const grd = ctx.createRadialGradient(ox, oy, 0, ox, oy, glowR);
      grd.addColorStop(0, `rgba(210, 120, 67, ${glowInnerOp})`);
      grd.addColorStop(0.45, `rgba(210, 120, 67, ${glowInnerOp * 0.5})`);
      grd.addColorStop(1, "rgba(210, 120, 67, 0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(ox, oy, glowR, 0, Math.PI * 2);
      ctx.fill();
      // Core dot — breathes from r=2.8 to r=4.5
      const dotR = (2.8 + 1.7 * pulse) * dpr;
      const dotOp = 0.62 + 0.32 * pulse;
      ctx.fillStyle = `rgba(210, 120, 67, ${dotOp})`;
      ctx.beginPath();
      ctx.arc(ox, oy, dotR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // ── Annotations ──────────────────────────────────────────────────────────
      ctx.save();
      ctx.font = `${8.5 * dpr}px "IBM Plex Mono", monospace`;
      ctx.fillStyle = "rgba(142, 161, 168, 0.25)";
      ctx.fillText("λ = −0.085 ± 0.62i", ox + 11 * dpr, oy - 11 * dpr);
      ctx.fillText("stable spiral", ox + 11 * dpr, oy + 5 * dpr);
      ctx.fillStyle = "rgba(142, 161, 168, 0.14)";
      ctx.fillText("x₁", W - 20 * dpr, oy - 7 * dpr);
      ctx.fillText("x₂", ox + 7 * dpr, 16 * dpr);
      ctx.restore();

      // ── Spiral trajectories ───────────────────────────────────────────────────
      for (const traj of trajsRef.current) {
        traj.t += dt;

        const tNow = Math.max(traj.t, 0);
        const rNow = traj.r * Math.exp(-ALPHA * tNow);

        // Reset when converged to origin
        if (rNow < 0.065 && traj.t > 0) {
          traj.t = -(Math.random() * 5.5);
          traj.r = 1.4 + Math.random() * 1.9;
          traj.phi = Math.random() * Math.PI * 2;
          continue;
        }

        // Fading trail — drawn as small segments to get opacity gradient
        const SEGS = 45;
        const lookback = Math.min(tNow, 12);
        const tS = tNow - lookback;
        const fadeOrigin = Math.min(1, (rNow - 0.065) / 0.55);
        const color = PALETTE[traj.colorIdx];

        ctx.save();
        ctx.lineWidth = 1.25 * dpr;
        for (let i = 0; i < SEGS; i++) {
          const s0 = tS + (i / SEGS) * lookback;
          const s1 = tS + ((i + 1) / SEGS) * lookback;
          const r0 = traj.r * Math.exp(-ALPHA * s0);
          const r1 = traj.r * Math.exp(-ALPHA * s1);
          const [p0x, p0y] = toC(r0 * Math.cos(OMEGA * s0 + traj.phi), r0 * Math.sin(OMEGA * s0 + traj.phi));
          const [p1x, p1y] = toC(r1 * Math.cos(OMEGA * s1 + traj.phi), r1 * Math.sin(OMEGA * s1 + traj.phi));
          const prog = (i + 1) / SEGS;
          ctx.strokeStyle = `${color}${prog * 0.33 * fadeOrigin})`;
          ctx.beginPath();
          ctx.moveTo(p0x, p0y);
          ctx.lineTo(p1x, p1y);
          ctx.stroke();
        }
        ctx.restore();

        // Arrow head at current position
        if (rNow > 0.22) {
          const x1c = rNow * Math.cos(OMEGA * tNow + traj.phi);
          const x2c = rNow * Math.sin(OMEGA * tNow + traj.phi);
          const vx = -ALPHA * x1c - OMEGA * x2c;
          const vy = OMEGA * x1c - ALPHA * x2c;
          const vmag = Math.sqrt(vx * vx + vy * vy);
          if (vmag > 0.01) {
            const [ax, ay] = toC(x1c, x2c);
            const angle = Math.atan2(-vy, vx); // canvas y is flipped
            const back = angle + Math.PI;
            const spread = 0.44;
            const len = 7 * dpr;
            const arOp = Math.min(1, (rNow - 0.22) / 0.9) * 0.55;
            ctx.save();
            ctx.strokeStyle = `${color}${arOp})`;
            ctx.lineWidth = 1.5 * dpr;
            ctx.beginPath();
            ctx.moveTo(ax + Math.cos(back + spread) * len, ay + Math.sin(back + spread) * len);
            ctx.lineTo(ax, ay);
            ctx.lineTo(ax + Math.cos(back - spread) * len, ay + Math.sin(back - spread) * len);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [resize]);

  return (
    <canvas
      ref={canvasRef}
      className={`phase-portrait ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
