import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section id="hero">
      <div class="hero-bg">
        <div class="glow glow-1"></div>
        <div class="glow glow-2"></div>
        <div class="grid-lines"></div>
      </div>
      <div class="container hero-content">
        <div class="hero-text">
          <span class="eyebrow">Hallo, ik ben</span>
          <h1>Carolina<br><span class="accent-text">Sauselé</span></h1>
          <p class="tagline">
            Informatica student · Full Stack Developer · Creatief probleemoplossen
          </p>
          <div class="hero-actions">
            <a href="#projecten" class="btn-primary">Bekijk mijn werk</a>
            <a href="#contact" class="btn-ghost">Neem contact op</a>
          </div>
          <div class="hero-badges">
            <span class="badge">Python</span>
            <span class="badge">Angular</span>
            <span class="badge">Springboot</span>
            <span class="badge">Machine Learning</span>
          </div>
        </div>
        <div class="hero-visual">
          <div class="avatar-ring">
            <div class="avatar-placeholder">
              <img src="assets/profile.jpg" alt="Carolina Sauselé" />
            </div>
          </div>
          <div class="orbit orbit-1"></div>
          <div class="orbit orbit-2"></div>
          <div class="floating-chip chip-1">Full Stack</div>
          <div class="floating-chip chip-2">ML</div>
          <div class="floating-chip chip-3">UI/UX</div>
        </div>
      </div>
      <div class="scroll-hint">
        <div class="scroll-line"></div>
        <span>Scroll</span>
      </div>
    </section>
  `,
  styles: [`
    section {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.15;
    }
    .glow-1 {
      width: 600px; height: 600px;
      background: var(--accent);
      top: -100px; left: -100px;
    }
    .glow-2 {
      width: 400px; height: 400px;
      background: var(--accent2);
      bottom: -50px; right: 10%;
    }
    .grid-lines {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 60px 60px;
    }
    .hero-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
      padding-top: 80px;
    }
    .hero-text {
      animation: fadeUp 0.8s ease both;
    }
    .eyebrow {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--accent);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      display: block;
      margin-bottom: 16px;
    }
    h1 {
      font-size: clamp(3rem, 6vw, 5rem);
      font-weight: 800;
      color: var(--white);
      line-height: 1;
      margin-bottom: 24px;
    }
    .accent-text {
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .tagline {
      color: var(--muted);
      font-size: 1.05rem;
      margin-bottom: 36px;
      max-width: 420px;
    }
    .hero-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 40px;
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      color: #fff;
      padding: 13px 28px;
      border-radius: 100px;
      font-weight: 600;
      font-size: 0.9rem;
      transition: opacity 0.2s, transform 0.2s;
      &:hover { opacity: 0.85; transform: translateY(-2px); }
    }
    .btn-ghost {
      border: 1px solid var(--border);
      color: var(--text);
      padding: 13px 28px;
      border-radius: 100px;
      font-weight: 500;
      font-size: 0.9rem;
      transition: border-color 0.2s, transform 0.2s;
      &:hover { border-color: var(--accent); transform: translateY(-2px); }
    }
    .hero-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .badge {
      font-size: 0.75rem;
      color: var(--muted);
      border: 1px solid var(--border);
      padding: 4px 12px;
      border-radius: 100px;
    }

    /* Visual */
    .hero-visual {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 400px;
      animation: fadeIn 1s ease 0.3s both;
    }
    .avatar-ring {
      width: 180px; height: 180px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      padding: 3px;
      position: relative;
      z-index: 2;
    }
    .avatar-placeholder {
      width: 100%; height: 100%;
      border-radius: 50%;
      background: var(--surface2);
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center top;
      }
    }
    .orbit {
      position: absolute;
      border-radius: 50%;
      border: 1px solid rgba(124,107,255,0.15);
    }
    .orbit-1 { width: 260px; height: 260px; animation: spin 20s linear infinite; }
    .orbit-2 { width: 340px; height: 340px; animation: spin 30s linear infinite reverse; }
    .floating-chip {
      position: absolute;
      background: var(--surface2);
      border: 1px solid rgba(124,107,255,0.25);
      color: var(--accent2);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 100px;
      white-space: nowrap;
    }
    .chip-1 { top: 60px; right: 40px; animation: float 4s ease-in-out infinite; }
    .chip-2 { bottom: 80px; right: 20px; animation: float 4s ease-in-out 1.5s infinite; }
    .chip-3 { top: 100px; left: 30px; animation: float 4s ease-in-out 3s infinite; }

    /* Scroll hint */
    .scroll-hint {
      position: absolute;
      bottom: 36px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: var(--muted);
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      animation: fadeIn 1s ease 1.5s both;
    }
    .scroll-line {
      width: 1px;
      height: 40px;
      background: linear-gradient(to bottom, var(--accent), transparent);
      animation: scrollPulse 2s ease-in-out infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes scrollPulse {
      0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
      50% { opacity: 1; transform: scaleY(1); }
    }

    @media (max-width: 900px) {
      .hero-content { grid-template-columns: 1fr; gap: 40px; text-align: center; padding-top: 100px; }
      .hero-actions { justify-content: center; }
      .hero-badges { justify-content: center; }
      .hero-visual { height: 280px; }
      .tagline { margin: 0 auto 36px; }
    }
  `]
})
export class HeroComponent {}
