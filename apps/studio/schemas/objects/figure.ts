// A chapter figure inside portable text: the five-step plan, a before/after slider or Lighthouse bars.
import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'figure', title: 'Figure', type: 'object',
  fields: [
    defineField({ name: 'kind', type: 'string', validation: (r) => r.required(), options: { list: [
      { title: 'Steps', value: 'steps' }, { title: 'Before / after slider', value: 'compare' }, { title: 'Lighthouse before / after', value: 'lighthouse' },
    ], layout: 'radio' } }),
    defineField({ name: 'steps', type: 'array', hidden: ({ parent }) => parent?.kind !== 'steps', validation: (r) => r.max(6),
      of: [defineArrayMember({ type: 'object', name: 'step', fields: [
        defineField({ name: 'when', type: 'string', description: 'e.g. W1, W2–3' }), defineField({ name: 'label', type: 'string' }),
      ], preview: { select: { title: 'label', subtitle: 'when' } } })] }),
    defineField({ name: 'before', title: 'Before caption', type: 'string', hidden: ({ parent }) => parent?.kind !== 'compare' }),
    defineField({ name: 'after', title: 'After caption', type: 'string', hidden: ({ parent }) => parent?.kind !== 'compare' }),
    defineField({ name: 'scores', type: 'array', hidden: ({ parent }) => parent?.kind !== 'lighthouse',
      of: [defineArrayMember({ type: 'object', name: 'score', fields: [
        defineField({ name: 'label', type: 'string' }),
        defineField({ name: 'before', type: 'number', validation: (r) => r.min(0).max(100) }),
        defineField({ name: 'after', type: 'number', validation: (r) => r.min(0).max(100) }),
      ], preview: { select: { title: 'label', b: 'before', a: 'after' }, prepare: ({ title, b, a }) => ({ title, subtitle: `${b} → ${a}` }) } })] }),
  ],
  preview: { select: { kind: 'kind' }, prepare: ({ kind }) => ({ title: `Figure · ${kind}` }) },
});
