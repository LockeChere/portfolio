import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  template: `
    <section id="contact">
      <div class="container">
        <span class="section-label">Laten we praten</span>
        <h2 class="section-title">Neem contact<br><span>op</span></h2>
        <div class="divider"></div>

        <div class="contact-layout">
          <div class="contact-intro">
            <p>
              Ben je op zoek naar een enthousiaste developer voor een stage, samenwerking of project?
              Ik hoor graag van je!
            </p>
            <div class="contact-links">
              <a href="mailto:caasausele@gmail.com" class="contact-item">
                <div class="contact-icon">✉️</div>
                <div>
                  <span class="contact-label">Email</span>
                  <span class="contact-value">caasausele&#64;gmail.com</span>
                </div>
              </a>
              <a href="https://www.linkedin.com/in/carolina-sausel%C3%A9-092595194/"
                 target="_blank" class="contact-item">
                <div class="contact-icon">💼</div>
                <div>
                  <span class="contact-label">LinkedIn</span>
                  <span class="contact-value">carolina-sauselé</span>
                </div>
              </a>
            </div>
          </div>

          <div class="contact-cta">
            <div class="cta-card">
              <span class="cta-emoji">🚀</span>
              <h3>Open voor mogelijkheden</h3>
              <p>Stage, afstudeeropdracht, freelance project of parttime werk — ik sta altijd open voor interessante uitdagingen.</p>
              <a href="mailto:caasausele@gmail.com" class="btn-primary">
                Stuur me een bericht
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: start;
    }
    .contact-intro p {
      color: var(--muted);
      font-size: 1rem;
      line-height: 1.8;
      margin-bottom: 36px;
    }
    .contact-links {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      transition: border-color var(--transition), transform var(--transition);
      &:hover {
        border-color: rgba(124,107,255,0.4);
        transform: translateX(4px);
      }
    }
    .contact-icon {
      font-size: 1.4rem;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(124,107,255,0.1);
      border-radius: 10px;
      flex-shrink: 0;
    }
    .contact-label {
      display: block;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 2px;
    }
    .contact-value {
      display: block;
      font-size: 0.9rem;
      color: var(--text);
    }
    .cta-card {
      background: linear-gradient(135deg, rgba(124,107,255,0.15), rgba(192,132,252,0.08));
      border: 1px solid rgba(124,107,255,0.25);
      border-radius: var(--radius-lg);
      padding: 44px 36px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .cta-emoji { font-size: 2.5rem; }
    h3 {
      font-family: var(--font-display);
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--white);
    }
    p {
      color: var(--muted);
      font-size: 0.9rem;
      line-height: 1.7;
    }
    .btn-primary {
      margin-top: 8px;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      color: #fff;
      padding: 13px 28px;
      border-radius: 100px;
      font-weight: 600;
      font-size: 0.9rem;
      transition: opacity 0.2s, transform 0.2s;
      display: inline-block;
      &:hover { opacity: 0.85; transform: translateY(-2px); }
    }
    @media (max-width: 768px) {
      .contact-layout { grid-template-columns: 1fr; gap: 40px; }
    }
  `]
})
export class ContactComponent {}
