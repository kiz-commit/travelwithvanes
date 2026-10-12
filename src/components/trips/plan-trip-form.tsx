"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitTripEnquiry } from "@/lib/firestore";
import { cn } from "@/lib/utils";

type TripOption = { slug: string; title: string; country: string };

const PLACES = [
  "Rio de Janeiro",
  "Paraty & Ilha Grande",
  "Búzios & Arraial do Cabo",
  "Iguaçu Falls",
  "Salvador & Bahia",
  "Lençóis Maranhenses",
  "The Amazon",
  "Florianópolis",
  "Argentina",
  "Peru",
  "Chile",
  "Not sure yet",
];

const INTERESTS = [
  "Beaches",
  "Food & drink",
  "Nature & hiking",
  "Culture & history",
  "Music & nightlife",
  "Carnival or New Year",
  "Slow & relaxing",
  "Family-friendly",
];

const TRAVELLERS = ["Solo", "Couple", "Family with kids", "Group of friends", "Other"];
const LENGTHS = ["Under a week", "7–10 nights", "11–14 nights", "15+ nights", "Not sure yet"];
const BUDGETS = [
  "Under AU$3,000 pp",
  "AU$3,000–5,000 pp",
  "AU$5,000–8,000 pp",
  "AU$8,000+ pp",
  "Not sure yet",
];

function upcomingMonths(count = 18): string[] {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-AU", { month: "long", year: "numeric" });
  return Array.from({ length: count }, (_, i) =>
    formatter.format(new Date(now.getFullYear(), now.getMonth() + 1 + i, 1))
  );
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[14px] transition-colors",
        active
          ? "border-mata bg-mata text-white"
          : "border-ink/15 bg-white text-ink hover:border-ink/40"
      )}
    >
      {active ? <Check className="size-3.5" aria-hidden /> : null}
      {children}
    </button>
  );
}

const fieldClass =
  "h-12 w-full rounded-lg border border-ink/20 bg-white px-3.5 text-[15px] text-ink outline-none transition placeholder:text-dust/70 focus:border-mar focus:ring-3 focus:ring-mar/15";

function Fieldset({ step, title, hint, children }: { step: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-ink/10 py-8 first:border-t-0 first:pt-0">
      <legend className="sr-only">{title}</legend>
      <div className="mb-5 flex items-baseline gap-3">
        <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full bg-mata text-[13px] font-bold text-white">{step}</span>
        <div>
          <p className="t-h3 font-heading">{title}</p>
          {hint ? <p className="mt-1 text-[14px] text-dust">{hint}</p> : null}
        </div>
      </div>
      <div className="grid gap-5">{children}</div>
    </fieldset>
  );
}

