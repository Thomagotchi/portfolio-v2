import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'cta',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'href', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'variant', type: 'string', initialValue: 'surface',
      description: 'Accent: the main action, once per group. Surface: every other button.',
      options: { list: ['accent', 'surface'], layout: 'radio', direction: 'horizontal' },
    }),
  ],
});
