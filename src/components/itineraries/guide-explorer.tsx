"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  List,
  LocateFixed,
  Map as MapIcon,
  MapPin,
  Minus,
  Plus,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { plainTextFromHtml } from "@/lib/rich-text";
import { DESTINATIONS } from "@/lib/destinations";
import { SafeImage } from "@/components/media/safe-image";
import type { Itinerary } from "@/types";
import { formatGuidePrice } from "@/lib/pricing";

/** A country name (from DESTINATIONS) or "Elsewhere". */
type GuideRegion = string;
type ViewMode = "map" | "list";

type KnownLocation = {
  aliases: string[];
  label: string;
  latitude: number;
  longitude: number;
  region: GuideRegion;
};

type GuidePoint = {
  itinerary: Itinerary;
  label: string;
  region: GuideRegion;
  x: number;
  y: number;
};

const KNOWN_LOCATIONS: KnownLocation[] = [
  { aliases: ["el calafate", "perito moreno"], label: "El Calafate", latitude: -50.34, longitude: -72.27, region: "Argentina" },
  { aliases: ["el chalten", "fitz roy"], label: "El Chaltén", latitude: -49.33, longitude: -72.89, region: "Argentina" },
  { aliases: ["buenos aires", "san telmo", "recoleta"], label: "Buenos Aires", latitude: -34.6037, longitude: -58.3816, region: "Argentina" },
  { aliases: ["machu picchu", "sacred valley", "cusco", "ollantaytambo"], label: "Cusco & Machu Picchu", latitude: -13.53, longitude: -71.97, region: "Peru" },
  { aliases: ["torres del paine", "puerto natales"], label: "Torres del Paine", latitude: -50.94, longitude: -73.4, region: "Chile" },
  { aliases: ["atacama", "valle de la luna", "el tatio"], label: "Atacama", latitude: -22.91, longitude: -68.2, region: "Chile" },
  { aliases: ["valparaiso", "valparaíso", "maipo"], label: "Santiago & Valparaíso", latitude: -33.3, longitude: -71.1, region: "Chile" },
  { aliases: ["cartagena", "getsemani", "rosario islands"], label: "Cartagena", latitude: 10.391, longitude: -75.4794, region: "Colombia" },
  { aliases: ["lencois maranhenses", "barreirinhas", "atins"], label: "Lençóis Maranhenses", latitude: -2.75, longitude: -42.82, region: "Brazil" },
  { aliases: ["ilha grande"], label: "Ilha Grande", latitude: -23.14, longitude: -44.23, region: "Brazil" },
  { aliases: ["costa-verde-rio-paraty-6-days", "costa verde"], label: "Costa Verde", latitude: -23.15, longitude: -44.45, region: "Brazil" },
  { aliases: ["regiao-dos-lagos-road-trip-5-days", "regiao dos lagos", "região dos lagos"], label: "Região dos Lagos", latitude: -22.75, longitude: -42.05, region: "Brazil" },
  { aliases: ["serra-fluminense-petropolis-teresopolis-4-days", "serra fluminense"], label: "Serra Fluminense", latitude: -22.42, longitude: -43.0, region: "Brazil" },
  { aliases: ["brisbane-gold-coast-byron-road-trip-6-days"], label: "Brisbane to Byron", latitude: -28.02, longitude: 153.43, region: "Australia" },
  { aliases: ["tasmania-loop-8-days"], label: "Tasmania Loop", latitude: -42.0, longitude: 146.5, region: "Australia" },
  { aliases: ["cairns-daintree-5-days", "daintree"], label: "Tropical North Queensland", latitude: -16.2, longitude: 145.45, region: "Australia" },
  { aliases: ["bondi"], label: "Bondi", latitude: -33.8915, longitude: 151.2767, region: "Australia" },
  { aliases: ["sydney"], label: "Sydney", latitude: -33.8688, longitude: 151.2093, region: "Australia" },
  { aliases: ["melbourne"], label: "Melbourne", latitude: -37.8136, longitude: 144.9631, region: "Australia" },
  { aliases: ["brisbane"], label: "Brisbane", latitude: -27.4698, longitude: 153.0251, region: "Australia" },
  { aliases: ["gold coast"], label: "Gold Coast", latitude: -28.0167, longitude: 153.4, region: "Australia" },
  { aliases: ["sunshine coast"], label: "Sunshine Coast", latitude: -26.65, longitude: 153.0667, region: "Australia" },
  { aliases: ["byron bay"], label: "Byron Bay", latitude: -28.6474, longitude: 153.602, region: "Australia" },
  { aliases: ["great ocean road"], label: "Great Ocean Road", latitude: -38.6806, longitude: 143.3912, region: "Australia" },
  { aliases: ["tasmania", "hobart"], label: "Tasmania", latitude: -42.8821, longitude: 147.3272, region: "Australia" },
  { aliases: ["cairns"], label: "Cairns", latitude: -16.9186, longitude: 145.7781, region: "Australia" },
  { aliases: ["whitsunday", "whitsundays"], label: "Whitsundays", latitude: -20.282, longitude: 148.957, region: "Australia" },
  { aliases: ["perth"], label: "Perth", latitude: -31.9523, longitude: 115.8613, region: "Australia" },
  { aliases: ["adelaide"], label: "Adelaide", latitude: -34.9285, longitude: 138.6007, region: "Australia" },
  { aliases: ["uluru", "ayers rock"], label: "Uluru", latitude: -25.3444, longitude: 131.0369, region: "Australia" },
  { aliases: ["rio de janeiro", "rio"], label: "Rio de Janeiro", latitude: -22.9068, longitude: -43.1729, region: "Brazil" },
  { aliases: ["sao paulo", "são paulo"], label: "São Paulo", latitude: -23.5505, longitude: -46.6333, region: "Brazil" },
  { aliases: ["florianopolis", "florianópolis"], label: "Florianópolis", latitude: -27.5949, longitude: -48.5482, region: "Brazil" },
  { aliases: ["salvador", "bahia"], label: "Salvador", latitude: -12.9777, longitude: -38.5016, region: "Brazil" },
  { aliases: ["jericoacoara", "jeri"], label: "Jericoacoara", latitude: -2.7956, longitude: -40.5142, region: "Brazil" },
  { aliases: ["recife"], label: "Recife", latitude: -8.0476, longitude: -34.877, region: "Brazil" },
  { aliases: ["fortaleza"], label: "Fortaleza", latitude: -3.7319, longitude: -38.5267, region: "Brazil" },
  { aliases: ["paraty"], label: "Paraty", latitude: -23.2196, longitude: -44.7171, region: "Brazil" },
  { aliases: ["buzios", "búzios"], label: "Búzios", latitude: -22.7469, longitude: -41.8817, region: "Brazil" },
  { aliases: ["arraial do cabo"], label: "Arraial do Cabo", latitude: -22.9661, longitude: -42.0278, region: "Brazil" },
  { aliases: ["cabo frio"], label: "Cabo Frio", latitude: -22.8894, longitude: -42.0286, region: "Brazil" },
  { aliases: ["petropolis", "petrópolis"], label: "Petrópolis", latitude: -22.505, longitude: -43.178, region: "Brazil" },
  { aliases: ["teresopolis", "teresópolis"], label: "Teresópolis", latitude: -22.4167, longitude: -42.9782, region: "Brazil" },
  { aliases: ["foz do iguacu", "foz do iguaçu", "iguazu", "iguacu", "iguaçu"], label: "Iguaçu", latitude: -25.5163, longitude: -54.5854, region: "Brazil" },
  { aliases: ["manaus", "amazon", "amazonia", "amazônia"], label: "Amazonas", latitude: -3.119, longitude: -60.0217, region: "Brazil" },
  { aliases: ["brasilia", "brasília"], label: "Brasília", latitude: -15.7975, longitude: -47.8919, region: "Brazil" },
  { aliases: ["bali"], label: "Bali", latitude: -8.4095, longitude: 115.1889, region: "Elsewhere" },
  { aliases: ["santiago"], label: "Santiago", latitude: -33.4489, longitude: -70.6693, region: "Chile" },
  { aliases: ["chile"], label: "Chile", latitude: -33.4489, longitude: -70.6693, region: "Chile" },
  { aliases: ["argentina", "patagonia"], label: "Argentina", latitude: -34.6, longitude: -58.4, region: "Argentina" },
  { aliases: ["peru"], label: "Peru", latitude: -12.05, longitude: -77.04, region: "Peru" },
  { aliases: ["colombia"], label: "Colombia", latitude: 4.71, longitude: -74.07, region: "Colombia" },
  { aliases: ["lisbon", "lisboa", "portugal"], label: "Portugal", latitude: 38.7223, longitude: -9.1393, region: "Elsewhere" },
  { aliases: ["london", "england", "united kingdom", "uk"], label: "London", latitude: 51.5072, longitude: -0.1276, region: "Elsewhere" },
  { aliases: ["paris", "france"], label: "Paris", latitude: 48.8566, longitude: 2.3522, region: "Elsewhere" },
  { aliases: ["tokyo", "japan"], label: "Japan", latitude: 35.6762, longitude: 139.6503, region: "Elsewhere" },
  { aliases: ["cape town", "south africa"], label: "Cape Town", latitude: -33.9249, longitude: 18.4241, region: "Elsewhere" },
  { aliases: ["new york", "nyc"], label: "New York", latitude: 40.7128, longitude: -74.006, region: "Elsewhere" },
  { aliases: ["mexico"], label: "Mexico", latitude: 19.4326, longitude: -99.1332, region: "Elsewhere" },
  { aliases: ["thailand", "bangkok"], label: "Thailand", latitude: 13.7563, longitude: 100.5018, region: "Elsewhere" },
  { aliases: ["australia"], label: "Australia", latitude: -25.2744, longitude: 133.7751, region: "Australia" },
  { aliases: ["brazil", "brasil"], label: "Brazil", latitude: -14.235, longitude: -51.9253, region: "Brazil" },
];

