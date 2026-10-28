// Every figure on /pricing comes from here: the page never hard-codes a price.
import { defineArrayMember, defineField, defineType } from 'sanity';
import { groups, heading, label, lede, placeholder, preview, seo, strings } from '../objects/fields';

const eur = (name: string, title?: string) => defineField({ name, title, type: 'number', description: 'Euros, excl. VAT', validation: (r) => r.min(0) });
const obj = (name: string, fields: ReturnType<typeof defineField>[], title = 'label') =>
  defineArrayMember({ type: 'object', name, fields, preview: { select: { title } } });

export default defineType({
  name: 'pricing', title: 'Pricing', type: 'document', groups: [...groups, { name: 'sim', title: 'Simulator' }],
  fields: [
    placeholder, label, heading(), lede,
    defineField({ name: 'points', title: 'Price points', type: 'array', validation: (r) => r.length(3), of: [obj('point', [
      defineField({ name: 'label', type: 'string' }), defineField({ name: 'title', type: 'string' }), eur('from', 'From'),
      defineField({ name: 'per', type: 'string', description: 'e.g. " / month"' }), strings('items'),
    ], 'title')] }),
    defineField({ name: 'simLabel', group: 'sim', title: 'Simulator tag', type: 'string' }),
    heading('simHeading'),
    defineField({ name: 'faqLabel', title: 'FAQ tag', type: 'string' }),
    defineField({ name: 'types', group: 'sim', type: 'array', of: [obj('projectType', [
      defineField({ name: 'label', type: 'string' }), defineField({ name: 'note', type: 'string' }), eur('base'),
      defineField({ name: 'pages', title: 'Pages included', type: 'number' }), defineField({ name: 'weeks', type: 'number' }),
    ])] }),
    eur('pagePrice', 'Price per extra page'),
    defineField({ name: 'pageWeeks', group: 'sim', title: 'Weeks per extra page', type: 'number' }),
    defineField({ name: 'maxPages', group: 'sim', title: 'Pages slider max', type: 'number' }),
    defineField({ name: 'options', group: 'sim', type: 'array', of: [obj('option', [
      defineField({ name: 'label', type: 'string' }), defineField({ name: 'note', type: 'string' }),
      eur('price', 'Price (flat)'), defineField({ name: 'pct', title: 'Or % of the subtotal', type: 'number' }),
      defineField({ name: 'weeks', type: 'number' }), defineField({ name: 'on', title: 'On by default', type: 'boolean' }),
    ])] }),
    defineField({ name: 'delivery', group: 'sim', type: 'array', of: [obj('speed', [
      defineField({ name: 'label', type: 'string' }), defineField({ name: 'note', type: 'string' }),
      defineField({ name: 'pct', title: 'Surcharge %', type: 'number' }), defineField({ name: 'factor', title: 'Duration factor', type: 'number' }),
    ])] }),
    defineField({ name: 'care', group: 'sim', type: 'array', of: [obj('plan', [
      defineField({ name: 'label', type: 'string' }), defineField({ name: 'note', type: 'string' }), eur('month', 'Per month'),
    ])] }),
    defineField({ name: 'deposit', group: 'sim', title: 'Deposit %', type: 'number' }),
    defineField({ name: 'faq', title: 'FAQ', type: 'array', of: [obj('qa', [
      defineField({ name: 'question', type: 'string' }), defineField({ name: 'answer', type: 'text', rows: 3 }),
    ], 'question')] }),
    seo,
  ],
  preview: { ...preview('label'), prepare: ({ p }: { p?: boolean }) => ({ title: 'Pricing', subtitle: p ? 'Placeholder · replace the DA prices' : undefined }) },
});
