import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="educatie">
      <div class="container">
        <span class="section-label">Achtergrond</span>
        <h2 class="section-title">Edu<span>catie</span></h2>
        <div class="divider"></div>

        <div class="edu-grid">
          <div class="edu-card card" *ngFor="let edu of educations">
            <div class="edu-badge">{{ edu.badge }}</div>
            <div class="edu-body">
              <span class="edu-type">{{ edu.type }}</span>
              <h3>{{ edu.school }}</h3>
              <span class="edu-program">{{ edu.program }}</span>
              <p>{{ edu.description }}</p>
              <div class="edu-tags">
                <span class="tag" *ngFor="let tag of edu.tags">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="courses-section">
          <h3 class="courses-title">📚 Udemy Cursussen</h3>
          <div class="courses-grid">
            <div class="course-item" *ngFor="let course of courses">
              <span class="course-check">✓</span>
              {{ course }}
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .edu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 48px;
    }
    .edu-card {
      display: flex;
      gap: 20px;
    }
    .edu-badge {
      font-size: 2rem;
      flex-shrink: 0;
    }
    .edu-type {
      display: block;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 4px;
    }
    h3 {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 700;
      color: var(--white);
      margin-bottom: 2px;
    }
    .edu-program {
      display: block;
      font-size: 0.85rem;
      color: var(--accent2);
      margin-bottom: 12px;
    }
    p {
      font-size: 0.85rem;
      color: var(--muted);
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .edu-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .courses-section {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 36px;
    }
    .courses-title {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 700;
      color: var(--white);
      margin-bottom: 24px;
    }
    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 12px;
    }
    .course-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.875rem;
      color: var(--muted);
    }
    .course-check {
      color: var(--accent);
      font-weight: 700;
      font-size: 0.8rem;
    }
  `]
})
export class EducationComponent {
  educations = [
    {
      badge: '🎓',
      type: 'Hbo · Huidig',
      school: 'Hogeschool Leiden',
      program: 'Informatica',
      description: 'Volledig stack development, machine learning, Docker, Raspberry Pi, Unity, Flutter, Interface Design en meer.',
      tags: ['Python', 'Java', 'Angular', 'Springboot', 'ML', 'Docker', 'Unity', 'Flutter']
    },
    {
      badge: '🏗️',
      type: 'Hbo',
      school: 'Hogeschool Utrecht',
      program: 'Built Environment',
      description: 'ArcGIS, Smart Sustainable Cities, woninganalyse, ingenieursniveau rekenen, duurzaamheid, brugontwerp en Autodesk Revit.',
      tags: ['ArcGIS', 'Revit', 'Duurzaamheid', 'Waterberging']
    },
    {
      badge: '📜',
      type: 'Voortgezet onderwijs',
      school: 'Rembrandt College, Veenendaal',
      program: 'HAVO Diploma',
      description: 'Vakken: Natuur & Techniek en Natuur & Gezondheid.',
      tags: ['Natuur & Techniek', 'Natuur & Gezondheid']
    }
  ];

  courses: string[] = [
    'Photoshop cursus',
    'Blender cursus',
    'Autodesk Revit cursus',
    'Web Development Bootcamp',
    'Java Full Stack (Springboot & Angular)',
    'The Complete Python cursus',
    'Unreal Engine 5 cursus'
  ];
}
