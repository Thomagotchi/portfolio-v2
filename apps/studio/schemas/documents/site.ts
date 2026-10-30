import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'site',
  title: 'Site settings',
  type: 'document',
  groups: [{ name: 'main', default: true }, { name: 'nav' }, { name: 'contact' }],
  fields: [
    defineField({ name: 'name', type: 'string', group: 'main', validation: (r) => r.required() }),
    defineField({ name: 'role', type: 'string', group: 'main', description: 'e.g. Freelance web developer · France', validation: (r) => r.required() }),
    defineField({ name: 'description', type: 'text', rows: 3, group: 'main', validation: (r) => r.required().max(155) }),
    defineField({
      name: 'nav', type: 'array', group: 'nav',
      of: [defineArrayMember({
        type: 'object', name: 'navItem',
        fields: [
          defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'href', type: 'string', validation: (r) => r.required() }),
          defineField({
            name: 'panel', title: 'Dropdown panel', type: 'array',
            of: [defineArrayMember({
              type: 'object', name: 'panelItem',
              fields: [
                defineField({ name: 'eyebrow', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'text', type: 'string' }),
                defineField({ name: 'href', type: 'string', validation: (r) => r.required() }),
              ],
              preview: { select: { title: 'title', subtitle: 'eyebrow' } },
            })],
          }),
        ],
      })],
    }),
    defineField({
      name: 'contact', type: 'object', group: 'contact',
      fields: [
        defineField({ name: 'email', type: 'string', validation: (r) => r.required().email() }),
        defineField({ name: 'tz', title: 'Time zone (IANA)', type: 'string', initialValue: 'Europe/Paris' }),
        defineField({ name: 'place', type: 'string' }),
        defineField({
          name: 'availability', type: 'string', initialValue: 'available',
          description: 'Colour of the blinking dot in the footer: green = available, red = busy. Publish to rebuild.',
          options: { list: [{ title: 'Available (green)', value: 'available' }, { title: 'Busy (red)', value: 'busy' }], layout: 'radio', direction: 'horizontal' },
        }),
        defineField({ name: 'status', title: 'Availability text', type: 'string', description: 'Shown beside the dot, e.g. "Disponible" or "Complet jusqu\'en mars".' }),
        defineField({ name: 'reply', title: 'Reply time', type: 'string' }),
        defineField({ name: 'lighthouse', title: 'Lighthouse readout', type: 'string' }),
      ],
    }),
    defineField({ name: 'footerLabel', type: 'string', group: 'contact', initialValue: 'Write to' }),
    defineField({ name: 'socials', type: 'array', group: 'contact', of: [{ type: 'link' }], description: 'Also used as schema.org sameAs (GEO).' }),
  ],
});
