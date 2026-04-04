import { useState } from "react";

export function Button({
  children,
  variant = "primary",
  className = "",
  as = "button",
  ...props
}) {
  const Component = as;
  return (
    <Component
      className={`button button--${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Badge({ children, className = "", tone = "default" }) {
  return <span className={`badge badge--${tone} ${className}`.trim()}>{children}</span>;
}

export function Card({ children, className = "" }) {
  return <article className={`card ${className}`.trim()}>{children}</article>;
}

export function Section({ id, children, className = "" }) {
  return (
    <section id={id} className={`section ${className}`.trim()}>
      {children}
    </section>
  );
}

export function Icon({ name, className = "icon" }) {
  const icons = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </>
    ),
    plane: (
      <>
        <path d="M10 14 21 3" />
        <path d="M21 3 14 21l-4-7-7-4 18-7Z" />
      </>
    ),
    cpu: (
      <>
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    waves: (
      <>
        <path d="M2 8c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
        <path d="M2 14c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
        <path d="M2 20c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="M18 6 6 18M6 6l12 12" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v5h5" />
        <path d="M9 13h6M9 17h6M9 9h2" />
      </>
    ),
    github: (
      <>
        <path d="M9 19c-4.3 1.4-4.3-2.5-6-3" />
        <path d="M15 22v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-7A5.4 5.4 0 0 0 19 4.8 5 5 0 0 0 18.9 1S17.7.7 15 2.5a13.4 13.4 0 0 0-6 0C6.3.7 5.1 1 5.1 1A5 5 0 0 0 5 4.8a5.4 5.4 0 0 0-1.3 3.7c0 5.5 3.2 6.7 6.2 7a3.4 3.4 0 0 0-.9 2.6V22" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

export function AssetPanel({ item, fit = "contain" }) {
  const [broken, setBroken] = useState(false);
  const isVideo = item.type === "video";
  const mediaClassName = `asset-panel__media ${fit === "cover" ? "asset-panel__media--cover" : ""}`;

  return (
    <Card className="asset-panel">
      <div className="asset-panel__frame">
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
            preload="metadata"
            poster={item.poster}
            onError={() => setBroken(true)}
          >
            <source src={item.src} />
          </video>
        ) : (
          <img
            src={item.src}
            alt={item.title}
            className={mediaClassName}
            onError={() => setBroken(true)}
          />
        )}
      </div>
      <div className="asset-panel__body">
        <div className="eyebrow">{item.type === "video" ? "Video asset" : "Media asset"}</div>
        <h3>{item.title}</h3>
        <p>{item.caption}</p>
      </div>
    </Card>
  );
}
