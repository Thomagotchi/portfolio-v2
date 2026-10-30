# portfolio-v2 · Thomas Sanouiller

Portfolio site built on the astro-sanity-starter stack: Astro 7 + SCSS + GSAP + Lenis + Three.js, Sanity at build time. Every page scores Lighthouse 100 (mobile median of 3 runs) and passes axe.

## Start a project
```sh
nvm use                      # Node 24 (the repo refuses older Node)
corepack enable              # pnpm only: npm cannot install a pnpm workspace
pnpm i
cp .env.example .env         # Sanity project id (required: all content lives in Sanity)
cp <DA>/out/<slug>.tokens.json packages/tokens/tokens.json
pnpm dev                     # site on :4321 (tokens rebuild on change)
pnpm dev:studio              # Sanity Studio on :3333 (needs SANITY_STUDIO_PROJECT_ID)
trail init --agents claude   # code map for cheaper agent sessions
```
Set `SITE` in `apps/web/src/config.ts`.

## Switches (`apps/web/src/config.ts`)
| | |
|---|---|
| `SMOOTH_SCROLL` | Lenis on/off. Off = never downloaded. |
| `SITE.theme` | `dark` / `light` / `auto`, from the DA's semantic tokens. |
| `ALLOW_AI_CRAWLERS` | robots.txt rules for GPTBot, ClaudeBot, PerplexityBot… |
| Hero `scene` | per-block toggle in Sanity. |

## Commands
| | |
|---|---|
| `pnpm check` | lint → build → astro check → HTML/CSS/links → axe → 3D budget → Lighthouse. Must pass. |
| `pnpm new:section Name` | section component + Sanity block + registration |
| `pnpm test:3d` | WebGL frame time and blocking time on a 4× slower CPU |
| `pnpm tokens` | DA tokens → `tokens.css` + `tokens.json` |

## How it stays at 100
- Static HTML, CSS inlined, two variable fonts preloaded, nothing render-blocking.
- All JS (GSAP, Lenis, ScrollTrigger, Three.js) loads after load + fonts + a painted frame (`apps/web/integrations/defer-scripts.mjs`).
- Hero entrance is CSS, transform only (the hero holds the LCP element).
- WebGL refuses software rendering (`failIfMajorPerformanceCaveat`): no GPU → CSS gradient.
