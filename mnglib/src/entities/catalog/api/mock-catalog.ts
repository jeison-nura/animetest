import type {
  AnimeEntry,
  CatalogEntry,
  HeroSlide,
  MangaEntry,
  WatchProgressItem,
} from "../model/types";

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    catalogId: 1,
    title: "JUJUTSU KAISEN",
    subtitle: "Season 3 · 2024",
    description:
      "As cursed spirits grow stronger, Yuji Itadori and his allies face their most dangerous battle yet against the fallen sorcerer Kenjaku and his Culling Game.",
    genres: ["Action", "Supernatural", "Dark Fantasy"],
    rating: "9.2",
    episodes: 24,
    palette: {
      from: "#2e1065",
      to: "#4c1d95",
      accent: "#a855f7",
      textAccent: "#c084fc",
    },
  },
  {
    id: 2,
    catalogId: 2,
    title: "DEMON SLAYER",
    subtitle: "Infinity Castle Arc · 2024",
    description:
      "The final chapter unfolds as Tanjiro and the Hashira confront Muzan Kibutsuji in a breathtaking battle that will decide the fate of humanity.",
    genres: ["Action", "Fantasy", "Historical"],
    rating: "9.5",
    episodes: 11,
    palette: {
      from: "#450a0a",
      to: "#7f1d1d",
      accent: "#f87171",
      textAccent: "#fca5a5",
    },
  },
  {
    id: 3,
    catalogId: 3,
    title: "FRIEREN: BEYOND JOURNEY'S END",
    subtitle: "Season 1 · 2023",
    description:
      "A thousand-year-old elven mage sets out on a quiet journey to understand what it truly means to connect with others, long after her companions have passed.",
    genres: ["Fantasy", "Adventure", "Drama"],
    rating: "9.6",
    episodes: 28,
    palette: {
      from: "#0c4a6e",
      to: "#164e63",
      accent: "#38bdf8",
      textAccent: "#7dd3fc",
    },
  },
  {
    id: 4,
    catalogId: 8,
    title: "ATTACK ON TITAN: FINAL",
    subtitle: "The Final Season Part 4 · 2023",
    description:
      "Eren Yeager unleashes the power of the Founding Titan, setting the world on an inevitable path toward total annihilation in the series' epic conclusion.",
    genres: ["Action", "Drama", "Post-Apocalyptic"],
    rating: "9.8",
    episodes: 12,
    palette: {
      from: "#1c1917",
      to: "#3d1f1f",
      accent: "#a78bfa",
      textAccent: "#c4b5fd",
    },
  },
];

const continueWatching: WatchProgressItem[] = [
  {
    id: 1,
    catalogId: 13,
    title: "Death Note",
    episode: "Ep 12",
    progress: 32,
    totalEps: 37,
    color: "#1e1b4b",
  },
  {
    id: 2,
    catalogId: 3,
    title: "Frieren",
    episode: "Ep 18",
    progress: 38,
    totalEps: 28,
    color: "#0891b2",
  },
  {
    id: 3,
    catalogId: 5,
    title: "Vinland Saga",
    episode: "Ep 11",
    progress: 85,
    totalEps: 24,
    color: "#92400e",
  },
  {
    id: 4,
    catalogId: 9,
    title: "Blue Lock",
    episode: "Ep 20",
    progress: 20,
    totalEps: 24,
    color: "#1d4ed8",
  },
  {
    id: 5,
    catalogId: 7,
    title: "Chainsaw Man",
    episode: "Ep 7",
    progress: 55,
    totalEps: 12,
    color: "#b91c1c",
  },
];

const topPicks: AnimeEntry[] = [
  {
    id: 1,
    title: "Jujutsu Kaisen",
    rating: 9.2,
    episodes: 24,
    year: 2024,
    genres: ["Action", "Supernatural"],
    color: "#7c3aed",
    isNew: true,
    description:
      "Yuji Itadori swallows a cursed finger and becomes host to the King of Curses, joining Tokyo Jujutsu High to hunt the curses that threaten humanity.",
  },
  {
    id: 2,
    title: "Demon Slayer",
    rating: 9.5,
    episodes: 11,
    year: 2024,
    genres: ["Action", "Fantasy"],
    color: "#dc2626",
    isNew: true,
    description:
      "After his family is slaughtered, Tanjiro joins the Demon Slayer Corps to cure his sister and hunt the demon who destroyed his life.",
  },
  {
    id: 3,
    title: "Frieren",
    rating: 9.6,
    episodes: 28,
    year: 2023,
    genres: ["Fantasy", "Drama"],
    color: "#0891b2",
    description:
      "After the hero's party defeats the Demon King, the elven mage Frieren embarks on a quiet journey to understand the humans she has outlived.",
  },
  {
    id: 4,
    title: "Bleach: TYBW",
    rating: 9.3,
    episodes: 52,
    year: 2024,
    genres: ["Action", "Supernatural"],
    color: "#d97706",
    isNew: true,
    description:
      "Ichigo Kurosaki returns to the battlefield as the Quincy army led by Yhwach declares war on Soul Society.",
  },
  {
    id: 5,
    title: "Vinland Saga",
    rating: 9.1,
    episodes: 24,
    year: 2023,
    genres: ["Historical", "Action"],
    color: "#7f5231",
    relatedId: 17,
    description:
      "Thorfinn joins a band of mercenaries to avenge his father, only to learn that a warrior without a sword can still find redemption.",
  },
  {
    id: 6,
    title: "Spy x Family",
    rating: 8.7,
    episodes: 25,
    year: 2023,
    genres: ["Comedy", "Action"],
    color: "#be185d",
    description:
      "A master spy builds the perfect fake family, unaware that his daughter is a telepath and his wife an assassin.",
  },
  {
    id: 7,
    title: "Chainsaw Man",
    rating: 8.8,
    episodes: 12,
    year: 2022,
    genres: ["Dark Fantasy", "Action"],
    color: "#b91c1c",
    relatedId: 19,
    description:
      "Denji fuses with his chainsaw devil Pochita and joins Public Safety's devil hunters, chasing an ordinary life through extraordinary carnage.",
  },
  {
    id: 8,
    title: "Attack on Titan",
    rating: 9.8,
    episodes: 87,
    year: 2023,
    genres: ["Action", "Drama"],
    color: "#374151",
    description:
      "Humanity fights for survival behind towering walls against man-eating Titans in this brutal epic of freedom and war.",
  },
];

