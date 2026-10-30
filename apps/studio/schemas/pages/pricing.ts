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
    defineField({ name: 'points', title: 'Price points', type: 'array', validation: (r) => r.min(3).max(5), of: [obj('point', [
      defineField({ name: 'label', type: 'string' }), defineField({ name: 'title', type: 'string' }), eur('from', 'From'),
      defineField({ name: 'per', type: 'string', description: 'e.g. " / month"' }),
      defineField({ name: 'exact', title: 'Fixed price', type: 'boolean', description: 'On = shown without "from" (a day rate).' }),
      strings('items'),
      defineField({ name: 'sim', title: 'Sets in the simulator', type: 'object', description: 'Empty = the button goes to the contact page.', fields: [
        defineField({ name: 'type', title: 'Type index', type: 'number' }), defineField({ name: 'opt', title: 'Option index', type: 'number' }),
        defineField({ name: 'care', title: 'Care plan index', type: 'number' }),
      ] }),
    ], 'title')] }),
    defineField({ name: 'start', group: 'sim', title: 'Type selected on load', type: 'number', description: 'Index in Types (0 = first).' }),
    defineField({ name: 'simLabel', group: 'sim', title: 'Simulator tag', type: 'string' }),
    heading('simHeading'),
    defineField({ name: 'faqLabel', title: 'FAQ tag', type: 'string' }),
    defineField({ name: 'types', group: 'sim', type: 'array', of: [obj('projectType', [
      defineField({ name: 'label', type: 'string' }), defineField({ name: 'note', type: 'string' }),
      defineField({ name: 'base', title: 'First page', type: 'number', description: 'Euros, excl. VAT: the price of the first page; each other page adds the price per extra page.', validation: (r) => r.min(0) }),
      defineField({ name: 'pages', title: 'Pages on selection', type: 'number', description: 'The page count the simulator jumps to when this type is picked (1 = one-page site).' }),
      defineField({ name: 'weeks', title: 'Weeks for the first page', type: 'number' }),
      defineField({ name: 'days', title: 'Billed by the day', type: 'boolean', description: 'On = First page is the day rate, Pages on selection the days; the simulator counts days and hides options, delivery and care.' }),
      defineField({ name: 'careOnly', title: 'Maintenance only', type: 'boolean', description: 'On = no project: the simulator shows only the care plans (monthly) and hides pages, options and delivery.' }),
    ])] }),
    eur('pagePrice', 'Price per extra page (after the first). Legal pages and the 404 are free.'),
    defineField({ name: 'pageWeeks', group: 'sim', title: 'Weeks per extra page', type: 'number' }),
    defineField({ name: 'maxPages', group: 'sim', title: 'Pages slider max', type: 'number' }),
    defineField({ name: 'maxDays', group: 'sim', title: 'Days slider max', type: 'number', description: 'For a type billed by the day.' }),
    defineField({ name: 'options', group: 'sim', type: 'array', of: [obj('option', [
      defineField({ name: 'label', type: 'string' }), defineField({ name: 'note', type: 'string' }),
      eur('price', 'Price (flat, or for the first page)'), eur('perPage', 'Plus, per extra page'),
      defineField({ name: 'pct', title: 'Or % of the subtotal', type: 'number' }),
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
