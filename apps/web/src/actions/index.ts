// Contact brief. Runs on the server (the only on-demand route). Validates again whatever the browser
// checked; the chips must be values the contact page offers. For now each brief is logged as one JSON line
// (Vercel → Logs); the mailing tool (Mailchimp or other) plugs in where it is logged.
// Bot traps, both answered with a fake success so bots learn nothing: the honeypot `website` (hidden from
// people, filled by bots) and `t`, the time the page loaded (a brief sent under 3 s is a script).
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { getContact } from '@/lib/sanity';
import { langOf, useT } from '@/i18n';

// Messages are the client's concern (the page shows them in its language); these are for logs only.
const brief = z.object({
  lang: z.enum(['fr', 'en']).optional(),
  type: z.array(z.string()).min(1, 'Pick at least one'),
  budget: z.string().min(1, 'Required'),
  timing: z.string().min(1, 'Required'),
  firstName: z.string().trim().min(1, 'Required').max(80),
  lastName: z.string().trim().min(1, 'Required').max(80),
  email: z.string().trim().pipe(z.email('Check the address')),
  company: z.string().trim().max(120).optional(),
  msg: z.string().trim().min(20, 'A few more words').max(1000, 'Under 1000 characters'),
  website: z.string().optional(),
  t: z.coerce.number().optional(),
});

export const server = {
  contact: defineAction({
    accept: 'form',
    input: brief,
    handler: async ({ website, t: loaded, ...b }) => {
      if (website || !loaded || Date.now() - loaded < 3000) {
        console.warn(`[contact] bot trap (${website ? 'honeypot' : 'too fast'})`);
        return { ok: true };
      }
      const lang = langOf(b.lang);
      const page = await getContact(lang);
      if (!b.type.every((v) => page.types.includes(v)) || !page.budgets.includes(b.budget) || !page.timings.includes(b.timing)) {
        throw new ActionError({ code: 'BAD_REQUEST', message: useT(lang).contact.err.option });
      }
      console.info(`[contact] ${JSON.stringify({ at: new Date().toISOString(), ...b, lang })}`);
      return { ok: true };
    },
  }),
};
