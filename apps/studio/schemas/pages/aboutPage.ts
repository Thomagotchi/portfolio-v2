import { defineArrayMember, defineField, defineType } from 'sanity';
import { cells, groups, heading, label, lede, placeholder, preview, seo, strings } from '../objects/fields';

export default defineType({
  name: 'aboutPage', title: 'About', type: 'document', groups,
  fields: [
    placeholder, label, heading(), lede, cells('facts'),
    defineField({ name: 'portrait', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }], description: 'Empty = the dot warp holds the place.' }),
    defineField({ name: 'statementLabel', type: 'string' }), defineField({ name: 'statement', type: 'text', rows: 3 }),
    defineField({ name: 'statementCite', title: 'Statement author', type: 'string', description: 'Set when the statement is a quotation.' }),
    defineField({ name: 'timelineLabel', type: 'string' }), heading('timelineHeading'),
    defineField({ name: 'timeline', type: 'array', of: [defineArrayMember({ type: 'object', name: 'entry', fields: [
      defineField({ name: 'year', type: 'string', validation: (r) => r.required().regex(/^\d{4}$/) }),
      defineField({ name: 'title', type: 'string' }), defineField({ name: 'text', type: 'text', rows: 2 }), strings('tags'),
    ], preview: { select: { title: 'title', subtitle: 'year' } } })] }),
    defineField({ name: 'principlesLabel', type: 'string' }),
    defineField({ name: 'principles', type: 'array', validation: (r) => r.length(3), of: [defineArrayMember({ type: 'object', name: 'principle', fields: [
      defineField({ name: 'title', type: 'string' }), defineField({ name: 'text', type: 'text', rows: 2 }),
    ] })] }),
    defineField({ name: 'ctas', title: 'Buttons', type: 'array', of: [{ type: 'cta' }], validation: (r) => r.max(2) }),
    seo,
  ],
  preview: { ...preview('label'), prepare: ({ p }: { p?: boolean }) => ({ title: 'About', subtitle: p ? 'Placeholder · replace the DA copy' : undefined }) },
});
