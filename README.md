# Portfolio – Carolina Sauselé

Mijn portfolio met al mijn projecten, volledig statisch gehost op **GitHub Pages**. Er is geen server, Docker of database nodig.

| Project | Wat je ziet | Map |
|---|---|---|
| Portfolio | De portfolio-site zelf (Angular) | `portfolio/` |
| Luxury Products Webshop | Werkende webshop met het giftcard-systeem | `projecten/luxury-products/` |
| Aerith's Flower Shop | Werkende bloemenshop | `projecten/aeriths-flower-shop/` |
| Space Haven | Werkend reserveringssysteem voor ruimteschepen | `projecten/space-haven/` |
| Landbouw Minigame | Galerij van het Figma-ontwerp | `projecten/landbouw-minigame/` |

## Hoe werken de projecten zonder backend?

De Angular-frontends praten niet meer met de Spring Boot-API. Ze gebruiken een kleine "demo-database" in de browser (localStorage) die dezelfde regels volgt als de echte backend. Bij de webshop betekent dat bijvoorbeeld dat de voorraad afneemt, dat er bij het kopen van een cadeaubon een code wordt aangemaakt en dat je die code later weer kunt inwisselen. Iedere bezoeker begint met dezelfde voorbeelddata, en wat je verandert blijft alleen in je eigen browser bewaard. Met de knop **Reset data** in de demobalk zet je alles terug naar de beginstand.

De code daarvoor staat per project in `src/app/demo/`. De originele backend-code van Luxury Products staat nog in `projecten/luxury-products/backend/`, zodat je kunt laten zien hoe de Spring Boot-kant in elkaar zit.

### Demo-accounts

| Project | Admin | Gebruiker |
|---|---|---|
| Luxury Products | `admin@test.nl` / `Admin123!` | `demo@test.nl` / `Demo123!` (testcadeaubon: `DEMO-100`) |
| Aerith's Flower Shop | `admin@example.com` (elk wachtwoord) | elk ander e-mailadres |
| Space Haven | `admin@haven.nl` / `Admin123!` | `user@haven.nl` / `User123!` |

Je kunt in elk project ook zelf een nieuw account registreren.

## Online zetten (eenmalig)

1. Maak op GitHub een nieuwe **public** repository aan.
   - Noem je hem `<jouw-gebruikersnaam>.github.io`, dan komt de site op `https://<jouw-gebruikersnaam>.github.io/`.
   - Kies je een andere naam, bijvoorbeeld `portfolio`, dan komt hij op `https://<jouw-gebruikersnaam>.github.io/portfolio/`. Allebei werken, want alle links zijn relatief.
2. Deze map is al een git-repository met één commit op `main`. Open een terminal in de map en push hem naar je nieuwe repository:
   ```bash
   git remote add origin https://github.com/<jouw-gebruikersnaam>/<repo-naam>.git
   git push -u origin main
   ```
3. Ga in de repository naar **Settings → Pages** en kies bij *Source* voor **GitHub Actions**.
4. Open het tabblad **Actions**. De workflow *Deploy naar GitHub Pages* bouwt alles, wat een paar minuten duurt. Zodra hij groen is, staat je site online.

Daarna gaat het vanzelf: elke `git push` naar `main` bouwt en publiceert de site opnieuw.

### Eigen domein (optioneel)

Wil je `carolinasausele.nl` blijven gebruiken? Maak dan in de hoofdmap een bestand `CNAME` met alleen `carolinasausele.nl` erin, en stel bij je domeinprovider de DNS-records in die GitHub noemt onder **Settings → Pages → Custom domain**. Let op: de oude subdomeinen (zoals `spacehaven.carolinasausele.nl`) werken daarna niet meer, want de projecten staan dan op `carolinasausele.nl/projecten/...`.

## Lokaal draaien

```bash
bash scripts/build-site.sh     # bouwt alles naar _site/
npx http-server _site          # of: python -m http.server -d _site
```

Voor het ontwikkelen aan één project gebruik je gewoon `npm install` en `npm start` in de map van dat project.

## Wat er is aangepast ten opzichte van de schoolversies

- De backend-aanroepen zijn vervangen door de demo-database in de browser (`src/app/demo/`).
- De apps gebruiken hash-routing (`/#/products`) en een relatieve `base href`. Daardoor werken ze in een submap van GitHub Pages en geven ze geen 404 bij het verversen van de pagina.
- Er is een demobalk met inloggegevens, een link terug naar het portfolio en een resetknop (`src/assets/demo-banner.js`).
- Docker-, nginx- en GitLab CI-bestanden van de frontends zijn weggehaald. De bouw gaat nu via `.github/workflows/deploy.yml`.
- De productfoto's van de Flower Shop zijn verkleind (van 63 MB naar 5 MB).
- Een paar kleine bugs zijn opgelost:
  - Flower Shop: de checkout crashte door een typfout (`cartType` in plaats van `cardType`), en de categorie- en zoekfilters werden overschreven.
  - Luxury Products: de ➕-knop in de winkelwagen deed niets.
  - Space Haven: afbeeldingen en lettertypes laadden alleen vanuit de root van het domein.
