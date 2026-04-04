import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  aboutThemes,
  contactLinks,
  heroProjects,
  navItems,
  projectPages,
  resumeContent,
  routeTitles,
  siteContent,
  supportingProjects,
  technicalAreas,
} from "./data/portfolio";
import { AssetPanel, Badge, Button, Card, Icon, Section } from "./components/ui";
import { PhasePortrait } from "./components/PhasePortrait";
import { BifurcationDivider } from "./components/BifurcationDivider";
import { DoublePendulum } from "./components/DoublePendulum";
import { FourierEpicycles } from "./components/FourierEpicycles";
import { KalmanDemo } from "./components/KalmanDemo";
import { LorenzAttractor } from "./components/LorenzAttractor";
import { LSystemBackdrop } from "./components/LSystemBackdrop";
import { MandelbrotBackdrop } from "./components/MandelbrotBackdrop";
import { ContactBodePlot } from "./components/ContactBodePlot";
import { ReactionDiffusionBackdrop } from "./components/ReactionDiffusionBackdrop";
import { RootLocusStrip } from "./components/RootLocusStrip";
import { VoronoiField } from "./components/VoronoiField";
import { VorticityFlowBackdrop } from "./components/VorticityFlowBackdrop";

// ─── Floating equations (engineering wallpaper) ──────────────────────────────
function FloatingEquations({ equations }) {
  return (
    <div className="eq-drift-layer" aria-hidden="true">
      {equations.map((eq, i) => (
        <span
          key={i}
          className="eq-drift"
          style={{
            "--eq-x": eq.x,
            "--eq-y": eq.y,
            "--eq-delay": eq.delay,
            "--eq-dur": eq.dur,
            "--eq-op": eq.op ?? 0.065,
          }}
        >
          {eq.text}
        </span>
      ))}
    </div>
  );
}

// ─── S-plane background (contact page theatrical) ────────────────────────────
function SPlaneBg() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };
    resize();

    // Poles of "the communication system" — all firmly in LHP
    const poles = [
      { s: -0.8,  w:  1.3,  label: "p₁"  },
      { s: -0.8,  w: -1.3,  label: "p₁*" },
      { s: -1.6,  w:  0,    label: "p₂"  },
      { s: -0.45, w:  2.2,  label: "p₃"  },
      { s: -0.45, w: -2.2,  label: "p₃*" },
      { s: -2.1,  w:  0.6,  label: "p₄"  },
    ];
    const zeros = [
      { s: -0.25, w:  0.9,  label: "z₁"  },
      { s: -0.25, w: -0.9,  label: "z₁*" },
    ];

    let t = 0;
    let lastTs = null;

    function frame(ts) {
      if (lastTs === null) lastTs = ts;
      t += (ts - lastTs) / 1000;
      lastTs = ts;

      const W = canvas.width;
      const H = canvas.height;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, W, H);

      // Map s-plane [-4.5, 0.8] × [-3, 3] → canvas
      const pw = 5.3, ph = 6.2;
      const jAxisX = W * 0.82;   // jω axis position (right side)
      const rAxisY = H / 2;
      const sx = W / pw, sy = H / ph;
      const toC = (sigma, omega) => [jAxisX + sigma * sx, rAxisY - omega * sy];

      // LHP stable-region gradient
      const grad = ctx.createLinearGradient(0, 0, jAxisX, 0);
      grad.addColorStop(0, "rgba(142, 161, 168, 0.045)");
      grad.addColorStop(1, "rgba(142, 161, 168, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, jAxisX, H);

      // Grid
      ctx.save();
      ctx.strokeStyle = "rgba(242, 236, 228, 0.032)";
      ctx.lineWidth = 0.5 * dpr;
      for (let s = -4; s <= 1; s += 0.5) {
        ctx.beginPath();
        const [gx] = toC(s, 0);
        ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      }
      for (let w = -3; w <= 3; w += 0.5) {
        ctx.beginPath();
        const [, gy] = toC(0, w);
        ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
      }
      ctx.restore();

      // jω axis
      ctx.save();
      ctx.strokeStyle = "rgba(210, 120, 67, 0.18)";
      ctx.lineWidth = 1.2 * dpr;
      ctx.beginPath();
      ctx.moveTo(jAxisX, 0); ctx.lineTo(jAxisX, H);
      ctx.stroke();
      // σ axis
      ctx.strokeStyle = "rgba(242, 236, 228, 0.08)";
      ctx.lineWidth = 0.8 * dpr;
      ctx.beginPath();
      ctx.moveTo(0, rAxisY); ctx.lineTo(W, rAxisY);
      ctx.stroke();
      ctx.restore();

      // Axis labels
      ctx.save();
      ctx.font = `${9 * dpr}px "IBM Plex Mono", monospace`;
      ctx.fillStyle = "rgba(142, 161, 168, 0.28)";
      ctx.fillText("jω", jAxisX + 5 * dpr, 16 * dpr);
      ctx.fillText("σ", W - 14 * dpr, rAxisY - 6 * dpr);
      ctx.fillStyle = "rgba(142, 161, 168, 0.18)";
      ctx.fillText("LHP", 18 * dpr, 20 * dpr);
      ctx.restore();

      // Zeros (circles)
      ctx.save();
      for (const z of zeros) {
        const [zx, zy] = toC(z.s, z.w);
        const pulse = 1 + 0.06 * Math.sin(t * 1.1 + z.w);
        ctx.strokeStyle = "rgba(142, 161, 168, 0.32)";
        ctx.lineWidth = 1.8 * dpr;
        ctx.beginPath();
        ctx.arc(zx, zy, 7 * dpr * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.font = `${7.5 * dpr}px "IBM Plex Mono", monospace`;
        ctx.fillStyle = "rgba(142, 161, 168, 0.2)";
        ctx.fillText(z.label, zx + 10 * dpr, zy - 4 * dpr);
      }
      ctx.restore();

      // Poles (× markers)
      for (const p of poles) {
        const [px, py] = toC(p.s, p.w);
        const pulse = 0.12 * Math.sin(t * 0.7 + p.w * 0.6);
        const op = 0.52 + pulse;
        const sz = 7 * dpr;
        ctx.save();
        ctx.strokeStyle = `rgba(210, 120, 67, ${op})`;
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        ctx.moveTo(px - sz, py - sz); ctx.lineTo(px + sz, py + sz);
        ctx.moveTo(px + sz, py - sz); ctx.lineTo(px - sz, py + sz);
        ctx.stroke();
        // glow
        const grd = ctx.createRadialGradient(px, py, 0, px, py, 18 * dpr);
        grd.addColorStop(0, `rgba(210, 120, 67, ${op * 0.22})`);
        grd.addColorStop(1, "rgba(210, 120, 67, 0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(px, py, 18 * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = `${7.5 * dpr}px "IBM Plex Mono", monospace`;
        ctx.fillStyle = `rgba(210, 120, 67, ${op * 0.5})`;
        ctx.fillText(p.label, px + 9 * dpr, py - 5 * dpr);
        ctx.restore();
      }

      // Footer annotations
      ctx.save();
      ctx.font = `${8 * dpr}px "IBM Plex Mono", monospace`;
      ctx.fillStyle = "rgba(210, 120, 67, 0.2)";
      ctx.fillText("all poles in LHP", 18 * dpr, H - 22 * dpr);
      ctx.fillText("PM: sufficient  ·  GM: adequate  ·  disposition: responsive", 18 * dpr, H - 9 * dpr);
      ctx.restore();

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="s-plane-bg" aria-hidden="true" />;
}

// ─── Page transition fade overlay ────────────────────────────────────────────
function PageTransition() {
  const location = useLocation();
  const [phase, setPhase] = useState("idle"); // idle | out | in
  const prevPathRef = useRef(location.pathname);
  const t1Ref = useRef(null);
  const t2Ref = useRef(null);

  useEffect(() => {
    if (location.pathname === prevPathRef.current) return;
    setPhase("out");
    t1Ref.current = setTimeout(() => setPhase("in"), 310);
    t2Ref.current = setTimeout(() => {
      setPhase("idle");
      prevPathRef.current = location.pathname;
    }, 820);
    return () => {
      clearTimeout(t1Ref.current);
      clearTimeout(t2Ref.current);
    };
  }, [location.pathname]);

  if (phase === "idle") return null;
  return (
    <div
      className={`page-transition-overlay${phase === "out" ? " page-transition-overlay--out" : " page-transition-overlay--in"}`}
      aria-hidden="true"
    />
  );
}

// ─── Per-page closing equation (footer annotation) ───────────────────────────
const PAGE_FOOTER_EQS = {
  "/":                   "V̇(x) < 0  ·  probably",
  "/about":              "∃ ε > 0 : still curious",
  "/contact":            "H(s) = enthusiasm / (s + anxiety)",
  "/projects/slam":      "ATE → 0  ·  eventually",
  "/projects/f18":       "δe → Cm = 0  ·  trimmed",
  "/projects/spirob":    "Re ≪ 1  ·  laminar life",
};

function PageFooterEq() {
  const location = useLocation();
  const eq = PAGE_FOOTER_EQS[location.pathname];
  if (!eq) return null;
  return (
    <div className="page-footer-eq" aria-hidden="true">
      {eq}
    </div>
  );
}

const marginNoteAnchors = [
  "margin-note--northwest",
  "margin-note--northeast",
  "margin-note--west",
  "margin-note--east",
  "margin-note--southwest",
  "margin-note--southeast",
];

const marginNotesByRoute = {
  home: [
    "simulation truther",
    "discipline first, atmosphere second",
    "calm on the outside, transfer functions within",
    "V̇(x) < 0  (hopefully)",
    "the eigenvalues are my emotional support",
    "if the Jacobian looks friendly, you're linearizing too hard",
    "curious, then verify, then question the model",
    "subtle is fine if the work is loud enough",
    "Re ≪ 1 means you can trust your gut. Re ≫ 1 means you cannot.",
  ],
  projects: [
    "not every proof needs to be loud",
    "the strongest artifact should enter first",
    "elegance is allowed to be technical",
    "a neat grid can still lie",
    "the card should not outperform the project",
    "evidence gets top billing",
    "good arrangement is not the same as truth",
    "the Bode plot doesn't care how it looks in dark mode",
  ],
  f18: [
    "if it oscillates, ask why",
    "eigenvalues are mood indicators",
    "trim is a peace treaty with the nonlinearity",
    "the plot is part of the claim",
    "disturb it on purpose",
    "closed loop is where the gossip stops",
    "stability is still a love language",
    "nonlinear systems do not care about your optimism",
    "if the recovery looks easy, the setup probably was not",
    "NASA model: because toy benchmarks are beneath us",
    "PPO asked: what is trim? the model answered with turbulence",
    "phase margin: the engineering equivalent of leaving some buffer",
  ],
  spirob: [
    "hardware has opinions",
    "compliance is not chaos — it's a design parameter",
    "the mechanism has to deserve the caption",
    "wave motion, but make it repeatable",
    "the bench usually knows first",
    "a cable can absolutely humble you",
    "the motor sound is sometimes diagnostic literature",
    "ULN2003: humble, dependable, 500mA max, no complaints",
    "a stepper in open loop is just optimism with wires",
    "not everyone starts with a P1S. some of us built character",
    "the Sovol has seen things",
    "28BYJ-48: unironically great if you respect its limitations",
  ],
  slam: [
    "drift is a personality test",
    "alignment before confidence",
    "pose first, mythology later",
    "trajectories can absolutely lie to you",
    "maps are persuasive, not infallible",
    "scale ambiguity is an intimacy issue",
    "if the path looks perfect, check the frame first",
    "localization: the robot's best guess, with humility",
    "the covariance ellipse is just uncertainty, visualized",
    "ORB-SLAM3 asks: have you calibrated your camera? yes? good. run it again.",
  ],
  vision: [
    "a zone is also a policy",
    "alerts should earn their sound",
    "perception is a systems problem",
    "false confidence is still false",
    "if it detects everything, inspect the threshold",
    "a confident bounding box is not an argument",
    "bounding boxes can still be emotionally incorrect",
    "runtime behavior is part of the model story",
    "an alert should feel deserved, not eager",
    "YOLO: fast and unapologetic",
  ],
  resume: [
    "the public version is never the whole story",
    "signal beats volume",
    "one page means many ruthless cuts",
    "bullet points are compression algorithms",
    "if it sounds inflated, it probably is",
    "the best resume is still a pointer to real work",
  ],
  about: [
    "build, understand, explain",
    "most claims need one more question",
    "hardware always has the last word",
    "clarity is part of the craft",
    "serious does not have to look heavy",
    "the math is beautiful AND it has to work",
    "a good simulation is a question, not an answer",
    "engineering and art are the same conversation in different fonts",
  ],
  contact: [
    "all poles in LHP",
    "PM: sufficient  GM: adequate",
    "inbox: asymptotically stable",
    "the best intro email is short, specific, and has a good subject line",
    "context first, attachment second",
    "good outreach has an obvious next move",
    "H(s) = enthusiasm / (s + anxiety)",
  ],
};

function getMarginNotes(pathname) {
  if (pathname === "/") {
    return marginNotesByRoute.home;
  }

  if (pathname === "/projects") {
    return marginNotesByRoute.projects;
  }

  if (pathname.startsWith("/projects/f18")) {
    return marginNotesByRoute.f18;
  }

  if (pathname.startsWith("/projects/spirob")) {
    return marginNotesByRoute.spirob;
  }

  if (pathname.startsWith("/projects/slam")) {
    return marginNotesByRoute.slam;
  }

  if (pathname.startsWith("/projects/vision")) {
    return marginNotesByRoute.vision;
  }

  if (pathname === "/resume") {
    return marginNotesByRoute.resume;
  }

  if (pathname === "/about") {
    return marginNotesByRoute.about;
  }

  if (pathname === "/contact") {
    return marginNotesByRoute.contact;
  }

  return marginNotesByRoute.projects;
}

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const title = routeTitles[location.pathname];

    if (title) {
      document.title = title;
      return;
    }

    if (location.pathname.startsWith("/projects/")) {
      const projectId = location.pathname.split("/").at(-1);
      const project = projectPages[projectId];

      document.title = project ? `${project.title} | Jeffrey Walker` : "Project | Jeffrey Walker";
    }
  }, [location.pathname]);

  return null;
}

