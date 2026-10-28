import { defineArrayMember, defineField, defineType } from 'sanity';
import { groups, heading, label, lede, seo } from '../objects/fields';

export default defineType({
  name: 'notFound', title: '404', type: 'document', groups,
  fields: [
    label, heading(), heading('found'), lede,
    defineField({ name: 'links', type: 'array', of: [defineArrayMember({ type: 'link' })] }),
    seo,
  ],
  preview: { prepare: () => ({ title: '404' }) },
});
