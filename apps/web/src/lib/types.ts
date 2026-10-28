// Mirrors apps/studio/schemas. Replace with `sanity typegen generate` output once the project is live.

export type Link = { label: string; href: string };
export type Cta = Link & { variant?: 'primary' | 'accent' | 'secondary' | 'surface' | 'link' };
export type Seo = { title?: string; description?: string; image?: SanityImage; noindex?: boolean };
export type SanityImage = { asset: { _ref: string }; alt?: string };
/** Heading in three parts: the middle one is muted (the DA's emphasis). */
export type Headline = { lead: string; muted?: string; tail?: string };

type B<T extends string, P> = { _type: T; _key: string } & P;
export type HeroBlock = B<'hero', { label?: string; heading: Headline; text?: string; ctas?: Cta[]; scene?: boolean }>;
export type KpiBlock = B<'kpi', { label?: string; heading: Headline; stats: { value: string; label: string }[] }>;
export type BuiltWithBlock = B<'builtWith', { label: string; items: string[] }>;
/** `cite`: the text is a quotation, attributed under it. */
export type StatementBlock = B<'statement', { label?: string; text: string; anchor?: string; cite?: string }>;
export type StackBlock = B<'stack', { label?: string; heading: Headline; groups: { name: string; tools: string[] }[] }>;
export type OffersBlock = B<'offers', { label?: string; anchor?: string; items: { title: string; meta?: string; href?: string }[]; ctas?: Cta[] }>;
export type WorkBlock = B<'work', { label?: string; anchor?: string; heading: Headline; items: { title: string; meta?: string; category: string; href?: string }[] }>;
export type FaqBlock = B<'faq', { heading: string; items: { question: string; answer: string }[] }>;
export type Block = HeroBlock | KpiBlock | BuiltWithBlock | StatementBlock | StackBlock | OffersBlock | WorkBlock | FaqBlock;

// Inner pages. `placeholder: true` = DA placeholder copy, flagged in the Studio until replaced.
export type Cell = { label: string; value: string };
export type PtBlock = { _type: 'block'; _key: string; style?: string; children: { _type: 'span'; _key: string; text: string; marks?: string[] }[]; markDefs?: unknown[] };
export type Figure = { _type: 'figure'; _key: string } & (
  | { kind: 'steps'; steps: { when: string; label: string }[] }
  | { kind: 'compare'; before: string; after: string }
  | { kind: 'lighthouse'; scores: { label: string; before: number; after: number }[] }
);
export type Chapter = { _key: string; label: string; heading: Headline; body: (PtBlock | Figure)[] };
export type CaseStudy = {
  title: string; slug: string; category: string; summary: string; label: string; heading: Headline; lede: string;
  meta: Cell[]; results?: Cell[]; cover?: SanityImage; chapters: Chapter[]; quote?: { text: string; cite: string };
  gallery?: SanityImage[]; next?: { title: string; slug: string; summary: string };
  /** The original case study (agency work): linked from the header and the end of the page. */
  source?: Link;
  /** Local images in src/assets/work/<slug>/ until Sanity holds them: cover (2:1), wide (16:10), tall (3:4). */
  media?: { cover?: LocalImage; wide?: LocalImage; tall?: LocalImage };
  seo?: Seo; placeholder?: boolean; _updatedAt?: string;
};
/** A file in src/assets/work (e.g. 'audion/cover.png') and its alt text. */
export type LocalImage = { file: string; alt: string };
export type AboutPage = {
  label: string; heading: Headline; lede: string; facts: Cell[]; portrait?: SanityImage;
  statementLabel: string; statement: string; statementCite?: string; timelineLabel: string; timelineHeading: Headline;
  timeline: { _key: string; year: string; title: string; text: string; tags: string[] }[];
  principlesLabel: string; principles: { _key: string; title: string; text: string }[]; ctas: Cta[];
  seo?: Seo; placeholder?: boolean;
};
export type ContactPage = {
  label: string; heading: Headline; lede: string; types: string[]; budgets: string[]; timings: string[];
  done: { title: string; text: string }; seo?: Seo; placeholder?: boolean;
};
export type PriceType = { label: string; note: string; base: number; pages: number; weeks: number };
export type PriceOption = { label: string; note: string; price?: number; pct?: number; weeks: number; on?: boolean };
export type Pricing = {
  label: string; heading: Headline; lede: string;
  /** `sim`: what "start from this" sets in the simulator (type index, option index, care index). No `sim` →
   *  the button goes to the contact page. `exact`: a fixed price (day rate), shown without "from". */
  points: { _key: string; label: string; title: string; from: number; per?: string; exact?: boolean; items: string[]; sim?: { type?: number; opt?: number; care?: number } }[];
  /** Simulator type selected on load (index into `types`). */
  start?: number;
  simLabel: string; simHeading: Headline; faqLabel: string;
  types: PriceType[]; pagePrice: number; pageWeeks: number; maxPages: number; options: PriceOption[];
  delivery: { label: string; note?: string; pct: number; factor: number }[];
  care: { label: string; note?: string; month: number }[]; deposit: number;
  faq: { question: string; answer: string }[];
  seo?: Seo; placeholder?: boolean;
};
export type NotFoundPage = { label: string; heading: Headline; found: Headline; lede: string; links: Link[]; seo?: Seo };

export type Page = { title: string; slug: string; seo?: Seo; blocks: Block[]; _updatedAt?: string };
export type NavItem = Link & { panel?: { eyebrow: string; title: string; text?: string; href: string }[] };
export type Contact = { email: string; tz: string; place: string; status: string; reply: string; lighthouse?: string };
export type Site = {
  name: string; role: string; description: string; nav: NavItem[]; socials?: Link[];
  contact: Contact; footerLabel?: string;
};
