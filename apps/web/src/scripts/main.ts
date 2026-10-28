import { initScroll } from './scroll';
import { initInview } from './inview';
import { initDecode } from './decode';
import { initThread } from './thread';
import { initClocks } from './clock';
import { ScrollTrigger } from './gsap';

initScroll();
initInview();
initDecode();
initThread();
initClocks();
document.fonts.ready.then(() => ScrollTrigger.refresh());
