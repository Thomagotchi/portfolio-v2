// Lighthouse 100 on every page. 404 is noindex, so its SEO score is skipped.
// Median of 3 runs: stricter than LHCI's default (best run). Not 'median-run': it skips category scores.
const m = { aggregationMethod: 'median' };
const strict = {
  'categories:performance': ['error', { minScore: 1, ...m }],
  'categories:accessibility': ['error', { minScore: 1, ...m }],
  'categories:best-practices': ['error', { minScore: 1, ...m }],
  'categories:seo': ['error', { minScore: 1, ...m }],
  'total-blocking-time': ['error', { maxNumericValue: 150, ...m }],
  'cumulative-layout-shift': ['error', { maxNumericValue: 0, ...m }],
};
const notFound = { ...strict };
delete notFound['categories:seo'];

module.exports = {
  ci: {
    collect: {
      staticDistDir: './apps/web/dist/client',
      // Every French page (autodiscovery stops at 5) and each English template; LHCI swaps in the static
      // server's port. Add new routes here.
      url: [
        'index', 'a-propos', 'contact', 'tarifs', '404', 'projets/audion', 'projets/la-premiere-brique',
        'en/index', 'en/about', 'en/contact', 'en/pricing', 'en/work/audion',
      ].map((p) => `http://localhost/${p}.html`),
      numberOfRuns: 3,
      settings: {
        preset: process.env.LH_PRESET === 'desktop' ? 'desktop' : undefined,
        // Real GPU when there is one, so WebGL is measured as users get it (no GPU → hero fallback).
        chromeFlags: '--enable-gpu --ignore-gpu-blocklist --use-angle=metal',
      },
    },
    assert: {
      assertMatrix: [
        { matchingUrlPattern: '^(?!.*/404).*$', assertions: strict },
        { matchingUrlPattern: '.*/404.*', assertions: notFound },
      ],
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
};
