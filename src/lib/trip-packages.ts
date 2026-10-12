import { unsplash } from "@/lib/destinations";

/**
 * Signature trips — the "packages" Vanessa plans for travellers.
 *
 * The live versions are stored in Firestore (`trip_packages`) and edited in
 * /admin/trips. DEFAULT_TRIP_PACKAGES below is the starter set: it is shown on
 * the public site until the collection has any trips in it, and the admin
 * "Add signature trips" button copies it into Firestore for editing.
 *
 * Pricing is quote-based by default: set `fromPrice` (e.g. "AU$3,450 pp")
 * once supplier rates are locked in and it shows on cards and detail pages.
 */

export type TripMotif = "waves" | "peaks" | "sun" | "falls" | "palms" | "compass";

export interface TripOutlineStop {
  /** e.g. "Days 1–3" */
  when: string;
  title: string;
  copy: string;
}

export const TRIP_TONES = ["forest", "olive", "ocean", "espresso", "clay", "sun"] as const;
export const TRIP_MOTIFS: TripMotif[] = ["waves", "peaks", "sun", "falls", "palms", "compass"];
export const TRIP_PACES = ["Easy", "Balanced", "Full"] as const;

export interface TripPackage {
  slug: string;
  /** Country name from DESTINATIONS, e.g. "Brazil". */
  country: string;
  title: string;
  /** Short line under the title on cards. */
  kicker: string;
  summary: string;
  nights: number;
  route: string[];
  bestFor: string;
  season: string;
  pace: (typeof TRIP_PACES)[number];
  /** Optional — shown as "From …". Leave undefined for quote-only trips. */
  fromPrice?: string;
  /** Optional cover photo URL (Firebase Storage or /public). */
  image?: string;
  motif: TripMotif;
  tone: (typeof TRIP_TONES)[number];
  highlights: string[];
  outline: TripOutlineStop[];
  /** Small badge, e.g. "Limited dates" */
  badge?: string;
}

/** A trip as stored in Firestore. */
export interface TripPackageRecord extends TripPackage {
  id: string;
  published: boolean;
  sortOrder: number;
  createdAt?: Date;
}

/** What every package is built around (shown on listing + detail pages). */
export const PACKAGE_INCLUSIONS = [
  {
    title: "Stays chosen for the neighbourhood",
    copy: "Hand-picked hotels and pousadas in walkable, well-located areas, matched to your budget and travel style.",
  },
  {
    title: "Transfers sorted",
    copy: "Airport pick-ups and the in-between legs arranged in advance, so you are never negotiating a ride after a long-haul flight.",
  },
  {
    title: "Experiences worth the time",
    copy: "Trusted local guides for the big sights, plus the small, specific things Vanessa would actually send a friend to do.",
  },
  {
    title: "A day-by-day plan you can hold",
    copy: "A clear itinerary with maps, restaurant picks, safety notes, and wet-weather swaps — in English, written by someone who speaks Portuguese.",
  },
  {
    title: "Someone on WhatsApp",
    copy: "A real person to message before and during the trip when plans change or you just want a lunch recommendation.",
  },
] as const;

