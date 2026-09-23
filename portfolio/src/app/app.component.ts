import { Component } from '@angular/core';
import { NavComponent } from './components/nav/nav.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { EducationComponent } from './components/education/education.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ContactComponent } from './components/contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ExperienceComponent,
    EducationComponent,
    ProjectsComponent,
    ContactComponent
  ],
  template: `
    <app-nav></app-nav>
    <main>
      <app-hero></app-hero>
      <app-about></app-about>
      <app-skills></app-skills>
      <app-experience></app-experience>
      <app-education></app-education>
      <app-projects></app-projects>
      <app-contact></app-contact>
    </main>
    <footer>
      <div class="container">
        <p>© 2024 Carolina Sauselé · Gemaakt met Angular</p>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      border-top: 1px solid var(--border);
      padding: 32px 0;
      text-align: center;
      color: var(--muted);
      font-size: 0.85rem;
    }
  `]
})
export class AppComponent {}
