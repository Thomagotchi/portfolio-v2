// The only place GSAP plugins get registered. Import { gsap, ScrollTrigger } from here.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import tokens from 'tokens/tokens.json';

gsap.registerPlugin(ScrollTrigger, CustomEase);

// DA eases (cubic-bezier) → named GSAP eases: 'move', 'soft', …
for (const [name, value] of Object.entries(tokens.motion)) {
  const m = value.match(/cubic-bezier\(([^)]+)\)/);
  if (m) CustomEase.create(name, `M0,0 C${m[1].split(',').map((n) => n.trim()).join(',')} 1,1`);
}
gsap.defaults({ ease: 'soft', duration: 0.6 });

export const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export { gsap, ScrollTrigger };
