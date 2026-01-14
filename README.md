# Interest Calculator (PWA)

This repo provides a Progressive Web App that calculates monthly interest between two dates. The app is installable and works offline after first load.

## Features

- Plain HTML/CSS/JS (no framework)
- PWA: manifest.json + service worker
- Calculates fractional months (avg month = 30.4375 days)
- Shows interest breakdown per month and fractional remainder
- Uses INR currency formatting (en-IN locale)
- Small test suite for calculation helpers (Jest)

## Local development

1. Install dependencies (to run tests):

   npm install

2. Start a static server (or use the Live Server extension in VS Code). For quick testing with a simple server:

   npx http-server -c-1 . -p 8080

3. Visit http://localhost:8080 in a browser. To test service worker and installability, you must use HTTPS or localhost.

## Deployment (GitHub Pages)

1. Merge the `feature/pwa-interest-calculator` branch into `main`.
2. Enable GitHub Pages in repository settings (use `main` branch and `/` root). The site will be available at https://<your-username>.github.io/IntrestClaculator/
3. After deploy, visit the site and open DevTools > Application to verify the Service Worker is active.

## Tests

Run unit tests:

  npm test

CI: A GitHub Actions workflow is included to run tests on push and PR.

## Notes

- To update cache version in `sw.js`, change the `CACHE_NAME` to `interest-pwa-v2` etc.
- Optional features: compound interest toggle, CSV export, exact calendar month calculation.

## Manual QA checklist

- [ ] Inputs validate (start < end, principal > 0, rate >= 0)
- [ ] Example 1: 2026-01-01 to 2026-04-01, principal 10000, rate 1% → interest 300, total 10300
- [ ] Example 2: 2026-01-15 to 2026-03-01, principal 5000, rate 1.5% → interest ≈ 111
- [ ] Install prompt appears (use Chrome/Chromium)
- [ ] Offline load works after first visit (disconnect network and reload)