function useActiveSection(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? null);

  useEffect(() => {
    if (!sectionIds.length) {
      return undefined;
    }

    const observers = [];
    const visible = new Map();

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);

      if (!element) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visible.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
          });

          const next = [...visible.entries()]
            .sort((a, b) => b[1] - a[1])
            .find(([, ratio]) => ratio > 0);

          if (next) {
            setActiveId(next[0]);
          }
        },
        {
          rootMargin: "-25% 0px -55% 0px",
          threshold: [0, 0.2, 0.45, 0.7, 1],
        },
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sectionIds]);

  return activeId;
}

function MarginNotes() {
  const location = useLocation();
  const [note, setNote] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const previousNoteRef = useRef("");
  const previousAnchorRef = useRef("");
  const scrollDirectionRef = useRef("idle");
  const lastScrollYRef = useRef(0);
  const lastScrollAtRef = useRef(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => {
      mediaQuery.removeEventListener("change", syncPreference);
    };
  }, []);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    lastScrollAtRef.current = Date.now();

    const syncDirection = () => {
      const nextScrollY = window.scrollY;
      const delta = nextScrollY - lastScrollYRef.current;

      if (Math.abs(delta) > 8) {
        scrollDirectionRef.current = delta > 0 ? "down" : "up";
      }

      lastScrollYRef.current = nextScrollY;
      lastScrollAtRef.current = Date.now();
    };

    window.addEventListener("scroll", syncDirection, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncDirection);
    };
  }, []);

  useEffect(() => {
    setNote(null);

    if (reducedMotion) {
      return undefined;
    }

    const notes = getMarginNotes(location.pathname);

    if (!notes.length) {
      return undefined;
    }

    let revealTimeout;
    let fadeTimeout;
    let clearTimeoutId;
    let intervalId;

    const pickDifferentValue = (values, previousValue) => {
      if (values.length <= 1) {
        return values[0];
      }

      let nextValue = previousValue;

      while (nextValue === previousValue) {
        nextValue = values[Math.floor(Math.random() * values.length)];
      }

      return nextValue;
    };

    const revealNote = () => {
      if (Date.now() - lastScrollAtRef.current < 950) {
        return;
      }

      const flow = scrollDirectionRef.current;
      const anchorPool =
        flow === "down"
          ? marginNoteAnchors.slice(0, 4)
          : flow === "up"
            ? marginNoteAnchors.slice(2)
            : ["margin-note--west", "margin-note--east"];
      const nextNote = pickDifferentValue(notes, previousNoteRef.current);
      const nextAnchor = pickDifferentValue(anchorPool, previousAnchorRef.current);

      previousNoteRef.current = nextNote;
      previousAnchorRef.current = nextAnchor;

      setNote({
        text: nextNote,
        anchor: nextAnchor,
        flow,
        phase: "enter",
      });

      fadeTimeout = window.setTimeout(() => {
        setNote((current) => (current ? { ...current, phase: "exit" } : null));
      }, 4800);

      clearTimeoutId = window.setTimeout(() => {
        setNote(null);
      }, 6600);
    };

    revealTimeout = window.setTimeout(revealNote, 2600);
    intervalId = window.setInterval(revealNote, 19000);

    return () => {
      window.clearTimeout(revealTimeout);
      window.clearTimeout(fadeTimeout);
      window.clearTimeout(clearTimeoutId);
      window.clearInterval(intervalId);
    };
  }, [location.pathname, reducedMotion]);

  if (!note || reducedMotion) {
    return null;
  }

  return (
    <div className="margin-notes" aria-hidden="true">
      <div
        className={`margin-note ${note.anchor} margin-note--flow-${note.flow} margin-note--${note.phase}`.trim()}
      >
        <span>{note.text}</span>
      </div>
    </div>
  );
}

