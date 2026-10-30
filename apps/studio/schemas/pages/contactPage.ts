import { defineField, defineType } from 'sanity';
import { groups, heading, label, lede, placeholder, preview, seo, strings } from '../objects/fields';

export default defineType({
  name: 'contactPage', title: 'Contact', type: 'document', groups,
  fields: [
    placeholder, label, heading(), lede,
    strings('types', 'Project chips (multi-select). The last one is "not sure yet": picking it clears the others, and the reverse.'), strings('budgets', 'Budget chips'), strings('timings', 'Timing chips'),
    defineField({ name: 'done', title: 'Confirmation', type: 'object', fields: [defineField({ name: 'title', type: 'string' }), defineField({ name: 'text', type: 'string' })] }),
    seo,
  ],
  preview: { ...preview('label'), prepare: ({ p }: { p?: boolean }) => ({ title: 'Contact', subtitle: p ? 'Placeholder · replace the DA copy' : undefined }) },
});