export function PlanTripForm({
  trips,
  initialTripSlug,
  email,
}: {
  trips: TripOption[];
  initialTripSlug?: string;
  email: string;
}) {
  const months = useMemo(() => upcomingMonths(), []);
  const initialTrip = trips.find((trip) => trip.slug === initialTripSlug);

  const [tripSlug, setTripSlug] = useState(initialTrip?.slug ?? "");
  const [places, setPlaces] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [travelMonth, setTravelMonth] = useState("");
  const [nights, setNights] = useState("");
  const [travellers, setTravellers] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function toggle(list: string[], value: string, setter: (next: string[]) => void) {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (website) {
      setStatus("sent");
      return;
    }
    setStatus("sending");
    const trip = trips.find((item) => item.slug === tripSlug);
    try {
      await submitTripEnquiry({
        name: name.trim().slice(0, 120),
        email: contactEmail.trim().toLowerCase(),
        phone: phone.trim().slice(0, 40),
        tripSlug: trip?.slug ?? "",
        tripTitle: trip?.title ?? "Custom trip",
        destinations: places,
        travelMonth,
        nights,
        travellers,
        budget,
        interests,
        message: message.trim().slice(0, 4000),
        marketingOptIn,
      });
      setStatus("sent");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl bg-mist p-8 text-center sm:p-12">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-mata text-white">
          <Check className="size-6" aria-hidden />
        </span>
        <h2 className="t-h2 mt-5">Obrigada, {name.split(" ")[0] || "friend"}!</h2>
        <p className="mx-auto mt-3 max-w-md text-[16px] leading-7 text-dust">
          Your trip details are with Vanessa. She reads every request herself and will reply by email within two business days.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button variant="creator" size="cta" render={<Link href="/itineraries" />}>Browse guide previews</Button>
          <Button variant="creator-outline" size="cta" render={<Link href="/trips" />}>Back to trips</Button>
        </div>
      </div>
    );
  }

  const mailtoBody = encodeURIComponent(
    `Hi Vanessa,\n\nTrip: ${trips.find((t) => t.slug === tripSlug)?.title ?? "Custom"}\nPlaces: ${places.join(", ")}\nWhen: ${travelMonth}\nLength: ${nights}\nWho: ${travellers}\nBudget: ${budget}\nInterests: ${interests.join(", ")}\n\n${message}\n\n${name}\n${phone}`
  );

  const selectedTrip = trips.find((trip) => trip.slug === tripSlug);

  return (
    <form onSubmit={handleSubmit}>
      {selectedTrip ? (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-mata/30 bg-mist px-4 py-3">
          <p className="text-[15px]">
            <span className="text-dust">Starting from</span>{" "}
            <span className="font-semibold">{selectedTrip.title}</span>
          </p>
          <button type="button" onClick={() => setTripSlug("")} className="text-[14px] font-semibold text-mar underline-offset-4 hover:underline">
            Make it custom instead
          </button>
        </div>
      ) : null}
      <Fieldset step={1} title="The trip" hint="Start from a signature trip, or build something new.">
        <label className="grid gap-2 text-[14px] font-semibold">
          Starting point
          <select className={fieldClass} value={tripSlug} onChange={(e) => setTripSlug(e.target.value)}>
            <option value="">Something custom</option>
            {trips.map((trip) => (
              <option key={trip.slug} value={trip.slug}>{trip.title} · {trip.country}</option>
            ))}
          </select>
        </label>
        <div>
          <p className="mb-3 text-[14px] font-semibold">Places on your mind</p>
          <div className="flex flex-wrap gap-2">
            {PLACES.map((place) => (
              <Chip key={place} active={places.includes(place)} onClick={() => toggle(places, place, setPlaces)}>{place}</Chip>
            ))}
          </div>
        </div>
      </Fieldset>

      <Fieldset step={2} title="When and who" hint="Rough answers are perfect.">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-[14px] font-semibold">
            Travel month
            <select className={fieldClass} value={travelMonth} onChange={(e) => setTravelMonth(e.target.value)}>
              <option value="">Flexible / not sure</option>
              {months.map((month) => <option key={month}>{month}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-[14px] font-semibold">
            Trip length
            <select className={fieldClass} value={nights} onChange={(e) => setNights(e.target.value)}>
              <option value="">Choose…</option>
              {LENGTHS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-[14px] font-semibold">
            Who&apos;s travelling
            <select className={fieldClass} value={travellers} onChange={(e) => setTravellers(e.target.value)}>
              <option value="">Choose…</option>
              {TRAVELLERS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-[14px] font-semibold">
            Budget on the ground
            <select className={fieldClass} value={budget} onChange={(e) => setBudget(e.target.value)}>
              <option value="">Choose…</option>
              {BUDGETS.map((item) => <option key={item}>{item}</option>)}
            </select>
            <span className="text-[13px] font-normal text-dust">Per person, excluding international flights.</span>
          </label>
        </div>
      </Fieldset>

      <Fieldset step={3} title="Your kind of trip" hint="Pick as many as you like.">
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <Chip key={interest} active={interests.includes(interest)} onClick={() => toggle(interests, interest, setInterests)}>{interest}</Chip>
          ))}
        </div>
        <label className="grid gap-2 text-[14px] font-semibold">
          Anything else Vanessa should know?
          <textarea
            className={cn(fieldClass, "h-auto min-h-36 py-3 leading-7")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={4000}
            placeholder="A birthday, a honeymoon, a bad knee, a must-eat dish, a hotel you loved…"
          />
        </label>
      </Fieldset>

      <Fieldset step={4} title="Your details" hint="So Vanessa can reply. Name and email are required.">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-[14px] font-semibold">
            Name <span className="sr-only">(required)</span>
            <input required className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={120} />
          </label>
          <label className="grid gap-2 text-[14px] font-semibold">
            Email
            <input required type="email" className={fieldClass} value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} autoComplete="email" />
          </label>
          <label className="grid gap-2 text-[14px] font-semibold sm:col-span-2">
            WhatsApp or phone <span className="text-[13px] font-normal text-dust">(optional)</span>
            <input type="tel" className={fieldClass} value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" maxLength={40} />
          </label>
        </div>
        <label className="hidden" aria-hidden>
          Website
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
        <label className="flex items-start gap-3 text-[14px] leading-6 text-dust">
          <input type="checkbox" checked={marketingOptIn} onChange={(e) => setMarketingOptIn(e.target.checked)} className="mt-1 size-4 accent-[#0e4d3a]" />
          Send me the occasional email with new trips and Brazil travel notes. Unsubscribe any time.
        </label>
      </Fieldset>

      <div className="flex flex-col gap-4 border-t border-ink/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-[13px] leading-5 text-dust">
          No payment, no obligation. Your details are only used to plan your trip.
        </p>
        <Button type="submit" variant="primary" size="cta" disabled={status === "sending"} className="sm:min-w-52">
          {status === "sending" ? <Loader2 className="size-4 animate-spin" /> : null}
          {status === "sending" ? "Sending..." : "Send my trip details"}
        </Button>
      </div>
      {status === "error" ? (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-[14px] text-red-800">
          Your details didn&apos;t send because the connection dropped.{" "}
          <a className="font-semibold underline" href={`mailto:${email}?subject=${encodeURIComponent("Trip enquiry")}&body=${mailtoBody}`}>
            Email your answers to Vanessa instead
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}
