// Contact brief → email through Resend. Runs on the server (the only on-demand route). Validates again
// whatever the browser checked; the chips must be values the contact page offers. Honeypot: `website`
// must stay empty (bots fill it; they get a fake success). No RESEND_API_KEY → dry run: logged, not sent.
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { CONTACT_FROM, CONTACT_TO, RESEND_API_KEY } from 'astro:env/server';
import { getContact, getSite } from '@/lib/sanity';
import { langOf, useT } from '@/i18n';

// Messages are the client's concern (the page shows them in its language); these are for logs only.
const brief = z.object({
  lang: z.enum(['fr', 'en']).optional(),
  type: z.array(z.string()).min(1, 'Pick at least one'),
  budget: z.string().optional(),
  timing: z.string().optional(),
  name: z.string().trim().min(1, 'Required').max(120),
  email: z.string().trim().pipe(z.email('Check the address')),
  company: z.string().trim().max(120).optional(),
  msg: z.string().trim().min(20, 'A few more words').max(1000, 'Under 1000 characters'),
  website: z.string().optional(),
});

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export const server = {
  contact: defineAction({
    accept: 'form',
    input: brief,
    handler: async (b) => {
      if (b.website) return { ok: true };
      const lang = langOf(b.lang);
      const t = useT(lang).contact.err;
      const page = await getContact(lang);
      const allowed = (list: string[], v?: string) => !v || list.includes(v);
      if (!b.type.every((t) => page.types.includes(t)) || !allowed(page.budgets, b.budget) || !allowed(page.timings, b.timing)) {
        throw new ActionError({ code: 'BAD_REQUEST', message: t.option });
      }
      const site = await getSite(lang);
      // The email is for Thomas: always French labels, plus the language the visitor wrote from.
      const rows: [string, string | undefined][] = [
        ['Projet', b.type.join(' + ')], ['Budget', b.budget], ['Délai', b.timing],
        ['De', `${b.name} <${b.email}>`], ['Structure', b.company], ['Langue', lang.toUpperCase()], ['Message', b.msg],
      ];
      const text = rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');
      if (!RESEND_API_KEY) {
        console.info(`[contact] dry run (no RESEND_API_KEY)\n${text}`);
        return { ok: true, dryRun: true };
      }
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: CONTACT_FROM ?? `Site <brief@${new URL(site.contact.email.replace(/^.*@/, 'https://')).hostname}>`,
          to: [CONTACT_TO ?? site.contact.email],
          reply_to: b.email,
          subject: `Brief · ${b.type.join(' + ')} · ${b.name}`,
          text,
          html: `<table>${rows.filter(([, v]) => v).map(([k, v]) => `<tr><th align="left">${k}</th><td>${esc(v!)}</td></tr>`).join('')}</table>`,
        }),
      });
      if (!res.ok) throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: t.send });
      return { ok: true };
    },
  }),
};
