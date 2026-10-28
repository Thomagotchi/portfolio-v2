// DA font roles → one Fontsource entry per family. Roles sharing a family (display = body) load one file;
// the extra roles alias the first one (--font-body: var(--font-display)).
import tokens from 'tokens/tokens.json';

type Role = { family: string; weights: number[] };
const roles = Object.entries(tokens.fonts as Record<string, Role>);

export const families = roles.reduce<{ family: string; role: string; roles: string[]; weights: number[] }[]>((acc, [role, f]) => {
  const hit = acc.find((x) => x.family === f.family);
  if (hit) { hit.roles.push(role); hit.weights.push(...f.weights); } else acc.push({ family: f.family, role, roles: [role], weights: [...f.weights] });
  return acc;
}, []);

export const fontAliases = families.flatMap((f) => f.roles.slice(1).map((r) => `--font-${r}: var(--font-${f.role});`)).join('');
