import { defineArrayMember, defineField, defineType } from 'sanity';
import { blocks } from '../blocks';

export default defineType({
  name: 'page',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, description: 'Use "index" for the home page.', validation: (r) => r.required() }),
    defineField({ name: 'blocks', type: 'array', of: blocks.map((b) => defineArrayMember({ type: b.name })) }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
