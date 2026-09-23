#!/usr/bin/env bash
# Bouwt de portfolio en alle projecten en zet alles samen in _site/ (wat GitHub Pages publiceert).
# Lokaal draaien: bash scripts/build-site.sh  (daarna bv. npx http-server _site)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/_site"
export CYPRESS_INSTALL_BINARY=0   # Cypress (e2e-tests Luxury Products) is niet nodig voor de build
export NG_CLI_ANALYTICS=false

build_angular () {   # $1 = map met angular-project, $2 = doelmap in _site
  local dir="$ROOT/$1" dest="$OUT/$2"
  echo "▶ Bouwen: $1"
  (cd "$dir" && npm ci --no-audit --no-fund && npx ng build --configuration production --base-href ./)
  local browser
  browser="$(find "$dir/dist" -maxdepth 2 -type d -name browser | head -n 1)"
  mkdir -p "$dest"
  cp -r "$browser"/. "$dest"/
}

rm -rf "$OUT"
mkdir -p "$OUT"

build_angular portfolio                          .
build_angular projecten/aeriths-flower-shop      projecten/aeriths-flower-shop
build_angular projecten/luxury-products/frontend projecten/luxury-products
build_angular projecten/space-haven              projecten/space-haven

echo "▶ Kopiëren: Landbouw minigame (statisch ontwerp)"
mkdir -p "$OUT/projecten/landbouw-minigame"
cp -r "$ROOT/projecten/landbouw-minigame"/. "$OUT/projecten/landbouw-minigame"/

# Eigen domein (optioneel): zet je domein in een bestand CNAME in de hoofdmap van de repo.
[ -f "$ROOT/CNAME" ] && cp "$ROOT/CNAME" "$OUT/CNAME"
touch "$OUT/.nojekyll"
echo "✔ Klaar: $OUT"
