import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'cta',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'href', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'variant', type: 'string', initialValue: 'primary',
      description: 'Primary once per view; accent on offers and footers, never twice in a view.',
      options: { list: ['primary', 'accent', 'secondary', 'surface', 'link'], layout: 'radio', direction: 'horizontal' },
    }),
  ],
});
