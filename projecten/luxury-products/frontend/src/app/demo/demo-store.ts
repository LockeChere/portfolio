/**
 * Demo-opslag voor de GitHub Pages-versie.
 * In plaats van de Spring Boot-backend worden gegevens in de browser (localStorage) bewaard.
 * Iedere bezoeker begint met dezelfde voorbeelddata; wijzigingen blijven alleen in de eigen browser.
 */
export class DemoStore<T> {
  constructor(private key: string, private seed: () => T) {}

  get(): T {
    try {
      const raw = localStorage.getItem('demo:' + this.key);
      if (raw) return JSON.parse(raw) as T;
    } catch { /* ignore */ }
    const data = this.seed();
    this.set(data);
    return data;
  }

  set(value: T): void {
    try { localStorage.setItem('demo:' + this.key, JSON.stringify(value)); } catch { /* ignore */ }
  }
}

export function resetDemoData(): void {
  try {
    Object.keys(localStorage).filter(k => k.startsWith('demo:')).forEach(k => localStorage.removeItem(k));
  } catch { /* ignore */ }
}