function AppLayout() {
  return (
    <div className="app-shell">
      <ScrollManager />
      <PageTransition />
      <MarginNotes />
      <RootLocusStrip />
      <TopNav />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectRoutePage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function TopNav() {
  const location = useLocation();
  const [pathnameRoot] = location.pathname.split("/").filter(Boolean);
  const currentRoot = pathnameRoot ? `/${pathnameRoot}` : "/";
  const [isOpen, setIsOpen] = useState(false);
  const currentItem =
    navItems.find((item) =>
      item.to === "/" ? location.pathname === "/" : currentRoot === item.to,
    ) ?? navItems[0];

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header className="top-nav">
      <div className="shell top-nav__bar">
        <Link className="brand" to="/">
          <span className="brand__eyebrow">{siteContent.owner.name}</span>
          <span className="brand__title">Engineering Portfolio</span>
          <span className="brand__line" />
        </Link>
        <nav className="top-nav__links" aria-label="Primary">
          {navItems.map((item) => {
            const isActive =
              item.to === "/" ? location.pathname === "/" : currentRoot === item.to;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`nav-pill ${isActive ? "nav-pill--active" : ""}`.trim()}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="top-nav__score">Calm systems / strange margins</div>
        <button
          className="menu-button"
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          <Icon name={isOpen ? "close" : "menu"} />
        </button>
      </div>
      {isOpen && (
        <div className="shell top-nav__mobile">
          <div className="top-nav__mobile-sheet">
            <div className="eyebrow">Movement map</div>
            <h2>Choose the next page like a cue, not a tab.</h2>
            <div className="top-nav__mobile-status">
              <span>Current cue</span>
              <strong>{currentItem.label}</strong>
            </div>
            <div className="top-nav__mobile-list">
              {navItems.map((item, index) => {
                const isActive =
                  item.to === "/" ? location.pathname === "/" : currentRoot === item.to;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`mobile-link ${isActive ? "mobile-link--active" : ""}`.trim()}
                  >
                    <span className="mobile-link__index">{String(index + 1).padStart(2, "0")}</span>
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
            <div className="top-nav__mobile-meta">
              <div className="top-nav__mobile-rule" />
              <p>Minimal atmosphere. Technical weight. A little drift in the arrangement.</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function HomePage() {
  const anchorProjects = heroProjects.slice(0, 3);

  return (
    <div className="shell page-stack">
      <Section id="home">
        <div className="home-phase-wrap">
          <PhasePortrait />
          <div className="home-score">
            <div className="home-score__copy reveal">
              <div className="eyebrow home-score__label">Movement I</div>
              <div className="home-score__rule" />
              <p className="home-score__kicker">
                Mech engineer who wandered into controls, got stuck on eigenvalues, and never left.
              </p>
              <h1>{siteContent.hero.headline}</h1>
              <p className="home-score__body">{siteContent.hero.body}</p>
              <div className="button-row">
                <Button as={Link} to="/projects">
                  {siteContent.hero.primaryCta} <Icon name="arrow" className="icon icon--sm" />
                </Button>
                <Button as={Link} to="/projects/f18" variant="secondary">
                  {siteContent.hero.secondaryCta}
                </Button>
              </div>
              <div className="home-score__traits">
                <div className="glass-list-item">
                  <strong>Vibe</strong>
                  Jaded about abstractions, genuinely excited about every domain.
                </div>
                <div className="glass-list-item">
                  <strong>Most visible lane</strong>
                  Nonlinear aircraft control — where the Jacobian is just the beginning.
                </div>
                <div className="glass-list-item">
                  <strong>Working style</strong>
                  Model it, build it, question both.
                </div>
                <div className="glass-list-item">
                  <strong>Read after an hour</strong>
                  He finds the math beautiful and the hardware humbling.
                </div>
              </div>
            </div>
          </div>
          <div className="home-cards-strip reveal reveal--delay">
            <Card className="home-manifest">
              <div className="eyebrow">Three movements</div>
              <h2>Start with the strongest proof, then widen the lens.</h2>
              <div className="home-preview-list">
                {siteContent.projectPreview.map((item, index) => (
                  <Link key={item.route} to={item.route} className="home-preview-item">
                    <span className="home-preview-item__index">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.body}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
            <Card className="hero-summary">
              <div className="eyebrow">Signal at a glance</div>
              <h2>{siteContent.summary.title}</h2>
              <p>{siteContent.summary.body}</p>
              <div className="stack-sm">
                {siteContent.summary.notes.map((note) => (
                  <div key={note} className="glass-list-item">
                    {note}
                  </div>
                ))}
              </div>
            </Card>
            <Card className="fourier-card">
              <div className="eyebrow">Signature transform</div>
              <FourierEpicycles />
            </Card>
          </div>
          <BifurcationDivider />
        </div>
      </Section>

      <Section id="featured-projects">
        <div className="section-header">
          <div className="eyebrow">Anchor studies</div>
          <h2>Three pages that anchor the portfolio</h2>
          <p>
            F-18 leads the controls narrative, SpiRob carries the hardware and embedded
            story, and SLAM rounds out perception and navigation work.
          </p>
        </div>
        <div className="project-grid project-grid--three project-grid--anchors">
          {anchorProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </Section>

      <Section id="homepage-signals">
        <div className="section-header">
          <div className="eyebrow">Why this site should be easy to read</div>
          <h2>High-signal portfolio structure</h2>
          <p>
            The homepage now points directly at the strongest proof instead of making
            visitors infer what matters from a generic grid of cards.
          </p>
        </div>
        <div className="bucket-grid bucket-grid--signals">
          {siteContent.homeSignals.map((item) => (
            <Card key={item.title} className="text-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="focus-areas">
        <div className="section-header">
          <div className="eyebrow">Technical focus</div>
          <h2>Core engineering themes</h2>
          <p>
            The site is organized around controls, robotics, autonomy, embedded systems,
            and simulation-heavy development instead of trying to feel broad for its own
            sake.
          </p>
        </div>
        <div className="tile-grid tile-grid--areas">
          {technicalAreas.map((area) => (
            <Card key={area} className="tile-card">
              <h3>{area}</h3>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

function ProjectsPage() {
  const caseStudyProjects = heroProjects.filter((project) =>
    ["Flagship case study", "Case study"].includes(project.status),
  );
  const additionalStudies = heroProjects.filter(
    (project) => !["Flagship case study", "Case study"].includes(project.status),
  );

  return (
    <div className="shell page-stack">
      <Section id="projects">
        <div className="projects-masthead">
          <div className="section-header">
            <div className="eyebrow">Selected projects</div>
            <h1>Engineering work with technical depth</h1>
            <p>
              A curated set of projects across nonlinear control, robotics, embedded systems,
              perception, sensor fusion, and simulation-driven development.
            </p>
          </div>
          <Card className="projects-note">
            <div className="eyebrow">Counterpoint</div>
            <h2>Each page enters from a different angle.</h2>
            <div className="stack-sm">
              <div className="glass-list-item">
                <strong>F-18</strong>
                Starts with recovery and proof.
              </div>
              <div className="glass-list-item">
                <strong>SpiRob</strong>
                Starts with hardware reality and mechanism feel.
              </div>
              <div className="glass-list-item">
                <strong>SLAM / Vision</strong>
                Start from workflow, architecture, and interpretation.
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <Section id="case-studies">
        <div className="section-header">
          <div className="eyebrow">Case studies</div>
          <h2>Projects with current read depth</h2>
        </div>
        <div className="project-grid project-grid--three">
          {caseStudyProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </Section>

      <Section id="additional-studies">
        <div className="section-header">
          <div className="eyebrow">Additional studies</div>
          <h2>Focused work beyond the flagship pages</h2>
        </div>
        <div className="project-grid">
          {additionalStudies.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={caseStudyProjects.length + index}
            />
          ))}
        </div>
      </Section>

      <Section id="supporting-projects">
        <div className="section-header">
          <div className="eyebrow">Supporting work</div>
          <h2>Additional projects</h2>
        </div>
        <div className="supporting-grid">
          {supportingProjects.map((project, index) => (
            <Card key={project.title} className={`supporting-card supporting-card--${(index % 2) + 1}${project.videoMedia ? " supporting-card--has-video" : ""}`}>
              {project.videoMedia && (
                <div className="supporting-card__video-frame">
                  <video
                    className="supporting-card__video"
                    controls
                    preload="metadata"
                    poster={project.videoMedia.poster}
                  >
                    <source src={project.videoMedia.src} type={project.videoMedia.mimeType} />
                  </video>
                </div>
              )}
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="chip-row">
                {project.tags.map((tag) => (
                  <Badge key={tag} tone="muted">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

function ResumePage() {
  return (
    <div className="shell page-stack resume-page">
      <Section id="resume">
        <div className="resume-layout">
          <Card className="profile-card resume-sheet">
            <div className="page-mark">Movement II / Profile and record</div>
            <div className="badge-row">
              <Badge tone="inverted">Resume / profile</Badge>
              <Badge tone="muted">Controls • Robotics • Autonomy</Badge>
            </div>
            <h1>Engineering profile and experience</h1>
            <p>
              Mechanical engineer focused on controls, autonomy, robotics, and
              simulation-heavy engineering. This page bridges the case studies and the
              formal resume version used for applications.
            </p>
            <div className="info-grid">
              {resumeContent.profileBullets.map((item) => (
                <div key={item} className="glass-list-item">
                  {item}
                </div>
              ))}
            </div>
            <div className="button-row">
              <Button as="a" href={siteContent.owner.resumePdf} target="_blank" rel="noreferrer">
                <Icon name="file" className="icon icon--sm" /> Resume
              </Button>
              <Button
                as="a"
                variant="secondary"
                href={siteContent.owner.githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="github" className="icon icon--sm" /> GitHub
              </Button>
            </div>
          </Card>

          <div className="resume-rail">
            <Card className="resume-note">
              <div className="eyebrow">Public default</div>
              <h2>Controls and autonomy first.</h2>
              <p>
                The published resume follows the same logic as the portfolio: lead with
                aircraft controls, then widen into robotics, estimation, and systems work.
              </p>
              <div className="stack-sm">
                <div className="glass-list-item">
                  <strong>Best fit now</strong>
                  Controls, autonomy, GNC, and simulation-heavy engineering roles.
                </div>
                <div className="glass-list-item">
                  <strong>Parallel versions</strong>
                  Robotics/embedded and research-heavy variants are already compiled.
                </div>
              </div>
            </Card>
            <Card className="media-summary-card resume-portrait">
              <div className="eyebrow">Portfolio-aligned snapshot</div>
              <h2>Case-study-first applications</h2>
              <AssetPanel
                item={{
                  title: "Profile image",
                  caption: "Headshot used alongside resume and portfolio materials.",
                  src: siteContent.owner.headshot,
                  type: "image",
                }}
                fit="cover"
              />
            </Card>
          </div>
        </div>
      </Section>

      <Section id="experience">
        <SectionIntro
          index="01"
          eyebrow="Experience highlights"
          title="High-signal experience areas"
          body="This page is not a duplicate of the PDF. It is the quick-reading version of the same professional identity, arranged around the strongest lanes and evidence."
        />
        <div className="stack-md resume-stack">
          {resumeContent.highlights.map((item, index) => (
            <Card key={item.title} className={`text-card resume-card resume-card--${(index % 2) + 1}`}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="skills">
        <SectionIntro
          index="02"
          eyebrow="Skill buckets"
          title="Technical range, kept readable"
          body="The point here is not to throw every tool at the screen. It is to show the recurring disciplines that appear across the portfolio and the resume versions."
        />
        <div className="bucket-grid bucket-grid--resume">
          {resumeContent.skillBuckets.map((bucket) => (
            <Card key={bucket.title} className="text-card">
              <h3>{bucket.title}</h3>
              <div className="chip-row">
                {bucket.items.map((item) => (
                  <Badge key={item} tone="muted">
                    {item}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="shell page-stack about-page page-phase-wrap page-phase-wrap--about">
      <LorenzAttractor />
      <Section id="about">
        <div className="about-layout">
          <Card className="profile-card about-sheet">
            <div className="page-mark">Movement III / Working philosophy</div>
            <div className="badge-row">
              <Badge tone="inverted">About</Badge>
              <Badge tone="muted">Engineer • Researcher • Builder</Badge>
            </div>
            <h1>I find engineering genuinely interesting — all of it.</h1>
            <p>
              Nonlinear control, soft robotics, SLAM, embedded systems — these aren't adjacent disciplines
              I happened to touch. They're the same conversation at different scales, and I find moving
              between them useful. The math is consistent even when the hardware is not.
            </p>
            <p>
              I'm jaded about abstractions that don't survive contact with a real system, and excited about
              the ones that do. The portfolio is built around projects that earned their validation.
            </p>
          </Card>

          <div className="about-rail">
            <Card className="about-note">
              <div className="eyebrow">Operating principle</div>
              <h2>Build, understand, explain.</h2>
              <p>
                The sequence matters. You have to make the thing, then understand why it behaves
                the way it does, then explain it in a way that's legible to someone else.
                Skipping any of those steps is just vibes.
              </p>
              <div className="stack-sm">
                <div className="glass-list-item">
                  <strong>On precision</strong>
                  Seriousness should be obvious without needing to announce itself.
                </div>
                <div className="glass-list-item">
                  <strong>On aesthetics</strong>
                  Engineering and art are the same conversation written in different notation.
                </div>
                <div className="glass-list-item">
                  <strong>On hardware</strong>
                  The bench always has the final word. The simulation just gets to go first.
                </div>
              </div>
            </Card>
            <Card className="about-chaos-card">
              <div className="eyebrow">Chaos corner</div>
              <h2>Deterministic, then rude.</h2>
              <p>
                Five identical systems, except for an initial perturbation on the order
                of <code>10^-6</code>. Then the trajectories start disagreeing.
              </p>
              <DoublePendulum />
            </Card>
            <Card className="media-summary-card">
              <div className="eyebrow">The hardware says hello</div>
              <h2>Real systems, printed parts, and wires with opinions.</h2>
              <AssetPanel
                item={{
                  title: "SpiRob hardware close-up",
                  caption: "Printed segment geometry — courtesy of a Sovol 3D with something to prove.",
                  src: "/assets/spirob/441898208-e35ee814-b298-4bb8-a3fc-6146c4e591f1.jpg",
                  type: "image",
                }}
                fit="cover"
              />
            </Card>
          </div>
        </div>
      </Section>

      <Section id="about-themes">
        <SectionIntro
          index="01"
          eyebrow="Themes"
          title="What keeps showing up regardless of the project"
          body="Aircraft control, cable robots, SLAM pipelines, and computer vision — different domains, same recurring ideas. These are the things I keep returning to."
        />
        <div className="about-voronoi-wrap">
          <div className="bucket-grid bucket-grid--about">
            {aboutThemes.map((theme, index) => (
              <Card key={theme.title} className={`text-card about-theme about-theme--${(index % 3) + 1}`}>
                <h3>{theme.title}</h3>
                <p>{theme.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="shell page-stack contact-page page-phase-wrap page-phase-wrap--contact">
      <Section id="contact">
        <div className="contact-layout">
          <Card className="profile-card contact-sheet contact-splane-wrap">
            <SPlaneBg />
            <div className="page-mark">Coda / Contact and next step</div>
            <div className="badge-row">
              <Badge tone="inverted">Contact</Badge>
              <Badge tone="muted">Low-friction outreach</Badge>
            </div>
            <div className="contact-stability-badge">
              <span className="contact-stability-dot" />
              system: asymptotically stable
            </div>
            <h1>Get in touch.</h1>
            <p>
              As it turns out, reaching out has pretty good phase margin. All poles are in the left-half plane,
              the gain margin is adequate, and I respond to well-framed emails faster than a stepper motor
              with a full step driver.
            </p>
            <div className="contact-signal-grid">
              <div className="glass-list-item">
                <strong>Best fit</strong>
                Controls, autonomy, robotics, simulation, and anything that requires
                both a model and a screwdriver.
              </div>
              <div className="glass-list-item">
                <strong>Best approach</strong>
                Short, specific, and with a clear next move. Context first, attachment second.
              </div>
            </div>
          </Card>
          <div className="contact-rail">
            <Card className="contact-note">
              <div className="eyebrow">Response style</div>
              <h2>Direct, technical, easy to route.</h2>
              <p>
                The goal is an obvious next step: open the resume, click into a case study,
                or send a note. No friction, no ambiguity, no lengthy PDF attached to a cold email.
              </p>
            </Card>
            <Card className="contact-note contact-note--alt">
              <div className="eyebrow">H(s) = best first move</div>
              <h2>Resume, flagship, conversation.</h2>
              <p>
                For roles: controls resume → F-18 or SpiRob → everything else if needed.
                The transfer function is short and the poles are stable.
              </p>
            </Card>
            <div className="contact-bode-footnote" aria-hidden="true">
              <div className="contact-bode-footnote__label">
                // Bode plot · phase margin: adequate
              </div>
              <ContactBodePlot />
            </div>
          </div>
        </div>
      </Section>

      <Section id="contact-links">
        <SectionIntro
          index="01"
          eyebrow="Reach out"
          title="Choose the channel that matches the question"
          body="Email for roles and real conversations. GitHub and resume for immediate proof. LinkedIn for the low-friction public layer. Response time: bounded."
        />
        <div className="contact-grid contact-grid--authored">
          {contactLinks.map((link, index) => (
            <Button
              key={link.label}
              as="a"
              href={link.href}
              target="_blank"
              rel="noreferrer"
              variant="surface"
              className={`contact-card contact-card--${(index % 2) + 1}`}
            >
              <div className="icon-bubble">
                <Icon name={link.icon} className="icon" />
              </div>
              <div className="contact-card__index">{String(index + 1).padStart(2, "0")}</div>
              <strong>{link.label}</strong>
              <span>{link.value}</span>
            </Button>
          ))}
        </div>
      </Section>

      <Section id="contact-coda">
        <Card className="contact-coda">
          <div className="page-mark">Final cue / Suggested first move</div>
          <div className="contact-coda__grid">
            <div>
              <h2>Lead with the role. The proof does the rest.</h2>
              <p>
                Short outreach, clear problem space, one or two case-study links that actually match.
                The transfer function from cold email to interview is shorter than you'd think
                if the numerator is specific.
              </p>
            </div>
            <div className="stack-sm">
              <div className="glass-list-item">
                <strong>Controls / GNC / Autonomy</strong>
                Controls resume + F-18 first. That page was designed for this exact path.
              </div>
              <div className="glass-list-item">
                <strong>Robotics / embedded / mechatronics</strong>
                SpiRob first — hardware, firmware, mechanism, and enough 3D printer character to be real.
              </div>
              <div className="glass-list-item">
                <strong>Perception / SLAM / navigation</strong>
                SLAM page, then Vision. The portfolio has a perception story now.
              </div>
            </div>
          </div>
        </Card>
      </Section>
    </div>
  );
}

function ProjectCard({ project, index = 0 }) {
  return (
    <Card className={`project-card project-card--${project.id} project-card--v${(index % 3) + 1}`}>
      <div className="project-card__meta">
        <span className="project-card__index">{String(index + 1).padStart(2, "0")}</span>
        <Badge tone="muted">{project.status}</Badge>
      </div>
      <div className="project-card__top">
        <div className="icon-bubble">
          <Icon name={project.icon} className="icon" />
        </div>
        <div className="project-card__rule" />
      </div>
      <h3>{project.title}</h3>
      <p>{project.hook}</p>
      <div className="chip-row">
        {project.tags.map((tag) => (
          <Badge key={tag} tone="muted">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="project-card__tempo">
        {project.id === "f18" && "Adagio / stability under disturbance"}
        {project.id === "spirob" && "Rubato / mechanism, cable, wave"}
        {project.id === "slam" && "Staccato / trajectory, drift, alignment"}
        {project.id === "vision" && "Ostinato / zones, posture, alerts"}
        {project.id === "sensorfusion" && "Andante / fusion under dropout"}
      </div>
      <Button as={Link} to={`/projects/${project.id}`}>
        Open case study <Icon name="arrow" className="icon icon--sm" />
      </Button>
    </Card>
  );
}

function FeatureMedia({ item, className = "", fit = "cover", eyebrow = "Proof artifact" }) {
  const [broken, setBroken] = useState(false);
  const isVideo = item.type === "video";
  const mediaClassName = `feature-media__media ${
    fit === "contain" ? "feature-media__media--contain" : ""
  }`.trim();

  return (
    <Card className={`feature-media ${className}`.trim()}>
      <div className="feature-media__frame">
        {broken ? (
          <div className="asset-panel__placeholder">
            <span className="asset-panel__placeholder-tag">{item.type || "asset"}</span>
            <strong>{item.title}</strong>
            <p>Asset not included in this build. Expected path: <code>{item.src}</code>.</p>
          </div>
        ) : isVideo ? (
          <video
            className={mediaClassName}
            controls
            playsInline
            preload="metadata"
            poster={item.poster}
            onError={() => setBroken(true)}
          >
            <source src={item.src} type={item.mimeType} />
          </video>
        ) : (
          <img
            src={item.src}
            alt={item.title}
            className={mediaClassName}
            onError={() => setBroken(true)}
          />
        )}
        <div className="feature-media__overlay">
          <span>{eyebrow}</span>
        </div>
      </div>
      <div className="feature-media__caption">
        <div className="eyebrow">{item.type === "video" ? "Video proof" : "Media proof"}</div>
        <h3>{item.title}</h3>
        <p>{item.caption}</p>
      </div>
    </Card>
  );
}

function StatCard({ item }) {
  return (
    <Card className="result-card">
      <div className="result-card__value">{item.value}</div>
      <div className="result-card__label">{item.label}</div>
      <p>{item.note}</p>
    </Card>
  );
}

function SectionIntro({ index, eyebrow, title, body }) {
  return (
    <div className="section-intro">
      <div className="section-intro__index">{index}</div>
      <div className="section-intro__content">
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
    </div>
  );
}

function FlagshipRail({ items }) {
  const activeId = useActiveSection(items.map((item) => item.id));
  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <aside className="flagship-rail">
      <div className="eyebrow">Section rail</div>
      <div className="flagship-rail__status">
        <span className="flagship-rail__status-label">Now reading</span>
        <strong>{activeItem?.label}</strong>
      </div>
      <div className="flagship-rail__list">
        {items.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={activeId === item.id ? "true" : undefined}
            className={`flagship-rail__item ${activeId === item.id ? "flagship-rail__item--active" : ""}`.trim()}
          >
            <span className="flagship-rail__index">{String(index + 1).padStart(2, "0")}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}

function ListCard({ title, items }) {
  return (
    <Card className="text-card">
      <h3>{title}</h3>
      <div className="flag-list">
        {items.map((item) => (
          <div key={item} className="glass-list-item">
            {item}
          </div>
        ))}
      </div>
    </Card>
  );
}

function ProjectRoutePage() {
  const { projectId } = useParams();

  if (!projectPages[projectId]) {
    return <Navigate to="/projects" replace />;
  }

  if (projectId === "f18") {
    return <F18Page />;
  }

  if (projectId === "spirob") {
    return <SpiRobPage />;
  }

  if (projectId === "slam") {
    return <SlamPage />;
  }

  if (projectId === "vision") {
    return <VisionPage />;
  }

  const project = projectPages[projectId];

  return (
    <div className="shell page-stack">
      <Button as={Link} variant="ghost" className="back-button" to="/projects">
        ← Back to projects
      </Button>
      <Card className="profile-card">
        <Badge tone="muted">Project overview</Badge>
        <h1>{project.title}</h1>
        <p>{project.intro}</p>
      </Card>
    </div>
  );
}

function F18Page() {
  const project = projectPages.f18;
  const railItems = [
    { id: "f18-hero", label: "Hero" },
    { id: "f18-results", label: "Outcome" },
    { id: "f18-framing", label: "Framing" },
    { id: "f18-workflow", label: "Workflow" },
    { id: "f18-comparison", label: "Comparison" },
    { id: "f18-value", label: "Value" },
    { id: "f18-notes", label: "Notes" },
  ];

  const f18Equations = [
    { text: "ṗ = f(x, u, t)", x: "72%", y: "8%",  delay: "0s",    dur: "18s", op: 0.06 },
    { text: "Cm = Cm₀ + Cmα·α", x: "12%", y: "22%", delay: "3s",  dur: "22s", op: 0.055 },
    { text: "ẋ = Ax + Bu",       x: "60%", y: "42%", delay: "1.5s", dur: "16s", op: 0.065 },
    { text: "J = ∫(xᵀQx + uᵀRu)dt", x: "5%", y: "60%", delay: "5s", dur: "20s", op: 0.05 },
    { text: "λ = σ ± iω",        x: "78%", y: "72%", delay: "2s",  dur: "14s", op: 0.06 },
    { text: "δe, δa, δr",        x: "35%", y: "85%", delay: "4s",  dur: "19s", op: 0.055 },
    { text: "det(λI − A) = 0",   x: "55%", y: "18%", delay: "6s",  dur: "17s", op: 0.05 },
  ];

  return (
    <div className="shell flagship-layout flagship-layout--f18 page-phase-wrap page-phase-wrap--f18">
      <VorticityFlowBackdrop />
      <FloatingEquations equations={f18Equations} />
      <div className="flagship-layout__rail">
        <Button as={Link} variant="ghost" className="back-button" to="/projects">
          ← Back to projects
        </Button>
        <FlagshipRail items={railItems} />
      </div>
      <div className="page-stack flagship-page">
        <Section id="f18-hero">
        <div className="flagship-hero">
          <Card className="profile-card flagship-copy">
            <div className="page-mark">Study 01 / Aircraft control</div>
            <div className="badge-row">
              {project.badge.map((item) => (
                <Badge key={item} tone={item === "Flagship case study" ? "inverted" : "muted"}>
                  {item}
                </Badge>
              ))}
            </div>
            <h1>{project.title}</h1>
            <p>{project.intro}</p>
            <div className="metric-strip">
              {project.metrics.map((item) => (
                <div key={item} className="glass-list-item">
                  {item}
                </div>
              ))}
            </div>
          </Card>
          <FeatureMedia
            item={project.heroMedia}
            className="feature-media--hero"
            fit="cover"
            eyebrow="Closed-loop proof artifact"
          />
        </div>
        </Section>

        <Section id="f18-results">
        <SectionIntro
          index="01"
          eyebrow="Measured outcome"
          title="Strongest result, stated without marketing fluff"
          body="The controller story matters because the behavior is observable. These result cards are backed by the flight video, the closed-loop traces, and the open-loop comparison that follows."
        />
        <div className="result-grid">
          {project.resultCards.map((item) => (
            <StatCard key={item.label} item={item} />
          ))}
        </div>
        </Section>

        <Section id="f18-framing">
        <SectionIntro
          index="02"
          eyebrow="Narrative arc"
          title="Problem, setup, visual proof, comparison"
          body="The page works best when it reads like a real engineering case study instead of a thesis dump or a vague AI landing page."
        />
        <Card className="text-card text-card--lead">
          <h3>The core challenge</h3>
          <p>{project.challenge}</p>
        </Card>
        <div className="bucket-grid">
          {project.storyline.map((item) => (
            <Card key={item.title} className="text-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Card>
          ))}
        </div>
        </Section>

        <Section id="f18-workflow">
        <SectionIntro
          index="03"
          eyebrow="Engineering workflow"
          title="Model, controller, evaluation, interpretation"
          body="The engineering value is in how the control problem was framed, how the comparison was organized, and how the responses were interpreted, not just in producing one good-looking trace."
        />
        <div className="comparison-split">
          <div className="comparison-track">
            {project.architecture.map((item) => (
              <Card key={item.title} className="text-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </Card>
            ))}
          </div>
          <div className="comparison-track">
            {project.workflow.map((item) => (
              <Card key={item.title} className="text-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </Card>
            ))}
          </div>
        </div>
        </Section>

        <Section id="f18-comparison">
        <SectionIntro
          index="04"
          eyebrow="Visual comparison"
          title="Closed-loop evidence against open-loop contrast"
          body="The controlled plots need prominence, but the unregulated baseline is what makes the controller value credible instead of merely asserted."
        />
        <div className="comparison-split">
          <div className="comparison-track">
            <Card className="comparison-header comparison-header--positive">
              <div className="eyebrow">Closed-loop evidence</div>
              <h3>Recovery, bounded response, interpretable control effort</h3>
              <p>
                These are the plots a technical reviewer should scan first: velocity,
                altitude, angular motion, and control inputs.
              </p>
            </Card>
            <div className="comparison-grid">
              {project.closedLoopAssets.map((item) => (
                <FeatureMedia
                  key={item.title}
                  item={item}
                  className="feature-media--plot"
                  fit="contain"
                  eyebrow="Closed-loop plot"
                />
              ))}
            </div>
          </div>
          <div className="comparison-track">
            <Card className="comparison-header comparison-header--neutral">
              <div className="eyebrow">Open-loop contrast</div>
              <h3>Why the controller matters at all</h3>
              <p>
                The open-loop traces are intentionally visible because they provide the
                contrast that keeps the case study honest and technically legible.
              </p>
            </Card>
            <div className="comparison-grid comparison-grid--stack">
              {project.openLoopAssets.map((item) => (
                <FeatureMedia
                  key={item.title}
                  item={item}
                  className="feature-media--plot feature-media--wide"
                  fit="contain"
                  eyebrow="Open-loop plot"
                />
              ))}
            </div>
          </div>
        </div>
        </Section>

        <Section id="f18-value">
        <SectionIntro
          index="05"
          eyebrow="What this proves"
          title="Engineering value, validation, and interpretive depth"
          body="This work should read as serious controls and autonomy engineering grounded in modeling, simulation infrastructure, evaluation, and honest technical interpretation."
        />
        <div className="comparison-split">
          <ListCard title="Engineering value" items={project.engineeringValue} />
          <ListCard title="Validation questions" items={project.validationQuestions} />
        </div>
        </Section>

        <Section id="f18-notes">
        <div className="comparison-split">
          <ListCard title="What this demonstrates" items={project.hiringTakeaways} />
          <div className="comparison-track">
            {project.sections.map((section) => (
              <Card key={section.title} className="text-card">
                <h3>{section.title}</h3>
                <p>{section.body}</p>
              </Card>
            ))}
          </div>
        </div>
        </Section>
      </div>
    </div>
  );
}

function SpiRobPage() {
  const project = projectPages.spirob;
  const railItems = [
    { id: "spirob-hero", label: "Hero" },
    { id: "spirob-story", label: "Story" },
    { id: "spirob-visuals", label: "Visuals" },
    { id: "spirob-details", label: "Mechanism" },
    { id: "spirob-simulation", label: "Simulation" },
  ];

  const spirobEquations = [
    { text: "τ = J·α",         x: "68%", y: "6%",  delay: "0s",   dur: "20s", op: 0.06 },
    { text: "T = k·Δθ",        x: "8%",  y: "18%", delay: "2.5s", dur: "17s", op: 0.055 },
    { text: "Re ≪ 1",          x: "75%", y: "38%", delay: "1s",   dur: "22s", op: 0.065 },
    { text: "qₖ = sin(ωt + φₖ)", x: "5%", y: "55%", delay: "4s", dur: "18s", op: 0.05  },
    { text: "F = kx",          x: "60%", y: "70%", delay: "3s",   dur: "15s", op: 0.06  },
    { text: "28BYJ-48 ✓",      x: "20%", y: "82%", delay: "5.5s", dur: "19s", op: 0.04  },
    { text: "∂L/∂q̇ − ∂L/∂q = 0", x: "40%", y: "14%", delay: "7s", dur: "21s", op: 0.05 },
  ];

  return (
    <div className="shell flagship-layout flagship-layout--spirob page-phase-wrap page-phase-wrap--spirob">
      <LSystemBackdrop />
      <FloatingEquations equations={spirobEquations} />
      <div className="flagship-layout__rail">
        <Button as={Link} variant="ghost" className="back-button" to="/projects">
          ← Back to projects
        </Button>
        <FlagshipRail items={railItems} />
      </div>
      <div className="page-stack flagship-page">
        <Section id="spirob-hero">
        <div className="flagship-hero flagship-hero--reverse">
          <FeatureMedia
            item={project.heroMedia}
            className="feature-media--hero feature-media--warm"
            fit="cover"
            eyebrow="Hero still"
          />
          <Card className="profile-card flagship-copy">
            <div className="page-mark">Study 02 / Soft robotics</div>
            <div className="badge-row">
              {project.badge.map((item) => (
                <Badge key={item} tone={item === "Flagship robotics case study" ? "inverted" : "muted"}>
                  {item}
                </Badge>
              ))}
            </div>
            <h1>{project.title}</h1>
            <p>{project.intro}</p>
            <div className="metric-strip">
              {project.metrics.map((metric) => (
                <div key={metric} className="glass-list-item">
                  {metric}
                </div>
              ))}
            </div>
          </Card>
        </div>
        </Section>

        <Section id="spirob-story">
        <SectionIntro
          index="01"
          eyebrow="Robotics storyline"
          title="Real hardware first, embedded logic second, simulation path third"
          body="The page should feel like a convincing robotics build with real implementation depth, not like a hobby gallery and not like a fake finished product."
        />
        <div className="bucket-grid">
          {project.story.map((item) => (
            <Card key={item.title} className="text-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Card>
          ))}
        </div>
        </Section>

        <Section id="spirob-visuals">
        <SectionIntro
          index="02"
          eyebrow="Build evidence"
          title="Hardware stills, wave motion, and grasping"
          body="The full-system still establishes reality. The bench and segment views show the embedded and mechanism details. Then comes the motion: one clip demoing wave-like behavior, one showing the robot doing what it was always quietly threatening to do — grasp."
        />
        <div className="comparison-split">
          <div className="comparison-track">
            <div className="comparison-grid">
              {project.supportingAssets.map((item) => (
                <FeatureMedia
                  key={item.title}
                  item={item}
                  className="feature-media--tall"
                  fit="cover"
                  eyebrow="Supporting build view"
                />
              ))}
            </div>
          </div>
          <div className="comparison-track">
            <FeatureMedia
              item={project.motionMedia}
              className="feature-media--hero feature-media--motion"
              fit="contain"
              eyebrow="Wave motion demo"
            />
            <FeatureMedia
              item={project.graspingMedia}
              className="feature-media--plot feature-media--motion"
              fit="contain"
              eyebrow="Grasping demo"
            />
          </div>
        </div>
        </Section>

        <Section id="spirob-details">
        <SectionIntro
          index="03"
          eyebrow="Implementation"
          title="Mechanism, embedded logic, and systems value"
          body="The technical interest is not only in building the robot, but in organizing repeatable actuation, explaining the mechanism, and turning a prototype into a credible systems project."
        />
        <div className="comparison-split">
          <Card className="text-card">
            <h3>Technical implementation</h3>
            <div className="stack-sm">
              {project.implementation.map((item) => (
                <div key={item.title} className="glass-list-item">
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </Card>
          <div className="comparison-track">
            <ListCard title="Why this build matters" items={project.whyItMatters} />
            <ListCard title="Engineering challenges" items={project.challenges} />
          </div>
        </div>
        </Section>

        <Section id="spirob-simulation">
        <SectionIntro
          index="04"
          eyebrow="Simulation path"
          title="Modeling progress exists before the renders do"
          body="The simulation section matters because it shows the project already moved beyond hardware assembly into structure, geometry, and future control-oriented modeling."
        />
        <div className="comparison-split">
          <Card className="text-card">
            <div className="eyebrow">Simulation path</div>
            <h2>Modeling progress exists before the renders do</h2>
            <p>{project.simulationStatus}</p>
            <div className="stack-sm">
              {project.simulationFiles.map((item) => (
                <div key={item} className="glass-list-item">
                  <code>{item}</code>
                </div>
              ))}
            </div>
          </Card>
          <div className="comparison-track">
            <FeatureMedia
              item={project.pendingAssets[0]}
              className="feature-media--plot feature-media--pending"
              fit="cover"
              eyebrow="Pending simulation render"
            />
            <ListCard title="Future directions" items={project.futureDirections} />
          </div>
        </div>
        </Section>
      </div>
    </div>
  );
}

function SlamPage() {
  const project = projectPages.slam;
  const railItems = [
    { id: "slam-hero", label: "Hero" },
    { id: "slam-story", label: "Framing" },
    { id: "slam-pipeline", label: "Pipeline" },
    { id: "slam-visuals", label: "Evidence" },
    { id: "slam-details", label: "Details" },
  ];

  const slamEquations = [
    { text: "x̂ₖ₊₁ = Ax̂ₖ + K(yₖ − Cx̂ₖ)",  x: "55%", y: "7%",  delay: "0s",   dur: "20s", op: 0.055 },
    { text: "P⁻ = APAᵀ + Q",               x: "8%",  y: "25%", delay: "3s",   dur: "17s", op: 0.06  },
    { text: "ξ ∈ SE(3)",                   x: "70%", y: "42%", delay: "1.5s", dur: "22s", op: 0.065 },
    { text: "K = P⁻Cᵀ(CP⁻Cᵀ + R)⁻¹",     x: "5%",  y: "58%", delay: "5s",   dur: "18s", op: 0.05  },
    { text: "ATE = Σ‖Tᵢ − T̂ᵢ‖",           x: "60%", y: "75%", delay: "2s",   dur: "16s", op: 0.055 },
    { text: "T ∈ SO(3) × ℝ³",             x: "30%", y: "88%", delay: "6s",   dur: "19s", op: 0.05  },
  ];

  return (
    <div className="shell flagship-layout flagship-layout--slam page-phase-wrap page-phase-wrap--slam">
      <MandelbrotBackdrop />
      <FloatingEquations equations={slamEquations} />
      <div className="flagship-layout__rail">
        <Button as={Link} variant="ghost" className="back-button" to="/projects">
          ← Back to projects
        </Button>
        <FlagshipRail items={railItems} />
      </div>
      <div className="page-stack flagship-page">
        <Section id="slam-hero">
        <div className="flagship-hero">
          <Card className="profile-card flagship-copy">
            <div className="page-mark">Study 03 / Perception workflow</div>
            <div className="badge-row">
              {project.badge.map((item) => (
                <Badge key={item} tone={item === "Perception case study" ? "inverted" : "muted"}>
                  {item}
                </Badge>
              ))}
            </div>
            <h1>{project.title}</h1>
            <p>{project.intro}</p>
            <div className="metric-strip">
              {project.metrics.map((metric) => (
                <div key={metric} className="glass-list-item">
                  {metric}
                </div>
              ))}
            </div>
            <div className="button-row">
              <Button as="a" href={project.repoUrl} target="_blank" rel="noreferrer">
                <Icon name="github" className="icon icon--sm" /> View GitHub
              </Button>
              <Button as={Link} to="/projects" variant="secondary">
                Compare with other case studies
              </Button>
            </div>
          </Card>
          <FeatureMedia
            item={project.heroMedia}
            className="feature-media--hero"
            fit="cover"
            eyebrow="Primary SLAM output"
          />
        </div>
        </Section>

        <Section id="slam-story">
        <SectionIntro
          index="01"
          eyebrow="Project framing"
          title="Perception and navigation workflow, not just another screenshot"
          body="The value of this page is that it gives the portfolio visible perception work: estimation output, trajectory inspection, and a more complete autonomy story around how systems are understood and debugged."
        />
        <div className="bucket-grid">
          {project.story.map((item) => (
            <Card key={item.title} className="text-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Card>
          ))}
        </div>
        </Section>

        <Section id="slam-pipeline">
        <SectionIntro
          index="02"
          eyebrow="Repository workflow"
          title="Structured around data, engine execution, and evaluation"
          body="The repo itself makes the project easier to explain. It is not just a loose experiment folder. The workflow is organized around preparing sequences, running a SLAM engine, and evaluating the resulting trajectory."
        />
        <div className="comparison-split">
          <div className="comparison-track">
            {project.pipeline.map((item) => (
              <Card key={item.title} className="text-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </Card>
            ))}
          </div>
          <ListCard title="Architecture notes" items={project.architectureNotes} />
        </div>
        </Section>

        <Section id="slam-visuals">
        <SectionIntro
          index="03"
          eyebrow="Current evidence"
          title="Reconstruction, pose inspection, and workflow motion"
          body="The still images and short video are most useful when they support the workflow explanation rather than replacing it. One image establishes the map output, one supports pose interpretation, and the video makes the process feel more real."
        />
        <div className="comparison-split">
          <div className="comparison-track">
            {project.assets.map((item, index) => (
              <FeatureMedia
                key={item.title}
                item={item}
                className={index === 0 ? "feature-media--hero" : "feature-media--plot"}
                fit={index === 0 ? "cover" : "contain"}
                eyebrow={index === 0 ? "Reconstruction output" : "Pose-viewer output"}
              />
            ))}
          </div>
          <div className="comparison-track">
            <FeatureMedia
              item={project.motionMedia}
              className="feature-media--hero feature-media--motion"
              fit="contain"
              eyebrow="Workflow video"
            />
          </div>
        </div>
        </Section>

        <Section id="slam-details">
        <SectionIntro
          index="04"
          eyebrow="Implementation"
          title="Code structure, interpretation, and why it matters"
          body="This is where the page shifts from visual proof to technical substance: how the workflow is organized, what outputs are useful, and why the project adds real perception depth to the portfolio."
        />
        <div className="comparison-split">
          <Card className="text-card">
            <h3>Implementation and workflow</h3>
            <div className="stack-sm">
              {project.implementation.map((item) => (
                <div key={item.title} className="glass-list-item">
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </Card>
          <div className="comparison-track">
            <Card className="kalman-card">
              <div className="eyebrow">Live estimate</div>
              <h3>Kalman intuition, made visible</h3>
              <p>
                Measurements fall in noisy and imperfect. The estimate moves more carefully,
                and the uncertainty band widens when the measurements disappear.
              </p>
              <KalmanDemo />
            </Card>
            <ListCard title="Why this page matters" items={project.valuePoints} />
            <ListCard title="Best next additions" items={project.nextSteps} />
          </div>
        </div>
        </Section>
      </div>
    </div>
  );
}

function VisionPage() {
  const project = projectPages.vision;
  const railItems = [
    { id: "vision-hero", label: "Hero" },
    { id: "vision-story", label: "Framing" },
    { id: "vision-pipeline", label: "Workflow" },
    { id: "vision-details", label: "Details" },
  ];

  return (
    <div className="shell flagship-layout flagship-layout--vision page-phase-wrap page-phase-wrap--vision">
      <MandelbrotBackdrop />
      <div className="flagship-layout__rail">
        <Button as={Link} variant="ghost" className="back-button" to="/projects">
          ← Back to projects
        </Button>
        <FlagshipRail items={railItems} />
      </div>
      <div className="page-stack flagship-page">
        <Section id="vision-hero">
        <div className="comparison-split">
          <Card className="profile-card flagship-copy">
            <div className="page-mark">Study 04 / Vision monitoring</div>
            <div className="badge-row">
              {project.badge.map((item) => (
                <Badge key={item} tone={item === "Computer vision case study" ? "inverted" : "muted"}>
                  {item}
                </Badge>
              ))}
            </div>
            <h1>{project.title}</h1>
            <p>{project.intro}</p>
            <div className="metric-strip">
              {project.metrics.map((metric) => (
                <div key={metric} className="glass-list-item">
                  {metric}
                </div>
              ))}
            </div>
            <div className="button-row">
              <Button as="a" href={project.repoUrl} target="_blank" rel="noreferrer">
                <Icon name="github" className="icon icon--sm" /> View GitHub
              </Button>
            </div>
          </Card>
          <Card className="text-card">
            <div className="eyebrow">System at a glance</div>
            <h2>Interactive monitoring pipeline</h2>
            <p>
              This page is intentionally architecture-forward. The core proof is the
              monitoring workflow itself: define zones, run the scene, interpret activity,
              and emit usable alert artifacts.
            </p>
            <div className="flag-list">
              {project.outputArtifacts.map((item) => (
                <div key={item} className="glass-list-item">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </div>
        </Section>

        <Section id="vision-story">
        <SectionIntro
          index="01"
          eyebrow="Project framing"
          title="More than model inference"
          body="The value of this work is that it treats computer vision as a working monitoring system with operator interaction, runtime behavior, and stored events rather than just predictions on frames."
        />
        <div className="bucket-grid">
          {project.story.map((item) => (
            <Card key={item.title} className="text-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Card>
          ))}
        </div>
        </Section>

        <Section id="vision-pipeline">
        <SectionIntro
          index="02"
          eyebrow="System workflow"
          title="Run source, define zones, monitor events, store outputs"
          body="The repository structure makes the workflow easy to explain. It supports live or file-based sources, interactive scene setup, and output logging in a way that feels operational rather than purely experimental."
        />
        <div className="comparison-split">
          <div className="comparison-track">
            {project.pipeline.map((item) => (
              <Card key={item.title} className="text-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </Card>
            ))}
          </div>
          <ListCard title="Architecture notes" items={project.architectureNotes} />
        </div>
        </Section>

        <Section id="vision-details">
        <SectionIntro
          index="03"
          eyebrow="Implementation"
          title="Architecture details and next proof points"
          body="This section is where the project earns credibility as a system: what is implemented, why the structure matters, and what additional artifacts would strengthen it further."
        />
        <div className="comparison-split">
          <Card className="text-card">
            <h3>Implementation details</h3>
            <div className="stack-sm">
              {project.implementation.map((item) => (
                <div key={item.title} className="glass-list-item">
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </Card>
          <div className="comparison-track">
            <ListCard title="Why this page matters" items={project.valuePoints} />
            <ListCard title="Best next additions" items={project.nextSteps} />
          </div>
        </div>
        </Section>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__identity">
          <div className="eyebrow">Closing line</div>
          <strong>{siteContent.owner.name}</strong>
          <p>{siteContent.owner.title}</p>
        </div>
        <div className="footer__note">
          <div className="eyebrow">Coda</div>
          <p>Case studies, simulation, hardware, and careful explanation.</p>
        </div>
        <div className="footer__links">
          <a href={`mailto:${siteContent.owner.email}`}>{siteContent.owner.email}</a>
          <a href={siteContent.owner.linkedinUrl} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={siteContent.owner.githubUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={siteContent.owner.resumePdf} target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>
      </div>
      <div className="shell footer__afterword">
        <span className="footer__afterword-rule" />
        <p>Calm systems. Strange margins. Discipline you can actually read.</p>
        <PageFooterEq />
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
