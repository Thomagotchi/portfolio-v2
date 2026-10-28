import { initScroll } from './scroll';
import { initInview } from './inview';
import { initDecode } from './decode';
import { initThread } from './thread';
import { initClocks } from './clock';
import { initBrackets } from './brackets';
import { ScrollTrigger } from './gsap';

initScroll();
initInview();
initDecode();
initThread();
initClocks();
initBrackets();
document.fonts.ready.then(() => ScrollTrigger.refresh());
