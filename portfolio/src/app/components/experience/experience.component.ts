import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Experience {
  title: string;
  company: string;
  period: string;
  current: boolean;
  tasks: string[];
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="ervaring">
      <div class="container">
        <span class="section-label">Werkervaring</span>
        <h2 class="section-title">Erva<span>ring</span></h2>
        <div class="divider"></div>

        <div class="timeline">
          <div class="timeline-item" *ngFor="let exp of experiences">
            <div class="timeline-dot" [class.active]="exp.current"></div>
            <div class="timeline-content card">
              <div class="exp-header">
                <div>
                  <h3>{{ exp.title }}</h3>
                  <span class="company">{{ exp.company }}</span>
                </div>
                <span class="period" [class.current-badge]="exp.current">
                  {{ exp.current ? '● ' : '' }}{{ exp.period }}
                </span>
              </div>
              <ul class="task-list">
                <li *ngFor="let task of exp.tasks">{{ task }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .timeline {
      display: flex;
      flex-direction: column;
      gap: 0;
      position: relative;
      padding-left: 36px;

      &::before {
        content: '';
        position: absolute;
        left: 7px;
        top: 0; bottom: 0;
        width: 1px;
        background: linear-gradient(to bottom, var(--accent), transparent);
      }
    }
    .timeline-item {
      position: relative;
      margin-bottom: 28px;
    }
    .timeline-dot {
      position: absolute;
      left: -32px;
      top: 28px;
      width: 14px; height: 14px;
      border-radius: 50%;
      border: 2px solid var(--border);
      background: var(--bg);
      transition: all 0.3s;
      &.active {
        border-color: var(--accent);
        background: var(--accent);
        box-shadow: 0 0 12px rgba(124,107,255,0.5);
      }
    }
    .timeline-item:hover .timeline-dot {
      border-color: var(--accent);
    }
    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    h3 {
      font-family: var(--font-display);
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--white);
      margin-bottom: 4px;
    }
    .company {
      font-size: 0.85rem;
      color: var(--accent);
    }
    .period {
      font-size: 0.8rem;
      color: var(--muted);
      white-space: nowrap;
      padding: 4px 12px;
      background: var(--surface2);
      border-radius: 100px;
      border: 1px solid var(--border);
    }
    .current-badge {
      color: var(--accent2);
      border-color: rgba(124,107,255,0.3);
    }
    .task-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      li {
        font-size: 0.9rem;
        color: var(--muted);
        padding-left: 16px;
        position: relative;
        &::before {
          content: '→';
          position: absolute;
          left: 0;
          color: var(--accent);
          font-size: 0.8rem;
        }
      }
    }
  `]
})
export class ExperienceComponent {
  experiences: Experience[] = [
    {
      title: 'Mantelzorger',
      company: 'Privé',
      period: 'Februari 2020 – heden',
      current: true,
      tasks: [
        'Volledige zorg en ondersteuning bieden aan een naaste',
        'Planning en coördinatie van dagelijkse activiteiten',
        'Communicatie met zorgprofessionals en instanties'
      ]
    },
    {
      title: 'Revit Coördinator',
      company: 'Bouwbedrijf (stage/opdracht)',
      period: 'Januari 2022 – September 2022',
      current: false,
      tasks: [
        'Aanpassen van bouwtekeningen in Autodesk Revit',
        'Controle op de juistheid van afmetingen',
        'Omzetten van bouwtekeningen naar PDF bestanden'
      ]
    },
    {
      title: 'Medewerker',
      company: 'Kringloopwinkel Restore',
      period: 'Januari 2016 – Februari 2016',
      current: false,
      tasks: [
        'Beheren van de kassa en afrekenen van klanten',
        'Klanten helpen met vragen',
        'Schoonmaken en ordenen van artikelen'
      ]
    }
  ];
}
