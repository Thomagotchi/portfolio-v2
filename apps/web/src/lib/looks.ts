// Section looks: attributes for a section's root (global.scss styles [data-look], scripts/looks.ts plays [data-entry]).
// The entry follows from the previous section's look: into light, a pixel wave; into signal, a curtain; light back
// to dark, the view crossfades (bascule).
import type { Entry, Look } from './types';

export function entryOf(prev: Look | undefined, look: Look | undefined): Entry | undefined {
  const p = prev ?? 'dark', c = look ?? 'dark';
  if (c === p) return undefined;
  if (c === 'light') return 'pixels';
  if (c === 'signal') return 'curtain';
  return p === 'light' ? 'bascule' : undefined;
}

export const lookAttrs = (look?: Look, entry?: Entry) => ({
  'data-look': look && look !== 'dark' ? look : entry ? 'dark' : undefined,
  'data-theme': look === 'light' ? 'light' : undefined,
  'data-entry': entry,
});
