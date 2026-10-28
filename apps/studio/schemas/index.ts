import page from './documents/page';
import site from './documents/site';
import caseStudy from './pages/caseStudy';
import aboutPage from './pages/aboutPage';
import contactPage from './pages/contactPage';
import pricing from './pages/pricing';
import notFound from './pages/notFound';
import seo from './objects/seo';
import link from './objects/link';
import cta from './objects/cta';
import headline from './objects/headline';
import figure from './objects/figure';
import { blocks } from './blocks';

export const schemaTypes = [page, site, caseStudy, aboutPage, contactPage, pricing, notFound, seo, link, cta, headline, figure, ...blocks];
