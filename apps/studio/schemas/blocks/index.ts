// One block per section component in apps/web/src/components/sections. name = Sanity _type.
import { defineArrayMember, defineField, defineType } from 'sanity';

const label = defineField({ name: 'label', title: 'Tag', type: 'string', description: 'Serif capitals, e.g. 02 · In numbers' });
const heading = defineField({ name: 'heading', type: 'headline', validation: (r) => r.required() });
const anchor = defineField({ name: 'anchor', type: 'string', description: 'Section id for nav links (#anchor).' });
const strings = (name: string) => defineField({ name, type: 'array', of: [{ type: 'string' }] });
const ctas = defineField({ name: 'ctas', title: 'Buttons', type: 'array', of: [{ type: 'cta' }], validation: (r) => r.max(2) });
const sub = (title: string) => ({ select: { h: 'heading.lead', l: 'label' }, prepare: ({ h, l }: { h?: string; l?: string }) => ({ title: h ?? l ?? title, subtitle: title }) });

const hero = defineType({
  name: 'hero', type: 'object',
  fields: [label, heading, defineField({ name: 'text', type: 'text', rows: 2 }), ctas,
    defineField({ name: 'scene', title: 'Dot terrain (WebGL)', type: 'boolean', initialValue: true })],
  preview: sub('Hero'),
});

const kpi = defineType({
  name: 'kpi', title: 'KPI', type: 'object',
  fields: [label, heading, defineField({
    name: 'stats', type: 'array', validation: (r) => r.min(1).max(4),
    of: [defineArrayMember({ type: 'object', name: 'stat', fields: [
      defineField({ name: 'value', type: 'string', validation: (r) => r.required() }),
      defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    ], preview: { select: { title: 'value', subtitle: 'label' } } })],
  })],
  preview: sub('KPI'),
});

const builtWith = defineType({
  name: 'builtWith', title: 'Built with', type: 'object',
  fields: [{ ...label, validation: (r) => r.required() }, { ...strings('items'), validation: (r) => r.max(4) }],
  preview: sub('Built with'),
});

const statement = defineType({
  name: 'statement', type: 'object',
  fields: [label, anchor, defineField({ name: 'text', type: 'text', rows: 4, validation: (r) => r.required().max(240) })],
  preview: { select: { title: 'text' }, prepare: ({ title }) => ({ title, subtitle: 'Statement' }) },
});

const stack = defineType({
  name: 'stack', type: 'object',
  fields: [label, heading, defineField({
    name: 'groups', type: 'array',
    of: [defineArrayMember({ type: 'object', name: 'group', fields: [
      defineField({ name: 'name', type: 'string', validation: (r) => r.required() }), strings('tools'),
    ] })],
  })],
  preview: sub('Stack'),
});

const offers = defineType({
  name: 'offers', type: 'object',
  fields: [label, anchor, defineField({
    name: 'items', type: 'array',
    of: [defineArrayMember({ type: 'object', name: 'offer', fields: [
      defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
      defineField({ name: 'meta', type: 'string' }),
      defineField({ name: 'href', type: 'string', description: 'Optional: the row links when set.' }),
    ] })],
  }), ctas],
  preview: sub('Offers'),
});

const work = defineType({
  name: 'work', type: 'object',
  fields: [label, anchor, heading, defineField({
    name: 'items', type: 'array',
    of: [defineArrayMember({ type: 'object', name: 'project', fields: [
      defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
      defineField({ name: 'meta', type: 'string' }),
      defineField({ name: 'category', type: 'string', description: 'Filter tab', validation: (r) => r.required() }),
      defineField({ name: 'href', type: 'string', description: 'Case study link: shows the View pill.' }),
    ], preview: { select: { title: 'title', subtitle: 'category' } } })],
  })],
  preview: sub('Work'),
});

const faq = defineType({
  name: 'faq', title: 'FAQ', type: 'object',
  description: 'Answer first: 1–2 sentences that stand on their own (GEO).',
  fields: [
    defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'items', type: 'array', of: [{ type: 'object', fields: [
      defineField({ name: 'question', type: 'string', validation: (r) => r.required() }),
      defineField({ name: 'answer', type: 'text', rows: 3, validation: (r) => r.required() }),
    ] }] }),
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title, subtitle: 'FAQ' }) },
});

export const blocks = [hero, kpi, builtWith, statement, stack, offers, work, faq];
