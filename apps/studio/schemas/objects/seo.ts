import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.max(60).warning('Keep it under 60 characters') }),
    defineField({ name: 'description', type: 'text', rows: 3, validation: (r) => r.max(155).warning('Keep it under 155 characters') }),
    defineField({ name: 'image', type: 'image', fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] }),
    defineField({ name: 'noindex', type: 'boolean', initialValue: false }),
  ],
});
