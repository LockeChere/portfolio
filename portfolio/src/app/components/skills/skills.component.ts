import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SkillGroup {
  category: string;
  icon: string;
  skills: string[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="vaardigheden">
      <div class="container">
        <span class="section-label">Wat ik kan</span>
        <h2 class="section-title">Vaardig<span>heden</span></h2>
        <div class="divider"></div>

        <div class="skills-grid">
          <div class="skill-group card" *ngFor="let group of skillGroups">
            <div class="group-header">
              <span class="group-icon">{{ group.icon }}</span>
              <h3>{{ group.category }}</h3>
            </div>
            <div class="skill-tags">
              <span class="tag" *ngFor="let skill of group.skills">{{ skill }}</span>
            </div>
          </div>
        </div>

        <div class="soft-skills">
          <h3 class="soft-title">Persoonlijke kwaliteiten</h3>
          <div class="soft-grid">
            <div class="soft-item" *ngFor="let s of softSkills">
              <span class="soft-dot"></span>
              {{ s }}
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 48px;
    }
    .group-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      .group-icon { font-size: 1.4rem; }
      h3 {
        font-family: var(--font-display);
        font-size: 1rem;
        font-weight: 700;
        color: var(--white);
      }
    }
    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .soft-skills {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 36px;
    }
    .soft-title {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 700;
      color: var(--white);
      margin-bottom: 24px;
    }
    .soft-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 12px;
    }
    .soft-item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--muted);
      font-size: 0.9rem;
    }
    .soft-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      flex-shrink: 0;
    }
  `]
})
export class SkillsComponent {
  skillGroups: SkillGroup[] = [
    {
      category: 'Programmeertalen',
      icon: '💻',
      skills: ['Python', 'Java', 'JavaScript', 'SQL', 'HTML/CSS']
    },
    {
      category: 'Frameworks & Tools',
      icon: '⚙️',
      skills: ['Angular', 'Springboot', 'Vue3', 'Docker', 'ETL']
    },
    {
      category: 'Data & AI',
      icon: '🧠',
      skills: ['Machine Learning', 'Clustering', 'Classificatie', 'Raspberry Pi']
    },
    {
      category: 'Design & 3D',
      icon: '🎨',
      skills: ['Autodesk Revit', 'ArcGIS', 'Photoshop', 'Blender', 'Unity', 'Unreal Engine 5', 'Tiled']
    },
    {
      category: 'Overig',
      icon: '🛠️',
      skills: ['Adobe Acrobat', 'Interface Design', 'Full Stack Development', 'Engels', 'Rijbewijs B']
    }
  ];

  softSkills: string[] = [
    'Nauwkeurig', 'Communicatief sterk', 'Kritisch', 'Doorzetter',
    'Doelgericht', 'Eerlijk', 'Geduldig', 'Praktisch',
    'Snel leren', 'Motiverend', 'Samenwerkend'
  ];
}
