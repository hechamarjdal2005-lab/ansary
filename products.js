/* ==========================================================================
   ANSARY PARFUM — CATALOGUE PRODUITS
   --------------------------------------------------------------------------
   Pour ajouter ou modifier un parfum, il suffit d'éditer ce tableau.
   - id        : identifiant unique (sans espaces)
   - category  : "femme" | "homme" | "niche" | "packs"
   - image     : chemin vers la photo du flacon (placeholders SVG inclus)
   - price     : prix de vente en dirhams
   - oldPrice  : ancien prix barré (ou null)
   - badge     : "Best-seller" | "Nouveauté" | "Pack promo" | null
   - bestseller: true pour afficher le produit sur la page d'accueil
   ========================================================================== */

window.PRODUCTS = [
  {
    id: "eclat-de-rose",
    name: "Éclat de Rose",
    category: "femme",
    price: 89,
    oldPrice: null,
    image: "assets/bottle-rose.svg",
    badge: "Best-seller",
    notes: "Rose de mai · Pivoine · Musc blanc",
    inspired: "Inspiré de Miss Dior",
    description:
      "Une rose lumineuse et poudrée, revisitée avec délicatesse pour une féminité moderne et assurée.",
    bestseller: true
  },
  {
    id: "nuit-de-jasmin",
    name: "Nuit de Jasmin",
    category: "femme",
    price: 89,
    oldPrice: null,
    image: "assets/bottle-ivory.svg",
    badge: "Nouveauté",
    notes: "Jasmin de nuit · Fleur d'oranger · Santal",
    inspired: "Inspiré de J'adore",
    description:
      "Un sillage floral solaire, enveloppé de fleur d'oranger et d'un fond de santal crémeux.",
    bestseller: true
  },
  {
    id: "ambre-sultane",
    name: "Ambre Sultane",
    category: "femme",
    price: 99,
    oldPrice: null,
    image: "assets/bottle-amber.svg",
    badge: null,
    notes: "Ambre chaud · Vanille · Épices douces",
    inspired: "Inspiré de Black Opium",
    description:
      "Un accord ambré gourmand et sensuel, pensé pour les soirées où l'on veut laisser une empreinte.",
    bestseller: false
  },
  {
    id: "voile-de-musc",
    name: "Voile de Musc",
    category: "femme",
    price: 79,
    oldPrice: null,
    image: "assets/bottle-violet.svg",
    badge: null,
    notes: "Musc velouté · Poudre de riz · Cèdre",
    inspired: "Inspiré de Narciso Rodriguez",
    description:
      "Un musc doux et enveloppant, comme une seconde peau. La fragrance discrète du quotidien.",
    bestseller: false
  },
  {
    id: "bleu-intense",
    name: "Bleu Intense",
    category: "homme",
    price: 89,
    oldPrice: null,
    image: "assets/bottle-sapphire.svg",
    badge: "Best-seller",
    notes: "Bergamote · Lavande · Bois ambré",
    inspired: "Inspiré de Bleu de Chanel",
    description:
      "L'élégance masculine par excellence : fraîcheur aromatique, profondeur boisée et tenue remarquable.",
    bestseller: true
  },
  {
    id: "noir-cedre",
    name: "Noir Cèdre",
    category: "homme",
    price: 89,
    oldPrice: null,
    image: "assets/bottle-noir.svg",
    badge: null,
    notes: "Cèdre · Vétiver · Poivre noir",
    inspired: "Inspiré de Dior Homme",
    description:
      "Un boisé sec et raffiné, relevé de poivre noir. Une signature sobre pour les hommes de caractère.",
    bestseller: false
  },
  {
    id: "vetiver-dor",
    name: "Vétiver d'Or",
    category: "homme",
    price: 99,
    oldPrice: null,
    image: "assets/bottle-gold.svg",
    badge: null,
    notes: "Vétiver · Cardamome · Fève tonka",
    inspired: "Inspiré de Terre d'Hermès",
    description:
      "Un vétiver minéral et chaleureux, sublimé par la cardamome et la douceur de la fève tonka.",
    bestseller: false
  },
  {
    id: "cuir-imperial",
    name: "Cuir Impérial",
    category: "homme",
    price: 99,
    oldPrice: null,
    image: "assets/bottle-emerald.svg",
    badge: null,
    notes: "Cuir · Safran · Patchouli",
    inspired: "Inspiré de Tom Ford Noir",
    description:
      "Un cuir noble et épicé, profondément masculin, pour une présence immédiatement remarquée.",
    bestseller: false
  },
  {
    id: "oud-royal",
    name: "Oud Royal",
    category: "niche",
    price: 119,
    oldPrice: null,
    image: "assets/bottle-noir.svg",
    badge: "Best-seller",
    notes: "Oud · Rose de Taïf · Bois précieux",
    inspired: "Inspiré des grandes maisons orientales",
    description:
      "Un oud opulent et velouté, marié à la rose de Taïf. Notre fragrance la plus signature.",
    bestseller: true
  },
  {
    id: "santal-sacre",
    name: "Santal Sacré",
    category: "niche",
    price: 109,
    oldPrice: null,
    image: "assets/bottle-gold.svg",
    badge: "Nouveauté",
    notes: "Santal crémeux · Iris · Musc",
    inspired: "Inspiré de Santal 33",
    description:
      "Un santal lacté et lumineux, adouci par l'iris. Une fragrance de niche à la fois douce et addictive.",
    bestseller: true
  },
  {
    id: "rose-de-damas",
    name: "Rose de Damas",
    category: "niche",
    price: 109,
    oldPrice: null,
    image: "assets/bottle-rose.svg",
    badge: null,
    notes: "Rose de Damas · Safran · Oud léger",
    inspired: "Inspiré de Oud Silk Mood",
    description:
      "La rose dans toute sa richesse, ponctuée de safran et d'un oud délicat. Féminin, profond, inoubliable.",
    bestseller: false
  },
  {
    id: "ambre-nomade",
    name: "Ambre Nomade",
    category: "niche",
    price: 119,
    oldPrice: null,
    image: "assets/bottle-amber.svg",
    badge: null,
    notes: "Ambre gris · Encens · Bois blond",
    inspired: "Inspiré de Grand Soir",
    description:
      "Un ambre nomade et mystérieux, entre encens et bois blonds. Pour les amateurs de sillages singuliers.",
    bestseller: false
  },
  {
    id: "pack-4",
    name: "Pack 4 Parfums",
    category: "packs",
    price: 200,
    oldPrice: 356,
    image: "assets/pack-4.svg",
    badge: "Pack promo",
    notes: "4 parfums au choix · Femme, homme ou niche",
    inspired: "L'offre préférée de notre communauté",
    description:
      "Composez votre coffret de 4 parfums parmi toute la collection. Le meilleur rapport qualité-prix de la maison.",
    bestseller: true,
    packUnits: 4
  },
  {
    id: "pack-niche",
    name: "Coffret Niche",
    category: "packs",
    price: 349,
    oldPrice: 456,
    image: "assets/pack-niche.svg",
    badge: "Pack promo",
    notes: "4 parfums de niche · Coffret cadeau",
    inspired: "Sélection des fragrances les plus rares",
    description:
      "Quatre parfums de niche réunis dans un coffret noir et or. Une idée cadeau aussi précieuse qu'intemporelle.",
    bestseller: false,
    packUnits: 4
  },
  {
    id: "pack-duo",
    name: "Coffret Duo",
    category: "packs",
    price: 149,
    oldPrice: 178,
    image: "assets/pack-duo.svg",
    badge: null,
    notes: "2 parfums au choix · Emballage cadeau",
    inspired: "Le duo parfait pour elle et lui",
    description:
      "Deux parfums à choisir librement, présentés dans un écrin élégant. Le cadeau juste, sans se tromper.",
    bestseller: false,
    packUnits: 2
  }
];

window.ANSARY_CATEGORIES = {
  femme: { label: "Parfums Femme", short: "Femme" },
  homme: { label: "Parfums Homme", short: "Homme" },
  niche: { label: "Parfums Niche", short: "Niche" },
  packs: { label: "Packs & Coffrets", short: "Coffret" }
};
