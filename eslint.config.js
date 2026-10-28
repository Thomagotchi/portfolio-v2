import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['**/dist/**', '**/.astro/**', '**/.sanity/**', 'packages/tokens/dist/**', '.lighthouseci/**'] },
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
];
