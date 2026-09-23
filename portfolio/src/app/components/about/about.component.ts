import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <section id="over-mij">
      <div class="container">
        <span class="section-label">Wie ben ik</span>
        <h2 class="section-title">Over <span>mij</span></h2>
        <div class="divider"></div>

        <div class="about-grid">
          <div class="about-text">
            <p>
              Ik ben Carolina, een enthousiaste <strong>Informatica student</strong> aan de Hogeschool Leiden
              met een brede technische achtergrond. Daarvoor studeerde ik Built Environment aan de Hogeschool
              Utrecht, waar ik werkte met ArcGIS, duurzaamheid en bouwtechniek.
            </p>
            <p>
              Ik werk nauwkeurig en ben altijd heel betrokken bij projecten. Ik ben communicatief sterk,
              kritisch waar nodig en een echte doorzetter. Ik leer graag nieuwe dingen en zorg er altijd
              voor dat ik nieuwe systemen snel onder de knie krijg.
            </p>
            <p>
              Naast mijn studie ben ik actief als <strong>mantelzorger</strong> en volg ik meerdere
              cursussen op Udemy om mijn kennis continu uit te breiden — van Blender tot Unreal Engine 5.
            </p>
            <div class="personal-facts">
              <div class="fact">
                <span class="fact-icon">🎨</span>
                <span>Schilderen op canvas</span>
              </div>
              <div class="fact">
                <span class="fact-icon">🎸</span>
                <span>Gitaar spelen</span>
              </div>
              <div class="fact">
                <span class="fact-icon">🕹️</span>
                <span>Retro consoles fixen</span>
              </div>
              <div class="fact">
                <span class="fact-icon">🎮</span>
                <span>Unity / Unreal Engine</span>
              </div>
            </div>
          </div>

          <div class="about-cards">
            <div class="stat-card">
              <span class="stat-num">2+</span>
              <span class="stat-label">Jaar ervaring<br>als developer</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">7+</span>
              <span class="stat-label">Udemy<br>cursussen</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">15+</span>
              <span class="stat-label">Technische<br>vaardigheden</span>
            </div>
            <div class="stat-card highlight">
              <span class="stat-icon">🚀</span>
              <span class="stat-label">Open voor<br>stage & werk</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 60px;
      align-items: start;
    }
    .about-text p {
      color: var(--muted);
      margin-bottom: 20px;
      line-height: 1.8;
      font-size: 1rem;
      strong { color: var(--text); font-weight: 500; }
    }
    .personal-facts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 32px;
    }
    .fact {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 12px 16px;
      font-size: 0.875rem;
      color: var(--text);
      .fact-icon { font-size: 1.1rem; }
    }
    .about-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 28px 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: border-color var(--transition);
      &:hover { border-color: rgba(124,107,255,0.3); }
    }
    .stat-num {
      font-family: var(--font-display);
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
    }
    .stat-label {
      font-size: 0.8rem;
      color: var(--muted);
      line-height: 1.4;
    }
    .stat-icon {
      font-size: 1.5rem;
      margin-bottom: 4px;
    }
    .highlight {
      background: linear-gradient(135deg, rgba(124,107,255,0.15), rgba(192,132,252,0.1));
      border-color: rgba(124,107,255,0.3);
    }
    @media (max-width: 900px) {
      .about-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 480px) {
      .personal-facts { grid-template-columns: 1fr; }
    }
  `]
})
export class AboutComponent {}
