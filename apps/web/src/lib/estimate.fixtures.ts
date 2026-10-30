// Test fixtures: the pricing and contact data as of 2026-10-30, frozen so the estimate tests do not follow
// edits made in Sanity.
import type { ContactPage, Pricing } from './types';

type Fixture = { pricing: Pricing; contact: ContactPage };
export const fr: Fixture = {
  "pricing": {
    "care": [
      {
        "label": "Aucun",
        "month": 0
      },
      {
        "label": "Essentiel",
        "month": 40,
        "note": "Mises à jour, sauvegardes"
      },
      {
        "label": "Complet",
        "month": 240,
        "note": "Plus 2 h de modifications"
      }
    ],
    "delivery": [
      {
        "factor": 1,
        "label": "Standard",
        "pct": 0
      },
      {
        "factor": 0.7,
        "label": "Express",
        "note": "30 % plus tôt",
        "pct": 25
      }
    ],
    "deposit": 30,
    "faq": [
      {
        "answer": "Le développement, le design s'il est choisi, la configuration du CMS, la mise en ligne, les mentions légales, la page 404 et une séance de formation. L'hébergement et le nom de domaine vous sont facturés directement, au prix coûtant.",
        "question": "Qu'est-ce qui est compris dans le prix ?"
      },
      {
        "answer": "Je rejoins votre projet pour un nombre de jours fixé ensemble : intégration Webflow, front-end React ou Next.js, animations GSAP. 350 € HT la journée, facturée aux jours travaillés.",
        "question": "Comment fonctionne le renfort à la journée ?"
      },
      {
        "answer": "30 % pour réserver les dates, 40 % à la validation des maquettes, 30 % à la mise en ligne. Factures en euros, hors taxes.",
        "question": "Comment se passe le paiement ?"
      },
      {
        "answer": "Oui. Chaque site est livré avec un CMS, Webflow ou Sanity, et un court guide vidéo pour votre équipe.",
        "question": "Est-ce que je pourrai modifier le site moi-même ?"
      },
      {
        "answer": "L'estimation est mise à jour avant tout travail supplémentaire. Rien n'est facturé sans votre accord écrit.",
        "question": "Et si le périmètre change en cours de route ?"
      }
    ],
    "faqLabel": "Questions",
    "heading": {
      "lead": "Les prix,",
      "muted": "affichés"
    },
    "label": "Tarifs",
    "lede": "Cinq points de départ, puis un simulateur pour estimer votre projet. Les montants sont hors taxes ; le devis final suit un appel.",
    "maxPages": 24,
    "options": [
      {
        "label": "Design inclus",
        "note": "Maquettes et direction, 250 € par page en plus",
        "on": true,
        "perPage": 250,
        "price": 500,
        "weeks": 1.5
      },
      {
        "label": "Deuxième langue",
        "note": "FR et EN",
        "pct": 10,
        "weeks": 0.5
      },
      {
        "label": "Animations",
        "note": "Apparitions GSAP, une scène Three.js",
        "pct": 20,
        "weeks": 1
      },
      {
        "label": "SEO",
        "note": "Audit, données structurées, redirections",
        "price": 300,
        "weeks": 0.5
      },
      {
        "label": "Aide à la rédaction",
        "note": "Structure et relecture, par page",
        "perPage": 100,
        "price": 100,
        "weeks": 1
      }
    ],
    "pagePrice": 300,
    "pageWeeks": 0.25,
    "points": [
      {
        "_key": "p1",
        "from": 600,
        "items": [
          "Sur votre design ou sur le mien",
          "Webflow ou Astro",
          "Formulaire et SEO de base"
        ],
        "label": "Landing page",
        "sim": {
          "type": 0
        },
        "title": "Une page, vite en ligne"
      },
      {
        "_key": "p2",
        "from": 1800,
        "items": [
          "5 pages, puis 300 € la page",
          "Next.js, Astro ou Webflow",
          "Mise en ligne incluse"
        ],
        "label": "Développement",
        "sim": {
          "type": 1
        },
        "title": "Développé et mis en ligne"
      },
      {
        "_key": "p3",
        "exact": true,
        "from": 350,
        "items": [
          "Intégration Webflow ou front Next.js",
          "Pour une agence ou une équipe en place",
          "Facturé aux jours travaillés"
        ],
        "label": "Renfort",
        "per": " / jour",
        "title": "À la journée"
      },
      {
        "_key": "p4",
        "from": 500,
        "items": [
          "500 € la première page, 250 € les suivantes",
          "Deux allers-retours de corrections",
          "Fichier Figma remis"
        ],
        "label": "Design",
        "sim": {
          "opt": 0
        },
        "title": "Maquettes et direction"
      },
      {
        "_key": "p5",
        "from": 40,
        "items": [
          "Mises à jour et sauvegardes",
          "Surveillance de disponibilité",
          "Petites modifications"
        ],
        "label": "Maintenance",
        "per": " / mois",
        "sim": {
          "care": 1
        },
        "title": "Suivi mensuel"
      }
    ],
    "simHeading": {
      "lead": "Votre projet,",
      "muted": "chiffré",
      "tail": "en direct"
    },
    "simLabel": "Simulateur",
    "start": 1,
    "types": [
      {
        "base": 600,
        "label": "Landing page",
        "note": "Une seule page",
        "pages": 1,
        "weeks": 1.5
      },
      {
        "base": 600,
        "label": "Site vitrine",
        "note": "Plusieurs pages, sans CMS",
        "pages": 5,
        "weeks": 2
      },
      {
        "base": 1500,
        "label": "Site et CMS",
        "note": "CMS Sanity ou Webflow",
        "pages": 8,
        "weeks": 3
      },
      {
        "base": 6000,
        "label": "Application web",
        "note": "Comptes et tableau de bord",
        "pages": 10,
        "weeks": 6
      }
    ]
  },
  "contact": {
    "label": "Contact",
    "heading": {
      "lead": "Parlez-moi",
      "muted": "du site",
      "tail": "dont vous avez besoin"
    },
    "lede": "Cinq questions courtes. Je lis chaque brief moi-même et je réponds sous 24 heures, avec une première estimation ou mes questions.",
    "types": [
      "Design",
      "Développement",
      "Maintenance",
      "Renfort à la journée",
      "Je ne sais pas encore"
    ],
    "budgets": [
      "< 2 k€",
      "2 k€ – 6 k€",
      "6 k€ – 10 k€",
      "10 k€ +"
    ],
    "timings": [
      "Dès que possible",
      "Dans 1 à 2 mois",
      "Dans 3 mois ou plus",
      "Pas de date fixe"
    ],
    "done": {
      "title": "Brief envoyé.",
      "text": "Je vous réponds sous 24 h."
    },
    "seo": {
      "title": "Contact · Thomas Sanouiller",
      "description": "Envoyez un brief court pour votre site, une landing page ou des jours de renfort. Réponse sous 24 heures."
    }
  }
};
export const en: Fixture = {
  "pricing": {
    "care": [
      {
        "label": "None",
        "month": 0
      },
      {
        "label": "Essential",
        "month": 40,
        "note": "Updates, backups"
      },
      {
        "label": "Full",
        "month": 240,
        "note": "Plus 2 h of changes"
      }
    ],
    "delivery": [
      {
        "factor": 1,
        "label": "Standard",
        "pct": 0
      },
      {
        "factor": 0.7,
        "label": "Express",
        "note": "30% sooner",
        "pct": 25
      }
    ],
    "deposit": 30,
    "faq": [
      {
        "answer": "Development, design if selected, CMS setup, launch, legal pages, the 404 page and a training session. Hosting and the domain are billed to you directly, at cost.",
        "question": "What is included in the price?"
      },
      {
        "answer": "I join your project for a number of days we agree on: Webflow builds, React or Next.js front end, GSAP motion. €350 excl. VAT a day, billed on days worked.",
        "question": "How does support by the day work?"
      },
      {
        "answer": "30% to book the dates, 40% when the designs are signed off, 30% at launch. Invoices in euros, excluding VAT.",
        "question": "How do payments work?"
      },
      {
        "answer": "Yes. Every site ships with a CMS, Webflow or Sanity, and a short video guide for your team.",
        "question": "Can I edit the site myself?"
      },
      {
        "answer": "The estimate is updated before any extra work starts. Nothing is billed without your written OK.",
        "question": "What if the scope changes?"
      }
    ],
    "faqLabel": "Questions",
    "heading": {
      "lead": "Prices,",
      "muted": "in the open"
    },
    "label": "Pricing",
    "lede": "Five starting points, then a simulator to price your own project. Every figure excludes VAT; the final quote follows a call.",
    "maxPages": 24,
    "options": [
      {
        "label": "Design included",
        "note": "Layouts and direction, €250 per extra page",
        "on": true,
        "perPage": 250,
        "price": 500,
        "weeks": 1.5
      },
      {
        "label": "Second language",
        "note": "FR and EN",
        "pct": 10,
        "weeks": 0.5
      },
      {
        "label": "Motion",
        "note": "GSAP reveals, a Three.js scene",
        "pct": 20,
        "weeks": 1
      },
      {
        "label": "SEO setup",
        "note": "Audit, structured data, redirects",
        "price": 300,
        "weeks": 0.5
      },
      {
        "label": "Copywriting help",
        "note": "Structure and editing, per page",
        "perPage": 100,
        "price": 100,
        "weeks": 1
      }
    ],
    "pagePrice": 300,
    "pageWeeks": 0.25,
    "points": [
      {
        "_key": "p6",
        "from": 600,
        "items": [
          "Your design or mine",
          "Webflow or Astro",
          "Contact form and basic SEO"
        ],
        "label": "Landing page",
        "sim": {
          "type": 0
        },
        "title": "One page, live fast"
      },
      {
        "_key": "p7",
        "from": 1800,
        "items": [
          "5 pages, then €300 a page",
          "Next.js, Astro or Webflow",
          "Launch included"
        ],
        "label": "Development",
        "sim": {
          "type": 1
        },
        "title": "Built and launched"
      },
      {
        "_key": "p8",
        "exact": true,
        "from": 350,
        "items": [
          "Webflow build or Next.js front end",
          "For an agency or an in-house team",
          "Billed on days worked"
        ],
        "label": "Support",
        "per": " / day",
        "title": "By the day"
      },
      {
        "_key": "p9",
        "from": 500,
        "items": [
          "€500 for the first page, €250 for each other",
          "Two rounds of changes",
          "Figma file handed over"
        ],
        "label": "Design",
        "sim": {
          "opt": 0
        },
        "title": "Layouts and direction"
      },
      {
        "_key": "p10",
        "from": 40,
        "items": [
          "Updates and backups",
          "Uptime monitoring",
          "Small changes"
        ],
        "label": "Maintenance",
        "per": " / month",
        "sim": {
          "care": 1
        },
        "title": "Monthly care"
      }
    ],
    "simHeading": {
      "lead": "Your project,",
      "muted": "priced",
      "tail": "live"
    },
    "simLabel": "Simulator",
    "start": 1,
    "types": [
      {
        "base": 600,
        "label": "Landing page",
        "note": "A single page",
        "pages": 1,
        "weeks": 1.5
      },
      {
        "base": 600,
        "label": "Showcase site",
        "note": "Several pages, no CMS",
        "pages": 5,
        "weeks": 2
      },
      {
        "base": 1500,
        "label": "Site and CMS",
        "note": "Sanity or Webflow CMS",
        "pages": 8,
        "weeks": 3
      },
      {
        "base": 6000,
        "label": "Web app",
        "note": "Accounts and a dashboard",
        "pages": 10,
        "weeks": 6
      }
    ]
  },
  "contact": {
    "label": "Contact",
    "heading": {
      "lead": "Tell me about",
      "muted": "the site",
      "tail": "you need"
    },
    "lede": "Five short questions. I read every brief myself and reply within 24 hours, with a first estimate or my questions.",
    "types": [
      "Design",
      "Development",
      "Maintenance",
      "Support by the day",
      "Not sure yet"
    ],
    "budgets": [
      "< €2k",
      "€2k – €6k",
      "€6k – €10k",
      "€10k+"
    ],
    "timings": [
      "As soon as possible",
      "In 1 to 2 months",
      "In 3 months or more",
      "No fixed date"
    ],
    "done": {
      "title": "Brief sent.",
      "text": "I will reply within 24 h."
    },
    "seo": {
      "title": "Contact · Thomas Sanouiller",
      "description": "Send a short brief for a website, a landing page or days of support. Reply within 24 hours."
    }
  }
};
