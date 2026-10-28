import { defineField, defineType } from 'sanity';

// Heading in three parts; the middle one shows in the muted colour (the brand's emphasis, never italic).
export default defineType({
  name: 'headline',
  type: 'object',
  options: { columns: 3 },
  fields: [
    defineField({ name: 'lead', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'muted', type: 'string' }),
    defineField({ name: 'tail', type: 'string' }),
  ],
});
