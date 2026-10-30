// Team roles in credit order: every case study lists its team in this order. Same keys as the Studio's
// list (apps/studio/schemas/pages/caseStudy.ts ROLES); labels per language live in i18n/ui.ts case.roles.
export const ROLES = ['direction', 'strategy', 'creative', 'art', 'webdesign', 'copy', 'dev', 'threeD', 'motion', 'illustration', 'product', 'photo', 'pm'] as const;
export type Role = (typeof ROLES)[number];

export const byRole = <T extends { role: string }>(lines: T[]) =>
  [...lines].sort((a, b) => ROLES.indexOf(a.role as Role) - ROLES.indexOf(b.role as Role));
