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
  @media (max-width: 768px) {
    nav { padding: 20px 24px; }
    .hero { padding: 0 24px 64px; }
    .hero-bottom { flex-direction: column; align-items: flex-start; }
    .hero-stats { gap: 32px; }
    .work, .about, .skills-section { padding: 80px 24px; }
    .project-header { grid-template-columns: 36px 1fr auto; gap: 14px; }
    .project-tags { display: none; }
    .project-body-inner { grid-template-columns: 1fr; }
    .about-inner { grid-template-columns: 1fr; gap: 48px; }
    footer { flex-direction: column; gap: 8px; text-align: center; }
    body { cursor: auto; }
    .cursor, .cursor-ring { display: none; }
  }
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
    id: 2,
    num: "02",
    name: "HerEra Spreadsheets",
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
    liveUrl: "https://hereraspreadsheets.com",
    githubUrl: null,
    demo: null,
  },
  {
    id: 3,
    num: "03",
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
    id: 4,
    num: "04",
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
    githubUrl: "https://github.com/atobin07/idealfitness",
    demo: null,
  },
  {
    id: 5,
    num: "05",
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
    id: 6,
    num: "06",
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
    id: 7,
    num: "07",
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
  const stripe = STRIPES[index % 3];

  return (
    <div
      className={`project-card fade-in ${stripe} ${open ? "expanded" : ""}`}
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

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [activePage, setActivePage] = useState("work");
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
          {["skills", "work", "about"].map((p) => (
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
              <div className="stat-num">7</div>
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
                { role: "Data Analyst", yrs: "4+ yrs" },
                { role: "Project Management", yrs: "4+ yrs" },
                { role: "Automations", yrs: "3 yrs" },
                { role: "Business Intelligence", yrs: "2 yrs" },
                { role: "Developer", yrs: "2 yrs" },
                { role: "AI Solutions", yrs: "1 yr" },
                { role: "Consultant", yrs: "1 yr" },
                { role: "Founder", yrs: "1 yr" },
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

      {/* Footer */}
      <footer>
        <p>© 2026 — Alexander Tobin</p>
        <p>atobin@alum.utk.edu</p>
      </footer>
    </>
  );
}
