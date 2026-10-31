import { defineArrayMember, defineField, defineType } from 'sanity';
import { cells, groups, heading, image, label, lede, placeholder, preview, seo, slug } from '../objects/fields';

// Credit order: the site lists every team in this order (same keys as apps/web/src/lib/roles.ts).
const ROLES = [
  ['direction', 'Direction'], ['strategy', 'Strategy'], ['creative', 'Creative direction'], ['art', 'Art direction'],
  ['webdesign', 'Web design'], ['copy', 'Copywriting'], ['dev', 'Web development'], ['threeD', '3D'], ['motion', 'Motion design'],
  ['illustration', 'Illustration'], ['product', 'Product design'], ['photo', 'Photography'], ['pm', 'Project management'],
].map(([value, title]) => ({ value, title }));
const video = (name: string, title: string, description: string) => defineField({ name, title, type: 'file', description, options: { accept: 'video/mp4,video/webm' } });

export default defineType({
  name: 'caseStudy', title: 'Case study', type: 'document', groups,
  fields: [
    placeholder,
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    slug('Same slug in both languages: the URL is /projets/<slug> and /en/work/<slug>.'),
    defineField({ name: 'category', type: 'string', description: 'Work list filter, e.g. Webflow' }),
    defineField({ name: 'summary', type: 'string', description: 'One line for the work list and the next-project row.' }),
    label, heading(), lede,
    cells('meta', 'In this order on every case study: Client, Année/Year, Rôle/Role, Stack (tools separated by " / "), Agence/Agency, Site (with its link).'),
    cells('results', 'Measured figures only, roll in as odometers (e.g. +38%, 0.8s). Empty = no results section.'),
    defineField({ name: 'source', title: 'Original case study', type: 'link', description: 'Agency work: link to the agency case study (required by the agency).' }),
    image('cover', 'Cover', 'Under the header, 2:1. Empty = hatched placeholder. Also the poster of the cover video.'),
    video('coverVideo', 'Cover video', 'Optional: plays (muted, looped) in place of the cover image, which stays its poster.'),
    defineField({ name: 'chapters', type: 'array', of: [defineArrayMember({ type: 'object', name: 'chapter', fields: [
      defineField({ name: 'label', type: 'string', description: 'e.g. 02 · Approach' }), heading(),
      defineField({ name: 'body', type: 'array', of: [defineArrayMember({ type: 'block', styles: [{ title: 'Normal', value: 'normal' }], lists: [] }), defineArrayMember({ type: 'figure' })] }),
      defineField({ name: 'team', title: 'Show the team here', type: 'boolean', description: 'Lists the Team field below in this chapter (one line per role).' }),
    ], preview: { select: { title: 'label', subtitle: 'heading.lead' } } })] }),
    defineField({
      name: 'team', type: 'array', description: 'One line per role; the site always sorts roles in the same credit order.',
      of: [defineArrayMember({ type: 'object', name: 'teamLine', fields: [
        defineField({ name: 'role', type: 'string', options: { list: ROLES }, validation: (r) => r.required() }),
        defineField({ name: 'people', type: 'array', of: [{ type: 'string' }], validation: (r) => r.required().min(1) }),
      ], preview: { select: { title: 'role', p: 'people' }, prepare: ({ title, p }: { title?: string; p?: string[] }) => ({ title: ROLES.find((x) => x.value === title)?.title ?? title, subtitle: p?.join(', ') }) } })],
    }),
    defineField({ name: 'quote', type: 'object', fields: [defineField({ name: 'text', type: 'text', rows: 3 }), defineField({ name: 'cite', type: 'string' })] }),
    image('screen', 'Screen', 'After the chapters, 16:10. Also the poster of the screen video.'),
    video('screenVideo', 'Screen video', 'Optional: plays in place of the screen image.'),
    image('mobile', 'Mobile', 'Beside the screen, 3:4.'),
    defineField({
      name: 'gallery', type: 'array', description: 'In order: one image after each chapter (full width, its own ratio), the rest in a two-column grid after the screen. Landscape works best.',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true }, fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'caption', type: 'string', description: 'Optional, under the image.' }),
      ] })],
    }),
    defineField({ name: 'next', title: 'Next project', type: 'reference', to: [{ type: 'caseStudy' }] }),
    seo,
  ],
  preview: preview('title'),
});
