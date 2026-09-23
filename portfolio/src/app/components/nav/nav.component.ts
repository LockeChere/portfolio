import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav [class.scrolled]="scrolled()">
      <div class="nav-inner">
        <a class="logo" href="#hero">CS<span>.</span></a>
        <ul class="nav-links">
          <li><a href="#over-mij">Over mij</a></li>
          <li><a href="#vaardigheden">Vaardigheden</a></li>
          <li><a href="#ervaring">Ervaring</a></li>
          <li><a href="#educatie">Educatie</a></li>
          <li><a href="#projecten">Projecten</a></li>
          <li><a href="#contact" class="nav-cta">Contact</a></li>
        </ul>
        <button class="burger" (click)="toggleMenu()" [class.open]="menuOpen()">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="mobile-menu" [class.open]="menuOpen()">
        <a href="#over-mij"     (click)="toggleMenu()">Over mij</a>
        <a href="#vaardigheden" (click)="toggleMenu()">Vaardigheden</a>
        <a href="#ervaring"     (click)="toggleMenu()">Ervaring</a>
        <a href="#educatie"     (click)="toggleMenu()">Educatie</a>
        <a href="#projecten"    (click)="toggleMenu()">Projecten</a>
        <a href="#contact"      (click)="toggleMenu()">Contact</a>
      </div>
    </nav>
  `,
  styles: [`
    nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 1000;
      padding: 20px 40px;
      transition: all 0.4s ease;
    }
    nav.scrolled {
      background: rgba(10,10,15,0.85);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      padding: 14px 40px;
    }
    .nav-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--white);
      span { color: var(--accent); }
    }
    .nav-links {
      display: flex;
      list-style: none;
      gap: 36px;
      align-items: center;
      a {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--muted);
        transition: color 0.2s;
        &:hover { color: var(--white); }
      }
      .nav-cta {
        background: linear-gradient(135deg, var(--accent), var(--accent2));
        color: #fff !important;
        padding: 8px 20px;
        border-radius: 100px;
        font-weight: 600;
        transition: opacity 0.2s, transform 0.2s;
        &:hover { opacity: 0.85; transform: translateY(-1px); }
      }
    }
    .burger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      span {
        display: block;
        width: 22px;
        height: 2px;
        background: var(--text);
        border-radius: 2px;
        transition: all 0.3s;
      }
      &.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
      &.open span:nth-child(2) { opacity: 0; }
      &.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
    }
    .mobile-menu {
      display: none;
      flex-direction: column;
      gap: 20px;
      padding: 20px 0 10px;
      a {
        font-size: 1rem;
        color: var(--muted);
        font-weight: 500;
        &:hover { color: var(--white); }
      }
    }
    @media (max-width: 768px) {
      nav { padding: 16px 20px; }
      nav.scrolled { padding: 12px 20px; }
      .nav-links { display: none; }
      .burger { display: flex; }
      .mobile-menu.open { display: flex; }
    }
  `]
})
export class NavComponent {
  scrolled = signal(false);
  menuOpen = signal(false);

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 40);
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }
}
