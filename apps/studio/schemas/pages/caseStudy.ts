import { defineArrayMember, defineField, defineType } from 'sanity';
import { cells, groups, heading, label, lede, placeholder, preview, seo } from '../objects/fields';

const image = (name: string) => defineField({ name, type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] });

export default defineType({
  name: 'caseStudy', title: 'Case study', type: 'document', groups,
  fields: [
    placeholder,
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'category', type: 'string', description: 'Work list filter, e.g. Webflow' }),
    defineField({ name: 'summary', type: 'string', description: 'One line for the work list and the next-project row.' }),
    label, heading(), lede,
    cells('meta', 'Client, year, role, stack, live, agency'),
    cells('results', 'Measured figures only, roll in as odometers (e.g. +38%, 0.8s). Empty = no results section.'),
    defineField({ name: 'source', title: 'Original case study', type: 'link', description: 'Agency work: link to the agency case study (required by the agency).' }),
    image('cover'),
    defineField({ name: 'chapters', type: 'array', of: [defineArrayMember({ type: 'object', name: 'chapter', fields: [
      defineField({ name: 'label', type: 'string', description: 'e.g. 02 · Approach' }), heading(),
      defineField({ name: 'body', type: 'array', of: [defineArrayMember({ type: 'block', styles: [{ title: 'Normal', value: 'normal' }], lists: [] }), defineArrayMember({ type: 'figure' })] }),
    ], preview: { select: { title: 'label', subtitle: 'heading.lead' } } })] }),
    defineField({ name: 'quote', type: 'object', fields: [defineField({ name: 'text', type: 'text', rows: 3 }), defineField({ name: 'cite', type: 'string' })] }),
    defineField({ name: 'gallery', type: 'array', of: [defineArrayMember({ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] })], validation: (r) => r.max(2) }),
    defineField({ name: 'next', title: 'Next project', type: 'reference', to: [{ type: 'caseStudy' }] }),
    seo,
  ],
  preview: preview('title'),
});
