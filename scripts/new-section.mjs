// pnpm new:section <Name>: section component + Sanity block + registration in Blocks.astro and blocks/index.ts.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const Name = process.argv[2];
if (!/^[A-Z][A-Za-z0-9]+$/.test(Name ?? '')) throw new Error('Usage: pnpm new:section PascalName');
const type = Name[0].toLowerCase() + Name.slice(1);
const comp = `apps/web/src/components/sections/${Name}.astro`;
if (existsSync(comp)) throw new Error(`${comp} exists`);

writeFileSync(comp, `---
import Seam from '@/components/ui/Seam.astro';
import type { ${Name}Block } from '@/lib/types';

interface Props { block: ${Name}Block }
const { block } = Astro.props;
---
<section class="section">
  <Seam />
  <div class="wrap">
    <h2 data-reveal>{block.heading}</h2>
  </div>
</section>
`);

const edit = (file, find, replace) => {
  const s = readFileSync(file, 'utf8');
  if (!s.includes(find)) throw new Error(`Anchor not found in ${file}: ${find}`);
  writeFileSync(file, s.replace(find, replace));
};

edit('apps/web/src/components/sections/Blocks.astro', "\ninterface Props", `import ${Name} from './${Name}.astro';\n\ninterface Props`);
edit('apps/web/src/components/sections/Blocks.astro', ' } as const;', `, ${type}: ${Name} } as const;`);
edit('apps/web/src/lib/types.ts', 'export type Block = ', `export type ${Name}Block = { _type: '${type}'; _key: string; heading: string };\nexport type Block = ${Name}Block | `);
edit('apps/studio/schemas/blocks/index.ts', 'export const blocks = [', `const ${type} = defineType({
  name: '${type}', type: 'object',
  fields: [defineField({ name: 'heading', type: 'string', validation: (r) => r.required() })],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title, subtitle: '${Name}' }) },
});

export const blocks = [`);
{
  const f = 'apps/studio/schemas/blocks/index.ts';
  writeFileSync(f, readFileSync(f, 'utf8').replace(/(export const blocks = \[[^\]]*)\]/, `$1, ${type}]`));
}
console.log(`Created ${comp} + Sanity block '${type}'. Axe covers it once a page uses it.`);
