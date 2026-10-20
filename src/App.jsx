import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f4f4f4;
    --bg2: #ffffff;
    --bg3: #ebebeb;
    --border: #d6d6d6;
    --border2: #c0c0c0;
    --text: #2b2b2b;
    --text2: #585858;
    --text3: #9a9a9a;
    --accent: #ff8200;
    --accent2: #ffc080;
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
    border: 1px solid rgba(255,130,0,0.4);
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
    background: rgba(244,244,244,0.92);
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
      linear-gradient(rgba(255,130,0,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,130,0,0.04) 1px, transparent 1px);
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
    font-size: clamp(48px, 7vw, 108px);
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
    max-width: 440px;
    font-family: var(--font-mono); font-size: 13px; line-height: 1.8;
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

  /* SKILLS SECTION */
  .skills-section { padding: 120px 48px; background: var(--bg2); min-height: auto; }
  .skills-intro {
    font-family: var(--font-mono); font-size: 13px; line-height: 1.8;
    color: var(--text2); max-width: 560px; margin-bottom: 64px;
  }
  .skills-categories {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
  }
  .skill-category {
    padding: 32px 28px;
    border: 1px solid var(--border);
    background: var(--bg3);
  }
  .skill-category-title {
    font-size: 10px; font-family: var(--font-mono);
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border2);
  }
  .skill-item {
    font-family: var(--font-mono); font-size: 12px;
    color: var(--text2); line-height: 1;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .skill-item:last-child { border-bottom: none; }
  .skill-item::before {
    content: ''; display: block;
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--border2); flex-shrink: 0;
  }
  .skill-item.primary { color: var(--text); }
  .skill-item.primary::before { background: var(--accent); }

  /* WORK section */
  .work { padding: 120px 48px; min-height: auto; }
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
  .project-body.open { max-height: 1000px; }
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
    color: var(--text2); padding: 8px 0;
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

  /* ABOUT / CONTACT */
  .about { padding: 120px 48px; background: var(--bg); min-height: auto; }
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
    color: var(--text2); margin-bottom: 20px;
  }
  .contact-list { margin-top: 40px; list-style: none; }
  .contact-item {
    display: flex; align-items: baseline; gap: 16px;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
  }
  .contact-label {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text3); width: 80px; flex-shrink: 0;
  }
  .contact-val {
    font-family: var(--font-mono); font-size: 12px;
    color: var(--text2);
  }
  .contact-val a {
    color: var(--text2); text-decoration: none;
    transition: color 0.2s;
  }
  .contact-val a:hover { color: var(--accent); }

  /* DEMO CREDENTIALS */
  .demo-creds {
    margin-top: 20px;
    border: 1px solid rgba(255,130,0,0.25);
    border-radius: 2px;
    overflow: hidden;
    background: rgba(255,130,0,0.04);
  }
  .demo-creds-label {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--accent); padding: 10px 16px;
    border-bottom: 1px solid rgba(255,130,0,0.15);
    display: flex; align-items: center; gap: 8px;
  }
  .demo-creds-row {
    display: flex; align-items: center; gap: 12px;
    padding: 8px 16px;
    border-bottom: 1px solid rgba(255,130,0,0.08);
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

  @media (max-width: 768px) {
    nav { padding: 20px 24px; }
    .hero { padding: 0 24px 64px; }
    .hero-bottom { flex-direction: column; align-items: flex-start; }
    .hero-stats { gap: 32px; }
    .work, .about, .skills-section { padding: 80px 24px; }
    .project-header { grid-template-columns: 32px 1fr auto; gap: 12px; }
    .project-tags { display: none; }
    .project-body-inner { grid-template-columns: 1fr; }
    .about-grid { grid-template-columns: 1fr; gap: 48px; }
    .skills-categories { grid-template-columns: 1fr 1fr; }
    footer { flex-direction: column; gap: 8px; text-align: center; }
    body { cursor: auto; }
    .cursor, .cursor-ring { display: none; }
  }

  @media (max-width: 480px) {
    .skills-categories { grid-template-columns: 1fr; }
  }
`;

const SKILL_GROUPS = [
  {
    title: "AI & Automation",
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
          AT<span>.</span>
        </a>
        <div className="nav-links">
          {["skills", "work", "about"].map((p) => (
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
          <div>Alexander</div>
          <div className="line2">Tobin</div>
          <div><span className="accent">Developer.</span></div>
        </h1>
        <div className="hero-bottom">
          <p className="hero-desc">
            Full-stack developer and AI integration specialist. I build production
            applications, automate business workflows, and wire AI into systems
            that replace manual work. 4+ years delivering end-to-end across dev,
            data, and automation.
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
        <div className="section-header fade-in">
          <span className="section-title">Technical Skills</span>
          <span className="section-num">Demonstrated in production</span>
        </div>
        <p className="about-text fade-in" style={{ maxWidth: 560, marginBottom: 48 }}>
          Skills listed here have been applied in shipped work — production apps,
          client automation systems, or employer analytics environments. Highlighted
          items are primary strengths.
        </p>
        <div className="skills-categories fade-in">
          {SKILL_GROUPS.map((group) => (
            <div key={group.title} className="skill-category">
              <div className="skill-category-title">{group.title}</div>
              {group.skills.map((s) => (
                <div key={s.name} className={`skill-item ${s.primary ? "primary" : ""}`}>
                  {s.name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* WORK */}
      <section className="work" id="work">
        <div className="section-header fade-in">
          <span className="section-title">Selected Work</span>
          <span className="section-num">{PROJECTS.length} projects</span>
        </div>
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
        <div style={{ marginTop: 48, padding: "32px", border: "1px dashed var(--border)", borderRadius: "1px", textAlign: "center" }} className="fade-in">
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Additional projects available on request
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about" id="about">
        <div className="about-grid">
          <div className="fade-in">
            <h2 className="about-heading">
              Contact<br /><span>me.</span>
            </h2>
            <p className="about-text">
              I scope, build, and deliver — solo or inside a team. Comfortable
              taking a vague problem all the way through to a working system, with
              documentation the next person can actually maintain.
            </p>
            <p className="about-text">
              Background spans full-stack development, AI and workflow automation,
              and data analytics. University of Tennessee, Knoxville. Google Project
              Management and Analytics certified.
            </p>
            <ul className="contact-list">
              <li className="contact-item">
                <span className="contact-label">Email</span>
                <span className="contact-val">
                  <a href="mailto:atobin@alum.utk.edu">atobin@alum.utk.edu</a>
                </span>
              </li>
            </ul>
          </div>
          <div className="fade-in" style={{ transitionDelay: "0.15s" }}>
            <div style={{ padding: "32px", border: "1px solid var(--border)", background: "var(--bg2)", marginTop: "0" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--border2)" }}>
                Experience
              </div>
              {[
                { role: "Freelance Developer & AI Consultant", dates: "2026 – Present" },
                { role: "Operations Manager", dates: "2024 – 2026" },
                { role: "Data Analyst / Project Manager", dates: "2022 – 2024" },
                { role: "Smartsheet Admin & Analyst", dates: "2023 – 2024" },
              ].map((e) => (
                <div key={e.role} style={{ padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>{e.role}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text3)", display: "flex", justifyContent: "flex-end" }}>
                    <span>{e.dates}</span>
                  </div>
                </div>
              ))}
            </div>
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
