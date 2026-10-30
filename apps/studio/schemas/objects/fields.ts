// Shared fields for the inner pages. `placeholder` flags DA copy still to replace (shown in the list preview).
import { defineArrayMember, defineField, type SlugIsUniqueValidator } from 'sanity';

export const placeholder = defineField({
  name: 'placeholder', title: 'Placeholder content', type: 'boolean', initialValue: false,
  description: 'On = copy, figures or images are still the DA placeholders. Untick once replaced.',
});
export const label = defineField({ name: 'label', title: 'Tag', type: 'string', description: 'Serif capitals above the heading.' });
export const heading = (name = 'heading') => defineField({ name, type: 'headline', validation: (r) => r.required() });
export const lede = defineField({ name: 'lede', type: 'text', rows: 3 });
export const seo = defineField({ name: 'seo', type: 'seo', group: 'seo' });
export const strings = (name: string, title?: string) => defineField({ name, title, type: 'array', of: [{ type: 'string' }] });
/** Label / value pairs in a hairline row (meta, results, facts). */
export const cells = (name: string, description?: string) => defineField({
  name, type: 'array', description,
  of: [defineArrayMember({ type: 'object', name: 'cell', fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'value', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'href', title: 'Link', type: 'url', description: 'Optional: the value opens this address in a new tab (e.g. the live site).' }),
  ], preview: { select: { title: 'value', subtitle: 'label' } } })],
});
export const groups = [{ name: 'content', title: 'Content', default: true }, { name: 'seo', title: 'SEO' }];
/** List preview: the title, and "Placeholder" while the flag is on. */
export const preview = (title: string) => ({
  select: { t: title, p: 'placeholder' },
  prepare: ({ t, p }: { t?: string; p?: boolean }) => ({ title: t, subtitle: p ? 'Placeholder · replace the DA copy' : undefined }),
});

// FR and EN documents share their canonical slug (/work/audion ↔ /projets/audion): unique per type and language.
const uniquePerLanguage: SlugIsUniqueValidator = async (slug, { document, getClient }) => {
  const id = document?._id.replace(/^drafts\./, '');
  const query = 'count(*[_type == $type && slug.current == $slug && language == $lang && !(_id in [$id, "drafts." + $id])])';
  return !(await getClient({ apiVersion: '2026-10-01' }).fetch(query, { type: document?._type, slug, lang: document?.language, id }));
};
export const slug = (description?: string) => defineField({
  name: 'slug', type: 'slug', description, options: { source: 'title', isUnique: uniquePerLanguage }, validation: (r) => r.required(),
});
/** An image with its alt text (required: Lighthouse a11y). `description` gives the ratio it is cropped to. */
export const image = (name: string, title: string, description: string) => defineField({
  name, title, type: 'image', description, options: { hotspot: true },
  fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.required() })],
});