const COUNTRY_ORDER = DESTINATIONS.map((destination) => destination.name);

const LAND_PATHS = [
  "M44 112 L91 70 158 55 224 73 278 66 336 101 317 136 275 151 252 190 217 210 191 249 151 236 137 198 96 181 68 151Z",
  "M306 252 L351 239 399 266 431 314 418 361 394 400 380 462 346 485 323 436 319 385 293 343 278 291Z",
  "M416 80 L443 48 486 42 503 68 477 94 445 101Z",
  "M450 135 L500 105 558 112 590 137 625 135 658 159 627 183 581 178 558 205 518 200 489 173 456 167Z",
  "M480 205 L535 188 585 213 611 263 600 324 562 381 518 369 495 326 463 289 451 244Z",
  "M575 114 L635 78 708 69 771 85 843 80 922 109 957 144 919 177 873 177 842 205 790 202 749 241 700 229 669 196 616 185 592 154Z",
  "M754 218 L793 204 827 230 813 261 775 272 747 248Z",
  "M805 350 L847 327 905 339 948 377 929 420 875 436 821 415 789 380Z",
  "M943 427 L967 421 978 441 958 459 939 446Z",
  "M552 390 L571 378 584 399 568 427 548 416Z",
];

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function project(latitude: number, longitude: number) {
  return {
    x: ((longitude + 180) / 360) * 1000,
    y: ((90 - latitude) / 180) * 500,
  };
}

