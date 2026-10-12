import { cn } from "@/lib/utils";
import type { TripMotif, TripPackage } from "@/lib/trip-packages";
import { SafeImage } from "@/components/media/safe-image";

const TONES: Record<TripPackage["tone"], { bg: string; ink: string; line: string }> = {
  forest: { bg: "linear-gradient(160deg,#0e4d3a 0%,#0b2a20 100%)", ink: "#ffffff", line: "#f5c33b" },
  olive: { bg: "linear-gradient(160deg,#4f6b62 0%,#0e4d3a 100%)", ink: "#ffffff", line: "#eef3f0" },
  ocean: { bg: "linear-gradient(165deg,#0a6584 0%,#073f53 100%)", ink: "#ffffff", line: "#eef3f0" },
  espresso: { bg: "linear-gradient(160deg,#0b2a20 0%,#12241d 100%)", ink: "#ffffff", line: "#f5c33b" },
  clay: { bg: "linear-gradient(160deg,#0a6584 0%,#0e4d3a 100%)", ink: "#ffffff", line: "#f5c33b" },
  sun: { bg: "linear-gradient(160deg,#f5c33b 0%,#e0a91e 100%)", ink: "#12241d", line: "#0e4d3a" },
};

/** Copacabana-style promenade wave — the most Rio pattern there is. */
function Waves({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      {Array.from({ length: 9 }).map((_, row) => (
        <path
          key={row}
          d={`M-20 ${40 + row * 32} q25 -22 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0`}
          fill="none"
          stroke={color}
          strokeOpacity={0.22}
          strokeWidth={9}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function Peaks({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <circle cx="300" cy="90" r="34" fill={color} fillOpacity={0.35} />
      <path d="M0 300 L0 210 C40 200 60 150 95 150 C125 150 130 205 165 205 C195 205 205 120 245 95 C275 78 290 170 320 185 C350 200 370 180 400 175 L400 300Z" fill={color} fillOpacity={0.18} />
      <path d="M0 300 L0 245 C50 240 80 225 120 230 C170 236 200 250 250 246 C300 242 340 228 400 232 L400 300Z" fill={color} fillOpacity={0.28} />
    </svg>
  );
}

function Sun({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <circle cx="200" cy="205" r="78" fill={color} fillOpacity={0.3} />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x="0" y={212 + i * 15} width="400" height={4 + i} fill={color} fillOpacity={0.12 + i * 0.05} />
      ))}
    </svg>
  );
}

function Falls({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <path d="M0 120 C80 100 140 140 220 118 C300 96 340 125 400 110" fill="none" stroke={color} strokeOpacity={0.35} strokeWidth={3} />
      {Array.from({ length: 22 }).map((_, i) => (
        <line key={i} x1={40 + i * 15} y1={120 + (i % 3) * 4} x2={40 + i * 15} y2={300} stroke={color} strokeOpacity={0.08 + (i % 4) * 0.05} strokeWidth={i % 2 ? 2 : 4} />
      ))}
    </svg>
  );
}

function Palms({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <g fill="none" stroke={color} strokeOpacity={0.28} strokeWidth={6} strokeLinecap="round">
        <path d="M300 300 C300 230 290 170 270 120" />
        <path d="M270 120 C240 100 200 100 170 120" />
        <path d="M270 120 C260 85 235 65 205 60" />
        <path d="M270 120 C285 85 310 70 345 70" />
        <path d="M270 120 C300 110 335 120 360 145" />
      </g>
      {Array.from({ length: 26 }).map((_, i) => (
        <circle key={i} cx={(i * 67) % 400} cy={(i * 43) % 300} r={(i % 3) + 2} fill={color} fillOpacity={0.35} />
      ))}
    </svg>
  );
}

function Compass({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <g transform="translate(290 120)" fill="none" stroke={color} strokeOpacity={0.35}>
        <circle r="95" strokeWidth={1.5} />
        <circle r="70" strokeWidth={1} strokeDasharray="3 6" />
        <path d="M0 -110 L12 0 L0 110 L-12 0Z" fill={color} fillOpacity={0.25} strokeWidth={0} />
        <path d="M-110 0 L0 9 L110 0 L0 -9Z" fill={color} fillOpacity={0.15} strokeWidth={0} />
      </g>
    </svg>
  );
}

const MOTIFS: Record<TripMotif, (props: { color: string }) => React.ReactElement> = {
  waves: Waves,
  peaks: Peaks,
  sun: Sun,
  falls: Falls,
  palms: Palms,
  compass: Compass,
};

export function tripToneInk(trip: TripPackage) {
  return TONES[trip.tone].ink;
}

export function TripCover({
  trip,
  className,
  children,
  priority = false,
}: {
  trip: TripPackage;
  className?: string;
  children?: React.ReactNode;
  priority?: boolean;
}) {
  const tone = TONES[trip.tone];
  const Motif = MOTIFS[trip.motif];

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ background: tone.bg, color: trip.image ? "#fbfaf6" : tone.ink }}
    >
      {trip.image ? (
        <>
          <SafeImage
            src={trip.image}
            alt=""
            loading={priority ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {children ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/20 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-espresso/40 to-transparent" />
            </>
          ) : null}
        </>
      ) : (
        <Motif color={tone.line} />
      )}
      {children ? <div className="relative h-full">{children}</div> : null}
    </div>
  );
}
