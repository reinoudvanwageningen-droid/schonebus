export const SITE_COLORS = {
  forest: "#0F3D35",
  primary: "#1B6B5A",
  accent: "#22C88A",
  mintBg: "#E8F7F0",
  ink: "#0B1F1A",
  sub: "#4A5C57",
  white: "#FFFFFF",
  cream: "#FAFBF9",
  line: "#E2EBE7",
} as const;

export const NAV_ITEMS = [
  { href: "#hoe-het-werkt", label: "Hoe het werkt" },
  { href: "#calculator", label: "Calculator" },
  { href: "#veelgestelde-vragen", label: "Veelgestelde vragen" },
  { href: "#contact", label: "Contact" },
] as const;

export const TRUST_ITEMS = [
  "No cure, no pay",
  "Aanvraag binnen 24 uur in behandeling",
  "Werkt samen met je eigen boekhouder",
] as const;

export const WHAT_WE_DO_ITEMS = [
  {
    title: "We checken je aanvraag",
    body: "Stuur je opdrachtbevestiging op. Wij controleren binnen 24 uur of je in aanmerking komt en welke regelingen het meest opleveren.",
  },
  {
    title: "We dienen alles in",
    body: "MIA, Vamil, KIA — wij vullen de formulieren in en dienen ze in bij RVO. Jij hoeft niks te doen.",
  },
  {
    title: "We bewaken de deadlines",
    body: "De meldingstermijn is 3 maanden na de koopovereenkomst. Wij zorgen dat je die niet mist.",
  },
] as const;

export const HOW_IT_WORKS_ITEMS = [
  {
    title: "Opdrachtbevestiging opsturen",
    body: "Mail je koopovereenkomst of opdrachtbevestiging naar aanvraag@schonebus.nl.",
  },
  {
    title: "Wij rekenen door",
    body: "Binnen 24 uur weet je welke regelingen je oplevert wat.",
  },
  {
    title: "Aanvraag bij RVO",
    body: "Wij vullen alles in en dienen het in. Jij ondertekent één formulier.",
  },
  {
    title: "Voordeel verrekend",
    body: "Je verwerkt de aftrek in je belastingaangifte. Lukt de aanvraag niet, dan betaal je niets.",
  },
] as const;

export const PRICING_ITEMS = [
  {
    name: "schonebus.nl Basis",
    body: "8% van de aftrekpost. Geen aftrek, geen kosten.",
    featured: false,
  },
  {
    name: "schonebus.nl Compleet",
    body: "10% van de aftrekpost. Inclusief begeleiding bij MIA én KIA én EIA op losse onderdelen (batterijpakket, koeling, lichtgewicht laadbak).",
    featured: true,
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Wat kost het als de aanvraag niet lukt?",
    answer: "Niets. We werken no cure, no pay.",
  },
  {
    question: "Welke termijn moet ik halen?",
    answer:
      "De aanvraag moet binnen 3 maanden na de datum van je opdrachtbevestiging binnen zijn bij RVO.",
  },
  {
    question: "Bestaat de SEBA-subsidie nog?",
    answer:
      "Nee. SEBA is per 31 december 2024 gesloten. We werken nu met MIA, Vamil, KIA en EIA op onderdelen.",
  },
  {
    question: "Wat is het verschil tussen MIA en EIA voor mijn bus?",
    answer:
      "MIA gaat over de bus zelf (code E 3101). EIA gaat over specifieke energiebesparende onderdelen, bijvoorbeeld het batterijpakket of een elektrische koeling.",
  },
  {
    question: "Kan ik MIA en KIA combineren?",
    answer: "Ja. Beide regelingen mogen naast elkaar.",
  },
  {
    question: "Geldt dit ook voor tweedehands e-bussen?",
    answer:
      "MIA geldt alleen voor nieuwe bedrijfsmiddelen. Voor gebruikte bussen kijken we per geval.",
  },
  {
    question: "Werkt mijn boekhouder mee?",
    answer:
      "Ja. We leveren alles aan zoals je boekhouder het in de aangifte kan verwerken.",
  },
  {
    question: "Hoe zit het met wegenbelasting?",
    answer:
      "De volledige vrijstelling voor elektrische bestelbussen is in 2026 vervallen. Je betaalt nu het normale tarief.",
  },
] as const;

export const HERO_IMAGE = {
  src: "https://images.unsplash.com/photo-1517520287167-4bbf64a00d66?auto=format&fit=crop&w=1200&q=80",
  alt: "Witte elektrische bestelbus op een lichte bedrijfslocatie",
} as const;

export const CABLE_IMAGE = {
  src: "https://images.unsplash.com/photo-1593941707882-a56bbc8df2b1?auto=format&fit=crop&w=1200&q=80",
  alt: "Oplaadkabel van een elektrische bestelbus bij een laadpunt",
} as const;

export const CLIPBOARD_IMAGE = {
  src: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1200&q=80",
  alt: "Ondernemer met een klembord naast een bedrijfswagen",
} as const;

export const CONTACT_DETAILS = {
  email: "aanvraag@schonebus.nl",
  phone: "06 — nog invullen",
} as const;
