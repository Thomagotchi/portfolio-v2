// Shared fields for the inner pages. `placeholder` flags DA copy still to replace (shown in the list preview).
import { defineArrayMember, defineField } from 'sanity';

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
  ], preview: { select: { title: 'value', subtitle: 'label' } } })],
});
export const groups = [{ name: 'content', title: 'Content', default: true }, { name: 'seo', title: 'SEO' }];
/** List preview: the title, and "Placeholder" while the flag is on. */
export const preview = (title: string) => ({
  select: { t: title, p: 'placeholder' },
  prepare: ({ t, p }: { t?: string; p?: boolean }) => ({ title: t, subtitle: p ? 'Placeholder · replace the DA copy' : undefined }),
});
