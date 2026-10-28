// Fails if a Sass function from _tools.scss leaked into built CSS unresolved (e.g. a partial without `@use 'tools'`).
import { readdirSync, readFileSync } from 'node:fs';

const dir = 'apps/web/dist/client';
const bad = readdirSync(dir, { recursive: true })
  .filter((f) => /\.(html|css)$/.test(f))
  .filter((f) => /[:\s(,]fluid\(/.test(readFileSync(`${dir}/${f}`, 'utf8')));
if (bad.length) {
  console.error(`Unresolved fluid() in: ${bad.join(', ')}. Add \`@use 'tools' as *;\` to the partial.`);
  process.exit(1);
}
