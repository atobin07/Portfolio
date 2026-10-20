import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0a;
    --bg2: #111111;
    --bg3: #161616;
    --border: #222222;
    --border2: #2a2a2a;
    --text: #f0f0f0;
    --text2: #888888;
    --text3: #444444;
    --accent: #e8ff47;
    --accent2: #47ffe8;
    --font-display: 'Syne', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-display);
    overflow-x: hidden;
    cursor: none;
  }

  /* Custom cursor */
  .cursor {
    position: fixed;
    width: 10px; height: 10px;
    background: var(--accent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
    mix-blend-mode: difference;
  }
  .cursor-ring {
    position: fixed;
    width: 36px; height: 36px;
    border: 1px solid rgba(232,255,71,0.4);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transition: transform 0.15s ease, width 0.2s ease, height 0.2s ease;
    mix-blend-mode: difference;
  }
  .cursor-ring.expanded { width: 56px; height: 56px; }

  /* Noise overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9997;
    opacity: 0.6;
  }

  /* NAV */
  nav {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 48px;
    border-bottom: 1px solid transparent;
    transition: border-color 0.3s, background 0.3s, backdrop-filter 0.3s;
  }
  nav.scrolled {
    border-color: var(--border);
    background: rgba(10,10,10,0.85);
    backdrop-filter: blur(12px);
  }
  .nav-logo {
    font-size: 18px; font-weight: 800; letter-spacing: -0.03em;
    color: var(--text);
    text-decoration: none;
  }
  .nav-logo span { color: var(--accent); }
  .nav-links { display: flex; gap: 32px; }
  .nav-links button {
    background: none; border: none; color: var(--text2);
    font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em;
    cursor: none;
    transition: color 0.2s;
    text-transform: uppercase;
  }
  .nav-links button:hover { color: var(--accent); }
  .nav-links button.active { color: var(--text); }

  /* SECTIONS */
  section { min-height: 100vh; }

  /* HERO */
  .hero {
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 0 48px 80px;
    position: relative; overflow: hidden;
  }
  .hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(232,255,71,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(232,255,71,0.04) 1px, transparent 1px);
    background-size: 80px 80px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
  }
  .hero-eyebrow {
    font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.15em;
    color: var(--accent); text-transform: uppercase;
    margin-bottom: 24px;
    display: flex; align-items: center; gap: 12px;
  }
  .hero-eyebrow::before {
    content: ''; display: block;
    width: 32px; height: 1px; background: var(--accent);
  }
  .hero-title {
    font-size: clamp(56px, 8vw, 120px);
    font-weight: 800; line-height: 0.92;
    letter-spacing: -0.04em;
    margin-bottom: 40px;
  }
  .hero-title .line2 { color: var(--text2); }
  .hero-title .accent { color: var(--accent); }
  .hero-bottom {
    display: flex; align-items: flex-end; justify-content: space-between;
    gap: 32px;
  }
  .hero-desc {
    max-width: 400px;
    font-family: var(--font-mono); font-size: 13px; line-height: 1.7;
    color: var(--text2);
  }
  .hero-stats {
    display: flex; gap: 48px;
  }
  .stat-item { text-align: right; }
  .stat-num {
    font-size: 32px; font-weight: 800; letter-spacing: -0.04em;
    color: var(--text); line-height: 1;
  }
  .stat-label {
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em;
    color: var(--text3); text-transform: uppercase; margin-top: 4px;
  }
  .scroll-indicator {
    position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em;
    color: var(--text3); text-transform: uppercase;
    animation: bounce 2s ease-in-out infinite;
  }
  .scroll-indicator::after {
    content: ''; display: block;
    width: 1px; height: 40px; background: linear-gradient(var(--text3), transparent);
  }
  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(6px); }
  }

  /* WORK section */
  .work { padding: 120px 48px; }
  .section-header {
    display: flex; align-items: baseline; justify-content: space-between;
    margin-bottom: 64px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 24px;
  }
  .section-title {
    font-size: 11px; font-weight: 400;
    font-family: var(--font-mono); letter-spacing: 0.15em;
    color: var(--text2); text-transform: uppercase;
  }
  .section-num {
    font-size: 11px; font-family: var(--font-mono);
    color: var(--text3);
  }

  /* PROJECT CARD */
  .project-card {
    border: 1px solid var(--border);
    background: var(--bg2);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 2px;
    cursor: none;
    transition: border-color 0.3s;
  }
  .project-card:hover { border-color: var(--border2); }
  .project-card.expanded { border-color: var(--accent); }

  .project-header {
    display: grid;
    grid-template-columns: 48px 1fr auto auto;
    align-items: center;
    gap: 24px;
    padding: 28px 32px;
    cursor: none;
  }
  .project-num {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--text3); letter-spacing: 0.05em;
  }
  .project-name-wrap {}
  .project-name {
    font-size: 22px; font-weight: 700; letter-spacing: -0.02em;
    margin-bottom: 4px;
    transition: color 0.2s;
  }
  .project-card:hover .project-name { color: var(--accent); }
  .project-tagline {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--text2); letter-spacing: 0.03em;
  }
  .project-tags {
    display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end;
  }
  .tag {
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.06em;
    color: var(--text3); text-transform: uppercase;
    padding: 4px 10px;
    border: 1px solid var(--border);
    border-radius: 1px;
    transition: color 0.2s, border-color 0.2s;
  }
  .project-card.expanded .tag { color: var(--text2); border-color: var(--border2); }
  .expand-icon {
    font-size: 20px; color: var(--text3);
    transition: transform 0.3s, color 0.2s;
    width: 24px; text-align: center;
  }
  .project-card.expanded .expand-icon { transform: rotate(45deg); color: var(--accent); }

  /* Expanded content */
  .project-body {
    max-height: 0; overflow: hidden;
    transition: max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .project-body.open { max-height: 800px; }
  .project-body-inner {
    padding: 0 32px 40px;
    border-top: 1px solid var(--border);
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 48px;
  }
  .project-desc {
    font-family: var(--font-mono); font-size: 13px; line-height: 1.8;
    color: var(--text2); margin-top: 32px;
    margin-bottom: 24px;
  }
  .project-highlights { list-style: none; }
  .project-highlights li {
    font-family: var(--font-mono); font-size: 12px; line-height: 1.6;
    color: var(--text2); padding: 6px 0;
    border-bottom: 1px solid var(--border);
    display: flex; gap: 12px; align-items: flex-start;
  }
  .project-highlights li::before {
    content: '→'; color: var(--accent); flex-shrink: 0;
  }
  .project-links { margin-top: 32px; display: flex; gap: 12px; }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--accent); color: #0a0a0a;
    font-family: var(--font-mono); font-size: 11px; font-weight: 400;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 10px 20px; border-radius: 1px;
    text-decoration: none; cursor: none;
    border: none;
    transition: opacity 0.2s;
  }
  .btn-primary:hover { opacity: 0.85; }
  .btn-secondary {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: var(--text2);
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 10px 20px; border-radius: 1px;
    text-decoration: none; cursor: none;
    border: 1px solid var(--border2);
    transition: color 0.2s, border-color 0.2s;
  }
  .btn-secondary:hover { color: var(--text); border-color: var(--text2); }

  .project-meta { margin-top: 32px; }
  .meta-row {
    display: flex; justify-content: space-between; align-items: baseline;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
  }
  .meta-key {
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em;
    color: var(--text3); text-transform: uppercase;
  }
  .meta-val {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--text2); text-align: right;
  }
  .meta-val.accent { color: var(--accent); }

  .status-dot {
    display: inline-block; width: 6px; height: 6px;
    border-radius: 50%; background: var(--accent);
    margin-right: 6px;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  /* ABOUT */
  .about { padding: 120px 48px; background: var(--bg); }
  .about-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 96px;
    align-items: start;
  }
  .about-heading {
    font-size: clamp(40px, 5vw, 72px);
    font-weight: 800; line-height: 0.95; letter-spacing: -0.04em;
    margin-bottom: 40px;
  }
  .about-heading span { color: var(--accent); }
  .about-text {
    font-family: var(--font-mono); font-size: 13px; line-height: 1.9;
    color: var(--text2); margin-bottom: 16px;
  }
  .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 48px; }
  .skill-block {
    padding: 20px;
    border: 1px solid var(--border);
    border-radius: 1px;
  }
  .skill-block-title {
    font-size: 10px; font-family: var(--font-mono);
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 12px;
  }
  .skill-list {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--text2); line-height: 2;
  }

  

  /* FOOTER */
  footer {
    padding: 32px 48px;
    border-top: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
  }
  footer p {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--text3); letter-spacing: 0.05em;
  }

  /* DEMO CREDENTIALS */
  .demo-creds {
    margin-top: 20px;
    border: 1px solid rgba(232,255,71,0.25);
    border-radius: 2px;
    overflow: hidden;
    background: rgba(232,255,71,0.04);
  }
  .demo-creds-label {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--accent); padding: 10px 16px;
    border-bottom: 1px solid rgba(232,255,71,0.15);
    display: flex; align-items: center; gap: 8px;
  }
  .demo-creds-row {
    display: flex; align-items: center; gap: 12px;
    padding: 8px 16px;
    border-bottom: 1px solid rgba(232,255,71,0.08);
  }
  .demo-creds-row:last-child { border-bottom: none; }
  .demo-key {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--text3); letter-spacing: 0.08em;
    text-transform: uppercase; width: 64px; flex-shrink: 0;
  }
  .demo-val {
    font-family: var(--font-mono); font-size: 12px;
    color: var(--text); letter-spacing: 0.03em;
    background: rgba(255,255,255,0.05);
    padding: 2px 8px; border-radius: 2px;
    user-select: all;
  }

  /* Fade-in animation */
  .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 768px) {
    nav { padding: 20px 24px; }
    .hero { padding: 0 24px 64px; }
    .hero-bottom { flex-direction: column; align-items: flex-start; }
    .hero-stats { gap: 32px; }
    .work, .about, .contact { padding: 80px 24px; }
    .project-header { grid-template-columns: 32px 1fr auto; gap: 12px; }
    .project-tags { display: none; }
    .project-body-inner { grid-template-columns: 1fr; }
    .about-grid { grid-template-columns: 1fr; gap: 48px; }
    footer { flex-direction: column; gap: 8px; text-align: center; }
    body { cursor: auto; }
    .cursor, .cursor-ring { display: none; }
  }
