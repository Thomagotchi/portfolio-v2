import { initScroll } from './scroll';
import { initInview } from './inview';
import { initDecode } from './decode';
import { initThread } from './thread';
import { initClocks } from './clock';
import { initBrackets } from './brackets';
import { initLooks } from './looks';
import { ScrollTrigger } from './gsap';

initScroll();
// Entry motion waits for the page transition (scripts/head.js).
await window.__vt;
initInview();
initDecode();
initThread();
initClocks();
initBrackets();
initLooks();
document.fonts.ready.then(() => ScrollTrigger.refresh());