function guidePoint(itinerary: Itinerary): GuidePoint | null {
  const haystack = normalize(`${itinerary.destinations.join(" ")} ${itinerary.title} ${itinerary.slug}`);
  const location = KNOWN_LOCATIONS.find((candidate) =>
    candidate.aliases.some((alias) => haystack.includes(normalize(alias)))
  );
  if (!location) return null;
  return {
    itinerary,
    label: location.label,
    region: itinerary.country || location.region,
    ...project(location.latitude, location.longitude),
  };
}

/** Zoom and pan so every pin is in view (e.g. zoomed into South America). */
function fitView(points: GuidePoint[]): { zoom: number; pan: { x: number; y: number } } {
  if (points.length === 0) return { zoom: 1, pan: { x: 0, y: 0 } };
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const zoom = Math.min(2.6, Math.max(1, Math.min(1000 / (maxX - minX + 160), 500 / (maxY - minY + 120))));
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return { zoom: Number(zoom.toFixed(2)), pan: { x: -zoom * (cx - 500), y: -zoom * (cy - 250) } };
}

function guideRegion(itinerary: Itinerary): GuideRegion {
  return itinerary.country || guidePoint(itinerary)?.region || "Elsewhere";
}

function GuideCard({ itinerary }: { itinerary: Itinerary; index: number }) {
  return (
    <Link href={`/itineraries/${itinerary.slug}`} className="group flex flex-col rounded-xl">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-mata">
        {itinerary.coverImage ? (
          <SafeImage src={itinerary.coverImage} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[13px] text-dust">
          {guideRegion(itinerary)} <span aria-hidden>/</span> {itinerary.duration} {itinerary.duration === 1 ? "day" : "days"}
        </p>
        <h3 className="t-h3 mt-1.5 text-ink group-hover:text-mata">{itinerary.title}</h3>
        <p className="mt-2 line-clamp-2 text-[15px] leading-6 text-dust">{plainTextFromHtml(itinerary.description)}</p>
        <p className="mt-auto pt-3 text-[14px] font-semibold text-mar">
          Free preview<span className="font-normal text-dust"> — full guide {formatGuidePrice(itinerary.price)}</span>
        </p>
      </div>
    </Link>
  );
}

function GuideMap({ guides }: { guides: Itinerary[] }) {
  const points = useMemo(() => guides.map(guidePoint).filter((point): point is GuidePoint => Boolean(point)), [guides]);
  const initialView = useMemo(() => fitView(points), [points]);
  const [selectedId, setSelectedId] = useState<string | null>(points[0]?.itinerary.id ?? null);
  const [zoom, setZoom] = useState(initialView.zoom);
  const [pan, setPan] = useState(initialView.pan);
  const drag = useRef<{ pointerId: number; startX: number; startY: number; panX: number; panY: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const selected = selectedId === null ? null : points.find((point) => point.itinerary.id === selectedId) ?? points[0] ?? null;
  const unmappedCount = guides.length - points.length;

  function changeZoom(amount: number) {
    setZoom((current) => Math.min(2.6, Math.max(1, Number((current + amount).toFixed(2)))));
  }

  function resetMap() {
    setZoom(initialView.zoom);
    setPan(initialView.pan);
  }

  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    event.preventDefault();
    changeZoom(event.deltaY > 0 ? -0.15 : 0.15);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, panX: pan.x, panY: pan.y };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current || drag.current.pointerId !== event.pointerId || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = drag.current.panX + ((event.clientX - drag.current.startX) / rect.width) * 1000;
    const y = drag.current.panY + ((event.clientY - drag.current.startY) / rect.height) * 500;
    const limitX = 500 * zoom;
    const limitY = 250 * zoom;
    setPan({ x: Math.max(-limitX, Math.min(limitX, x)), y: Math.max(-limitY, Math.min(limitY, y)) });
  }

  function stopDragging(event: ReactPointerEvent<HTMLDivElement>) {
    if (drag.current?.pointerId === event.pointerId) drag.current = null;
  }

  function selectFromKeyboard(event: ReactKeyboardEvent<SVGGElement>, id: string) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setSelectedId(id);
  }

  const transform = `translate(${pan.x} ${pan.y}) translate(500 250) scale(${zoom}) translate(-500 -250)`;

  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-[#dce6df] shadow-[0_24px_70px_rgba(37,37,31,0.09)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-paper/80 px-4 py-3 backdrop-blur sm:px-5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-olive">Move around the map</p>
          <p className="mt-1 text-xs text-dust">Drag to explore · use the controls to zoom</p>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-ink/10 bg-paper p-1">
          <button type="button" onClick={() => changeZoom(-0.2)} aria-label="Zoom out" className="grid size-8 place-items-center rounded-full text-ink transition hover:bg-linen disabled:opacity-35" disabled={zoom <= 1}><Minus className="size-3.5" /></button>
          <span className="min-w-10 text-center text-[9px] font-bold tracking-[0.12em] text-dust">{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={() => changeZoom(0.2)} aria-label="Zoom in" className="grid size-8 place-items-center rounded-full text-ink transition hover:bg-linen disabled:opacity-35" disabled={zoom >= 2.6}><Plus className="size-3.5" /></button>
          <button type="button" onClick={resetMap} aria-label="Reset map" className="grid size-8 place-items-center rounded-full text-cobalt transition hover:bg-linen"><LocateFixed className="size-3.5" /></button>
        </div>
      </div>

      <div
        ref={mapRef}
        className="relative h-[26rem] cursor-grab select-none overflow-hidden active:cursor-grabbing sm:h-[34rem]"
        style={{ touchAction: "none" }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      >
        <svg className="h-full w-full" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" aria-label="Illustrated world map with guide locations">
          <defs>
            <pattern id="map-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M50 0H0V50" fill="none" stroke="#31584a" strokeOpacity="0.07" strokeWidth="1" />
            </pattern>
            <filter id="pin-shadow" x="-80%" y="-80%" width="260%" height="260%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#25251f" floodOpacity="0.2" />
            </filter>
          </defs>
          <rect width="1000" height="500" fill="#dce6df" />
          <rect width="1000" height="500" fill="url(#map-grid)" />
          <g transform={transform} className="transition-transform duration-75">
            {LAND_PATHS.map((path, index) => <path key={index} d={path} fill="#f3f0e9" stroke="#31584a" strokeOpacity="0.22" strokeWidth="1.2" />)}
            <path d="M24 250H976 M500 18V482" stroke="#31584a" strokeOpacity="0.08" strokeDasharray="4 8" />
            {points.map((point, index) => {
              const selectedPin = selected?.itinerary.id === point.itinerary.id;
              const offsetX = (index % 3) * 8;
              const offsetY = (index % 2) * -7;
              return (
                <g
                  key={point.itinerary.id}
                  transform={`translate(${point.x + offsetX} ${point.y + offsetY})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${point.itinerary.title}`}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => setSelectedId(point.itinerary.id)}
                  onKeyDown={(event) => selectFromKeyboard(event, point.itinerary.id)}
                  className="cursor-pointer outline-none"
                  filter="url(#pin-shadow)"
                >
                  <circle r={selectedPin ? 17 : 13} fill={selectedPin ? "#d96f4b" : "#31584a"} stroke="#fbfaf6" strokeWidth="3" className="transition-all" />
                  <text x="0" y="3.5" textAnchor="middle" fill="#fbfaf6" fontSize="9" fontWeight="700">{index + 1}</text>
                  {selectedPin ? <circle r="24" fill="none" stroke="#d96f4b" strokeOpacity="0.35" strokeWidth="2" /> : null}
                </g>
              );
            })}
          </g>
        </svg>

        {selected ? (
          <div onPointerDown={(event) => event.stopPropagation()} className="absolute bottom-3 left-3 right-3 overflow-hidden rounded-xl border border-ink/10 bg-paper/95 shadow-[0_18px_45px_rgba(37,37,31,0.16)] backdrop-blur sm:bottom-5 sm:left-5 sm:right-auto sm:w-[23rem]">
            <button type="button" onClick={() => setSelectedId(null)} aria-label="Close guide preview" className="absolute right-2 top-2 z-10 grid size-7 place-items-center rounded-full bg-paper/85 text-dust transition hover:text-ink"><X className="size-3.5" /></button>
            <div className="grid grid-cols-[6.5rem_1fr]">
              <div className="relative min-h-32 bg-cobalt">
                {selected.itinerary.coverImage ? (
                  <SafeImage src={selected.itinerary.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : <div className="absolute inset-0 bg-[linear-gradient(145deg,#31584a,#66705d)]" />}
              </div>
              <div className="min-w-0 p-4 pr-9">
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-clay">{selected.label}</p>
                <h2 className="mt-1.5 line-clamp-2 font-heading text-xl font-medium leading-[1.05] tracking-[-0.035em] text-ink">{selected.itinerary.title}</h2>
                <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-dust">
                  <span>{selected.itinerary.duration} days</span>
                  <Link href={`/itineraries/${selected.itinerary.slug}`} className="inline-flex items-center gap-1 font-bold text-cobalt hover:underline">Open guide <ArrowUpRight className="size-3" /></Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {points.length === 0 ? (
          <div className="absolute inset-0 grid place-items-center bg-[#dce6df]/85 p-8 text-center backdrop-blur-sm">
            <div><MapPin className="mx-auto size-8 text-cobalt/45" /><p className="mt-3 font-heading text-xl text-ink">No mapped guides in this view</p><p className="mt-1 text-sm text-dust">Try another region or switch to the list.</p></div>
          </div>
        ) : null}

        {unmappedCount > 0 ? <div className="absolute right-3 top-3 rounded-full bg-paper/85 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-dust backdrop-blur">+{unmappedCount} in list only</div> : null}
      </div>
    </div>
  );
}

export function GuideExplorer({ itineraries }: { itineraries: Itinerary[] }) {
  const [view, setView] = useState<ViewMode>("list");
  const [region, setRegion] = useState<string>("All");
  const [query, setQuery] = useState("");

  const regions = useMemo(() => {
    const present = Array.from(new Set(itineraries.map(guideRegion)));
    present.sort((a, b) => {
      const ia = COUNTRY_ORDER.indexOf(a);
      const ib = COUNTRY_ORDER.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
    return ["All", ...present];
  }, [itineraries]);
  // Deep-link support: /itineraries?country=Brazil
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("country");
    if (!wanted) return;
    const match = regions.find((item) => item.toLowerCase() === wanted.toLowerCase());
    if (match) queueMicrotask(() => setRegion(match));
  }, [regions]);

  const countFor = (name: string) =>
    name === "All" ? itineraries.length : itineraries.filter((item) => guideRegion(item) === name).length;

  const filtered = useMemo(() => {
    const search = normalize(query.trim());
    return itineraries.filter((itinerary) => {
      const matchesRegion = region === "All" || guideRegion(itinerary) === region;
      const searchable = normalize(`${itinerary.title} ${itinerary.destinations.join(" ")} ${plainTextFromHtml(itinerary.description)}`);
      return matchesRegion && (!search || searchable.includes(search));
    });
  }, [itineraries, query, region]);

  return (
    <section id="guide-explorer" className="scroll-mt-28">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter guides by country" className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:pb-0">
          {regions.map((item) => {
            const active = region === item;
            return (
              <button key={item} type="button" onClick={() => setRegion(item)} aria-pressed={active} className={`shrink-0 rounded-lg border px-3.5 py-2 text-[14px] font-medium transition-colors ${active ? "border-mata bg-mata text-white" : "border-ink/15 bg-white text-ink hover:border-ink/40"}`}>
                {item} <span className={active ? "text-white/70" : "text-dust"}>{countFor(item)}</span>
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <label className="relative min-w-0 flex-1 lg:w-64 lg:flex-none">
            <span className="sr-only">Search guides</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dust" aria-hidden />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a place" className="h-10 w-full rounded-lg border border-ink/20 bg-white pl-9 pr-3 text-[14px] text-ink outline-none placeholder:text-dust/70 focus:border-mar" />
          </label>
          <div className="flex shrink-0 rounded-lg border border-ink/15 p-0.5">
            <button type="button" onClick={() => setView("list")} aria-pressed={view === "list"} className={`flex h-9 items-center gap-1.5 rounded-md px-3 text-[14px] ${view === "list" ? "bg-mist font-semibold text-ink" : "text-dust hover:text-ink"}`}><List className="size-4" aria-hidden />Grid</button>
            <button type="button" onClick={() => setView("map")} aria-pressed={view === "map"} className={`flex h-9 items-center gap-1.5 rounded-md px-3 text-[14px] ${view === "map" ? "bg-mist font-semibold text-ink" : "text-dust hover:text-ink"}`}><MapIcon className="size-4" aria-hidden />Map</button>
          </div>
        </div>
      </div>

      <p className="mb-6 mt-4 text-[14px] text-dust" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "guide" : "guides"}
        {region !== "All" || query ? (
          <button type="button" onClick={() => { setRegion("All"); setQuery(""); }} className="ml-3 font-semibold text-mar hover:underline">Clear filters</button>
        ) : null}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-mist px-6 py-16 text-center">
          <MapPin className="mx-auto size-8 text-mata/50" aria-hidden />
          <h2 className="t-h3 mt-4">No guides match that search</h2>
          <p className="mt-2 text-[15px] text-dust">Try another place, or show every guide.</p>
          <Button variant="creator-outline" size="sm" className="mt-5" onClick={() => { setRegion("All"); setQuery(""); }}>Show every guide</Button>
        </div>
      ) : view === "map" ? (
        <GuideMap key={`${region}-${query}`} guides={filtered} />
      ) : (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((itinerary, index) => <GuideCard key={itinerary.id} itinerary={itinerary} index={index} />)}
        </div>
      )}
    </section>
  );
}
