import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  icon: string;
  link?: string;
  linkLabel?: string;
  github?: string;
  role?: string;
  type: 'solo' | 'groep';
}

// Projecten staan als statische demo's in dezelfde GitHub Pages-site (map /projecten).

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="projecten">
      <div class="container">
        <span class="section-label">Mijn werk</span>
        <h2 class="section-title">Projec<span>ten</span></h2>
        <div class="divider"></div>

        <div class="projects-grid">
          <div class="project-card card" *ngFor="let project of projects">
            <div class="project-header">
              <span class="project-icon">{{ project.icon }}</span>
              <div class="project-links">
                <span class="type-badge" [class.solo]="project.type === 'solo'">
                  {{ project.type === 'solo' ? 'Solo' : 'Groepsproject' }}
                </span>
                <a *ngIf="project.link" [href]="project.link" class="icon-link" [title]="project.linkLabel || 'Bekijk live demo'">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                  </svg>
                </a>
              </div>
            </div>
            <h3>{{ project.title }}</h3>
            <p class="short-desc">{{ project.description }}</p>
            <p class="long-desc">{{ project.longDescription }}</p>
            <div *ngIf="project.role" class="role-badge">
              <span>Mijn rol: {{ project.role }}</span>
            </div>
            <div class="project-tags">
              <span class="tag" *ngFor="let tag of project.tags">{{ tag }}</span>
            </div>
            <a *ngIf="project.link" [href]="project.link" class="project-cta">
              {{ project.linkLabel || 'Bekijk live demo' }} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }
    .project-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .project-icon { font-size: 1.8rem; }
    .project-links { display: flex; gap: 10px; align-items: center; }
    .type-badge {
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      padding: 3px 10px;
      border-radius: 100px;
      border: 1px solid var(--border);
      color: var(--muted);
      &.solo {
        border-color: rgba(124,107,255,0.3);
        color: var(--accent2);
      }
    }
    .icon-link {
      color: var(--muted);
      transition: color 0.2s;
      &:hover { color: var(--accent); }
    }
    h3 {
      font-family: var(--font-display);
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--white);
    }
    .short-desc {
      font-size: 0.875rem;
      color: var(--text);
      font-weight: 500;
      line-height: 1.5;
    }
    .long-desc {
      font-size: 0.825rem;
      color: var(--muted);
      line-height: 1.6;
      flex: 1;
    }
    .role-badge {
      span {
        font-size: 0.75rem;
        color: var(--accent);
        font-weight: 500;
      }
    }
    .project-cta {
      margin-top: 8px;
      align-self: flex-start;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--white);
      padding: 8px 16px;
      border-radius: 100px;
      border: 1px solid rgba(124,107,255,0.35);
      background: rgba(124,107,255,0.1);
      transition: background 0.2s, border-color 0.2s;
      span { display: inline-block; transition: transform 0.2s; }
      &:hover { background: rgba(124,107,255,0.22); border-color: var(--accent); }
      &:hover span { transform: translateX(3px); }
    }
    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }
  `]
})
export class ProjectsComponent {
  projects: Project[] = [
    {
      title: 'Luxury Products Webshop',
      description: 'Giftcard-systeem gebouwd bovenop een bestaande webshop voor luxeproducten.',
      longDescription: 'Individueel project waarbij ik het volledige giftcard-systeem heb ontworpen en geïmplementeerd: giftcards aanmaken, kopen, inwisselen en saldo beheren. De webshop zelf was aangeleverd door school — mijn bijdrage was de volledige giftcard-functionaliteit.',
      tags: ['Angular', 'Spring Boot', 'PostgreSQL', 'JWT', 'Docker'],
      icon: '🛍️',
      type: 'solo',
      role: 'Volledige ontwikkeling incl. giftcard-systeem',
      link: 'projecten/luxury-products/'
    },
    {
      title: "Aerith's Flower Shop",
      description: 'Webshop voor het bestellen van bloemen met categorieën en orderhistorie.',
      longDescription: 'Individueel project: een full-stack bloemenshop met productbeheer per categorie, winkelwagen, bestelproces en ordergeschiedenis voor ingelogde gebruikers. Authenticatie via JWT.',
      tags: ['Angular', 'Spring Boot', 'PostgreSQL', 'JWT', 'Docker'],
      icon: '🌸',
      type: 'solo',
      role: 'Volledige ontwikkeling',
      link: 'projecten/aeriths-flower-shop/'
    },
    {
      title: 'Space Haven — Ruimtehaven',
      description: 'Beheersysteem voor het parkeren en reserveren van ruimteschepen.',
      longDescription: 'Groepsproject waarbij gebruikers ruimteschepen kunnen registreren en ligplaatsen in de haven kunnen reserveren. Admins beheren dokken, capaciteit en facties. Gebouwd met een volledige REST API en JWT-authenticatie.',
      tags: ['Angular', 'Spring Boot', 'PostgreSQL', 'JWT', 'Docker'],
      icon: '🚀',
      type: 'groep',
      role: 'Frontend & backend development',
      link: 'projecten/space-haven/'
    },
    {
      title: 'Landbouw Minigame',
      description: 'Figma-ontwerp van een pixel-art minigame over duurzaam boeren.',
      longDescription: 'Ontwerp van alle schermen van een minigame waarin je zes beurten lang een boerderij beheert. Elke keuze (zaaien, omheinen, plagen bestrijden) heeft direct effect op geld, bodemkwaliteit en biodiversiteit, en willekeurige gebeurtenissen zoals droogte gooien roet in het eten.',
      tags: ['Figma', 'UI/UX', 'Game design', 'Pixel art'],
      icon: '🌾',
      type: 'solo',
      role: 'UI/UX- en game-ontwerp',
      link: 'projecten/landbouw-minigame/',
      linkLabel: 'Bekijk het ontwerp'
    }
  ];
}
