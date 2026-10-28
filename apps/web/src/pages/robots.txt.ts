import type { APIRoute } from 'astro';
import { ALLOW_AI_CRAWLERS } from '@/config';

const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot'];

export const GET: APIRoute = ({ site }) => {
  const ai = AI_BOTS.map((b) => `User-agent: ${b}\n${ALLOW_AI_CRAWLERS ? 'Allow' : 'Disallow'}: /`).join('\n\n');
  return new Response(`User-agent: *\nAllow: /\n\n${ai}\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`);
};