`;

const PROJECTS = [
  {
    id: 1,
    num: "01",
    name: "Capitol Mirror",
    tagline: "Congressional stock trading tracker — STOCK Act disclosures turned into investment intelligence",
    tags: ["Next.js", "TypeScript", "Stripe", "Supabase"],
    description:
      "Nancy Pelosi's stock picks beat the S&P 500 by 68% last year. Capitol Mirror tells you what she's buying before the news does. A full-stack SaaS that converts public STOCK Act government filings into a subscription data product — covering all 538 Congress members with deep analytics, copy-trade tooling, and a full Stripe paywall.",
    highlights: [
      "Live trade feed across all 538 Congress members in real time",
      "Conflict of Interest scoring — cross-references committee memberships against holdings",
      "Copy Trading — one-tap broker deep-links (Robinhood, Webull, Fidelity, Schwab)",
      "Full Stripe paywall: Free / Pro $30 / Pro+ $65 with 7-day trial & billing portal",
      "Automated GitHub Actions pipeline bypasses government IP blocks daily",
      "Deep analytics: trade volume, party breakdowns, sector allocation, cumulative P&L",
      "Web Push notifications — alerts the moment a new trade is filed",
      "Custom watchlist boards per Congress member",
    ],
    meta: [
      { key: "Model", val: "Free / $30 / $65 /mo", accent: true },
      { key: "Status", val: "Live in production", live: true },
      { key: "Type", val: "SaaS / Data Product" },
      { key: "Stack", val: "Next.js 16 + TypeScript" },
      { key: "Backend", val: "Supabase + PostgreSQL" },
      { key: "Payments", val: "Stripe" },
      { key: "Deploy", val: "DigitalOcean + PM2" },
    ],
    liveUrl: "http://45.55.38.251",
    githubUrl: null,
    demo: { email: "demo@capitolmirror.app", password: "Demo1234!" },
  },
  {
    id: 2,
    num: "02",
    name: "Container Tracker",
    tagline: "Real-time freight container tracking with live shipping data",
    tags: ["React", "Supabase", "Vercel", "API"],
    description:
      "A full-stack logistics tool for tracking freight containers across their entire journey — from origin port through customs, drayage, and final delivery. Add a container number and the app pulls live shipping data, then tracks it automatically as it moves around the world.",
    highlights: [
      "Built from zero to functional full-stack app in 1–2 days",
      "Live shipping API integration — real container data on demand",
      "6-stage status pipeline: Origin → In Transit → Destination → Customs → Drayage → Delivered",
      "Dashboard stat cards give instant fleet-wide status overview",
      "Add container modal captures vessel, ports, bill of lading, ETA, and notes",
      "Supabase backend with full CRUD — data persists and updates as containers move",
    ],
    meta: [
      { key: "Timeline", val: "1–2 days", accent: true },
      { key: "Status", val: "Live (beta)", live: true },
      { key: "Type", val: "Logistics / B2B Tool" },
      { key: "Stack", val: "React + Vite" },
      { key: "Backend", val: "Supabase" },
      { key: "Deploy", val: "Vercel" },
    ],
    liveUrl: "https://container-tracker-beta.vercel.app/",
    githubUrl: null,
    demo: { email: "dev@testemail.com", password: "Test1" },
  },
];

function ProjectCard({ project, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`project-card fade-in ${open ? "expanded" : ""}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className="project-header" onClick={() => setOpen(!open)}>
        <span className="project-num">{project.num}</span>
        <div className="project-name-wrap">
          <div className="project-name">{project.name}</div>
          <div className="project-tagline">{project.tagline}</div>
        </div>
        <div className="project-tags">
          {project.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <div className="expand-icon">+</div>
      </div>

      <div className={`project-body ${open ? "open" : ""}`}>
        <div className="project-body-inner">
          <div>
            <p className="project-desc">{project.description}</p>
            <ul className="project-highlights">
              {project.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
            <div className="project-links">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  Try Live Demo ↗
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  GitHub →
                </a>
              )}
            </div>
            {project.demo && (
              <div className="demo-creds">
                <div className="demo-creds-label">
                  <span className="status-dot" />
                  Demo access — click around freely
                </div>
                <div className="demo-creds-row">
                  <span className="demo-key">email</span>
                  <code className="demo-val">{project.demo.email}</code>
                </div>
                <div className="demo-creds-row">
                  <span className="demo-key">password</span>
                  <code className="demo-val">{project.demo.password}</code>
                </div>
              </div>
            )}
          </div>

          <div className="project-meta">
            {project.meta.map((m) => (
              <div className="meta-row" key={m.key}>
                <span className="meta-key">{m.key}</span>
                <span className={`meta-val ${m.accent ? "accent" : ""}`}>
                  {m.live && <span className="status-dot" />}
                  {m.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [activePage, setActivePage] = useState("work");
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorExpanded, setCursorExpanded] = useState(false);
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let ringX = -100, ringY = -100;
    const onMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      ringX += (e.clientX - ringX) * 0.12;
      ringY += (e.clientY - ringY) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = ringX - 18 + "px";
        ringRef.current.style.top = ringY - 18 + "px";
      }
    };
    const raf = () => { requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseenter", (e) => {
      if (e.target.matches("a,button,.project-header,.contact-link,.btn-primary,.btn-secondary")) {
        setCursorExpanded(true);
      } else {
        setCursorExpanded(false);
      }
    }, true);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  // Fade-in observer
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActivePage(id);
  };

  return (
    <>
      <style>{styles}</style>

      {/* Cursor */}
      <div
        className="cursor"
        style={{ left: cursorPos.x - 5, top: cursorPos.y - 5 }}
      />
      <div
        ref={ringRef}
        className={`cursor-ring ${cursorExpanded ? "expanded" : ""}`}
      />

      {/* Nav */}
      <nav className={scrolled ? "scrolled" : ""}>
        <a href="#hero" className="nav-logo" onClick={(e) => { e.preventDefault(); scrollTo("hero"); }}>
          Port<span>.</span>
        </a>
        <div className="nav-links">
          {["work", "about"].map((p) => (
            <button
              key={p}
              className={activePage === p ? "active" : ""}
              onClick={() => scrollTo(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero" style={{ minHeight: "100vh" }}>
        <div className="hero-grid" />
        <div className="hero-eyebrow">Available for work</div>
        <h1 className="hero-title">
          <div>Building</div>
          <div className="line2">things that</div>
          <div><span className="accent">ship.</span></div>
        </h1>
        <div className="hero-bottom">
          <p className="hero-desc">
            Full-stack developer focused on product-quality execution.
            I build SaaS platforms, apps, and tools — from concept to
            live production.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-num">4+</div>
              <div className="stat-label">Years shipping</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">5</div>
              <div className="stat-label">Apps in production</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">2</div>
              <div className="stat-label">AI APIs integrated</div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">Scroll</div>
      </section>

      {/* WORK */}
      <section className="work" id="work">
        <div className="section-header fade-in">
          <span className="section-title">Selected Work</span>
          <span className="section-num">{PROJECTS.length} project{PROJECTS.length !== 1 ? "s" : ""}</span>
        </div>
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
        <div style={{ marginTop: 48, padding: "32px", border: "1px dashed var(--border)", borderRadius: "1px", textAlign: "center" }} className="fade-in">
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            More projects coming soon
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about" id="about">
        <div className="about-grid">
          <div className="fade-in">
            <h2 className="about-heading">
              About<br /><span>me.</span>
            </h2>
            <p className="about-text">
              I'm a full-stack developer who cares about shipping. I build production-ready
              products with modern stacks — fast, clean, and with real attention to UX detail.
            </p>
            <p className="about-text">
              I work at the intersection of frontend craft and backend systems — comfortable
              designing the UI, modeling the database, and deploying the infrastructure.
            </p>
          </div>
          <div className="fade-in" style={{ transitionDelay: "0.15s" }}>
            <div className="skills-grid">
              {[
                { title: "Frontend", skills: "React 18, Next.js 16\nTailwind CSS v4\nTypeScript / PWA" },
                { title: "Backend", skills: "Supabase (Postgres)\nEdge Functions (Deno)\nRLS + Auth" },
                { title: "Infra", skills: "Vercel\nSupabase Cloud\nCI / CD" },
                { title: "Integrations", skills: "Stripe payments\nResend / Web Push\nGitHub Actions" },
              ].map((s) => (
                <div key={s.title} className="skill-block">
                  <div className="skill-block-title">{s.title}</div>
                  <div className="skill-list" style={{ whiteSpace: "pre-line" }}>{s.skills}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2026 — Portfolio</p>
        <p>Built with React · Designed to ship</p>
      </footer>
    </>
  );
}