export const DEFAULT_TRIP_PACKAGES: TripPackage[] = [
  {
    slug: "first-time-rio",
    country: "Brazil",
    image: unsplash("photo-1544989164-22f292ae11b7"),
    title: "Rio, the first time",
    kicker: "The icons, done properly — plus the Rio locals actually love.",
    summary:
      "Six nights based in Ipanema with the big sights timed for good light and small crowds, a guided day in Santa Teresa and Centro, and slow beach afternoons built in. The trip for anyone who has always wanted to see Rio and wants to do it without stress.",
    nights: 6,
    route: ["Ipanema", "Santa Teresa", "Urca", "Tijuca Forest"],
    bestFor: "First-timers, couples, friends travelling together",
    season: "Year-round · drier and milder May–October",
    pace: "Balanced",
    motif: "waves",
    tone: "forest",
    highlights: [
      "Christ the Redeemer and Sugarloaf, timed around the crowds and the light",
      "A guided walk through Centro, Lapa and the hills of Santa Teresa",
      "Sunset at Arpoador and a proper boteco night",
      "A rainforest morning in Tijuca with a local guide",
      "Free beach afternoons — the most carioca thing you can do",
    ],
    outline: [
      { when: "Days 1–2", title: "Land softly in Ipanema", copy: "Airport transfer, a beachfront walk to get your bearings, an easy first dinner, and a first full day that eases you into the city's rhythm." },
      { when: "Days 3–4", title: "The icons and the old city", copy: "Corcovado early, Sugarloaf late, and a guided day through Centro's colonial streets, Lapa and the studios of Santa Teresa." },
      { when: "Days 5–6", title: "Green Rio and slow days", copy: "Tijuca Forest and the Botanical Garden, then unhurried beach time, a market lunch, and your choice of a samba night." },
      { when: "Day 7", title: "Departure", copy: "One last açaí, then a scheduled transfer to the airport." },
    ],
  },
  {
    slug: "rio-and-the-green-coast",
    country: "Brazil",
    image: unsplash("photo-1660252473252-b9fe4c019563"),
    title: "Rio & the Green Coast",
    kicker: "City, car-free island, and a colonial town on the water.",
    summary:
      "The Costa Verde is where mountains drop straight into the sea. This route pairs four nights in Rio with Ilha Grande's car-free trails and beaches, then finishes in Paraty's cobblestoned historic centre with a schooner day around the bay.",
    nights: 10,
    route: ["Rio de Janeiro", "Ilha Grande", "Paraty"],
    bestFor: "Second-timers, nature lovers, slower travellers",
    season: "Best April–November",
    pace: "Balanced",
    motif: "peaks",
    tone: "olive",
    highlights: [
      "Four nights in Rio to see the city before heading south",
      "Ilha Grande: no cars, jungle trails, and Lopes Mendes beach",
      "Paraty's historic centre and a schooner day around the islands",
      "Waterfalls and cachaça distilleries in the hills behind Paraty",
      "All road and boat transfers arranged door to door",
    ],
    outline: [
      { when: "Days 1–4", title: "Rio de Janeiro", copy: "The essential Rio — viewpoints, beaches, old town — at a pace that leaves room to enjoy it." },
      { when: "Days 5–7", title: "Ilha Grande", copy: "Transfer and boat to the island. Trails, swimming, and a boat day to the quieter beaches." },
      { when: "Days 8–10", title: "Paraty", copy: "Colonial streets, a schooner day on the bay, and an afternoon in the green hills inland." },
      { when: "Day 11", title: "Back to Rio for your flight", copy: "Private transfer timed around your departure." },
    ],
  },
  {
    slug: "rio-buzios-and-the-lakes",
    country: "Brazil",
    image: unsplash("photo-1521495611528-1d6a473a3da1"),
    title: "Rio, Búzios & the Lakes",
    kicker: "Clear water, beach towns, and Rio on either side.",
    summary:
      "East of Rio, the Região dos Lagos has some of the clearest water in Brazil. Split your time between the city, Arraial do Cabo's turquoise coves, and Búzios — a relaxed peninsula of beaches and good restaurants.",
    nights: 9,
    route: ["Rio de Janeiro", "Arraial do Cabo", "Búzios"],
    bestFor: "Beach lovers, honeymooners, families",
    season: "Best September–April for beach weather",
    pace: "Easy",
    motif: "sun",
    tone: "ocean",
    highlights: [
      "Boat day around Arraial do Cabo's coves and lookouts",
      "A different Búzios beach every day, sorted by wind and swell",
      "Sunset on Rua das Pedras and long seafood lunches",
      "Rio before or after — your choice of order",
      "Private transfers along the coast",
    ],
    outline: [
      { when: "Days 1–3", title: "Rio de Janeiro", copy: "Settle in, see the icons, and get a feel for the city." },
      { when: "Days 4–5", title: "Arraial do Cabo", copy: "A boat day through the turquoise coves and a sunset hike to a lookout." },
      { when: "Days 6–9", title: "Búzios", copy: "Beach days, a little shopping, great food, and nothing you have to rush." },
      { when: "Day 10", title: "Transfer for your flight", copy: "Back to Rio's airport on a private transfer." },
    ],
  },
  {
    slug: "rio-and-iguacu-falls",
    country: "Brazil",
    image: unsplash("photo-1614949260630-1d8a27791215"),
    title: "Rio & Iguaçu Falls",
    kicker: "Two of South America's great sights in one trip.",
    summary:
      "Pair Rio with a short flight to Foz do Iguaçu to see the falls from both the Brazilian and Argentine sides. Ideal if you want one trip that covers the city, the beach, and something truly wild.",
    nights: 9,
    route: ["Rio de Janeiro", "Foz do Iguaçu"],
    bestFor: "Bucket-list travellers, families with older kids",
    season: "Year-round · fullest falls December–March",
    pace: "Full",
    motif: "falls",
    tone: "espresso",
    highlights: [
      "Six nights in Rio with the essentials covered",
      "The Brazilian side's panoramic walkway and the Devil's Throat",
      "A guided day on the Argentine side's trails",
      "Optional boat ride into the spray",
      "Domestic flight and all transfers arranged",
    ],
    outline: [
      { when: "Days 1–6", title: "Rio de Janeiro", copy: "The city, the beaches and the viewpoints, with free time built in." },
      { when: "Days 7–9", title: "Foz do Iguaçu", copy: "Fly west for both sides of the falls, with a guide for the Argentine crossing." },
      { when: "Day 10", title: "Onward flight", copy: "Fly home from Foz or connect through São Paulo or Rio." },
    ],
  },
  {
    slug: "carnival-in-rio",
    country: "Brazil",
    image: unsplash("photo-1659700556679-6cb287a5c883"),
    title: "Carnival in Rio",
    kicker: "The street parties, the Sambadrome, and a plan to survive it.",
    summary:
      "Carnival is the best and most chaotic week of Rio's year. This trip handles the hard parts — well-located stays booked early, Sambadrome tickets, and a curated list of street blocos — so you can just enjoy it.",
    nights: 7,
    route: ["Rio de Janeiro"],
    bestFor: "Groups of friends, first-time Carnival-goers",
    season: "February or March — dates change every year",
    pace: "Full",
    motif: "palms",
    tone: "clay",
    badge: "Limited dates",
    highlights: [
      "Stays in safe, walkable neighbourhoods close to the action",
      "Sambadrome parade tickets for one night",
      "A hand-picked bloco schedule for each day",
      "Costume and glitter shopping with local tips",
      "Practical safety briefing before you go",
    ],
    outline: [
      { when: "Days 1–2", title: "Arrive before the rush", copy: "Settle in, learn the neighbourhood, and get the costume sorted." },
      { when: "Days 3–6", title: "Carnival", copy: "Street blocos by day, the Sambadrome one night, and recovery beach time in between." },
      { when: "Days 7–8", title: "Slow down", copy: "A quieter last day, then your transfer to the airport." },
    ],
  },
  {
    slug: "buenos-aires-and-patagonia",
    country: "Argentina",
    image: unsplash("photo-1637580980556-085dee659c7e"),
    title: "Buenos Aires & Patagonia",
    kicker: "Tango-city nights, then glaciers and granite spires.",
    summary:
      "Start with Buenos Aires' cafés, steakhouses and grand old neighbourhoods, then fly south to El Calafate for the Perito Moreno Glacier and on to El Chaltén, Argentina's trekking capital beneath Mount Fitz Roy. An easy add-on to a Brazil trip.",
    nights: 10,
    route: ["Buenos Aires", "El Calafate", "El Chaltén"],
    bestFor: "Hikers, food lovers, Brazil add-on trips",
    season: "Patagonia: October–April",
    pace: "Full",
    motif: "peaks",
    tone: "espresso",
    badge: "New",
    highlights: [
      "Four nights in Buenos Aires with a neighbourhood food walk",
      "Perito Moreno Glacier's walkways — and an optional ice trek",
      "Day hikes from El Chaltén toward Laguna de los Tres or Laguna Torre",
      "A tango evening chosen for music, not tourist dinner shows",
      "Domestic flights and transfers arranged",
    ],
    outline: [
      { when: "Days 1–4", title: "Buenos Aires", copy: "San Telmo, Recoleta and Palermo at an easy pace, with long dinners and a tango night." },
      { when: "Days 5–7", title: "El Calafate", copy: "Fly south for a full day at the Perito Moreno Glacier and a lakeside evening." },
      { when: "Days 8–10", title: "El Chaltén", copy: "Choose your hikes by weather and fitness, with a guide available for the bigger days." },
      { when: "Day 11", title: "Fly out", copy: "Back via El Calafate to Buenos Aires for onward flights." },
    ],
  },
  {
    slug: "peru-cusco-and-machu-picchu",
    country: "Peru",
    image: unsplash("photo-1587595431973-160d0d94add1"),
    title: "Cusco, the Sacred Valley & Machu Picchu",
    kicker: "The Inca heartland, paced for the altitude.",
    summary:
      "A carefully paced week in the Andes: start low in the Sacred Valley to acclimatise, take the train to Aguas Calientes for an early Machu Picchu entry, then finish in Cusco's cobbled historic centre.",
    nights: 7,
    route: ["Sacred Valley", "Machu Picchu", "Cusco"],
    bestFor: "History lovers, first trips to the Andes",
    season: "Driest May–September",
    pace: "Balanced",
    motif: "peaks",
    tone: "olive",
    badge: "New",
    highlights: [
      "An itinerary ordered to make acclimatisation easier",
      "Machu Picchu entry tickets and a private guide",
      "Pisac market and the Ollantaytambo ruins",
      "Scenic train through the Urubamba valley",
      "Cusco's San Blas neighbourhood and markets",
    ],
    outline: [
      { when: "Days 1–3", title: "Sacred Valley", copy: "Land in Cusco and head straight down to the valley to adjust gently, with Pisac and Ollantaytambo." },
      { when: "Days 4–5", title: "Machu Picchu", copy: "Train to Aguas Calientes, then an early guided visit to the citadel." },
      { when: "Days 6–7", title: "Cusco", copy: "The historic centre, San Blas, and a final dinner before you fly out." },
      { when: "Day 8", title: "Departure", copy: "Transfer to Cusco airport for your onward connection." },
    ],
  },
  {
    slug: "made-to-measure-brazil",
    country: "Brazil",
    image: unsplash("photo-1741635549870-e8a44f708b56"),
    title: "Your Brazil, made to measure",
    kicker: "Salvador, the Amazon, Lençóis — tell Vanessa the dream.",
    summary:
      "Not every trip fits a template. Tell Vanessa where you want to go, how you like to travel and what you want to feel, and she will design a route from scratch — from a long weekend in Rio to three weeks across Brazil.",
    nights: 0,
    route: ["Anywhere in Brazil"],
    bestFor: "Anyone with a specific idea — or none at all",
    season: "Any time of year",
    pace: "Balanced",
    motif: "compass",
    tone: "sun",
    highlights: [
      "A short call to understand how you like to travel",
      "A first route proposal with two or three options",
      "Revisions until the plan feels like yours",
      "Everything booked and documented once you are happy",
    ],
    outline: [
      { when: "Step 1", title: "Tell us the idea", copy: "Fill in the trip planner — dates, budget, interests, and who is travelling." },
      { when: "Step 2", title: "A tailored proposal", copy: "Vanessa sends a route with stay and experience options and a clear quote." },
      { when: "Step 3", title: "Book and go", copy: "Confirm, and everything is arranged, with a full itinerary and WhatsApp support." },
    ],
  },
];

/** Default trips shaped like Firestore records (used before anything is seeded). */
export const DEFAULT_TRIP_RECORDS: TripPackageRecord[] = DEFAULT_TRIP_PACKAGES.map(
  (trip, index) => ({ ...trip, id: `default-${trip.slug}`, published: true, sortOrder: index + 1 })
);

export function tripLengthLabel(trip: TripPackage): string {
  return trip.nights > 0 ? `${trip.nights} nights` : "Any length";
}