const trending: AnimeEntry[] = [
  {
    id: 9,
    title: "Blue Lock",
    rating: 8.5,
    episodes: 24,
    year: 2023,
    genres: ["Sports", "Drama"],
    color: "#1d4ed8",
    isNew: true,
    description:
      "Japan locks 300 strikers in a brutal prison facility to forge the world's most egotistical goalscorer.",
  },
  {
    id: 10,
    title: "One Piece",
    rating: 9.0,
    episodes: 1100,
    year: 2024,
    genres: ["Adventure", "Action"],
    color: "#d97706",
    description:
      "Monkey D. Luffy sails the Grand Line with his crew of pirates, chasing the legendary treasure and the throne of Pirate King.",
  },
  {
    id: 11,
    title: "My Hero Academia",
    rating: 8.4,
    episodes: 138,
    year: 2024,
    genres: ["Action", "School"],
    color: "#16a34a",
    description:
      "In a world of superpowers, quirkless Izuku Midoriya inherits the greatest power of all and enrolls in the top hero academy.",
  },
  {
    id: 12,
    title: "Hunter x Hunter",
    rating: 9.4,
    episodes: 148,
    year: 2014,
    genres: ["Action", "Adventure"],
    color: "#0891b2",
    description:
      "Gon Freecss sets out to become a Hunter and find his missing father, meeting friends and monsters along the way.",
  },
  {
    id: 13,
    title: "Death Note",
    rating: 9.3,
    episodes: 37,
    year: 2007,
    genres: ["Thriller", "Supernatural"],
    color: "#1e1b4b",
    description:
      "A brilliant student finds a notebook that kills anyone whose name is written in it, and a cat-and-mouse game with the detective L begins.",
  },
  {
    id: 14,
    title: "Fullmetal Alchemist",
    rating: 9.5,
    episodes: 64,
    year: 2010,
    genres: ["Action", "Fantasy"],
    color: "#7c2d12",
    description:
      "Two brothers search for the Philosopher's Stone to restore their bodies after a forbidden alchemical experiment goes wrong.",
  },
];

const topManga: MangaEntry[] = [
  {
    id: 15,
    title: "Berserk",
    rating: 9.7,
    chapters: 374,
    year: 2024,
    genres: ["Dark Fantasy", "Action"],
    color: "#1c1917",
    description:
      "Guts, a mercenary branded for sacrifice, swings his massive sword through a dark medieval world while hunting the demon who betrayed him.",
  },
  {
    id: 16,
    title: "Vagabond",
    rating: 9.5,
    chapters: 327,
    year: 2023,
    genres: ["Historical", "Martial Arts"],
    color: "#713f12",
    description:
      "The life of legendary swordsman Miyamoto Musashi, painted with brushstrokes as sharp as his blade.",
  },
  {
    id: 17,
    title: "Vinland Saga",
    rating: 9.2,
    chapters: 210,
    year: 2024,
    genres: ["Historical", "Drama"],
    color: "#7f5231",
    relatedId: 5,
    description:
      "A young Viking seeks revenge across the seas of England and Denmark, until the price of vengeance forces him to reimagine what a true warrior is.",
  },
  {
    id: 18,
    title: "Dungeon Meshi",
    rating: 9.0,
    chapters: 97,
    year: 2023,
    genres: ["Fantasy", "Comedy"],
    color: "#15803d",
    description:
      "A dungeon-delving party must cook and eat the monsters they defeat to survive, in this delicious fantasy of food and friendship.",
  },
  {
    id: 19,
    title: "Chainsaw Man Pt.2",
    rating: 8.9,
    chapters: 155,
    year: 2024,
    genres: ["Dark Fantasy", "Action"],
    color: "#b91c1c",
    isNew: true,
    relatedId: 7,
    description:
      "Asa Mitaka's high school life collides with devils, fame and the War Devil's plan to reclaim Chainsaw Man's heart.",
  },
  {
    id: 20,
    title: "Kaiju No. 8",
    rating: 8.6,
    chapters: 120,
    year: 2024,
    genres: ["Action", "Sci-Fi"],
    color: "#0f4c81",
    isNew: true,
    description:
      "A cleanup worker who disposes of Kaiju corpses gains the power to become one, joining the Defense Force that hunts his own kind.",
  },
];

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return heroSlides;
}

export async function getContinueWatching(): Promise<WatchProgressItem[]> {
  return continueWatching;
}

export async function getTopPicks(): Promise<AnimeEntry[]> {
  return topPicks;
}

export async function getTrending(): Promise<AnimeEntry[]> {
  return trending;
}

export async function getTopManga(): Promise<MangaEntry[]> {
  return topManga;
}

export async function getCatalogEntry(
  id: number
): Promise<CatalogEntry | null> {
  const [topPicks, trending, topManga] = await Promise.all([
    getTopPicks(),
    getTrending(),
    getTopManga(),
  ]);

  const allEntries: CatalogEntry[] = [...topPicks, ...trending, ...topManga];
  return allEntries.find((entry) => entry.id === id) ?? null;
}