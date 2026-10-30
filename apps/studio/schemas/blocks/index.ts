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

const statement = defineType({
  name: 'statement', type: 'object',
  fields: [
    label, anchor, defineField({ name: 'text', type: 'text', rows: 4, validation: (r) => r.required().max(280) }),
    defineField({ name: 'cite', type: 'string', description: 'Set when the text is a quotation: who said it.' }),
  ],
  preview: { select: { title: 'text' }, prepare: ({ title }) => ({ title, subtitle: 'Statement' }) },
});

const stack = defineType({
  name: 'stack', title: 'Tools', type: 'object',
  fields: [label, heading, { ...strings('tools'), description: 'One card each; 4 per row on desktop, 2 on mobile.', validation: (r) => r.max(16) }],
  preview: sub('Tools'),
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

// Process: the steps of a project in order, a title each. Steps that depend on an option (`when` = a toggle
// key) fold away when the visitor switches that option off. The toggles also preset the
// pricing simulator (opt = option index, care = care plan index in the pricing document).
const process = defineType({
  name: 'process', type: 'object',
  fields: [
    label, heading, anchor,
    defineField({ name: 'togglesLabel', title: 'Toggles legend', type: 'string', description: 'e.g. Votre projet comprend' }),
    defineField({
      name: 'toggles', type: 'array', validation: (r) => r.max(4),
      of: [defineArrayMember({ type: 'object', name: 'toggle', fields: [
        defineField({ name: 'key', type: 'string', description: 'Matched by the steps\' "Only with" field, e.g. design.', validation: (r) => r.required().regex(/^[a-z]+$/) }),
        defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'opt', title: 'Pricing option index', type: 'number', description: 'Option switched on in the simulator (0 = first option).' }),
        defineField({ name: 'care', title: 'Pricing care plan index', type: 'number', description: 'Care plan picked in the simulator (0 = none).' }),
      ], preview: { select: { title: 'label', subtitle: 'key' } } })],
    }),
    defineField({
      name: 'steps', type: 'array', validation: (r) => r.required().max(14),
      of: [defineArrayMember({ type: 'object', name: 'processStep', fields: [
        defineField({ name: 'title', type: 'string', validation: (r) => r.required().max(48) }),
        defineField({ name: 'when', title: 'Only with', type: 'string', description: 'A toggle key (e.g. design): the step folds away when it is off. Empty = always.' }),
      ], preview: { select: { title: 'title', w: 'when' }, prepare: ({ title, w }: { title?: string; w?: string }) => ({ title, subtitle: w ? `only with ${w}` : undefined }) } })],
    }),
    ctas,
  ],
  preview: sub('Process'),
});

export const blocks = [hero, kpi, statement, stack, offers, work, faq, process];
