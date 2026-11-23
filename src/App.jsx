import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f4f4f4;
    --bg2: #ffffff;
    --bg3: #efefef;
    --border: #e0e0e0;
    --border2: #c8c8c8;
    --text: #1a1a1a;
    --text2: #555555;
    --text3: #9a9a9a;
    --accent: #ff8200;
    --accent2: #ffc080;
    --card-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
    --card-shadow-hover: 0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06);
    --font-display: 'Plus Jakarta Sans', sans-serif;
    --font-mono: 'DM Sans', sans-serif;
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
    border: 1.5px solid rgba(255,130,0,0.45);
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
    padding: 24px 52px;
    border-bottom: 1px solid transparent;
    transition: border-color 0.3s, background 0.3s, backdrop-filter 0.3s;
  }
  nav.scrolled {
    border-color: var(--border);
    background: rgba(244,244,244,0.92);
    backdrop-filter: blur(14px);
  }
  .nav-logo {
    font-family: var(--font-mono);
    font-size: 34px; font-weight: 700; letter-spacing: -0.02em;
    text-decoration: none;
    display: flex; align-items: center; gap: 0;
    line-height: 1;
    padding: 8px 14px;
    border: 1.5px solid rgba(255,130,0,0.25);
    border-radius: 8px;
    background: rgba(255,130,0,0.04);
    transition: border-color 0.2s, background 0.2s;
  }
  .nav-logo:hover {
    border-color: rgba(255,130,0,0.55);
    background: rgba(255,130,0,0.08);
  }
  .nav-logo .logo-bracket { color: var(--accent); opacity: 0.7; font-size: 30px; }
  .nav-logo .logo-a { color: var(--text); }
  .nav-logo .logo-slash-mid { color: var(--accent); opacity: 0.85; font-size: 24px; margin: 0 2px; }
  .nav-logo .logo-power-t {
    display: inline-block;
    width: 34px; height: 43px;
    flex-shrink: 0;
    margin: 0 2px;
  }
  .nav-logo .logo-slash { color: var(--accent); opacity: 0.7; font-size: 30px; }
  .nav-links { display: flex; gap: 36px; }
  .nav-links button {
    background: none; border: none; color: var(--text3);
    font-family: var(--font-display); font-size: 13px; font-weight: 500;
    letter-spacing: 0.01em;
    cursor: none;
    transition: color 0.2s;
  }
  .nav-links button:hover { color: var(--text); }
  .nav-links button.active { color: var(--text); }

  /* HERO */
  section { min-height: 100vh; }
  .hero {
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 0 52px 88px;
    position: relative; overflow: hidden;
    min-height: 100vh;
  }
  .hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,130,0,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,130,0,0.04) 1px, transparent 1px);
    background-size: 80px 80px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
  }
  .hero-power-t {
    position: absolute; right: -60px; top: 50%;
    transform: translateY(-50%);
    width: clamp(320px, 42vw, 680px);
    opacity: 0.06;
    pointer-events: none;
    user-select: none;
  }
  .hero-title {
    font-size: clamp(72px, 13vw, 200px);
    font-weight: 800; line-height: 0.88;
    letter-spacing: -0.04em;
    margin-bottom: 52px;
    position: relative; z-index: 1;
  }
  .hero-title .line2 { color: var(--text2); }
  .hero-title .accent { color: var(--accent); }
  .hero-bottom {
    display: flex; align-items: flex-end; justify-content: space-between;
    gap: 32px; position: relative; z-index: 1;
  }
  .hero-desc {
    max-width: 480px;
    font-size: 16px; line-height: 1.75;
    color: var(--text2); font-weight: 400;
  }
  .hero-stats {
    display: flex; gap: 52px;
  }
  .stat-item { text-align: right; }
  .stat-num {
    font-size: 44px; font-weight: 800; letter-spacing: -0.04em;
    color: var(--text); line-height: 1;
  }
  .stat-label {
    font-size: 11px; letter-spacing: 0.06em;
    color: var(--text3); text-transform: uppercase; margin-top: 6px;
  }
  .scroll-indicator {
    position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em;
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

  /* ─── SKILLS ─── */
  .skills-section {
    padding: 120px 52px 140px;
    background: var(--bg2);
    min-height: auto;
  }
  .section-eyebrow {
    font-size: 11px; font-weight: 500; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--accent);
    margin-bottom: 20px;
  }
  .section-big-heading {
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 800; line-height: 0.95; letter-spacing: -0.03em;
    color: var(--text); margin-bottom: 48px;
  }
  .section-big-heading em { color: var(--text3); font-style: normal; }
  .skills-intro-text {
    font-size: 15px; line-height: 1.75; color: var(--text2);
    max-width: 520px; margin-bottom: 72px;
  }
  .skills-group {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 32px 64px;
    padding: 40px 0;
    border-top: 1px solid var(--border);
    align-items: start;
  }
  .skills-group:last-child { border-bottom: 1px solid var(--border); }
  .skill-group-label {
    font-size: 13px; font-weight: 700; letter-spacing: -0.01em;
    color: var(--text); padding-top: 4px;
  }
  .skill-group-label span {
    display: block; font-size: 11px; font-weight: 400;
    color: var(--text3); letter-spacing: 0.04em; margin-top: 6px;
  }
  .skill-pills {
    display: flex; flex-wrap: wrap; gap: 10px; align-items: center;
  }
  .skill-pill {
    font-size: 13px; font-weight: 500; letter-spacing: -0.01em;
    padding: 7px 16px; border-radius: 100px;
    background: var(--bg3); color: var(--text2);
    transition: background 0.2s, color 0.2s;
  }
  .skill-pill.primary {
    background: var(--accent); color: #fff;
    font-weight: 600;
  }

  /* ─── WORK ─── */
  .work { padding: 120px 52px 80px; min-height: auto; background: var(--bg); }
  .work-header { margin-bottom: 64px; }

  /* PROJECT CARD */
  .project-card {
    background: var(--bg2);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 16px;
    cursor: none;
    box-shadow: var(--card-shadow);
    transition: box-shadow 0.3s ease, transform 0.25s ease;
  }
  /* Stripe: name text cycles grey → orange → black */

  .project-card:hover { box-shadow: var(--card-shadow-hover); }
  .project-card.expanded {
    box-shadow: 0 0 0 2px rgba(255,130,0,0.6), var(--card-shadow-hover);
  }

  .project-header {
    display: grid;
    grid-template-columns: 52px 1fr auto auto;
    align-items: center;
    gap: 20px;
    padding: 28px 32px;
    cursor: none;
  }
  .project-num {
    font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
    color: var(--accent); opacity: 0.7;
  }

  .project-name-wrap {}
  .project-name {
    font-size: 22px; font-weight: 700; letter-spacing: -0.025em;
    margin-bottom: 5px; color: var(--text);
    transition: color 0.2s;
  }
  /* Alternating name text colors */
  .stripe-grey .project-name { color: var(--text2); }
  .stripe-orange .project-name { color: var(--accent); }
  .stripe-black .project-name { color: #1a1a1a; }
  .project-card:hover .project-name { opacity: 0.75; }

  .project-tagline {
    font-size: 13px; color: var(--text2); line-height: 1.4; font-weight: 400;
  }

  .project-tags {
    display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end;
  }
  .tag {
    font-size: 11px; font-weight: 500; letter-spacing: 0.01em;
    color: var(--text3); padding: 4px 12px;
    background: var(--bg3); border-radius: 100px;
    transition: color 0.2s, background 0.2s;
  }
  .project-card.expanded .tag { background: rgba(255,130,0,0.1); color: var(--accent); }

  .expand-icon {
    font-size: 22px; color: var(--text3);
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), color 0.2s;
    width: 28px; text-align: center; font-weight: 300; line-height: 1;
  }
  .project-card.expanded .expand-icon { transform: rotate(45deg); color: var(--accent); }

  /* Expanded content */
  .project-body {
    max-height: 0; overflow: hidden;
    transition: max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .project-body.open { max-height: 1200px; }
  .project-body-inner {
    padding: 0 32px 40px 32px;
    border-top: 1px solid var(--border);
    display: grid;
    grid-template-columns: 1fr 260px;
    gap: 48px;
  }
  .project-desc {
    font-size: 14px; line-height: 1.8; color: var(--text2);
    margin-top: 32px; margin-bottom: 24px;
  }
  .project-highlights { list-style: none; }
  .project-highlights li {
    font-size: 13px; line-height: 1.7; color: var(--text2);
    padding: 10px 0; border-bottom: 1px solid var(--border);
    display: flex; gap: 14px; align-items: flex-start;
  }
  .project-highlights li:last-child { border-bottom: none; }
  .project-highlights li::before {
    content: '→'; color: var(--accent); flex-shrink: 0; font-weight: 600;
  }
  .project-links { margin-top: 28px; display: flex; gap: 12px; }
  .project-embed { margin-top: 28px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); background: #000; position: relative; }
  .project-embed iframe { display: block; width: 100%; height: 480px; border: none; }
  .project-embed-label { font-size: 11px; color: var(--text-muted); padding: 8px 12px; border-top: 1px solid var(--border); letter-spacing: 0.05em; text-transform: uppercase; }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--accent); color: #fff;
    font-family: var(--font-display); font-size: 13px; font-weight: 600;
    letter-spacing: -0.01em;
    padding: 11px 22px; border-radius: 100px;
    text-decoration: none; cursor: none;
    border: none;
    transition: opacity 0.2s, transform 0.15s;
  }
  .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
  .btn-secondary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--bg3); color: var(--text2);
    font-family: var(--font-display); font-size: 13px; font-weight: 500;
    letter-spacing: -0.01em;
    padding: 11px 22px; border-radius: 100px;
    text-decoration: none; cursor: none;
    border: none;
    transition: background 0.2s, color 0.2s;
  }
  .btn-secondary:hover { background: var(--border2); color: var(--text); }

  .project-meta { margin-top: 32px; }
  .meta-group-label {
    font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--text3);
    margin-bottom: 16px;
  }
  .meta-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 9px 0; border-bottom: 1px solid var(--border);
  }
  .meta-key { font-size: 12px; font-weight: 500; color: var(--text3); }
  .meta-val { font-size: 12px; font-weight: 600; color: var(--text2); text-align: right; }
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

  /* ─── ABOUT ─── */
  .about { padding: 120px 52px 120px; background: var(--bg3); min-height: auto; }
  .about-inner {
    max-width: 1100px;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 96px; align-items: start;
  }
  .about-heading {
    font-size: clamp(40px, 5vw, 68px);
    font-weight: 800; line-height: 0.95; letter-spacing: -0.04em;
    margin-bottom: 36px;
  }
  .about-heading span { color: var(--accent); }
  .about-text {
    font-size: 15px; line-height: 1.8; color: var(--text2); margin-bottom: 20px;
  }
  .contact-block { margin-top: 44px; }
  .contact-email-label {
    font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--text3); margin-bottom: 10px;
  }
  .contact-email-link {
    font-size: 20px; font-weight: 700; letter-spacing: -0.02em;
    color: var(--text); text-decoration: none;
    border-bottom: 2px solid var(--accent);
    transition: color 0.2s;
  }
  .contact-email-link:hover { color: var(--accent); }

  /* Experience list */
  .exp-list { list-style: none; margin-top: 0; }
  .exp-item {
    padding: 20px 0;
    border-bottom: 1px solid var(--border2);
    display: flex; justify-content: space-between; align-items: baseline; gap: 16px;
  }
  .exp-item:first-child { border-top: 1px solid var(--border2); }
  .exp-role {
    font-size: 15px; font-weight: 600; letter-spacing: -0.01em; color: var(--text);
  }
  .exp-dates {
    font-size: 12px; font-weight: 500; color: var(--accent);
    white-space: nowrap;
  }
  .exp-tags {
    display: flex; flex-wrap: wrap; gap: 8px; margin-top: 24px;
  }
  .exp-tag {
    font-family: var(--font-mono);
    font-size: 11px; font-weight: 500; letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 5px 10px;
    border: 1px solid var(--border2);
    border-radius: 20px;
    color: var(--text3);
    background: transparent;
    transition: border-color 0.2s, color 0.2s;
  }
  .exp-tag:hover { border-color: var(--accent); color: var(--accent); }

  /* DEMO CREDENTIALS */
  .demo-creds {
    margin-top: 20px;
    border-radius: 12px;
    overflow: hidden;
    background: rgba(255,130,0,0.06);
    border: 1px solid rgba(255,130,0,0.2);
  }
  .demo-creds-label {
    font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--accent);
    padding: 10px 16px;
    border-bottom: 1px solid rgba(255,130,0,0.12);
    display: flex; align-items: center; gap: 8px;
  }
  .demo-creds-row {
    display: flex; align-items: center; gap: 12px;
    padding: 8px 16px; border-bottom: 1px solid rgba(255,130,0,0.08);
  }
  .demo-creds-row:last-child { border-bottom: none; }
  .demo-key {
    font-size: 10px; font-weight: 600; color: var(--text3);
    letter-spacing: 0.08em; text-transform: uppercase; width: 64px; flex-shrink: 0;
  }
  .demo-val {
    font-size: 12px; color: var(--text); letter-spacing: 0.03em;
    background: rgba(255,255,255,0.5); padding: 2px 8px; border-radius: 4px;
    user-select: all;
  }

  /* Fade-in */
  .fade-in { opacity: 0; transform: translateY(14px); transition: opacity 0.4s ease, transform 0.4s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }

  /* FOOTER */
  footer {
    padding: 32px 52px;
    border-top: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
    background: var(--bg2);
  }
  footer p {
    font-size: 12px; font-weight: 500; color: var(--text3); letter-spacing: 0.03em;
  }

  /* More projects note */
  .more-projects-note {
    margin-top: 40px; padding: 28px 32px;
    background: var(--bg2); border-radius: 12px;
    text-align: center;
    box-shadow: var(--card-shadow);
  }
  .more-projects-note p {
    font-size: 13px; color: var(--text3); letter-spacing: 0.04em;
  }

  @media (max-width: 900px) {
    .skills-group { grid-template-columns: 1fr; gap: 16px; }
  }
  /* B2B TOOLS */
  .b2b-section {
    padding: 120px 52px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .b2b-header { margin-bottom: 72px; }
  .b2b-category { margin-bottom: 64px; }
  .b2b-category-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--accent);
    margin-bottom: 24px;
    display: flex; align-items: center; gap: 12px;
  }
  .b2b-category-label::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, var(--border2), transparent);
  }
  .b2b-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1px;
    background: var(--border);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  }
  .b2b-card {
    display: flex;
    flex-direction: column;
    background: var(--bg2);
    padding: 28px 28px 24px;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    text-align: left;
    border: none;
    transition: background 0.18s;
    position: relative;
    overflow: hidden;
  }
  .b2b-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20% 20%, rgba(255,130,0,0.06) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.25s;
  }
  .b2b-card:hover { background: var(--bg3); }
  .b2b-card:hover::before { opacity: 1; }
  .b2b-card-top {
    display: flex; align-items: flex-start; gap: 14px;
    margin-bottom: 12px;
  }
  .b2b-glyph-wrap {
    width: 36px; height: 36px;
    border-radius: 8px;
    background: rgba(255,130,0,0.1);
    border: 1px solid rgba(255,130,0,0.2);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 17px;
    color: var(--accent);
    transition: background 0.18s, border-color 0.18s;
  }
  .b2b-card:hover .b2b-glyph-wrap {
    background: rgba(255,130,0,0.18);
    border-color: rgba(255,130,0,0.4);
  }
  .b2b-card-name {
    font-size: 15px; font-weight: 700; color: var(--text);
    letter-spacing: -0.02em; padding-top: 6px;
  }
  .b2b-card-desc {
    font-size: 13px; color: var(--text3); line-height: 1.65;
    flex: 1;
  }
  .b2b-card-cta {
    display: inline-flex; align-items: center; gap: 6px;
    margin-top: 20px;
    font-size: 11px; font-weight: 700;
    color: var(--accent); letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.75;
    transition: opacity 0.15s, gap 0.15s;
  }
  .b2b-card:hover .b2b-card-cta { opacity: 1; gap: 10px; }

  @media (max-width: 768px) {
    nav { padding: 20px 24px; }
    .hero { padding: 0 24px 64px; }
    .hero-bottom { flex-direction: column; align-items: flex-start; }
    .hero-stats { gap: 32px; }
    .work, .about, .skills-section { padding: 80px 24px; }
    .b2b-section { padding: 80px 24px; }
    .project-header { grid-template-columns: 36px 1fr auto; gap: 14px; }
    .project-tags { display: none; }
    .project-body-inner { grid-template-columns: 1fr; }
    .about-inner { grid-template-columns: 1fr; gap: 48px; }
    footer { flex-direction: column; gap: 8px; text-align: center; }
    body { cursor: auto; }
    .cursor, .cursor-ring { display: none; }
  }

  /* ─── TOOL MODAL ─── */
  .tool-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(10,10,10,0.72);
    backdrop-filter: blur(6px);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: fadeOverlay 0.2s ease;
  }
  @keyframes fadeOverlay {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .tool-modal {
    background: var(--bg2);
    border-radius: 20px;
    width: 100%; max-width: 860px;
    max-height: 88vh;
    overflow: hidden;
    display: flex; flex-direction: column;
    box-shadow: 0 32px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,130,0,0.2);
    animation: slideModal 0.25s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes slideModal {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .tool-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 28px 20px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .tool-modal-title-block { display: flex; align-items: center; gap: 14px; }
  .tool-modal-glyph {
    font-size: 22px; color: var(--accent);
    width: 44px; height: 44px;
    background: rgba(255,130,0,0.1);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
  }
  .tool-modal-name {
    font-size: 18px; font-weight: 700; letter-spacing: -0.02em; color: var(--text);
  }
  .tool-modal-category {
    font-size: 11px; font-weight: 500; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--text3);
    margin-top: 2px;
  }
  .tool-modal-close {
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--bg3); border: none;
    font-size: 18px; color: var(--text3);
    display: flex; align-items: center; justify-content: center;
    cursor: none; transition: background 0.2s, color 0.2s;
  }
  .tool-modal-close:hover { background: var(--border2); color: var(--text); }
  .tool-modal-body {
    overflow-y: auto; flex: 1; min-height: 0;
    padding: 28px;
  }
  /* Form styles */
  .tool-form { display: flex; flex-direction: column; gap: 16px; }
  .tool-field { display: flex; flex-direction: column; gap: 6px; }
  .tool-label {
    font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
    text-transform: uppercase; color: var(--text3);
  }
  .tool-input, .tool-textarea, .tool-select {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 11px 14px;
    font-family: var(--font-display); font-size: 14px; color: var(--text);
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    cursor: none;
  }
  .tool-input:focus, .tool-textarea:focus, .tool-select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(255,130,0,0.12);
  }
  .tool-textarea { resize: vertical; min-height: 90px; line-height: 1.6; }
  .tool-select { appearance: none; }
  .tool-actions {
    display: flex; gap: 10px; margin-top: 4px;
  }
  .tool-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--accent); color: #fff;
    font-family: var(--font-display); font-size: 13px; font-weight: 600;
    padding: 11px 22px; border-radius: 100px; border: none;
    cursor: none; transition: opacity 0.2s;
  }
  .tool-btn-primary:hover { opacity: 0.88; }
  .tool-spinner { width: 36px; height: 36px; border: 3px solid rgba(255,255,255,0.15); border-top-color: #a78bfa; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); }}
  .tool-btn-secondary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--bg3); color: var(--text2);
    font-family: var(--font-display); font-size: 13px; font-weight: 500;
    padding: 11px 22px; border-radius: 100px; border: none;
    cursor: none; transition: background 0.2s;
  }
  .tool-btn-secondary:hover { background: var(--border2); }
  /* Result pane */
  .tool-result { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .result-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
    color: var(--text3); background: none; border: none; cursor: none;
    margin-bottom: 24px; padding: 0; transition: color 0.2s;
  }
  .result-back:hover { color: var(--accent); }
  .result-section { margin-bottom: 28px; }
  .result-section-title {
    font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 12px;
  }
  .result-card {
    background: var(--bg3); border-radius: 12px; padding: 16px 20px;
    border: 1px solid var(--border);
  }
  .result-text {
    font-size: 14px; line-height: 1.7; color: var(--text2);
  }
  .result-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 0; border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .result-row:last-child { border-bottom: none; }
  .result-row-key { color: var(--text3); font-weight: 500; }
  .result-row-val { color: var(--text); font-weight: 600; text-align: right; max-width: 60%; }
  .result-pill {
    display: inline-block; padding: 3px 10px; border-radius: 100px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.03em;
  }
  .result-pill.green { background: rgba(34,197,94,0.15); color: #16a34a; }
  .result-pill.amber { background: rgba(245,158,11,0.15); color: #d97706; }
  .result-pill.red { background: rgba(239,68,68,0.15); color: #dc2626; }
  .result-pill.blue { background: rgba(59,130,246,0.15); color: #2563eb; }
  .result-pill.orange { background: rgba(255,130,0,0.15); color: var(--accent); }
  .result-list { list-style: none; }
  .result-list li {
    font-size: 13px; line-height: 1.65; color: var(--text2);
    padding: 7px 0; border-bottom: 1px solid var(--border);
    display: flex; gap: 10px; align-items: flex-start;
  }
  .result-list li:last-child { border-bottom: none; }
  .result-list li::before { content: '→'; color: var(--accent); flex-shrink: 0; }
  .result-signal {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 9px 0; border-bottom: 1px solid var(--border); font-size: 13px; color: var(--text2);
  }
  .result-signal:last-child { border-bottom: none; }
  .signal-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
  .signal-dot.pos { background: #22c55e; }
  .signal-dot.risk { background: #f59e0b; }
  /* Win probability gauge */
  .gauge-wrap { display: flex; flex-direction: column; align-items: center; padding: 8px 0 4px; }
  .gauge-pct {
    font-size: 52px; font-weight: 800; letter-spacing: -0.04em; color: var(--text); line-height: 1;
  }
  .gauge-label { font-size: 11px; color: var(--text3); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 4px; }
  /* Priority tags */
  .priority-high { color: #dc2626; }
  .priority-medium { color: #d97706; }
  .priority-low { color: #16a34a; }
  .action-card {
    background: var(--bg3); border-radius: 10px; padding: 14px 16px;
    border-left: 3px solid var(--border2); margin-bottom: 10px;
    border: 1px solid var(--border);
  }
  .action-card.high { border-left-color: #dc2626; }
  .action-card.medium { border-left-color: #d97706; }
  .action-card.low { border-left-color: #22c55e; }
  .action-card-title { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
  .action-card-rationale { font-size: 12px; color: var(--text3); line-height: 1.5; }
  /* Pricing tiers */
  .pricing-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
  .pricing-tier {
    background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; padding: 16px;
    position: relative;
  }
  .pricing-tier.recommended { border-color: var(--accent); }
  .pricing-rec-badge {
    position: absolute; top: -10px; left: 50%; transform: translateX(-50%);
    background: var(--accent); color: #fff;
    font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    padding: 3px 10px; border-radius: 100px;
  }
  .tier-name { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .tier-price { font-size: 22px; font-weight: 800; color: var(--accent); letter-spacing: -0.03em; }
  .tier-cadence { font-size: 11px; color: var(--text3); }
  .tier-best-for { font-size: 11px; color: var(--text2); margin: 8px 0; font-style: italic; }
  .tier-features { list-style: none; }
  .tier-features li { font-size: 12px; color: var(--text2); padding: 3px 0; display: flex; gap: 6px; }
  .tier-features li::before { content: '✓'; color: var(--accent); font-weight: 700; }
  /* Objections accordion */
  .objection-item {
    border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 8px;
  }
  .objection-q {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 16px; font-size: 13px; font-weight: 600; color: var(--text);
    cursor: none; background: var(--bg3);
  }
  .objection-a {
    padding: 12px 16px; font-size: 13px; color: var(--text2); line-height: 1.6;
    border-top: 1px solid var(--border); background: var(--bg2);
  }
  /* Timeline */
  .timeline-item {
    display: flex; gap: 16px; padding-bottom: 20px;
    position: relative;
  }
  .timeline-item::before {
    content: ''; position: absolute; left: 15px; top: 28px; bottom: 0;
    width: 1px; background: var(--border);
  }
  .timeline-item:last-child::before { display: none; }
  .timeline-dot {
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(255,130,0,0.12); border: 2px solid var(--accent);
    flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: var(--accent);
  }
  .timeline-content { padding-top: 4px; }
  .timeline-phase { font-size: 13px; font-weight: 700; color: var(--text); }
  .timeline-duration { font-size: 11px; color: var(--accent); font-weight: 600; margin: 2px 0; }
  .timeline-detail { font-size: 12px; color: var(--text3); line-height: 1.5; }
  /* ROI block */
  .roi-headline {
    font-size: 20px; font-weight: 800; color: var(--accent); letter-spacing: -0.02em;
    margin-bottom: 12px;
  }
  /* Ticket triage */
  .ticket-card {
    background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; padding: 16px;
    margin-bottom: 10px;
  }
  .ticket-meta { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; flex-wrap: wrap; }
  .ticket-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
  .ticket-draft {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 8px;
    padding: 12px; font-size: 12px; color: var(--text2); line-height: 1.6;
    margin-top: 10px; white-space: pre-wrap;
  }
  /* Speaker cards */
  .speaker-card {
    background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; padding: 12px 16px;
    margin-bottom: 8px;
  }
  .speaker-name { font-size: 12px; font-weight: 700; color: var(--text); letter-spacing: 0.04em; text-transform: uppercase; }
  .speaker-sentiment { font-size: 12px; color: var(--text3); margin-top: 2px; }
  /* Content cards */
  .content-channel-card {
    background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; padding: 16px 18px;
    margin-bottom: 12px;
  }
  .content-channel-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 8px;
  }
  .content-body { font-size: 13px; color: var(--text2); line-height: 1.65; }
  /* Budget variance */
  .variance-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .variance-table th {
    text-align: left; font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--text3); padding: 6px 10px;
    border-bottom: 1px solid var(--border);
  }
  .variance-table td { padding: 10px 10px; border-bottom: 1px solid var(--border); color: var(--text2); }
  .variance-table tr:last-child td { border-bottom: none; }
  .over { color: #dc2626; font-weight: 600; }
  .under { color: #16a34a; font-weight: 600; }
  /* SOP steps */
  .sop-step {
    display: flex; gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--border);
  }
  .sop-step:last-child { border-bottom: none; }
  .sop-step-num {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--accent); color: #fff;
    font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .sop-step-content { flex: 1; }
  .sop-step-title { font-size: 13px; font-weight: 600; color: var(--text); }
  .sop-step-detail { font-size: 12px; color: var(--text3); line-height: 1.5; margin-top: 3px; }
  /* SWOT grid */
  .swot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .swot-cell {
    background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; padding: 14px;
  }
  .swot-cell-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 8px;
  }
  .swot-cell ul { list-style: none; }
  .swot-cell ul li { font-size: 12px; color: var(--text2); padding: 3px 0; display: flex; gap: 6px; }
  .swot-cell ul li::before { content: '•'; color: var(--accent); }
`;


const SKILL_GROUPS = [
  {
    title: "AI & Automation",
    sub: "Shipped in client & own products",
    skills: [
      { name: "Claude API", primary: true },
      { name: "OpenAI API", primary: true },
      { name: "Airtable Automations", primary: true },
      { name: "Airtable Scripting (JS)" },
      { name: "Zapier" },
      { name: "Power Automate" },
      { name: "Smartsheet Automations" },
    ],
  },
  {
    title: "Full-Stack Dev",
    sub: "Production apps in use today",
    skills: [
      { name: "Next.js / React", primary: true },
      { name: "TypeScript", primary: true },
      { name: "Supabase + PostgreSQL", primary: true },
      { name: "Tailwind CSS" },
      { name: "Vercel" },
      { name: "Supabase Edge Functions" },
      { name: "Row-Level Security (RLS)" },
    ],
  },
  {
    title: "Data & Analytics",
    sub: "Employer & client environments",
    skills: [
      { name: "Power BI", primary: true },
      { name: "SQL", primary: true },
      { name: "GA4 / Google Analytics" },
      { name: "KPI Dashboard Design" },
      { name: "Excel / VBA" },
      { name: "Azure DevOps" },
      { name: "Data Validation & QA" },
    ],
  },
  {
    title: "Platforms & Infra",
    sub: "Integrated across live projects",
    skills: [
      { name: "Airtable", primary: true },
      { name: "Stripe (Payments)" },
      { name: "Resend / Web Push" },
      { name: "GitHub Actions / CI-CD" },
      { name: "AWS" },
      { name: "Azure" },
      { name: "Smartsheet" },
    ],
  },
];

const PROJECTS = [
  {
    id: 1,
    num: "01",
    name: "AdvisoryCloud 3.0",
    tagline: "Full platform rebuild of advisorycloud.com — Digital Boardroom, AI-powered board opportunities, and full Recurly billing",
    tags: ["React + Vite", "Supabase", "Claude AI", "Recurly", "Next.js"],
    description:
      "Complete ground-up rebuild of advisorycloud.com: a Digital Boardroom SaaS connecting executives with corporate advisory boards. 687 commits, ~50 database migrations, 24 serverless API endpoints, 15 Supabase edge functions, and 75+ product screens — including a Board Opportunities Engine that runs a weekly Federal Register pipeline through Claude AI to generate tiered board listings.",
    highlights: [
      "Built the full Digital Boardroom: board creation, member lifecycle management, 1:1 and group messaging, advisor directory, match scoring, and an AI assistant",
      "Board Opportunities Engine: weekly pipeline ingests Federal Register postings, feeds them through Claude AI to write listings, and gates access by membership tier",
      "Full Recurly billing integration — hosted checkout, webhooks, plan sync, Apple Pay, and self-serve cancel flow",
      "SEO-optimized public advisor directory: ~2,366 statically generated pages via Next.js 16 with Cloudflare Worker routing",
      "PWA with Capacitor for native iOS/Android packaging; PostHog analytics and Resend transactional email wired throughout",
      "Supabase backend with Row-Level Security, auth hardening, XSS/CORS lockdown, and webhook signature verification",
      "GitHub Actions CI/CD with ~50 Postgres migrations; legacy member migration and onboarding re-engagement campaigns",
    ],
    meta: [
      { key: "Type", val: "SaaS Platform Rebuild" },
      { key: "Stack", val: "React + Vite + Supabase" },
      { key: "AI", val: "Claude API", accent: true },
      { key: "Billing", val: "Recurly" },
      { key: "Commits", val: "687", live: true },
      { key: "Screens", val: "75+" },
    ],
    liveUrl: "https://advisorycloud.com",
    githubUrl: null,
    demo: null,
  },
  {
    id: 2,
    num: "02",
    name: "CallCatch AI",
    tagline: "AI phone agent SaaS for home service businesses — 24/7 call answering and lead capture",
    tags: ["Next.js", "TypeScript", "Retell AI", "Supabase", "Stripe"],
    description:
      "An AI receptionist SaaS built for HVAC, plumbing, electrical, and roofing contractors. The AI agent answers every call in under a second, qualifies the lead, and books the job around the clock. 6 paying clients generating ~$10K ARR.",
    highlights: [
      "Integrated Retell AI for sub-second call pickup with natural voice conversations and lead qualification",
      "Built a full-featured dispatch console dashboard — active calls, lead feed, booking calendar, job notes",
      "Stripe billing with tiered plans ($120–$250/mo), usage metering, and a self-serve portal",
      "Supabase backend with Row-Level Security — each business only sees their own calls and leads",
      "Resend transactional email for call summaries, booking confirmations, and lead alerts",
      "Mapbox integration for service area visualization and coverage zone setup",
      "Webhook architecture routes Retell events to real-time dashboard updates via Supabase Realtime",
    ],
    meta: [
      { key: "Type", val: "SaaS / AI Voice" },
      { key: "Stack", val: "Next.js 14 + TypeScript" },
      { key: "AI", val: "Retell AI", accent: true },
      { key: "Backend", val: "Supabase + PostgreSQL" },
      { key: "Payments", val: "Stripe" },
      { key: "Revenue", val: "~$10K ARR", live: true },
    ],
    liveUrl: "https://callcatchai.com",
    githubUrl: null,
    demo: null,
  },
  {
    id: 3,
    num: "03",
    name: "HerSoftEra",
    tagline: "Women's life management platform — budgeting, wellness, goals, and social planning",
    tags: ["Next.js", "TypeScript", "Tailwind", "Supabase", "Stripe"],
    description:
      "A subscription platform built for women managing every dimension of their life in one place. Zero-based budgeting, mood and wellness tracking, goal setting, and social circle planning. 12,000+ active users, $4.2M in finances tracked, and 92% six-month retention.",
    highlights: [
      "Built the full marketing site and app in Next.js (App Router) with React 19 and Tailwind CSS v4",
      "Content architecture centralizes all copy, products, and freebies in a single site.ts config file",
      "Kit (ConvertKit) email integration delivers free planners and drives subscriber growth",
      "Supabase backend planned for subscriber storage and product catalog management",
      "Stripe integration for paid tier access to the full template and tool suite",
      "Editorial brand system — warm, aesthetic design language tuned for the target audience",
      "12,000+ users and $4.2M tracked; 92% retention at six months",
    ],
    meta: [
      { key: "Type", val: "SaaS / Consumer App" },
      { key: "Stack", val: "Next.js + React 19" },
      { key: "Styling", val: "Tailwind CSS v4" },
      { key: "Email", val: "Kit (ConvertKit)", accent: true },
      { key: "Users", val: "12,000+", live: true },
    ],
    liveUrl: "https://hersoftera.app",
    githubUrl: null,
    demo: null,
  },
  {
    id: 4,
    num: "04",
    name: "PrimeLayer Solutions",
    tagline: "AI consulting agency — 13 live AI tools and dashboards demonstrating full-stack AI builds",
    tags: ["Next.js", "Claude API", "Airtable", "AI Agents", "Automation"],
    description:
      "Production website for an AI consulting practice. The site itself serves as a live portfolio of 13 working AI tools spanning workflow automation, custom AI applications, AI agents, data and RAG pipelines, lead generation, and strategic AI implementation.",
    highlights: [
      "Built and deployed 13 live AI tools covering automation, agents, RAG pipelines, and AI dashboards",
      "Integrated Claude API and OpenAI API across multiple client-facing tools and internal automations",
      "AI workflow automation replacing manual multi-step processes with zero-touch pipelines",
      "Custom AI apps built on Airtable, Zapier, Make.com, and edge functions",
      "Data and RAG systems for document ingestion, semantic search, and AI-assisted retrieval",
      "AI lead generation tools with enrichment, scoring, and CRM sync built in",
      "AI strategy consulting — roadmaps, build-vs-buy analysis, and implementation oversight",
    ],
    meta: [
      { key: "Type", val: "Agency / AI Tools" },
      { key: "AI Stack", val: "Claude + OpenAI", accent: true },
      { key: "Platforms", val: "Airtable, Make, Zapier" },
      { key: "Tools Live", val: "13", live: true },
    ],
    liveUrl: "https://primelayer.solutions",
    githubUrl: null,
    demo: null,
  },
  {
    id: 5,
    num: "05",
    name: "IdealFitness Hub",
    tagline: "Gym operations platform — trainer and client management, scheduling, and messaging",
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind", "RLS"],
    description:
      "A full-stack gym operations hub for personal trainers and their clients. Handles scheduling, session tracking, progress logging, 1:1 messaging, and gym-wide announcements — with role-based access enforced at the database level via Row-Level Security.",
    highlights: [
      "Role-aware auth system — trainers get operations surface, clients get their own view, no overlap",
      "Calendar and booking engine: trainers mark sessions completed/no-show/cancelled; clients can cancel",
      "Client management roster with profile views, session history, and progress logs (weight, body fat, notes)",
      "1:1 messaging between trainers and clients with unread badges and real-time updates",
      "Gym-wide announcements authored by trainers, visible to all clients",
      "Row-Level Security policies across every table — users only see and modify their own data",
      "Full data model: profiles, trainer_clients, availability, sessions, messages, announcements, progress",
    ],
    meta: [
      { key: "Type", val: "B2B SaaS / Fitness" },
      { key: "Stack", val: "Next.js (App Router)" },
      { key: "Backend", val: "Supabase + PostgreSQL" },
      { key: "Auth", val: "Supabase Auth", accent: true },
      { key: "Security", val: "Row-Level Security", live: true },
    ],
    liveUrl: null,
    githubUrl: null,
    demo: null,
  },
  {
    id: 6,
    num: "06",
    name: "PrimeLayer Trades",
    tagline: "Algorithmic trading SaaS — rule-based strategies with Alpaca and Coinbase broker integration",
    tags: ["Next.js", "TypeScript", "Supabase Vault", "Alpaca", "Coinbase"],
    description:
      "A 24/7 algorithmic trading agent that executes rule-based strategies across US equities and crypto. Ships with RSI mean-reversion and SMA crossover strategies, a full backtester, and a paper-to-live promotion pipeline. Supabase Vault stores all broker credentials encrypted at rest.",
    highlights: [
      "Broker abstraction layer supports Alpaca (stocks + crypto) and Coinbase (Advanced Trade) via one interface",
      "Two built-in strategies: RSI mean-reversion and SMA crossover — adding a new strategy is ~30 lines",
      "Risk engine gates every order: per-order notional cap, daily-loss auto-halt, kill switch, short-selling off",
      "Supabase Vault encrypts all API keys and broker secrets — never stored in plaintext",
      "Backtester validates strategies on historical data before promoting to paper or live",
      "Webhook + control server handles external signals (TradingView) and manual trade commands",
      "Watchlist config maps symbol → strategy → timeframe → params — edit and restart to change behavior",
    ],
    meta: [
      { key: "Type", val: "Algo Trading SaaS" },
      { key: "Stack", val: "Next.js + TypeScript" },
      { key: "Secrets", val: "Supabase Vault", accent: true },
      { key: "Brokers", val: "Alpaca + Coinbase" },
      { key: "Status", val: "Private Beta", live: true },
    ],
    liveUrl: "https://primelayertrades.com",
    githubUrl: null,
    demo: null,
  },
  {
    id: 7,
    num: "07",
    name: "Avail",
    tagline: "Personal finance app — connects bank accounts and calculates your real safe-to-spend number",
    tags: ["Next.js", "TypeScript", "Plaid", "Supabase", "Vercel"],
    description:
      "A personal finance app that connects directly to bank accounts via Plaid, then calculates a single 'safe to spend' number after automatically setting aside money for upcoming bills and savings goals. Removes the mental overhead of manual budget tracking.",
    highlights: [
      "Plaid integration for live bank account connection and real-time transaction ingestion",
      "Safe-to-spend calculation engine accounts for upcoming bills, recurring expenses, and savings targets",
      "Bills and goals management — set a due date and amount, the engine reserves it automatically",
      "Account aggregation across checking, savings, and linked accounts for a unified balance view",
      "Built on Next.js with Supabase backend and Vercel deployment",
      "Waitlist and early-access flow built into the landing page",
    ],
    meta: [
      { key: "Type", val: "Consumer Fintech" },
      { key: "Stack", val: "Next.js + TypeScript" },
      { key: "Banking", val: "Plaid API", accent: true },
      { key: "Backend", val: "Supabase" },
      { key: "Status", val: "Waitlist Open", live: true },
    ],
    liveUrl: "https://getavail.vercel.app",
    githubUrl: null,
    demo: null,
  },
  {
    id: 8,
    num: "08",
    name: "Cedar & Salt",
    tagline: "Artisan BBQ brand — provisions, smokehouse menu, and catering for a local food business",
    tags: ["Next.js", "TypeScript", "Tailwind", "Vercel", "E-Commerce"],
    description:
      "Production website for Cedar & Salt BBQ, an artisan food brand selling hot sauce, cultured butters, pickles, ferments, and smoked provisions. Multi-page site covers the full product catalog, smokehouse menu, and catering inquiry flow.",
    highlights: [
      "Multi-page Next.js site covering provisions shop, smokehouse menu, catering, and brand story",
      "Provisions catalog with product photography, descriptions, and e-commerce ordering",
      "Catering inquiry form with event type, guest count, and date selection",
      "Brand identity design — warm, tactile aesthetic reflecting handcrafted food production",
      "Deployed on Vercel with automatic preview deployments on every push",
      "Optimized for local SEO and mobile-first browsing",
    ],
    meta: [
      { key: "Type", val: "Brand / E-Commerce" },
      { key: "Stack", val: "Next.js + TypeScript" },
      { key: "Styling", val: "Tailwind CSS", accent: true },
      { key: "Deploy", val: "Vercel" },
      { key: "Status", val: "Live", live: true },
    ],
    liveUrl: "https://cedar-and-salt.vercel.app",
    githubUrl: null,
    demo: null,
  },
];

const STRIPES = ["stripe-grey", "stripe-orange", "stripe-black"];

function ProjectCard({ project, index }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef(null);
  const stripe = STRIPES[index % 3];

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`project-card fade-in ${stripe} ${open ? "expanded" : ""} ${visible ? "visible" : ""}`}
      style={{ transitionDelay: `${index * 0.05}s` }}
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
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  View Live ↗
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                  GitHub →
                </a>
              )}
            </div>
            {project.liveUrl && (
              <div className="project-embed">
                <iframe src={project.liveUrl} title={project.name} loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms" />
                <div className="project-embed-label">{project.liveUrl.replace(/^https?:\/\//, "")}</div>
              </div>
            )}
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
            <div className="meta-group-label">Details</div>
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

const B2B_CATEGORIES = [
  {
    label: "Sales & Revenue",
    tools: [
      { glyph: "◆", name: "Deal Coach", desc: "Turn messy deal notes into a win probability, the next best moves, and an objection playbook.", path: "/deal-coach" },
      { glyph: "§", name: "Proposal Generator", desc: "A prospect and their pain points in — a tailored proposal with pricing tiers and ROI out.", path: "/proposal-generator" },
    ],
  },
  {
    label: "Customer Success",
    tools: [
      { glyph: "⚠", name: "Churn Risk Explainer", desc: "Score your book of accounts for churn risk, explain why, and draft a save email for each.", path: "/churn-explainer" },
      { glyph: "⛑", name: "Support Ticket Triage", desc: "Classify incoming tickets by urgency and sentiment, route them, and draft the reply instantly.", path: "/ticket-triage" },
    ],
  },
  {
    label: "Operations",
    tools: [
      { glyph: "◉", name: "Meeting Intelligence", desc: "Paste a transcript, get decisions, owned action items, sentiment by speaker, and a follow-up email.", path: "/meeting-intelligence" },
      { glyph: "≣", name: "SOP Generator", desc: "Describe a process, get a polished SOP with roles, numbered steps, edge cases, and metrics.", path: "/sop-generator" },
    ],
  },
  {
    label: "Marketing",
    tools: [
      { glyph: "◎", name: "Competitive Intelligence", desc: "A competitor in — a SWOT from your side, positioning gaps, a battlecard, and the wedge to win.", path: "/competitive-intel" },
      { glyph: "⇄", name: "Content Repurposer", desc: "One post becomes a LinkedIn post, an X thread, an email, ad copy, and hashtags — each channel-native.", path: "/content-repurposer" },
    ],
  },
  {
    label: "Finance & Strategy",
    tools: [
      { glyph: "Δ", name: "Budget Variance Analyst", desc: "Budget vs. actuals, with each variance explained in plain English an exec can act on.", path: "/budget-variance" },
      { glyph: "¶", name: "KPI Narrator", desc: "Raw KPIs become the board-ready paragraph a CEO would present — plus highlights, concerns, and asks.", path: "/kpi-narrator" },
    ],
  },
  {
    label: "Analytics Dashboards",
    tools: [
      { glyph: "▦", name: "Sales Pipeline", desc: "Live pipeline — stage funnel, weighted forecast, rep breakdown, and top open deals.", path: "/dashboards/pipeline" },
      { glyph: "◍", name: "Lead Generation", desc: "Acquisition by channel, the MQL to SQL funnel, conversion trend, and per-channel performance.", path: "/dashboards/leads" },
      { glyph: "◆", name: "Executive KPIs", desc: "Company health — ARR, MRR growth, retention, revenue by segment, and a goal tracker.", path: "/dashboards/kpi" },
    ],
  },
];

const TOOL_SAMPLES = {
  "Deal Coach": {
    summary: "Opportunity is active but stalled at the proposal stage. Champion has executive access, which is positive, but the lack of formal evaluation criteria and a silent economic buyer are significant risks. Prioritize getting written requirements and an executive sponsor meeting.",
    win_probability: 58,
    confidence: "medium",
    stage: "Proposal",
    health: "watch",
    signals: [
      { type: "positive", text: "Champion confirmed with executive access" },
      { type: "positive", text: "Competitor mentioned — buyer is actively evaluating" },
      { type: "risk", text: "No formal evaluation criteria shared" },
      { type: "risk", text: "Economic buyer has gone silent for 2 weeks" },
      { type: "neutral", text: "Legal review not yet initiated" },
    ],
    next_actions: [
      { action: "Schedule executive sponsor meeting within 5 days", rationale: "Silent economic buyer is the top stall risk; a direct touchpoint reactivates the deal.", priority: "high" },
      { action: "Send a written RFP / evaluation-criteria template", rationale: "No formal criteria means no way to win on paper — get the scorecard so you can fill it.", priority: "high" },
      { action: "Deliver a ROI summary tied to their Q3 cost-reduction goal", rationale: "Champion needs ammunition to sell internally; finance-framed ROI lands.", priority: "medium" },
    ],
    objections: [
      { objection: "We already have a solution that does most of this.", response: "Most solutions handle the core workflow. What they miss is the AI layer that cuts manual prep from 4 hours to 20 minutes — which is where your team's time is actually going. Can I show you the side-by-side?" },
      { objection: "The price is higher than what we budgeted.", response: "The budget was likely set before you scoped what manual effort costs. If we quantify just the analyst hours saved, the payback is typically under 90 days. Want me to run the numbers for your environment?" },
    ],
  },
  "Proposal Generator": {
    title: "Transforming Data Operations at Meridian Health Partners",
    prepared_for: "Meridian Health Partners — VP of Operations",
    executive_summary: "Meridian's operations team spends an estimated 1,200 analyst-hours per quarter on manual reporting that could be automated. This proposal outlines how a structured data platform rollout — phased over 90 days — reduces that burden by 70%, unlocks real-time visibility across all 14 facilities, and positions Meridian for the HL7 FHIR compliance deadline.",
    situation: "Current state: Excel-based reporting, no single source of truth, 3-day lag on operational KPIs, and a compliance deadline 6 months out that requires audit-ready data trails.",
    objectives: ["Eliminate manual reporting lag — weekly KPIs available same-day", "FHIR-compliant audit log across all facility data flows", "Self-serve dashboards for department heads with no IT dependency"],
    solution: [
      { name: "Data Platform Setup", description: "Supabase + dbt pipeline replacing the Excel reporting chain. Automated nightly refresh; historical data migrated." },
      { name: "Dashboard Layer", description: "Role-based Airtable interfaces for department heads; executive summary in Vercel-hosted Next.js app." },
      { name: "Compliance Module", description: "Audit log schema, row-level access controls, and FHIR export endpoint." },
    ],
    pricing_tiers: [
      { name: "Starter", price: "$4,800", cadence: "one-time", best_for: "1–2 departments, proof of concept", features: ["Core pipeline build", "2 Airtable interfaces", "30-day support"], recommended: false },
      { name: "Professional", price: "$11,500", cadence: "one-time", best_for: "Full facility rollout", features: ["Full pipeline + all dashboards", "FHIR compliance module", "Staff training (4 hrs)", "90-day support"], recommended: true },
      { name: "Enterprise", price: "$2,200", cadence: "per month", best_for: "Ongoing managed service", features: ["Everything in Professional", "Monthly iteration sprints", "Priority support SLA", "Quarterly business review"], recommended: false },
    ],
    roi: { headline: "Payback in under 60 days", annual_value: "$214,000", payback_period: "52 days", assumptions: ["Analyst hours saved: 1,200 / quarter × $45/hr", "Compliance penalty avoidance: estimated $80K risk", "Executive decision speed: 2 decisions/month unblocked"] },
    timeline: [
      { phase: "Discovery & Schema", duration: "Week 1–2", detail: "Audit existing data sources, define target schema, stakeholder interviews" },
      { phase: "Pipeline Build", duration: "Week 3–5", detail: "dbt models, Supabase setup, historical data migration" },
      { phase: "Dashboard Rollout", duration: "Week 6–8", detail: "Airtable interfaces per department, executive dashboard, UAT" },
      { phase: "Compliance & Training", duration: "Week 9–12", detail: "FHIR module, access controls, staff training, go-live" },
    ],
    differentiators: ["Built by a practitioner who has run this stack at 3 organizations — no learning curve", "Modular design: replace any layer later without rebuilding", "Fixed-fee — no scope creep surprises"],
    next_steps: ["Approve scope and sign engagement letter", "Provide read access to current data exports for discovery", "Confirm kickoff date — earliest availability: Dec 2"],
  },
  "Churn Risk Explainer": {
    accounts: [
      { name: "Brightline Logistics", score: 87, tier: "Enterprise", risk: "high", signals: ["No logins in 23 days", "Support ticket unresolved 11 days", "Champion left company"], save_email: "Hi Marcus,\n\nI noticed you haven't had a chance to log in recently and wanted to reach out personally. With the transition on your team, I want to make sure nothing falls through the cracks — especially with your Q4 reporting cycle coming up.\n\nCould we set up 20 minutes this week? I'll bring a quick health check and a roadmap of the new automation features your team was excited about.\n\n— Alex" },
      { name: "Oakwood Financial", score: 64, tier: "Mid-Market", risk: "medium", signals: ["Usage down 40% vs 90-day avg", "Downgraded seat count last month", "NPS score dropped to 6"], save_email: "Hi Jennifer,\n\nQuick note — I saw your team scaled back a few seats last month and wanted to check in. Sometimes that signals a workflow change; sometimes it means we're not solving the right problems.\n\nEither way, I'd love 15 minutes to hear what's working and what isn't. No agenda other than making sure you're getting value.\n\n— Alex" },
      { name: "Cascade Media", score: 31, tier: "SMB", risk: "low", signals: ["Logged in 3x this week", "Opened 4 feature emails", "Referred a colleague"], save_email: "Hi Dana,\n\nThanks for the referral to Sarah at Ridgeline — that means a lot and tells me things are going well. As a thank-you, I'd like to get you early access to our new content calendar integration before it goes GA.\n\nI'll send the invite today — let me know if you have questions!\n\n— Alex" },
    ],
  },
  "Support Ticket Triage": {
    tickets: [
      { id: "TKT-4421", urgency: "critical", sentiment: "frustrated", category: "Data Loss", route: "Tier 2 Engineering", customer: "Brightline Logistics", subject: "All dashboard data disappeared after update", draft: "Hi Marcus,\n\nThank you for flagging this immediately — I completely understand the urgency and I'm escalating this to our engineering team right now.\n\nI can confirm this is a known issue affecting a small number of accounts after last night's deployment. Our team has identified the root cause and is actively restoring data. You should see everything back within the next 2–4 hours.\n\nI'll personally follow up once your data is fully restored and walk you through what happened. You have my direct line if anything changes in the meantime.\n\nSincerely, Support Team" },
      { id: "TKT-4418", urgency: "high", sentiment: "confused", category: "Billing", route: "Billing Team", customer: "Oakwood Financial", subject: "Charged twice for the same invoice", draft: "Hi Jennifer,\n\nThank you for bringing this to our attention. I've reviewed your account and can confirm a duplicate charge was processed on Nov 15.\n\nI've initiated a full refund for the duplicate amount — you should see it back on your statement within 3–5 business days depending on your bank.\n\nI apologize for the confusion this caused. We've added a flag to your account to ensure it doesn't recur.\n\nBest, Billing Team" },
      { id: "TKT-4415", urgency: "low", sentiment: "neutral", category: "How-To", route: "Knowledge Base", customer: "Cascade Media", subject: "How do I export to CSV?", draft: "Hi Dana,\n\nGreat question! Exporting to CSV is straightforward:\n\n1. Open any table or view\n2. Click the ··· menu in the top-right corner\n3. Select Export → Download as CSV\n\nYou can also schedule automated exports under Settings → Integrations → Export Schedule.\n\nLet me know if you'd like a quick walkthrough — happy to jump on a 5-minute call!\n\nBest, Support Team" },
    ],
  },
  "Meeting Intelligence": {
    meeting_title: "Q4 Strategy Review — Nov 18, 2026",
    duration: "47 minutes",
    decisions: [
      "Approved $120K budget reallocation from print to digital channels for Q4",
      "Deferred the new CRM migration to Q1 2027 pending security review completion",
      "Greenlit the pilot of the AI reporting dashboard for the finance team",
    ],
    action_items: [
      { owner: "Sarah Chen", action: "Send revised budget breakdown to CFO by EOD Friday", due: "Nov 22" },
      { owner: "Marcus Webb", action: "Schedule security review kick-off with IT", due: "Nov 25" },
      { owner: "Alex Tobin", action: "Spin up dashboard pilot environment and invite finance team", due: "Nov 29" },
      { owner: "Jennifer Park", action: "Draft Q4 campaign brief using new digital allocation", due: "Dec 1" },
    ],
    speakers: [
      { name: "Sarah Chen", sentiment: "positive", key_point: "Strongly advocated for digital reallocation citing 3.2x ROAS on Q3 test campaigns" },
      { name: "Marcus Webb", sentiment: "cautious", key_point: "Raised security concerns about CRM migration timeline; requested additional review time" },
      { name: "Alex Tobin", sentiment: "positive", key_point: "Presented dashboard demo, fielded questions, committed to pilot timeline" },
    ],
    follow_up_email: "Subject: Q4 Strategy Review — Decisions & Next Steps\n\nTeam,\n\nThanks for a productive session. Here's what we aligned on:\n\n✅ DECISIONS\n• $120K reallocated from print to digital for Q4\n• CRM migration moved to Q1 2027 (security review pending)\n• AI dashboard pilot approved for finance team\n\n📋 ACTION ITEMS\n• Sarah → CFO budget breakdown by Nov 22\n• Marcus → IT security kick-off by Nov 25\n• Alex → Dashboard pilot live by Nov 29\n• Jennifer → Q4 campaign brief by Dec 1\n\nFull recording available on request. Reply with any corrections.\n\n— Alex",
  },
  "SOP Generator": {
    title: "SOP: Monthly Financial Close Process",
    version: "v1.0",
    owner: "Finance Team",
    frequency: "Monthly — first 3 business days",
    purpose: "Ensure accurate, timely financial reporting by standardizing the month-end close sequence across all departments.",
    steps: [
      { num: 1, title: "Freeze Transactions", detail: "By 5 PM on the last business day of the month, notify all department heads to submit final expense reports and purchase orders. Lock the ERP system for new entries.", role: "Controller", duration: "30 min" },
      { num: 2, title: "Reconcile Bank Statements", detail: "Download statements from all 3 bank accounts. Match each transaction to the GL. Flag unmatched items in the reconciliation sheet (Tab: 'Exceptions') for review.", role: "Staff Accountant", duration: "2 hrs" },
      { num: 3, title: "Review AR Aging", detail: "Pull AR aging report. Escalate any balance 60+ days overdue to the CFO. Send automated dunning notice to 30+ day accounts via the billing system.", role: "AR Specialist", duration: "1 hr" },
      { num: 4, title: "Post Accruals and Adjusting Entries", detail: "Record all accruals per the accrual schedule in the shared drive. Post depreciation entries. Have Controller review and approve all entries before posting.", role: "Controller / Staff Accountant", duration: "1.5 hrs" },
      { num: 5, title: "Run Trial Balance and P&L Draft", detail: "Generate trial balance from ERP. Confirm it ties to zero. Produce draft P&L and Balance Sheet. Distribute to CFO and VP Finance for preliminary review.", role: "Controller", duration: "45 min" },
    ],
    edge_cases: [
      "If the ERP is down on close day, complete offline in the reconciliation spreadsheet and import when restored — do not delay the close.",
      "If a department misses the submission deadline, close without their entries and post a correcting journal in month+1.",
      "If a bank discrepancy exceeds $500, escalate to CFO before proceeding.",
    ],
    metrics: ["Close cycle time: target ≤ 3 business days", "Journal entry error rate: target < 1%", "On-time delivery to CFO: 100%"],
  },
  "Competitive Intelligence": {
    competitor: "Salesforce (Sales Cloud)",
    your_product: "Your CRM Platform",
    swot: {
      strengths: ["20–40% lower TCO for mid-market accounts", "Implementation in days, not months", "Native AI features included, no add-on pricing", "Dedicated CSM for all tiers"],
      weaknesses: ["Smaller ecosystem of third-party integrations", "Less brand recognition in enterprise deals", "No on-premise deployment option"],
      opportunities: ["Salesforce price increases driving mid-market re-evaluation", "New AI mandates create budget for modern tooling", "Rising demand for fast time-to-value in SMB segment"],
      threats: ["Salesforce investing $1B in AI features (Einstein GPT)", "Microsoft Dynamics bundling with M365 discounts", "Race-to-bottom pricing from newer entrants"],
    },
    positioning_gaps: [
      "Salesforce's onboarding takes 3–6 months average; your platform is live in 1–2 weeks — lead with this in every discovery call.",
      "Their AI features require a $75/user/month Einstein add-on; yours are native — quantify this in every pricing conversation.",
      "They lack a mid-market CSM model; dedicated support is a differentiator in accounts under $100K ACV.",
    ],
    battlecard: {
      win_themes: ["Speed to value", "Total cost of ownership", "AI without the add-on tax"],
      trap_questions: ["How long did your last CRM implementation take?", "What's your current Einstein / AI add-on spend?", "How often do you actually talk to your CSM?"],
      landmines: ["Avoid comparing feature lists — Salesforce wins on breadth. Win on outcomes and speed.", "Never call them 'legacy' — buyers have invested years in it."],
    },
    wedge: "Target accounts 18–24 months into a Salesforce contract — they've felt the gap between promise and reality and are starting to feel the renewal coming. Lead with a 30-minute live demo showing go-live in a single day.",
  },
  "Content Repurposer": {
    source: "New research: AI-assisted teams ship 3x faster than those who don't — but only if the human stays in the decision seat. The model is the engine. You are the driver.",
    channels: [
      { channel: "LinkedIn Post", body: "New data just landed and it's clarifying, not scary:\n\nAI-assisted teams ship 3x faster.\nBut only when a human stays in the decision seat.\n\nThe model is the engine. You are the driver.\n\nThe teams falling behind aren't the ones using AI.\nThey're the ones using it without a system.\n\nWhat's your process for staying in control of AI output?" },
      { channel: "X / Twitter Thread", body: "1/ New research: AI teams ship 3x faster — but only if the human stays in the decision seat.\n\nThread on what that actually means 👇\n\n2/ The mistake: treating AI like autopilot.\n\nYou set the destination. You override when the terrain changes. The model doesn't know what it doesn't know.\n\n3/ The fix: a 3-step review loop.\n→ AI drafts\n→ Human edits for accuracy + judgment\n→ AI polishes the final version\n\nSpeed AND quality.\n\n4/ The teams winning with AI aren't the fastest prompters. They're the best editors.\n\nAre you building that skill? 🔁 Repost if this reframed it for you." },
      { channel: "Email Newsletter", body: "Subject: The 3x faster secret (it's not what you think)\n\nHey,\n\nNew research confirmed what a lot of us have felt: AI-assisted teams ship 3x faster.\n\nBut there's a catch — it only holds if a human stays in the decision seat.\n\nI've seen both patterns in the wild. Teams that hand the wheel over entirely get fast output and mediocre judgment. Teams that treat AI as a collaborator and themselves as the final editor? They're the ones actually winning.\n\nThe model is the engine. You're the driver.\n\nOne thing I'd try this week: pick one workflow and run the AI-draft → human-edit → AI-polish loop once. See how it feels.\n\nTalk soon,\nAlex" },
      { channel: "Ad Copy", body: "Ship 3x faster without losing control.\n\nAI does the drafting. You do the deciding.\n[See how →]" },
    ],
    hashtags: ["#AIProductivity", "#FutureOfWork", "#ContentStrategy", "#AITools", "#WorkSmart"],
  },
  "Budget Variance Analyst": {
    period: "Q3 2026",
    variances: [
      { category: "Sales & Marketing", budget: 180000, actual: 214000, variance: 34000, type: "over", explanation: "Conference sponsorship ($18K) and two unplanned Google Ads tests ($11K) drove the overage. Pipeline ROI from the conference justifies the spend — recommend moving $20K from Q4 trade shows." },
      { category: "Engineering", budget: 320000, actual: 298000, variance: -22000, type: "under", explanation: "Two open headcount positions unfilled for the full quarter. Annualized this is a $88K favorable variance — recommend using $40K for contractor backfill on the Q4 feature sprint." },
      { category: "G&A", budget: 95000, actual: 97200, variance: 2200, type: "over", explanation: "Legal fees for the new vendor contract review. One-time item, no structural concern." },
      { category: "COGS", budget: 410000, actual: 388000, variance: -22000, type: "under", explanation: "Hosting costs under budget due to Q2 infrastructure optimization now fully realized. Sustainable going forward." },
    ],
    summary: "Q3 net variance is $7,800 favorable overall. The marketing overage is offset by engineering underspend driven by open headcount. No structural issues — recommend a mid-Q4 reforecast to reallocate the engineering savings before year-end.",
    exec_ask: "Approve reallocation of $40K from open engineering headcount to contractor sprint budget (Q4 feature delivery). No net change to total Q3/Q4 envelope.",
  },
  "KPI Narrator": {
    period: "November 2026",
    narrative: "November was a strong execution month with ARR growth accelerating to 8.2% MoM — the highest rate since February. Net Revenue Retention held at 112%, signaling healthy expansion within the existing base even as new logo acquisition remained flat. The sales team closed 14 new accounts against a target of 16, with the shortfall concentrated in the enterprise segment where two deals pushed to December. Customer satisfaction is a bright spot: NPS improved 7 points to 54, the highest score in 18 months, driven by improvements to onboarding time.",
    highlights: [
      "ARR grew 8.2% MoM — highest since Feb 2026",
      "NPS reached 54, up 7 points — 18-month high",
      "NRR held at 112% — expansion outpacing churn",
    ],
    concerns: [
      "New logo acquisition missed target by 2 accounts (enterprise pipeline soft)",
      "CAC increased 14% YoY — paid channel efficiency declining",
      "Support ticket volume up 22% with no headcount increase",
    ],
    board_asks: [
      "Approve one additional enterprise AE headcount for Q1 2027 to address pipeline gap",
      "Review CAC trend vs. LTV at next board session — decision point for paid channel strategy",
    ],
    kpis: [
      { name: "ARR", value: "$4.1M", change: "+8.2%", trend: "up" },
      { name: "NRR", value: "112%", change: "+1pt", trend: "up" },
      { name: "NPS", value: "54", change: "+7", trend: "up" },
      { name: "New Logos", value: "14", change: "-2 vs target", trend: "down" },
      { name: "CAC", value: "$3,200", change: "+14% YoY", trend: "down" },
    ],
  },
};

function ToolModal({ tool, onClose }) {
  const [view, setView] = useState("form");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const formRef = useRef(null);

  const collectFields = () => {
    if (!formRef.current) return {};
    const fields = {};
    formRef.current.querySelectorAll("input, textarea, select").forEach((el) => {
      const label = el.closest(".tool-field")?.querySelector(".tool-label")?.textContent;
      if (label && el.value) fields[label] = el.value;
    });
    return fields;
  };

  const handleRun = async (e) => {
    e.preventDefault();
    setView("loading");
    setError(null);
    await new Promise((r) => setTimeout(r, 900));
    const data = TOOL_SAMPLES[tool.name] || { output: "Demo complete." };
    setResult(data);
    setView("result");
  };

  const renderResult = () => {
    const data = result;
    if (!data) return <p className="result-text">No result yet.</p>;

    if (tool.name === "Deal Coach") {
      const pct = data.win_probability;
      const color = pct >= 70 ? "#4ade80" : pct >= 45 ? "#fb923c" : "#f87171";
      return (
        <>
          <div className="result-section">
            <div className="result-section-title">Summary</div>
            <p className="result-text">{data.summary}</p>
          </div>
          <div className="result-section">
            <div className="result-section-title">Win Probability</div>
            <div className="gauge-wrap">
              <div className="gauge-pct" style={{ color }}>{pct}%</div>
              <div className="gauge-label">{data.stage} · {data.health === "watch" ? "⚠ Watch" : data.health}</div>
            </div>
          </div>
          <div className="result-section">
            <div className="result-section-title">Deal Signals</div>
            {data.signals.map((s, i) => (
              <div key={i} className="result-signal">
                <div className={`signal-dot ${s.type}`} />
                <span>{s.text}</span>
              </div>
            ))}
          </div>
          <div className="result-section">
            <div className="result-section-title">Next Best Actions</div>
            {data.next_actions.map((a, i) => (
              <div key={i} className={`action-card ${a.priority}`}>
                <div className={`priority-${a.priority}`}>{a.priority.toUpperCase()}</div>
                <strong>{a.action}</strong>
                <p style={{ margin: "4px 0 0", fontSize: "0.82rem", opacity: 0.8 }}>{a.rationale}</p>
              </div>
            ))}
          </div>
          <div className="result-section">
            <div className="result-section-title">Objection Playbook</div>
            {data.objections.map((o, i) => (
              <div key={i} className="objection-item">
                <div className="objection-q">"{o.objection}"</div>
                <div className="objection-a">{o.response}</div>
              </div>
            ))}
          </div>
        </>
      );
    }

    if (tool.name === "Proposal Generator") {
      return (
        <>
          <div className="result-section">
            <div className="result-section-title" style={{ fontSize: "1.1rem" }}>{data.title}</div>
            <p className="result-text" style={{ opacity: 0.6, marginTop: 2 }}>Prepared for: {data.prepared_for}</p>
          </div>
          <div className="result-section">
            <div className="result-section-title">Executive Summary</div>
            <p className="result-text">{data.executive_summary}</p>
          </div>
          <div className="result-section">
            <div className="result-section-title">ROI Headline</div>
            <div className="roi-headline">{data.roi.headline} · {data.roi.annual_value}/yr value · Payback: {data.roi.payback_period}</div>
          </div>
          <div className="result-section">
            <div className="result-section-title">Pricing Options</div>
            <div className="pricing-grid">
              {data.pricing_tiers.map((t, i) => (
                <div key={i} className={`pricing-tier${t.recommended ? " rec" : ""}`}>
                  {t.recommended && <div className="pricing-rec-badge">Recommended</div>}
                  <div className="tier-name">{t.name}</div>
                  <div className="tier-price">{t.price} <span className="tier-cadence">{t.cadence}</span></div>
                  <div className="tier-best">{t.best_for}</div>
                  <ul className="tier-features">{t.features.map((f, j) => <li key={j}>{f}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
          <div className="result-section">
            <div className="result-section-title">Implementation Timeline</div>
            {data.timeline.map((t, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-phase">{t.phase} <span className="timeline-duration">{t.duration}</span></div>
                  <div className="timeline-detail">{t.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="result-section">
            <div className="result-section-title">Next Steps</div>
            <ul className="result-list">{data.next_steps.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
        </>
      );
    }

    if (tool.name === "Churn Risk Explainer") {
      return data.accounts.map((acc, i) => (
        <div key={i} className="result-card">
          <div className="result-row">
            <strong>{acc.name}</strong>
            <span className={`result-pill ${acc.risk}`}>{acc.risk.toUpperCase()} RISK — {acc.score}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "8px 0" }}>
            {acc.signals.map((s, j) => <span key={j} className="result-pill blue">{s}</span>)}
          </div>
          <div className="ticket-draft">
            <strong style={{ display: "block", marginBottom: 6 }}>Save Email Draft:</strong>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0, fontSize: "0.82rem" }}>{acc.save_email}</pre>
          </div>
        </div>
      ));
    }

    if (tool.name === "Support Ticket Triage") {
      return data.tickets.map((t, i) => (
        <div key={i} className="ticket-card">
          <div className="ticket-meta">
            <span>{t.id}</span>
            <span className={`result-pill ${t.urgency === "critical" ? "red" : t.urgency === "high" ? "amber" : "green"}`}>{t.urgency.toUpperCase()}</span>
            <span className="result-pill blue">{t.sentiment}</span>
            <span>→ {t.route}</span>
          </div>
          <div className="ticket-title">{t.subject}</div>
          <div className="ticket-draft">
            <strong style={{ display: "block", marginBottom: 6 }}>Suggested Reply:</strong>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0, fontSize: "0.82rem" }}>{t.draft}</pre>
          </div>
        </div>
      ));
    }

    if (tool.name === "Meeting Intelligence") {
      return (
        <>
          <div className="result-section">
            <div className="result-section-title">{data.meeting_title} · {data.duration}</div>
          </div>
          <div className="result-section">
            <div className="result-section-title">Decisions Made</div>
            <ul className="result-list">{data.decisions.map((d, i) => <li key={i}>{d}</li>)}</ul>
          </div>
          <div className="result-section">
            <div className="result-section-title">Action Items</div>
            {data.action_items.map((a, i) => (
              <div key={i} className="result-row" style={{ padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontWeight: 600 }}>{a.owner}</span>
                <span style={{ flex: 1, margin: "0 12px", opacity: 0.85 }}>{a.action}</span>
                <span style={{ opacity: 0.5, whiteSpace: "nowrap" }}>Due {a.due}</span>
              </div>
            ))}
          </div>
          <div className="result-section">
            <div className="result-section-title">Speaker Sentiment</div>
            {data.speakers.map((s, i) => (
              <div key={i} className="speaker-card">
                <div className="speaker-name">{s.name} <span className={`result-pill ${s.sentiment === "positive" ? "green" : s.sentiment === "cautious" ? "amber" : "blue"}`}>{s.sentiment}</span></div>
                <div className="speaker-sentiment">{s.key_point}</div>
              </div>
            ))}
          </div>
          <div className="result-section">
            <div className="result-section-title">Follow-Up Email Draft</div>
            <div className="ticket-draft">
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0, fontSize: "0.82rem" }}>{data.follow_up_email}</pre>
            </div>
          </div>
        </>
      );
    }

    if (tool.name === "SOP Generator") {
      return (
        <>
          <div className="result-section">
            <div className="result-section-title" style={{ fontSize: "1.05rem" }}>{data.title}</div>
            <p className="result-text" style={{ opacity: 0.6 }}>{data.version} · Owner: {data.owner} · {data.frequency}</p>
            <p className="result-text">{data.purpose}</p>
          </div>
          <div className="result-section">
            <div className="result-section-title">Steps</div>
            {data.steps.map((s, i) => (
              <div key={i} className="sop-step">
                <div className="sop-step-num">{s.num}</div>
                <div className="sop-step-content">
                  <div className="sop-step-title">{s.title} <span style={{ opacity: 0.5, fontWeight: 400, fontSize: "0.8rem" }}>· {s.role} · {s.duration}</span></div>
                  <div className="sop-step-detail">{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="result-section">
            <div className="result-section-title">Edge Cases</div>
            <ul className="result-list">{data.edge_cases.map((e, i) => <li key={i}>{e}</li>)}</ul>
          </div>
          <div className="result-section">
            <div className="result-section-title">Success Metrics</div>
            <ul className="result-list">{data.metrics.map((m, i) => <li key={i}>{m}</li>)}</ul>
          </div>
        </>
      );
    }

    if (tool.name === "Competitive Intelligence") {
      return (
        <>
          <div className="result-section">
            <div className="result-section-title">SWOT — Your Position vs. {data.competitor}</div>
            <div className="swot-grid">
              {[["Strengths", data.swot.strengths, "green"], ["Weaknesses", data.swot.weaknesses, "red"], ["Opportunities", data.swot.opportunities, "blue"], ["Threats", data.swot.threats, "amber"]].map(([label, items, color]) => (
                <div key={label} className="swot-cell">
                  <div className="swot-cell-label" style={{ color: color === "green" ? "#4ade80" : color === "red" ? "#f87171" : color === "blue" ? "#60a5fa" : "#fb923c" }}>{label}</div>
                  <ul className="result-list">{items.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
          <div className="result-section">
            <div className="result-section-title">Positioning Gaps to Exploit</div>
            <ul className="result-list">{data.positioning_gaps.map((p, i) => <li key={i}>{p}</li>)}</ul>
          </div>
          <div className="result-section">
            <div className="result-section-title">Battlecard</div>
            <div className="result-row" style={{ gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <strong>Win Themes</strong>
                <ul className="result-list">{data.battlecard.win_themes.map((t, i) => <li key={i}>{t}</li>)}</ul>
              </div>
              <div style={{ flex: 1 }}>
                <strong>Trap Questions</strong>
                <ul className="result-list">{data.battlecard.trap_questions.map((q, i) => <li key={i}>{q}</li>)}</ul>
              </div>
            </div>
          </div>
          <div className="result-section">
            <div className="result-section-title">The Wedge</div>
            <p className="result-text">{data.wedge}</p>
          </div>
        </>
      );
    }

    if (tool.name === "Content Repurposer") {
      return (
        <>
          <div className="result-section">
            <div className="result-section-title">Source Content</div>
            <p className="result-text" style={{ fontStyle: "italic" }}>"{data.source}"</p>
          </div>
          {data.channels.map((ch, i) => (
            <div key={i} className="content-channel-card">
              <div className="content-channel-label">{ch.channel}</div>
              <div className="content-body">{ch.body}</div>
            </div>
          ))}
          <div className="result-section">
            <div className="result-section-title">Hashtags</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {data.hashtags.map((h, i) => <span key={i} className="result-pill blue">{h}</span>)}
            </div>
          </div>
        </>
      );
    }

    if (tool.name === "Budget Variance Analyst") {
      return (
        <>
          <div className="result-section">
            <div className="result-section-title">Variance Analysis — {data.period}</div>
            <table className="variance-table">
              <thead><tr><th>Category</th><th>Budget</th><th>Actual</th><th>Variance</th></tr></thead>
              <tbody>
                {data.variances.map((v, i) => (
                  <tr key={i}>
                    <td>{v.category}</td>
                    <td>${v.budget.toLocaleString()}</td>
                    <td>${v.actual.toLocaleString()}</td>
                    <td className={v.type === "over" ? "over" : "under"}>{v.type === "over" ? "+" : "-"}${Math.abs(v.variance).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.variances.map((v, i) => (
            <div key={i} className="result-card">
              <div className="result-row"><strong>{v.category}</strong><span className={`result-pill ${v.type === "over" ? "red" : "green"}`}>{v.type === "over" ? "Over" : "Under"}</span></div>
              <p className="result-text">{v.explanation}</p>
            </div>
          ))}
          <div className="result-section">
            <div className="result-section-title">Executive Summary</div>
            <p className="result-text">{data.summary}</p>
          </div>
          <div className="result-section">
            <div className="result-section-title">Board Ask</div>
            <p className="result-text" style={{ fontWeight: 600 }}>{data.exec_ask}</p>
          </div>
        </>
      );
    }

    if (tool.name === "KPI Narrator") {
      return (
        <>
          <div className="result-section">
            <div className="result-section-title">KPI Summary — {data.period}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {data.kpis.map((k, i) => (
                <div key={i} className="result-card" style={{ flex: "1 1 140px", textAlign: "center" }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: 700 }}>{k.value}</div>
                  <div style={{ fontSize: "0.78rem", opacity: 0.6 }}>{k.name}</div>
                  <div className={`result-pill ${k.trend === "up" ? "green" : "red"}`} style={{ marginTop: 4 }}>{k.change}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="result-section">
            <div className="result-section-title">Board Narrative</div>
            <p className="result-text">{data.narrative}</p>
          </div>
          <div className="result-section">
            <div className="result-section-title">Highlights</div>
            <ul className="result-list">{data.highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
          </div>
          <div className="result-section">
            <div className="result-section-title">Concerns</div>
            <ul className="result-list">{data.concerns.map((c, i) => <li key={i}>{c}</li>)}</ul>
          </div>
          <div className="result-section">
            <div className="result-section-title">Board Asks</div>
            <ul className="result-list">{data.board_asks.map((a, i) => <li key={i}>{a}</li>)}</ul>
          </div>
        </>
      );
    }

    return <p className="result-text">Sample output for {tool.name}.</p>;
  };

  const renderForm = () => {
    const forms = {
      "Deal Coach": (
        <>
          <div className="tool-field"><label className="tool-label">Company / Prospect</label><input className="tool-input" defaultValue="Meridian Health Partners" /></div>
          <div className="tool-field"><label className="tool-label">Deal Stage</label><select className="tool-select"><option>Proposal</option><option>Discovery</option><option>Negotiation</option><option>Closing</option></select></div>
          <div className="tool-field"><label className="tool-label">Deal Notes</label><textarea className="tool-textarea" defaultValue="Champion is Sarah Chen, VP Ops. Has exec access. No formal eval criteria shared yet. Economic buyer (CFO) has gone quiet for 2 weeks. Competitor Salesforce also in play." /></div>
        </>
      ),
      "Proposal Generator": (
        <>
          <div className="tool-field"><label className="tool-label">Company Name</label><input className="tool-input" defaultValue="Meridian Health Partners" /></div>
          <div className="tool-field"><label className="tool-label">Contact / Title</label><input className="tool-input" defaultValue="Sarah Chen, VP of Operations" /></div>
          <div className="tool-field"><label className="tool-label">Pain Points & Goals</label><textarea className="tool-textarea" defaultValue="Manual reporting taking 1,200 hrs/quarter. No single source of truth. FHIR compliance deadline in 6 months." /></div>
        </>
      ),
      "Churn Risk Explainer": (
        <>
          <div className="tool-field"><label className="tool-label">Accounts to Analyze (one per line)</label><textarea className="tool-textarea" defaultValue={"Brightline Logistics, Enterprise\nOakwood Financial, Mid-Market\nCascade Media, SMB"} /></div>
          <div className="tool-field"><label className="tool-label">Usage Data Source</label><select className="tool-select"><option>CRM Export</option><option>Product Analytics</option><option>Manual Entry</option></select></div>
        </>
      ),
      "Support Ticket Triage": (
        <>
          <div className="tool-field"><label className="tool-label">Ticket Content</label><textarea className="tool-textarea" defaultValue={"TKT-4421 | Brightline Logistics | All dashboard data disappeared after update — URGENT\nTKT-4418 | Oakwood Financial | Charged twice for same invoice\nTKT-4415 | Cascade Media | How do I export to CSV?"} /></div>
        </>
      ),
      "Meeting Intelligence": (
        <>
          <div className="tool-field"><label className="tool-label">Meeting Title</label><input className="tool-input" defaultValue="Q4 Strategy Review" /></div>
          <div className="tool-field"><label className="tool-label">Transcript or Notes</label><textarea className="tool-textarea" defaultValue="Sarah: We should reallocate $120K from print to digital — our Q3 test showed 3.2x ROAS. Marcus: I'm concerned about the CRM timeline — we need security review first. Alex: The dashboard demo went well, finance team is ready to pilot." /></div>
        </>
      ),
      "SOP Generator": (
        <>
          <div className="tool-field"><label className="tool-label">Process Name</label><input className="tool-input" defaultValue="Monthly Financial Close" /></div>
          <div className="tool-field"><label className="tool-label">Process Description</label><textarea className="tool-textarea" defaultValue="Month-end accounting close: freeze transactions, reconcile bank statements, review AR aging, post accruals, run trial balance and distribute to leadership." /></div>
          <div className="tool-field"><label className="tool-label">Team / Owner</label><input className="tool-input" defaultValue="Finance Team" /></div>
        </>
      ),
      "Competitive Intelligence": (
        <>
          <div className="tool-field"><label className="tool-label">Competitor</label><input className="tool-input" defaultValue="Salesforce (Sales Cloud)" /></div>
          <div className="tool-field"><label className="tool-label">Your Product / Positioning</label><textarea className="tool-textarea" defaultValue="Mid-market CRM with native AI, faster implementation, lower TCO, and dedicated CSM for all tiers." /></div>
        </>
      ),
      "Content Repurposer": (
        <>
          <div className="tool-field"><label className="tool-label">Source Content</label><textarea className="tool-textarea" defaultValue="New research: AI-assisted teams ship 3x faster than those who don't — but only if the human stays in the decision seat. The model is the engine. You are the driver." /></div>
          <div className="tool-field"><label className="tool-label">Target Channels</label><select className="tool-select"><option>All Channels</option><option>LinkedIn Only</option><option>Email + Social</option></select></div>
        </>
      ),
      "Budget Variance Analyst": (
        <>
          <div className="tool-field"><label className="tool-label">Period</label><input className="tool-input" defaultValue="Q3 2026" /></div>
          <div className="tool-field"><label className="tool-label">Budget vs. Actuals (paste CSV or describe)</label><textarea className="tool-textarea" defaultValue={"Sales & Marketing: Budget $180K, Actual $214K\nEngineering: Budget $320K, Actual $298K\nG&A: Budget $95K, Actual $97.2K\nCOGS: Budget $410K, Actual $388K"} /></div>
        </>
      ),
      "KPI Narrator": (
        <>
          <div className="tool-field"><label className="tool-label">Period</label><input className="tool-input" defaultValue="November 2026" /></div>
          <div className="tool-field"><label className="tool-label">KPIs (paste data)</label><textarea className="tool-textarea" defaultValue={"ARR: $4.1M (+8.2% MoM)\nNRR: 112% (+1pt)\nNPS: 54 (+7)\nNew Logos: 14 (-2 vs target of 16)\nCAC: $3,200 (+14% YoY)"} /></div>
        </>
      ),
    };
    return forms[tool.name] || <div className="tool-field"><label className="tool-label">Input</label><textarea className="tool-textarea" placeholder="Paste your data here…" /></div>;
  };

  return (
    <div className="tool-modal-overlay" onClick={(e) => { if (e.target.classList.contains("tool-modal-overlay")) onClose(); }}>
      <div className="tool-modal">
        <div className="tool-modal-header">
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5 }}>AI Tool Demo</span>
            <h3 style={{ margin: "2px 0 0", fontSize: "1.15rem", fontWeight: 700 }}>{tool.name}</h3>
          </div>
          <button className="tool-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="tool-modal-body">
          {view === "loading" ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 16 }}>
              <div className="tool-spinner" />
              <p style={{ opacity: 0.5, fontSize: "0.85rem" }}>Running AI analysis…</p>
            </div>
          ) : view === "form" ? (
            <form ref={formRef} onSubmit={handleRun} className="tool-form">
              <p className="result-text" style={{ marginBottom: 16 }}>{tool.desc}</p>
              {error && <p style={{ color: "#f87171", fontSize: "0.82rem", marginBottom: 12 }}>Error: {error}</p>}
              {renderForm()}
              <div className="tool-actions">
                <button type="submit" className="tool-btn-primary">Run →</button>
              </div>
            </form>
          ) : (
            <div>
              <button className="result-back" onClick={() => setView("form")}>← Back</button>
              {renderResult()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [activePage, setActivePage] = useState("work");
  const [activeTool, setActiveTool] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorExpanded, setCursorExpanded] = useState(false);
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
    requestAnimationFrame(function raf() { requestAnimationFrame(raf); });
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", (e) => {
      if (e.target.matches("a,button,.project-header,.btn-primary,.btn-secondary")) {
        setCursorExpanded(true);
      } else {
        setCursorExpanded(false);
      }
    }, true);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".fade-in");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
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
      <div className="cursor" style={{ left: cursorPos.x - 5, top: cursorPos.y - 5 }} />
      <div ref={ringRef} className={`cursor-ring ${cursorExpanded ? "expanded" : ""}`} />

      {/* Nav */}
      <nav className={scrolled ? "scrolled" : ""}>
        <a href="#hero" className="nav-logo" onClick={(e) => { e.preventDefault(); scrollTo("hero"); }}>
          <span className="logo-bracket">&lt;</span>
          <span className="logo-a">A</span>
          <span className="logo-slash-mid">/</span>
          <svg className="logo-power-t" viewBox="0 0 500 560" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M0 0 H500 V140 H335 V168 H315 V560 H185 V168 H165 V140 H0 Z" fill="#ff8200" />
          </svg>
          <span className="logo-slash">/&gt;</span>
        </a>
        <div className="nav-links">
          {["skills", "work", "about", "b2b"].map((p) => (
            <button key={p} className={activePage === p ? "active" : ""} onClick={() => scrollTo(p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-grid" />
        <svg className="hero-power-t" viewBox="0 0 500 560" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M0 0 H500 V140 H335 V168 H315 V560 H185 V168 H165 V140 H0 Z" fill="var(--accent)" />
        </svg>
        <h1 className="hero-title">
          <div>Alexander</div>
          <div className="line2">Tobin</div>
          <div><span className="accent">Developer.</span></div>
        </h1>
        <div className="hero-bottom">
          <p className="hero-desc">
            Full-stack developer and AI integration specialist. I build production
            apps, automate workflows, and wire AI into systems that replace manual
            work. Select clients only — if you want results, you come to me.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-num">4+</div>
              <div className="stat-label">Years delivering</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">8</div>
              <div className="stat-label">Apps in production</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">~$10K</div>
              <div className="stat-label">ARR from own products</div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">Scroll</div>
      </section>

      {/* SKILLS */}
      <section className="skills-section" id="skills">
        <div className="fade-in">
          <p className="section-eyebrow">Technical Skills</p>
          <h2 className="section-big-heading">Built with.<br /><em>Shipped.</em></h2>
          <p className="skills-intro-text">
            Every skill here has been applied in production — shipped apps,
            client automation systems, or employer analytics environments.
            Orange = primary strength.
          </p>
        </div>
        {SKILL_GROUPS.map((group, gi) => (
          <div key={group.title} className="skills-group fade-in" style={{ transitionDelay: `${gi * 0.07}s` }}>
            <div className="skill-group-label">
              {group.title}
              <span>{group.sub}</span>
            </div>
            <div className="skill-pills">
              {group.skills.map((s) => (
                <span key={s.name} className={`skill-pill ${s.primary ? "primary" : ""}`}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* WORK */}
      <section className="work" id="work">
        <div className="work-header fade-in">
          <p className="section-eyebrow">Selected Work</p>
          <h2 className="section-big-heading">
            {PROJECTS.length} projects.<br /><em>All in production.</em>
          </h2>
        </div>
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
        <div className="more-projects-note fade-in">
          <p>Additional projects available on request.</p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about" id="about">
        <div className="about-inner">
          <div className="fade-in">
            <h2 className="about-heading">
              Work with<br /><span>Alexander.</span>
            </h2>
            <p className="about-text">
              I don't take every engagement. If you need someone to scope a problem,
              build it end-to-end, and hand it off production-ready — reach out and
              make the case. The right projects get my full attention.
            </p>
            <p className="about-text">
              Background spans full-stack development, AI and workflow automation,
              and data analytics. University of Tennessee, Knoxville. Google Project
              Management and Analytics certified.
            </p>
            <div className="contact-block">
              <p className="contact-email-label">Get in touch</p>
              <a href="mailto:atobin@alum.utk.edu" className="contact-email-link">
                atobin@alum.utk.edu
              </a>
            </div>
          </div>
          <div className="fade-in" style={{ transitionDelay: "0.12s" }}>
            <p className="section-eyebrow" style={{ marginBottom: 24 }}>Experience</p>
            <ul className="exp-list">
              {[
                { role: "Founder", yrs: "1 yr" },
                { role: "Consultant", yrs: "1 yr" },
                { role: "AI Solutions", yrs: "1 yr" },
                { role: "Developer", yrs: "2 yrs" },
                { role: "Business Intelligence", yrs: "2 yrs" },
                { role: "Automations", yrs: "3 yrs" },
                { role: "Project Management", yrs: "4+ yrs" },
                { role: "Data Analyst", yrs: "4+ yrs" },
              ].map((e) => (
                <li key={e.role} className="exp-item">
                  <span className="exp-role">{e.role}</span>
                  <span className="exp-dates">{e.yrs}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* B2B TOOLS */}
      <section id="b2b" style={{ background: "var(--bg3)" }}>
        <div className="b2b-section">
          <div className="b2b-header fade-in">
            <p className="section-eyebrow">B2B Tools</p>
            <h2 className="section-big-heading">
              13 tools.<br /><em>All live. All interactive.</em>
            </h2>
          </div>
          {B2B_CATEGORIES.map((cat, ci) => (
            <div key={cat.label} className="b2b-category fade-in" style={{ transitionDelay: `${ci * 0.06}s` }}>
              <div className="b2b-category-label">{cat.label}</div>
              <div className="b2b-grid">
                {cat.tools.map((tool) => (
                  <button
                    key={tool.name}
                    className="b2b-card"
                    onClick={() => setActiveTool(tool)}
                  >
                    <div className="b2b-card-top">
                      <span className="b2b-glyph-wrap">{tool.glyph}</span>
                      <span className="b2b-card-name">{tool.name}</span>
                    </div>
                    <p className="b2b-card-desc">{tool.desc}</p>
                    <span className="b2b-card-cta">Try it live →</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2026 — Alexander Tobin</p>
        <p>atobin@alum.utk.edu</p>
      </footer>

      {activeTool && <ToolModal tool={activeTool} onClose={() => setActiveTool(null)} />}
    </>
  );
}
