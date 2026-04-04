import { useEffect, useRef, useState } from "react";

const BUFFER_SIZE = 220;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randn() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function KalmanDemo() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const visibleRef = useRef(true);
  const stateRef = useRef(null);
  const controlsRef = useRef({ noise: 0.45, processNoise: 0.01 });
  const occludedUntilRef = useRef(0);
  const [noise, setNoise] = useState(0.45);
  const [processNoise, setProcessNoise] = useState(0.01);
  const [stamp, setStamp] = useState(0);

  useEffect(() => {
    controlsRef.current = {
      noise: Number(noise),
      processNoise: Number(processNoise),
    };
  }, [noise, processNoise]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    stateRef.current = {
      truthPos: 0,
      truthVel: 0.62,
      estimate: [0, 0.52],
      P: [
        [0.8, 0],
        [0, 0.35],
      ],
      measurements: [],
      truths: [],
      estimates: [],
      sigma: [],
    };

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.offsetWidth * dpr);
      canvas.height = Math.floor(canvas.offsetHeight * dpr);
      drawFrame();
    };

    const matMul2 = (A, B) => [
      [
        A[0][0] * B[0][0] + A[0][1] * B[1][0],
        A[0][0] * B[0][1] + A[0][1] * B[1][1],
      ],
      [
        A[1][0] * B[0][0] + A[1][1] * B[1][0],
        A[1][0] * B[0][1] + A[1][1] * B[1][1],
      ],
    ];

    const matAdd2 = (A, B) => [
      [A[0][0] + B[0][0], A[0][1] + B[0][1]],
      [A[1][0] + B[1][0], A[1][1] + B[1][1]],
    ];

    const transpose2 = (A) => [
      [A[0][0], A[1][0]],
      [A[0][1], A[1][1]],
    ];

    const step = () => {
      const s = stateRef.current;
      const dt = 0.05;
      const A = [
        [1, dt],
        [0, 1],
      ];
      const AT = transpose2(A);
      const Q = [
        [controlsRef.current.processNoise, 0],
        [0, controlsRef.current.processNoise * 0.4],
      ];
      const R = controlsRef.current.noise * controlsRef.current.noise;
      const H = [1, 0];

      s.truthVel += randn() * 0.01;
      s.truthPos += s.truthVel * dt;

      const xPred = [
        A[0][0] * s.estimate[0] + A[0][1] * s.estimate[1],
        A[1][0] * s.estimate[0] + A[1][1] * s.estimate[1],
      ];
      const PPred = matAdd2(matMul2(matMul2(A, s.P), AT), Q);

      const isOccluded = performance.now() < occludedUntilRef.current;
      const measurement = isOccluded ? null : s.truthPos + randn() * controlsRef.current.noise;

      let xNext = xPred;
      let PNext = PPred;

      if (measurement !== null) {
        const innovation = measurement - (H[0] * xPred[0] + H[1] * xPred[1]);
        const S = PPred[0][0] + R;
        const K = [PPred[0][0] / S, PPred[1][0] / S];

        xNext = [xPred[0] + K[0] * innovation, xPred[1] + K[1] * innovation];
        PNext = [
          [(1 - K[0] * H[0]) * PPred[0][0], (1 - K[0] * H[0]) * PPred[0][1]],
          [PPred[1][0] - K[1] * H[0] * PPred[0][0], PPred[1][1] - K[1] * H[0] * PPred[0][1]],
        ];
      }

      s.estimate = xNext;
      s.P = PNext;

      const sigma = Math.sqrt(Math.max(PNext[0][0], 0.0001)) * 2;

      s.truths.push(s.truthPos);
      s.estimates.push(s.estimate[0]);
      s.sigma.push(sigma);
      s.measurements.push(measurement);

      if (s.truths.length > BUFFER_SIZE) {
        s.truths.shift();
        s.estimates.shift();
        s.sigma.shift();
        s.measurements.shift();
      }
    };

    const drawFrame = () => {
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, W, H);

      const s = stateRef.current;
      const values = [
        ...s.truths,
        ...s.estimates,
        ...s.measurements.filter((value) => value !== null),
      ];
      const min = Math.min(...values, -2.4);
      const max = Math.max(...values, 2.4);
      const pad = 0.65;
      const yMin = min - pad;
      const yMax = max + pad;

      const xAt = (i) => (i / Math.max(BUFFER_SIZE - 1, 1)) * W;
      const yAt = (value) => H - ((value - yMin) / (yMax - yMin)) * H;

      ctx.save();
      ctx.strokeStyle = "rgba(242, 236, 228, 0.06)";
      ctx.lineWidth = 0.8 * dpr;
      for (let i = 0; i < 4; i += 1) {
        const y = ((i + 1) / 5) * H;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.fillStyle = "rgba(139, 155, 175, 0.08)";
      ctx.beginPath();
      s.estimates.forEach((value, index) => {
        const x = xAt(index);
        const upper = yAt(value + s.sigma[index]);
        const lower = yAt(value - s.sigma[index]);
        if (index === 0) ctx.moveTo(x, upper);
        else ctx.lineTo(x, upper);
        if (index === s.estimates.length - 1) {
          for (let j = s.estimates.length - 1; j >= 0; j -= 1) {
            ctx.lineTo(xAt(j), yAt(s.estimates[j] - s.sigma[j]));
          }
        }
      });
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      const drawLine = (series, color, width) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width * dpr;
        ctx.beginPath();
        series.forEach((value, index) => {
          const x = xAt(index);
          const y = yAt(value);
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.restore();
      };

      drawLine(s.truths, "rgba(139, 155, 175, 0.46)", 1);
      drawLine(s.estimates, "rgba(139, 155, 175, 0.92)", 2);

      ctx.save();
      s.measurements.forEach((value, index) => {
        if (value === null) return;
        ctx.fillStyle = "rgba(194, 96, 58, 0.7)";
        ctx.beginPath();
        ctx.arc(xAt(index), yAt(value), 2.2 * dpr, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      ctx.save();
      ctx.font = `${8.5 * dpr}px "IBM Plex Mono", monospace`;
      ctx.fillStyle = "rgba(139, 155, 175, 0.42)";
      ctx.fillText("K = PHᵀ(HPHᵀ + R)⁻¹", 12 * dpr, H - 14 * dpr);
      ctx.restore();
    };

    let accumulator = 0;
    let previousTs = null;

    const animate = (ts) => {
      if (previousTs === null) {
        previousTs = ts;
      }
      const elapsed = Math.min((ts - previousTs) / 1000, 0.06);
      previousTs = ts;

      if (visibleRef.current && !mediaQuery.matches) {
        accumulator += elapsed;
        while (accumulator >= 1 / 30) {
          step();
          accumulator -= 1 / 30;
        }
      }

      drawFrame();
      rafRef.current = window.requestAnimationFrame(animate);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.1 },
    );
    intersectionObserver.observe(canvas);

    if (mediaQuery.matches) {
      for (let i = 0; i < 80; i += 1) step();
      drawFrame();
    } else {
      rafRef.current = window.requestAnimationFrame(animate);
    }

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [stamp]);

  return (
    <div className="kalman-demo">
      <canvas ref={canvasRef} className="kalman-demo__canvas" aria-hidden="true" />
      <div className="kalman-demo__controls">
        <label>
          <span>Noise</span>
          <input
            type="range"
            min="0.1"
            max="1.5"
            step="0.05"
            value={noise}
            onChange={(event) => setNoise(Number(event.target.value))}
          />
        </label>
        <label>
          <span>Q</span>
          <input
            type="range"
            min="0.001"
            max="0.06"
            step="0.001"
            value={processNoise}
            onChange={(event) => setProcessNoise(Number(event.target.value))}
          />
        </label>
        <div className="kalman-demo__buttons">
          <button type="button" onClick={() => setNoise((value) => clamp(value + 0.1, 0.1, 1.5))}>
            add noise
          </button>
          <button type="button" onClick={() => {
            occludedUntilRef.current = performance.now() + 2000;
          }}>
            occlude
          </button>
          <button type="button" onClick={() => setStamp((value) => value + 1)}>
            reset
          </button>
        </div>
      </div>
    </div>
  );
}
