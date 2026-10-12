import type { Itinerary, ItineraryDay } from "@/types";
import { unsplash } from "@/lib/destinations";

export type StarterItinerary = Omit<Itinerary, "id" | "createdAt">;

const list = (items: string[]) => `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;

function itineraryDays(items: Array<[string, string]>): ItineraryDay[] {
  return items.map(([title, description], index) => ({
    day: index + 1,
    blockType: "day",
    title: `<p>${title}</p>`,
    description: `<p>${description}</p>`,
  }));
}

const STANDARD_EXCLUDED = [
  "Flights, accommodation, tours and transport bookings",
  "Visa, health and travel-insurance advice — always check official sources for your passport",
  "Live prices and opening hours, which change often — confirm before you go",
];

function starterGuide({
  title,
  slug,
  country,
  description,
  price,
  duration,
  destinations,
  highlights,
  days,
  included,
  cover,
  gallery = [],
}: {
  title: string;
  slug: string;
  country: string;
  description: string;
  price: number;
  duration: number;
  destinations: string[];
  highlights: string[];
  days: Array<[string, string]>;
  included: string[];
  cover: string;
  gallery?: string[];
}): StarterItinerary {
  return {
    title,
    slug,
    country,
    description: `<p>${description}</p>`,
    price,
    duration,
    destinations,
    highlights: list(highlights),
    coverImage: unsplash(cover),
    gallery: gallery.map((id) => unsplash(id, 1200)),
    days: itineraryDays(days),
    included: list(included),
    excluded: list(STANDARD_EXCLUDED),
    published: false,
  };
}

/**
 * Starter guide library, seeded from /admin/itineraries ("Add starter library").
 * Seeding copies these into Firestore, where every field can then be edited.
 * Photos are free-licence Unsplash images — replace with your own over time.
 * Never overwrites an existing guide with the same slug.
 */
export const STARTER_ITINERARIES: StarterItinerary[] = [
  // ------------------------------------------------------------------ BRAZIL
  starterGuide({
    title: "First-Time Rio: Beaches, Views & Old-School Charm",
    slug: "first-time-rio-5-days",
    country: "Brazil",
    description:
      "Five well-paced days for a first visit to Rio de Janeiro: the two great viewpoints timed for good light, a day in the historic centre and Santa Teresa, rainforest in the middle of the city, and proper beach time in Ipanema.",
    price: 19,
    duration: 5,
    destinations: ["Rio de Janeiro", "Ipanema", "Santa Teresa", "Urca"],
    cover: "photo-1544989164-22f292ae11b7",
    gallery: ["photo-1518639192441-8fce0a366e2e", "photo-1619546952812-520e98064a52", "photo-1626568941852-70bc179e493e"],
    highlights: [
      "Christ the Redeemer on the first train up, before the crowds",
      "Sugarloaf at sunset, plus the free Pista Cláudio Coutinho path",
      "Centro, Lapa and Santa Teresa in one walkable day",
      "Sunset applause on the Arpoador rock",
      "Where to stay, eat and swim as a first-timer",
    ],
    days: [
      ["Settle into Ipanema", "Check in, walk the promenade from Posto 9 to Arpoador, and join the crowd on the rock to applaud the sunset. Keep dinner close — a casual boteco in Ipanema is perfect after a long flight."],
      ["Centro, Lapa and Santa Teresa", "Coffee and pastries at Confeitaria Colombo, then the Real Gabinete Português de Leitura and the Theatro Municipal. Walk to the Lapa Arches and climb the Escadaria Selarón, then ride or walk up to Santa Teresa for Parque das Ruínas and a feijoada lunch."],
      ["Corcovado and green Rio", "Take an early Corcovado train from Cosme Velho to Christ the Redeemer. Afterwards, slow down at Parque Lage's café, the Botanical Garden, and an afternoon bike loop around Lagoa Rodrigo de Freitas."],
      ["Urca and Sugarloaf", "Spend a lazy morning at Praia Vermelha, walk the Pista Cláudio Coutinho trail (look for marmosets), then take the Sugarloaf cable car late afternoon for sunset over Guanabara Bay. Dinner and a cold beer on the Urca sea wall."],
      ["A carioca beach day", "Rent a chair and umbrella from a barraca, try mate and Biscoito Globo on the sand, and finish with açaí. On Sundays, add the Feira Hippie in Praça General Osório."],
    ],
    included: [
      "The five-day route with timings that beat queues and heat",
      "Neighbourhood guide: where to base yourself and why",
      "Vanessa's food list — botecos, feijoada, açaí and juice bars",
      "Beach etiquette, what to bring and what to leave at the hotel",
      "Practical safety notes and wet-weather swaps for every day",
    ],
  }),
  starterGuide({
    title: "Rio Like a Local: Food, Beaches & Neighbourhood Days",
    slug: "rio-like-a-local-3-days",
    country: "Brazil",
    description:
      "A shorter Rio guide for travellers who care more about neighbourhood rhythm, beach culture and good, casual food than ticking off every landmark. Perfect for a second visit or a long stopover.",
    price: 15,
    duration: 3,
    destinations: ["Rio de Janeiro", "Leblon", "Botafogo", "Niterói"],
    cover: "photo-1701397165362-eae00113599d",
    gallery: ["photo-1643400813604-b3877e0c4db9", "photo-1559817976-988f52cd9468", "photo-1507125524815-d9d6dccda1dc"],
    highlights: [
      "Leblon and Ipanema the way locals use them",
      "A guided Dois Irmãos hike from Vidigal",
      "Botafogo's food scene and Mureta da Urca evenings",
      "A ferry across the bay to Niemeyer's museum in Niterói",
    ],
    days: [
      ["Leblon, slowly", "Breakfast at a padaria, a swim at Leblon, and lunch on a side street away from the beachfront. In the late afternoon, walk to Mirante do Leblon for the view back along the coast."],
      ["Dois Irmãos and Botafogo", "Go early with a local guide to hike Morro Dois Irmãos from Vidigal — one of the best views in Rio. Rest, then spend the evening in Botafogo's bars and finish with drinks on the Mureta da Urca."],
      ["Across the bay to Niterói", "Take the ferry from Praça XV to Niterói for the Museu de Arte Contemporânea and its famous view of Rio. Back in the city, finish at Pedra do Sal if there is samba that night."],
    ],
    included: [
      "Three neighbourhood-led days with transport between them",
      "How to book a trusted guide for the Dois Irmãos hike",
      "Botafogo and Leblon food and bar shortlist",
      "Ferry, metro and ride-share tips",
    ],
  }),
  starterGuide({
    title: "Costa Verde: Rio to Paraty via Ilha Grande",
    slug: "costa-verde-rio-paraty-6-days",
    country: "Brazil",
    description:
      "Six days on the Green Coast, where rainforest drops straight into the sea. Three nights on car-free Ilha Grande, then three in Paraty's cobbled colonial centre, with a schooner day around the bay.",
    price: 24,
    duration: 6,
    destinations: ["Ilha Grande", "Paraty", "Trindade"],
    cover: "photo-1549728556-e82a9bbfac30",
    gallery: ["photo-1660076327655-a43e7cadf86d", "photo-1623194417728-adf641357d41", "photo-1660252473252-b9fe4c019563"],
    highlights: [
      "Lopes Mendes, one of Brazil's most beautiful beaches",
      "Snorkelling at Lagoa Azul by boat",
      "Paraty's historic centre and a saveiro schooner day",
      "Trindade's natural pool and cachaça distilleries",
    ],
    days: [
      ["Rio to Ilha Grande", "Transfer from Rio to the boat pier at Conceição de Jacareí or Angra dos Reis, then cross to Vila do Abraão. Walk the village, find dinner on the sand, and enjoy an island with no cars."],
      ["Lopes Mendes", "Hike the trail toward Pouso and on to Lopes Mendes, or take a boat to Pouso and walk the last section. Swim, then head back before the last boat."],
      ["Lagoa Azul by boat", "Join a boat tour to Lagoa Azul and the surrounding coves for snorkelling and quieter beaches. Keep the evening slow in Abraão."],
      ["Onward to Paraty", "Boat back to the mainland and transfer down the coast to Paraty. Spend the evening wandering the historic centre's cobbled streets — lit beautifully after dark."],
      ["Paraty Bay by schooner", "Take a saveiro schooner tour around the bay's islands and beaches, with swimming stops. In the evening, choose a restaurant in the old town."],
      ["Trindade or the hills", "Choose between Trindade's beaches and the Cachadaço natural pool, or the green road inland for waterfalls and a cachaça distillery tasting before heading on."],
    ],
    included: [
      "Door-to-door transport plan from Rio, with boat options",
      "Which trails, beaches and tours are worth it — and which to skip",
      "Paraty's best streets, restaurants and pousada areas",
      "Wet-weather and rough-sea alternatives",
    ],
  }),
  starterGuide({
    title: "Região dos Lagos: Búzios, Cabo Frio & Arraial",
    slug: "regiao-dos-lagos-road-trip-5-days",
    country: "Brazil",
    description:
      "Five sunny days in the Lakes Region east of Rio — turquoise water in Arraial do Cabo, sand dunes in Cabo Frio, and Búzios' easy beach-town rhythm — with only one hotel change.",
    price: 21,
    duration: 5,
    destinations: ["Búzios", "Cabo Frio", "Arraial do Cabo"],
    cover: "photo-1521495611528-1d6a473a3da1",
    gallery: ["photo-1508272961731-dc692d634a79", "photo-1585261561077-88d368ca7e46", "photo-1508272319511-badf90d1cf27"],
    highlights: [
      "A boat day to Arraial's Ilha do Farol and Gruta Azul",
      "Praia do Forno's short trail and clear water",
      "Búzios beaches matched to the wind each day",
      "Sunset on Orla Bardot and dinner on Rua das Pedras",
    ],
    days: [
      ["Rio to Arraial do Cabo", "Drive or transfer east (about three hours). Swim at Prainha, then walk up to Pontal do Atalaia for the view over the turquoise coves."],
      ["Arraial on the water", "Take a morning boat tour to Praia do Farol, Gruta Azul and the coves. Afternoon at Praia do Forno via its short trail."],
      ["Cabo Frio and on to Búzios", "Stop at Praia do Forte and the dunes in Cabo Frio, then continue to Búzios. Watch sunset from Orla Bardot."],
      ["Búzios beaches", "Pick beaches by the wind: Ferradura and João Fernandes for calm water, Geribá for surf and beach bars. Dinner on Rua das Pedras."],
      ["Azeda and home", "A morning swim at Azeda and Azedinha before the drive back to Rio. Leave early on weekends to beat traffic."],
    ],
    included: [
      "A route that avoids changing hotels every night",
      "Which beaches suit which conditions",
      "Boat-tour advice and what to expect",
      "Driving, parking and transfer tips",
    ],
  }),
  starterGuide({
    title: "Rio's Mountain Escape: Petrópolis & Teresópolis",
    slug: "serra-fluminense-petropolis-teresopolis-4-days",
    country: "Brazil",
    description:
      "A cooler four-day escape into the mountains behind Rio: imperial history in Petrópolis, the dramatic peaks of Serra dos Órgãos National Park, and long lunches in Itaipava.",
    price: 18,
    duration: 4,
    destinations: ["Petrópolis", "Itaipava", "Teresópolis"],
    cover: "photo-1635982321413-dda50caeee44",
    gallery: ["photo-1617367140853-95aacc56d56d"],
    highlights: [
      "The Imperial Museum and Petrópolis Cathedral",
      "Santos Dumont's quirky house",
      "Serra dos Órgãos National Park and the Dedo de Deus peak",
      "Cool-climate food in Itaipava",
    ],
    days: [
      ["Up to Petrópolis", "About an hour and a half from Rio. Visit the Imperial Museum and the Cathedral of São Pedro de Alcântara, then walk the historic centre's leafy avenues."],
      ["Petrópolis in depth", "See Casa de Santos Dumont and the grand Palácio Quitandinha, then head to Itaipava for a long lunch and local beer."],
      ["Serra dos Órgãos", "Drive the scenic road to Teresópolis and spend the day in Serra dos Órgãos National Park on trails suited to your fitness, with views of the Dedo de Deus."],
      ["Mountain morning, back to Rio", "A final easy walk or market visit before returning to Rio, timed to avoid weekend traffic."],
    ],
    included: [
      "A relaxed four-day route with road timings",
      "Trail options from easy to challenging",
      "Where to eat in Petrópolis and Itaipava",
      "Rainy-day alternatives",
    ],
  }),
  starterGuide({
    title: "São Paulo: Food, Art & Big-City Energy",
    slug: "sao-paulo-food-art-4-days",
    country: "Brazil",
    description:
      "Four focused days in Brazil's biggest city, organised by neighbourhood so you spend time eating and exploring rather than sitting in traffic.",
    price: 19,
    duration: 4,
    destinations: ["São Paulo", "Vila Madalena", "Liberdade", "Pinheiros"],
    cover: "photo-1645918899630-85e2f3132a84",
    gallery: ["photo-1554168848-228452c09d60"],
    highlights: [
      "MASP and Avenida Paulista (car-free on Sundays)",
      "The Mercado Municipal's legendary mortadella sandwich",
      "Liberdade's Japanese-Brazilian food",
      "Beco do Batman street art in Vila Madalena",
    ],
    days: [
      ["Avenida Paulista", "Start at MASP in Lina Bo Bardi's floating building, walk the avenue, and look into Casa Modernista or a bookshop café. Dinner nearby."],
      ["Centro and Liberdade", "The Mercado Municipal for lunch, Edifício Copan and the Pinacoteca, then into Liberdade for its street food and shops."],
      ["Vila Madalena and Pinheiros", "Coffee in Pinheiros, Beco do Batman's murals, independent design stores, and a late dinner — paulistanos eat late."],
      ["Ibirapuera", "A morning in Ibirapuera Park with its Niemeyer pavilions and museums, then one last neighbourhood lunch before you go."],
    ],
    included: [
      "Four neighbourhood-based days that minimise travel time",
      "Restaurant and bar shortlist by area",
      "Metro and ride-share tips",
      "Sunday-specific swaps for Paulista",
    ],
  }),
  starterGuide({
    title: "Salvador & Bahia: Colour, Capoeira and Coast",
    slug: "salvador-bahia-5-days",
    country: "Brazil",
    description:
      "Five days in Brazil's first capital, the heart of Afro-Brazilian culture: Pelourinho's painted streets, Bahian food, music and capoeira, and a day on the islands.",
    price: 21,
    duration: 5,
    destinations: ["Salvador", "Pelourinho", "Morro de São Paulo"],
    cover: "photo-1591233055842-a984961b71af",
    gallery: ["photo-1583166614297-a97b68d5cead", "photo-1741635549870-e8a44f708b56"],
    highlights: [
      "Pelourinho, a UNESCO World Heritage historic centre",
      "The gold-lined Igreja de São Francisco",
      "Acarajé, moqueca and Bahian sweets",
      "Sunset at Farol da Barra",
      "A day trip to Morro de São Paulo",
    ],
    days: [
      ["Barra and the lighthouse", "Settle into Barra, swim at Porto da Barra, and watch the sun set beside the Farol da Barra lighthouse."],
      ["Pelourinho", "Explore the historic centre with a local guide: Largo do Pelourinho, the Igreja de São Francisco and the capoeira and drumming that fill the squares."],
      ["Lower city and Rio Vermelho", "Ride the Elevador Lacerda down to the Mercado Modelo. Evening in Rio Vermelho for acarajé and live music."],
      ["Morro de São Paulo", "A catamaran day trip to car-free Morro de São Paulo for beaches and a lunch by the water (check sea conditions)."],
      ["A slow final day", "Return to Pelourinho for anything you missed, or spend the day on a beach north of the city."],
    ],
    included: [
      "Five days with timings for the historic centre",
      "Food guide to Bahian dishes and where to try them",
      "How to find genuine capoeira and music",
      "Safety notes for the old town after dark",
    ],
  }),
  starterGuide({
    title: "Iguaçu Falls: Both Sides in Three Days",
    slug: "iguacu-falls-3-days",
    country: "Brazil",
    description:
      "See one of the world's great waterfalls from both the Brazilian panorama and the Argentine walkways, with time for the bird park and a boat ride into the spray.",
    price: 15,
    duration: 3,
    destinations: ["Foz do Iguaçu", "Iguazú (Argentina)"],
    cover: "photo-1614949260630-1d8a27791215",
    gallery: ["photo-1598496437753-333a2880a98f"],
    highlights: [
      "The Brazilian trail ending at the Devil's Throat viewpoint",
      "The Argentine side's upper and lower circuits",
      "Parque das Aves, next to the park entrance",
      "An optional boat ride under the falls",
    ],
    days: [
      ["The Brazilian side", "Arrive early at Parque Nacional do Iguaçu and walk the panoramic trail to the Garganta do Diabo platform. In the afternoon, visit Parque das Aves across the road."],
      ["The Argentine side", "Cross the border (bring your passport) for a full day in Parque Nacional Iguazú: the Circuito Superior, Circuito Inferior and the train to the Garganta del Diablo walkway."],
      ["Boat ride or Itaipu", "Choose a boat ride into the spray, or the Itaipu Dam tour, before your flight out."],
    ],
    included: [
      "The best order to see both sides",
      "Border-crossing tips and what to bring",
      "Where to stay in Foz do Iguaçu",
      "How to stay dry (mostly)",
    ],
  }),
  starterGuide({
    title: "Lençóis Maranhenses: Dunes and Blue Lagoons",
    slug: "lencois-maranhenses-5-days",
    country: "Brazil",
    description:
      "One of Brazil's most surreal landscapes: white dunes filled with rainwater lagoons. Five days based in Barreirinhas and Atins, timed for the season when the lagoons are full.",
    price: 21,
    duration: 5,
    destinations: ["Barreirinhas", "Atins", "São Luís"],
    cover: "photo-1650623598066-235c97af15c7",
    gallery: ["photo-1701221258513-7f4c7092b6a0"],
    highlights: [
      "Swimming in Lagoa Azul and Lagoa Bonita",
      "A boat down the Preguiças River to Caburé",
      "Atins' quiet village and kitesurf beaches",
      "Best timing: roughly June to September",
    ],
    days: [
      ["São Luís to Barreirinhas", "Transfer from São Luís (about four hours) to Barreirinhas, the gateway to the national park."],
      ["Lagoa Azul circuit", "A 4x4 trip into the dunes for the Lagoa Azul circuit and swimming, returning for sunset over the sand."],
      ["Lagoa Bonita", "The Lagoa Bonita circuit — climb the dune for the view, then swim in the lagoons."],
      ["Down the river to Atins", "Boat along the Preguiças River via Vassouras and the Mandacaru lighthouse to Caburé and Atins."],
      ["Atins", "A slow day in Atins — dunes, beach and shrimp lunch — before heading back."],
    ],
    included: [
      "When to go for full lagoons",
      "How to choose tour operators and transfers",
      "Barreirinhas vs. Atins: where to stay",
      "Packing list for dunes and sun",
    ],
  }),

  // --------------------------------------------------------------- ARGENTINA
  starterGuide({
    title: "Buenos Aires: Cafés, Parrillas & Tango",
    slug: "buenos-aires-4-days",
    country: "Argentina",
    description:
      "Four days in the Paris of South America, neighbourhood by neighbourhood: grand cafés and Recoleta, San Telmo's Sunday market, colourful La Boca, and long nights in Palermo.",
    price: 19,
    duration: 4,
    destinations: ["Buenos Aires", "San Telmo", "Recoleta", "Palermo"],
    cover: "photo-1612294037637-ec328d0e075e",
    gallery: ["photo-1725499267114-15531716d101"],
    highlights: [
      "Recoleta Cemetery and El Ateneo Grand Splendid bookshop",
      "The San Telmo Sunday fair on Calle Defensa",
      "Caminito in La Boca",
      "A real milonga, not a dinner show",
    ],
    days: [
      ["Centro and Plaza de Mayo", "Plaza de Mayo, Casa Rosada and the Cabildo, coffee at Café Tortoni, and dinner at a classic parrilla."],
      ["Recoleta", "Recoleta Cemetery (find Evita's tomb), MALBA or the Museo Nacional de Bellas Artes, and El Ateneo Grand Splendid."],
      ["San Telmo and La Boca", "Wander San Telmo's antique streets — on Sundays the fair fills Calle Defensa — then visit Caminito's colourful houses in La Boca by day."],
      ["Palermo", "Palermo Soho's boutiques and cafés, the Rosedal gardens, and a final night at a milonga."],
    ],
    included: [
      "Four days organised by neighbourhood",
      "Parrilla and café shortlist",
      "How to choose a milonga as a beginner",
      "Getting around on the Subte and by taxi app",
    ],
  }),
  starterGuide({
    title: "Patagonia: Perito Moreno & El Chaltén",
    slug: "patagonia-calafate-chalten-6-days",
    country: "Argentina",
    description:
      "Six days in Argentine Patagonia: the Perito Moreno Glacier from El Calafate, then the trekking capital of El Chaltén under Mount Fitz Roy.",
    price: 24,
    duration: 6,
    destinations: ["El Calafate", "El Chaltén", "Patagonia"],
    cover: "photo-1637580980556-085dee659c7e",
    gallery: ["photo-1615657071655-3748ccc3340c"],
    highlights: [
      "Perito Moreno's walkways and boat trip",
      "Laguna de los Tres beneath Fitz Roy",
      "Laguna Torre and the Mirador de los Cóndores",
      "Best season: October to April",
    ],
    days: [
      ["Arrive in El Calafate", "Fly in, settle in, and walk the lakeside Laguna Nimez reserve."],
      ["Perito Moreno Glacier", "A full day at the glacier's walkways, with an optional boat trip or guided ice trek."],
      ["To El Chaltén", "Drive about three hours north to El Chaltén. Easy afternoon hike to the Mirador de los Cóndores."],
      ["Laguna de los Tres", "The big day: a long hike to the lagoon at the foot of Fitz Roy. Start early and check the weather."],
      ["Laguna Torre", "A slightly gentler hike to Laguna Torre and its glacier views."],
      ["Back to El Calafate", "Return for your flight, with a stop at a roadside estancia if time allows."],
    ],
    included: [
      "A realistic hiking plan by fitness level",
      "What to pack for Patagonian weather",
      "Bus and transfer options between towns",
      "Glacier tour comparisons",
    ],
  }),

  // -------------------------------------------------------------------- PERU
  starterGuide({
    title: "Cusco, the Sacred Valley & Machu Picchu",
    slug: "cusco-sacred-valley-machu-picchu-6-days",
    country: "Peru",
    description:
      "Six days in the Inca heartland, ordered to help with altitude: start lower in the Sacred Valley, take the train to Machu Picchu, then finish in Cusco.",
    price: 24,
    duration: 6,
    destinations: ["Cusco", "Sacred Valley", "Ollantaytambo", "Machu Picchu"],
    cover: "photo-1543385426-191664295b58",
    gallery: ["photo-1587595431973-160d0d94add1", "photo-1725153264822-ab95a6e81428"],
    highlights: [
      "Pisac market and ruins",
      "Moray terraces and the Maras salt pans",
      "Machu Picchu with timed entry and a guide",
      "Cusco's San Blas and San Pedro market",
    ],
    days: [
      ["Down to the Sacred Valley", "Land in Cusco and head straight down to the valley (lower than Cusco) to adjust. Take it easy."],
      ["Pisac", "Visit Pisac's market and the terraced ruins above the town."],
      ["Moray, Maras and Ollantaytambo", "See the circular terraces of Moray and the Maras salt pans, then explore Ollantaytambo's fortress."],
      ["Train to Machu Picchu", "Take the scenic train to Aguas Calientes. Early night."],
      ["Machu Picchu", "An early guided visit to the citadel on your booked circuit, then the train back toward Cusco."],
      ["Cusco", "Plaza de Armas, Qorikancha, San Pedro market and the San Blas neighbourhood. Sacsayhuamán if you have energy."],
    ],
    included: [
      "Altitude-friendly route order",
      "How Machu Picchu tickets and circuits work",
      "Train classes compared",
      "Cusco food and café guide",
    ],
  }),

  // ------------------------------------------------------------------- CHILE
  starterGuide({
    title: "Santiago & Valparaíso: Hills, Wine & Murals",
    slug: "santiago-wine-andes-4-days",
    country: "Chile",
    description:
      "Four days in Chile's capital with the Andes on the horizon: neighbourhoods and markets, a vineyard day in the Maipo Valley, and a colourful day trip to the port city of Valparaíso.",
    price: 19,
    duration: 4,
    destinations: ["Santiago", "Valparaíso", "Maipo Valley"],
    cover: "photo-1689850543263-01a52ccc6943",
    gallery: ["photo-1557974040-3bec341da09b"],
    highlights: [
      "Cerro San Cristóbal and Cerro Santa Lucía views",
      "La Chascona, Pablo Neruda's house",
      "Maipo Valley wineries",
      "Valparaíso's hills and funiculars",
    ],
    days: [
      ["Centro and Lastarria", "Plaza de Armas, the Mercado Central, and a climb up Cerro Santa Lucía, then dinner in Lastarria."],
      ["Bellavista and the hills", "La Chascona, then the funicular up Cerro San Cristóbal for the view. Evening in Bellavista."],
      ["Maipo Valley", "A day at Maipo Valley wineries, within easy reach of the city."],
      ["Valparaíso", "Day trip to Valparaíso: walk the Cerro Alegre and Concepción hills, ride the funiculars and see the murals."],
    ],
    included: [
      "Four-day plan with transport for day trips",
      "Winery shortlist",
      "Valparaíso walking route",
      "Neighbourhood guide for where to stay",
    ],
  }),
  starterGuide({
    title: "Atacama Desert: Salt Flats, Geysers & Stars",
    slug: "atacama-desert-4-days",
    country: "Chile",
    description:
      "Four days from San Pedro de Atacama in one of the driest places on Earth: moonlike valleys, floating salt lagoons, dawn geysers and some of the clearest night skies anywhere.",
    price: 19,
    duration: 4,
    destinations: ["San Pedro de Atacama", "Valle de la Luna", "El Tatio"],
    cover: "photo-1494783435443-c15feee0a80a",
    gallery: ["photo-1648498015611-4e51d7d3f74a"],
    highlights: [
      "Sunset at Valle de la Luna",
      "Floating in Laguna Cejar",
      "El Tatio geysers at dawn",
      "A stargazing tour",
    ],
    days: [
      ["San Pedro and Valle de la Luna", "Settle in to adjust to the altitude, then see Valle de la Luna at sunset."],
      ["Laguna Cejar", "Float in the salty Laguna Cejar and watch sunset at the Tebinquiche lagoons. Stargazing at night."],
      ["El Tatio", "A pre-dawn start for the El Tatio geysers (very cold and high — dress warmly)."],
      ["Altiplanic lagoons", "A day trip to the high-altitude lagoons and Piedras Rojas."],
    ],
    included: [
      "Altitude tips and a sensible order",
      "How to pick tour operators",
      "Packing list for hot days and freezing nights",
      "Best months for stargazing",
    ],
  }),
  starterGuide({
    title: "Torres del Paine: The W Trek Highlights",
    slug: "torres-del-paine-5-days",
    country: "Chile",
    description:
      "Five days in Chilean Patagonia's most famous national park, based in Puerto Natales or inside the park, hiking the classic viewpoints of the W.",
    price: 22,
    duration: 5,
    destinations: ["Puerto Natales", "Torres del Paine"],
    cover: "photo-1558517286-6b7b81953cb5",
    highlights: [
      "Base Las Torres at sunrise or midday",
      "Grey Glacier",
      "Mirador Cuernos and Salto Grande",
      "Best season: October to April",
    ],
    days: [
      ["Puerto Natales", "Arrive, stock up and prepare for the park."],
      ["Into the park", "Transfer to Torres del Paine. Easy walk to Salto Grande and Mirador Cuernos."],
      ["Base Las Torres", "The famous hike to the base of the towers — long and steep at the end."],
      ["Grey Glacier", "Boat or hike to see Grey Glacier."],
      ["Back to Natales", "Return to Puerto Natales for your onward flight."],
    ],
    included: [
      "Day-hike vs. trek options",
      "Park booking and entry tips",
      "Patagonian weather and packing",
      "Transfers from Puerto Natales",
    ],
  }),

  // ---------------------------------------------------------------- COLOMBIA
  starterGuide({
    title: "Cartagena: Walled City & Caribbean Islands",
    slug: "cartagena-4-days",
    country: "Colombia",
    description:
      "Four days in Colombia's Caribbean jewel: balconied streets in the walled city, street art in Getsemaní, a fortress, and a boat day to the Rosario Islands.",
    price: 19,
    duration: 4,
    destinations: ["Cartagena", "Getsemaní", "Rosario Islands"],
    cover: "photo-1714686495394-73e2bb1bbd39",
    gallery: ["photo-1536308037887-165852797016"],
    highlights: [
      "Sunset on the city walls",
      "Getsemaní's murals and Plaza de la Trinidad",
      "Castillo San Felipe de Barajas",
      "A boat day to the Rosario Islands",
    ],
    days: [
      ["The walled city", "Wander the old town's plazas and balconied streets, then watch sunset from the city walls."],
      ["Getsemaní and the fortress", "Street art and cafés in Getsemaní, Castillo San Felipe in the afternoon, then Plaza de la Trinidad at night."],
      ["Rosario Islands", "A boat day to the islands for swimming and snorkelling."],
      ["Slow final day", "Markets, a cooking class or the beach, plus one last ceviche."],
    ],
    included: [
      "Where to stay: walled city vs. Getsemaní",
      "Island boat-day options compared",
      "Food and rooftop shortlist",
      "Heat-friendly daily timings",
    ],
  }),

  // --------------------------------------------------------------- AUSTRALIA
  starterGuide({
    title: "Sydney: Harbour, Coast & Café Days",
    slug: "sydney-harbour-coast-4-days",
    country: "Australia",
    description:
      "Four Sydney days that pair the icons with coastal walks, ferries and the café rhythm that makes the city feel liveable.",
    price: 19,
    duration: 4,
    destinations: ["Sydney", "Bondi", "Manly", "Newtown"],
    cover: "photo-1624138784614-87fd1b6528f8",
    gallery: ["photo-1546268060-2592ff93ee24"],
    highlights: [
      "The Opera House, Botanic Garden and Mrs Macquarie's Chair",
      "The Bondi to Coogee coastal walk",
      "The ferry to Manly",
      "Newtown and Surry Hills food",
    ],
    days: [
      ["The harbour on foot", "The Rocks, Circular Quay and the Opera House, then the Royal Botanic Garden to Mrs Macquarie's Chair for the classic view."],
      ["Bondi to Coogee", "Walk the Bondi to Coogee coastal path, with swims along the way at patrolled beaches."],
      ["Manly by ferry", "Ferry from Circular Quay to Manly, then walk to Shelly Beach or tackle part of the Spit to Manly walk."],
      ["Inner Sydney", "Newtown's cafés and shops, then Surry Hills or Paddington for dinner."],
    ],
    included: [
      "Four days with public-transport tips",
      "Coastal walk guide with swim stops",
      "Café and restaurant shortlist",
      "Where to stay by budget",
    ],
  }),
  starterGuide({
    title: "Melbourne: Laneways, Food & Creative Neighbourhoods",
    slug: "melbourne-laneways-food-4-days",
    country: "Australia",
    description:
      "A weather-flexible Melbourne plan built around food, laneways, galleries, markets and the tram-friendly inner neighbourhoods.",
    price: 19,
    duration: 4,
    destinations: ["Melbourne", "Fitzroy", "Carlton", "St Kilda"],
    cover: "photo-1754633276350-a1cb2fb78e73",
    gallery: ["photo-1785545831898-6d8c5d182ded"],
    highlights: [
      "Hosier Lane and Degraves Street",
      "The NGV and Royal Botanic Gardens",
      "Queen Victoria Market",
      "Fitzroy, Carlton and St Kilda",
    ],
    days: [
      ["CBD lanes", "Degraves Street coffee, Hosier Lane's street art, Flinders Street Station, and the NGV."],
      ["Fitzroy and Carlton", "Brunswick and Gertrude Streets for cafés and shops, then Italian on Lygon Street."],
      ["Market and bayside", "Queen Victoria Market in the morning (check opening days), then St Kilda's pier and beach in the afternoon."],
      ["Gardens and goodbye", "The Royal Botanic Gardens and Southbank before you leave."],
    ],
    included: [
      "Tram-friendly daily groupings",
      "Laneway café and bar map",
      "Wet-weather swaps",
      "Neighbourhood guide",
    ],
  }),
  starterGuide({
    title: "Brisbane to Byron Bay: The Sunny Coast Road Trip",
    slug: "brisbane-gold-coast-byron-road-trip-6-days",
    country: "Australia",
    description:
      "Six days from Brisbane through the Gold Coast and its hinterland to Byron Bay, with short driving days and a two-night Byron finish.",
    price: 24,
    duration: 6,
    destinations: ["Brisbane", "Gold Coast", "Byron Bay"],
    cover: "photo-1690179536948-68cb4d28f1a9",
    gallery: ["photo-1566734904496-9309bb1798ae", "photo-1621841058209-dcb875c9b970"],
    highlights: [
      "South Bank and the Mt Coot-tha lookout",
      "Burleigh Heads and the hinterland rainforest",
      "The Cape Byron lighthouse walk",
      "Bangalow and the Byron hinterland",
    ],
    days: [
      ["Brisbane", "South Bank, the river walk and dinner at Howard Smith Wharves."],
      ["To the Gold Coast", "Mt Coot-tha lookout, then down to Burleigh Heads for a swim and sunset at the headland."],
      ["Hinterland", "Rainforest walks at Springbrook or Tamborine Mountain."],
      ["Into New South Wales", "Drive south into northern NSW and arrive in Byron Bay."],
      ["Byron Bay", "The Cape Byron lighthouse walk at sunrise, beaches, and a hinterland trip to Bangalow."],
      ["Slow morning", "A last swim before returning the car."],
    ],
    included: [
      "Driving times and parking tips",
      "Beach and hinterland options",
      "Food stops along the route",
      "Where to stay in each place",
    ],
  }),
  starterGuide({
    title: "Great Ocean Road: A Slow Four-Day Drive",
    slug: "great-ocean-road-4-days",
    country: "Australia",
    description:
      "Four days on the Great Ocean Road, giving the coast, the Otways rainforest and the Twelve Apostles the time a rushed day trip can't.",
    price: 21,
    duration: 4,
    destinations: ["Great Ocean Road", "Lorne", "Apollo Bay", "Port Campbell"],
    cover: "photo-1519406155028-39dbcdf8400c",
    gallery: ["photo-1596430222039-4a2d7b4cd767"],
    highlights: [
      "Bells Beach and Split Point Lighthouse",
      "Wild koalas at Kennett River",
      "Maits Rest rainforest walk",
      "Twelve Apostles and Loch Ard Gorge",
    ],
    days: [
      ["Melbourne to Lorne", "Torquay and Bells Beach, Split Point Lighthouse, the Memorial Arch, then Lorne and Erskine Falls."],
      ["Lorne to Apollo Bay", "Koalas at Kennett River and a relaxed afternoon in Apollo Bay."],
      ["The Otways to Port Campbell", "Maits Rest rainforest walk, Cape Otway Lightstation, and the Twelve Apostles at sunset."],
      ["Western highlights", "Loch Ard Gorge and London Bridge, then back to Melbourne inland."],
    ],
    included: [
      "Four realistic driving days",
      "Best times for each viewpoint",
      "Where to stay along the road",
      "Wildlife spotting tips",
    ],
  }),
  starterGuide({
    title: "Tasmania Loop: Hobart, Wineglass Bay & Cradle Mountain",
    slug: "tasmania-loop-8-days",
    country: "Australia",
    description:
      "An eight-day Tasmania loop linking Hobart, the east coast, Launceston and Cradle Mountain, with room for weather and wildlife.",
    price: 29,
    duration: 8,
    destinations: ["Hobart", "Freycinet", "Launceston", "Cradle Mountain"],
    cover: "photo-1701389357376-5b72922c5c8a",
    gallery: ["photo-1534853878021-7fb609562749"],
    highlights: [
      "MONA and the Salamanca Market",
      "Wineglass Bay lookout",
      "Cataract Gorge in Launceston",
      "The Dove Lake circuit",
    ],
    days: [
      ["Hobart", "The waterfront and Battery Point, and a dinner in town."],
      ["MONA and kunanyi", "Ferry to MONA, then sunset from kunanyi/Mt Wellington. On Saturdays, add Salamanca Market."],
      ["To the east coast", "Drive to Freycinet with a stop for oysters along the way."],
      ["Wineglass Bay", "Hike to the Wineglass Bay lookout, or down to the beach."],
      ["To Launceston", "Up the coast, then inland to Launceston and Cataract Gorge."],
      ["To Cradle Mountain", "Via the Tamar Valley, arriving before dark (watch for wildlife on the roads)."],
      ["Cradle Mountain", "The Dove Lake circuit and other walks, weather permitting."],
      ["Back to Hobart", "A long drive back through the centre of the island."],
    ],
    included: [
      "Loop route with driving times",
      "Walk options for every fitness level",
      "Food and wine stops",
      "Weather and wildlife driving tips",
    ],
  }),
  starterGuide({
    title: "Tropical North Queensland: Cairns, Reef & Daintree",
    slug: "cairns-daintree-5-days",
    country: "Australia",
    description:
      "Five tropical days with the Great Barrier Reef, the Daintree Rainforest and Port Douglas, without stacking long trips back to back.",
    price: 22,
    duration: 5,
    destinations: ["Cairns", "Port Douglas", "Daintree Rainforest"],
    cover: "photo-1587139223877-04cb899fa3e8",
    gallery: ["photo-1643633612522-23a0133e838a"],
    highlights: [
      "An outer reef snorkelling day",
      "Kuranda Scenic Railway and Skyrail",
      "Mossman Gorge",
      "The Daintree River and Cape Tribulation",
    ],
    days: [
      ["Cairns", "The Esplanade Lagoon and a relaxed dinner."],
      ["The reef", "A full day on the outer reef. Wear a stinger suit in season."],
      ["Kuranda", "Up on the Scenic Railway, back down on the Skyrail."],
      ["Port Douglas", "Four Mile Beach and Mossman Gorge."],
      ["Daintree", "The Daintree River ferry, a croc cruise and Cape Tribulation."],
    ],
    included: [
      "Reef operator comparison",
      "Stinger season and swimming safety",
      "Where to base yourself",
      "Rainforest day plan",
    ],
  }),
];
