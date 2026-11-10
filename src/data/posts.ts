export type PostBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export type PostCategory = "Guides d'achat" | "Ventilation" | "Conseils" | "Actualités";

export const postCategories: PostCategory[] = [
  "Guides d'achat",
  "Ventilation",
  "Conseils",
  "Actualités",
];

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  /** ISO date */
  date: string;
  readingTime: number;
  cover: string;
  content: PostBlock[];
  /** Category slug used for related products. */
  relatedCategory: string;
};

// CONTENU EXEMPLE À REMPLACER — articles d'exemple à relire / remplacer.
export const posts: Post[] = [
  // CONTENU EXEMPLE À REMPLACER
  {
    slug: "split-mural-cassette-ou-gainable",
    title: "Split mural, cassette ou gainable : lequel choisir ?",
    excerpt:
      "Trois familles de climatiseurs, trois logiques d'installation. Voici les critères pour choisir la solution adaptée à votre espace.",
    category: "Guides d'achat",
    date: "2026-10-20",
    readingTime: 5,
    cover: "/images/blog/blog-split-cassette-gainable.webp",
    relatedCategory: "split-mural",
    content: [
      {
        type: "p",
        text: "Le split mural, la cassette et le gainable sont trois configurations de climatisation « split » : une unité intérieure reliée à une unité extérieure. Ce qui les distingue, c'est la façon dont l'air est diffusé dans la pièce et le type d'installation nécessaire.",
      },
      { type: "h2", text: "Le split mural : simple et polyvalent" },
      {
        type: "p",
        text: "Fixée en hauteur sur un mur, l'unité intérieure souffle l'air directement dans la pièce. C'est la solution la plus courante pour une chambre, un salon ou un petit bureau, car elle demande peu de travaux.",
      },
      {
        type: "ul",
        items: [
          "Installation rapide, sans faux plafond",
          "Adapté à une pièce à la fois",
          "Entretien facile (filtres accessibles)",
        ],
      },
      { type: "h2", text: "La cassette : une diffusion homogène" },
      {
        type: "p",
        text: "Encastrée dans un faux plafond, la cassette diffuse l'air dans plusieurs directions. Elle est appréciée dans les commerces, open spaces et salles de réunion où l'on recherche un confort réparti sur toute la surface.",
      },
      { type: "h2", text: "Le gainable : la discrétion totale" },
      {
        type: "p",
        text: "Le gainable est dissimulé dans un faux plafond ou des combles. L'air est distribué par un réseau de gaines vers des bouches discrètes, ce qui permet de traiter plusieurs pièces avec une seule unité intérieure.",
      },
      { type: "h2", text: "Comment trancher ?" },
      {
        type: "ul",
        items: [
          "Une seule pièce, budget maîtrisé : split mural",
          "Grande pièce ouverte avec faux plafond : cassette",
          "Plusieurs pièces et recherche de discrétion : gainable",
        ],
      },
      {
        type: "p",
        text: "Dans tous les cas, le dimensionnement doit être validé par un professionnel en fonction de la surface, de l'exposition et de l'usage des locaux. Nos conseillers techniques peuvent vous accompagner.",
      },
    ],
  },
  // CONTENU EXEMPLE À REMPLACER
  {
    slug: "rooftop-choisir-la-bonne-puissance",
    title: "Rooftop : comment choisir la bonne puissance",
    excerpt:
      "Surface, volume, occupation, apports de chaleur : les éléments à prendre en compte pour dimensionner une unité de toiture.",
    category: "Guides d'achat",
    date: "2026-10-06",
    readingTime: 6,
    cover: "/images/blog/blog-rooftop-choisir-puissance.webp",
    relatedCategory: "rooftop",
    content: [
      {
        type: "p",
        text: "Le rooftop est une unité de climatisation monobloc posée en toiture. Il est conçu pour les grands volumes : surfaces commerciales, entrepôts, salles polyvalentes ou bâtiments tertiaires. Bien choisir sa puissance est déterminant pour le confort et la consommation.",
      },
      { type: "h2", text: "Comprendre l'unité RT" },
      {
        type: "p",
        text: "La puissance des rooftops est souvent exprimée en RT (Refrigeration Ton). Une tonne de réfrigération correspond à 12 000 BTU/h. Plus la valeur est élevée, plus l'unité peut évacuer de chaleur.",
      },
      { type: "h2", text: "Les critères de dimensionnement" },
      {
        type: "ul",
        items: [
          "La surface et la hauteur sous plafond (le volume d'air à traiter)",
          "L'occupation : nombre de personnes présentes simultanément",
          "Les apports internes : éclairage, machines, équipements",
          "L'exposition au soleil et l'isolation du bâtiment",
          "Le besoin d'air neuf et la configuration du réseau de gaines",
        ],
      },
      { type: "h2", text: "Pourquoi éviter le surdimensionnement" },
      {
        type: "p",
        text: "Une unité trop puissante fonctionne par cycles courts, ce qui nuit au confort et à la durée de vie de l'équipement. À l'inverse, une unité sous-dimensionnée tourne en permanence sans atteindre la température souhaitée.",
      },
      {
        type: "p",
        text: "Seule une étude de charge thermique permet de déterminer la puissance adaptée. Nos équipes peuvent réaliser ce dimensionnement à partir des informations de votre projet.",
      },
    ],
  },
  // CONTENU EXEMPLE À REMPLACER
  {
    slug: "caisson-extraction-vs-caisson-air-neuf",
    title: "Caisson d'extraction vs caisson d'air neuf",
    excerpt:
      "L'un évacue l'air vicié, l'autre apporte de l'air extérieur. Comprendre leur rôle pour concevoir une ventilation équilibrée.",
    category: "Ventilation",
    date: "2026-09-22",
    readingTime: 4,
    cover: "/images/blog/blog-caisson-extraction-vs-air-neuf.webp",
    relatedCategory: "caissons-extraction",
    content: [
      {
        type: "p",
        text: "Une ventilation efficace repose sur deux mouvements complémentaires : extraire l'air vicié et introduire de l'air neuf. Les caissons d'extraction et les caissons d'air neuf répondent chacun à l'un de ces besoins.",
      },
      { type: "h2", text: "Le caisson d'extraction" },
      {
        type: "p",
        text: "Il aspire l'air chargé d'humidité, d'odeurs ou de polluants et le rejette à l'extérieur. On le retrouve dans les cuisines professionnelles, les sanitaires collectifs, les parkings ou les locaux techniques.",
      },
      { type: "h2", text: "Le caisson d'air neuf" },
      {
        type: "p",
        text: "Il insuffle de l'air extérieur, généralement filtré, dans le bâtiment. Il contribue à la qualité de l'air intérieur et compense l'air extrait.",
      },
      { type: "h2", text: "Pourquoi les associer" },
      {
        type: "ul",
        items: [
          "Équilibrer les débits entre air entrant et air sortant",
          "Éviter les dépressions ou surpressions dans les locaux",
          "Maîtriser la qualité de l'air et le confort des occupants",
        ],
      },
      {
        type: "p",
        text: "Le choix des débits et des équipements dépend de l'usage du bâtiment. Un bureau d'études ou un installateur qualifié pourra vous orienter.",
      },
    ],
  },
  // CONTENU EXEMPLE À REMPLACER
  {
    slug: "desenfumage-les-bases",
    title: "Désenfumage : les bases à connaître",
    excerpt:
      "À quoi sert le désenfumage, comment fonctionne un caisson de désenfumage et pourquoi faire appel à un professionnel.",
    category: "Ventilation",
    date: "2026-09-08",
    readingTime: 4,
    cover: "/images/blog/blog-desenfumage-bases.webp",
    relatedCategory: "caissons-desenfumage",
    content: [
      {
        type: "p",
        text: "En cas d'incendie, les fumées représentent un danger majeur pour les occupants. Le désenfumage a pour objectif de les évacuer afin de maintenir des chemins d'évacuation praticables et de faciliter l'intervention des secours.",
      },
      { type: "h2", text: "Désenfumage naturel et mécanique" },
      {
        type: "p",
        text: "Le désenfumage naturel s'appuie sur des ouvrants en façade ou en toiture. Le désenfumage mécanique utilise des ventilateurs, comme les caissons de désenfumage, pour extraire activement les fumées.",
      },
      { type: "h2", text: "Le rôle du caisson de désenfumage" },
      {
        type: "p",
        text: "Il s'agit d'un ventilateur conçu pour fonctionner dans des conditions de température élevée pendant une durée déterminée. Il est raccordé à un réseau de conduits et piloté par le système de sécurité incendie du bâtiment.",
      },
      { type: "h2", text: "Les points de vigilance" },
      {
        type: "ul",
        items: [
          "La conception doit respecter la réglementation applicable au type de bâtiment",
          "Le choix de l'équipement doit être validé par un professionnel qualifié",
          "L'installation doit faire l'objet de vérifications et d'un entretien réguliers",
        ],
      },
      {
        type: "p",
        text: "Pour tout projet de désenfumage, rapprochez-vous d'un bureau d'études ou d'un installateur spécialisé. Nos équipes peuvent vous orienter vers l'équipement adapté.",
      },
    ],
  },
];

export const getPostBySlug = (slug: string) => posts.find((p) => p.slug === slug);

export const getLatestPosts = (limit = 3) =>
  [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);

export const formatPostDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
