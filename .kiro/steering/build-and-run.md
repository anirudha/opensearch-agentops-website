---
inclusion: manual
---

# Build & Run Locally

This project has two separate Astro apps (main site + Starlight docs) that get merged into a single `dist/` for GitHub Pages. To test end-to-end locally with working docs links:

## Steps

1. Install dependencies for both projects:
   ```bash
   npm install
   ```

2. Run the full production build (builds main site, builds starlight docs, merges into `dist/`):
   ```bash
   npm run build
   ```

3. Create the path-correct serving directory (GitHub Pages serves under `/opensearch-agentops-website/`):
   ```bash
   mkdir -p dist-serve/opensearch-agentops-website
   cp -r dist/* dist-serve/opensearch-agentops-website/
   ```

4. Serve locally:
   ```bash
   serve dist-serve -l 4321
   ```

5. Visit http://localhost:4321/opensearch-agentops-website/

## Notes

- The `base` path in both `astro.config.mjs` files is `/opensearch-agentops-website` (and `/opensearch-agentops-website/docs` for starlight). A plain `serve dist` won't work because the built assets expect that base path.
- `dist-serve/` is a temporary folder for local testing — don't commit it.
- The starlight docs dependencies are installed automatically during `npm run build:starlight` via `npm ci`.
