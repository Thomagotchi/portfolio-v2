// Share image of a case study (1200×630 PNG, built with the site: pages/og/[lang]/[slug].png.ts). Its cover on the
// left in the site's frame, the tag, the title (lead in text, muted part in muted) and the signature on the right;
// text sized to stay readable in a feed thumbnail. Satori lays it out as SVG (fonts from @fontsource, WOFF: Satori
// reads no WOFF2), sharp turns it into a PNG. The cover is fetched from Sanity as a JPEG (inlined).
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';
import { createImageUrlBuilder } from '@sanity/image-url';
import { SITE } from '@/config';
import type { CaseStudy } from '@/lib/types';

const require = createRequire(import.meta.url);
const font = (f: string) => readFile(require.resolve(`@fontsource/${f}`));
const fonts = Promise.all([font('geist/files/geist-latin-500-normal.woff'), font('faculty-glyphic/files/faculty-glyphic-latin-400-normal.woff')]);

const C = { bg: '#0C0C0E', text: '#EDEEF0', muted: '#A0A4AA', line: '#2A2A2E', accent: '#F0606B' };
const LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="7 7 50 50"><g fill="${C.text}"><polygon points="25,9 55,9 55,32 54.8,35 54.22,37.95 53.25,40.8 51.92,43.5 50.25,46 48.26,48.26 46,50.25 43.5,51.92 40.8,53.25 37.95,54.22 35,54.8 32,55 9,55 9,25 18,25 18,46 32,46 33.83,45.88 35.62,45.52 37.36,44.93 39,44.12 40.52,43.11 41.9,41.9 43.11,40.52 44.12,39 44.93,37.36 45.52,35.62 45.88,33.83 46,32 46,18 25,18"/><polygon points="9,9 18,9 18,18 9,18"/></g></svg>`;

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Node | string | false | undefined)[]): Node =>
  ({ type, props: { style: { display: 'flex', ...style }, children: children.filter(Boolean) } });

const builder = createImageUrlBuilder({ projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID, dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production' });

export async function caseOg(cs: CaseStudy, tag: string): Promise<Buffer> {
  const cover = cs.cover?.asset
    ? `data:image/jpeg;base64,${Buffer.from(await (await fetch(builder.image(cs.cover).width(1120).height(1096).fit('crop').format('jpg').quality(80).url())).arrayBuffer()).toString('base64')}`
    : undefined;
  const { lead, muted, tail } = cs.heading;
  const svg = await satori(
    // Satori takes React-shaped elements; plain objects avoid a JSX runtime here.
    h('div', { width: 1200, height: 630, background: C.bg, position: 'relative', fontFamily: 'Display' },
      cover ? { type: 'img', props: { src: cover, width: 560, height: 548, style: { position: 'absolute', left: 41, top: 41, objectFit: 'cover' } } } : h('div', { position: 'absolute', left: 41, top: 41, width: 560, height: 548, background: '#131315' }),
      h('div', { position: 'absolute', left: 40, top: 40, width: 1120, height: 550, border: `1px solid ${C.line}` }),
      h('div', { position: 'absolute', left: 601, top: 41, width: 1, height: 548, background: C.line }),
      h('div', { position: 'absolute', left: 36, top: 36, width: 9, height: 9, background: C.accent }),
      h('div', { position: 'absolute', left: 650, right: 70, bottom: 84, flexDirection: 'column' },
        h('div', { alignItems: 'center', gap: 16, fontFamily: 'Tag', fontSize: 24, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted },
          h('div', { width: 10, height: 10, background: C.accent }), tag),
        h('div', { flexWrap: 'wrap', marginTop: 24, fontSize: 66, lineHeight: 1.02, letterSpacing: '-0.035em', color: C.text },
          `${lead}${muted ? ' ' : ''}`, muted && h('span', { color: C.muted }, `${muted}${tail ? ' ' : ''}`), tail),
        h('div', { alignItems: 'center', gap: 16, marginTop: 40, fontSize: 28, color: C.muted },
          { type: 'img', props: { src: `data:image/svg+xml;base64,${Buffer.from(LOGO).toString('base64')}`, width: 38, height: 38 } }, SITE.name))) as unknown as Parameters<typeof satori>[0],
    { width: 1200, height: 630, fonts: (await fonts).map((data, i) => ({ name: i ? 'Tag' : 'Display', data, weight: i ? 400 : 500, style: 'normal' as const })) },
  );
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
