"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  Check,
  Coins,
  Route,
  Sparkles,
  WalletCards,
} from "lucide-react";

type MoneyFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
};

type TripMode = "monthly" | "custom";
type TripStyle = "budget" | "vanes" | "comfort" | "edited";
type MonthlyCosts = {
  fuel: number;
  food: number;
  campsites: number;
  experiences: number;
  other: number;
};

const currency = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

const TRIP_STYLES: Array<{
  id: Exclude<TripStyle, "edited">;
  label: string;
  note: string;
  costs: MonthlyCosts;
}> = [
  {
    id: "budget",
    label: "Budget-led",
    note: "More free camps and home cooking",
    costs: { fuel: 600, food: 550, campsites: 250, experiences: 250, other: 250 },
  },
  {
    id: "vanes",
    label: "Vanes pace",
    note: "Our balanced middle starting point",
    costs: { fuel: 800, food: 850, campsites: 500, experiences: 500, other: 350 },
  },
  {
    id: "comfort",
    label: "More comfort",
    note: "More paid stays, meals, and activities",
    costs: { fuel: 1100, food: 1350, campsites: 1000, experiences: 850, other: 500 },
  },
];

const COST_FIELDS: Array<{ key: keyof MonthlyCosts; label: string }> = [
  { key: "fuel", label: "Fuel + transport" },
  { key: "food", label: "Food + eating out" },
  { key: "campsites", label: "Campsites + stays" },
  { key: "experiences", label: "Activities + experiences" },
  { key: "other", label: "Phone, laundry + other" },
];

function safeNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function monthlyCostTotal(costs: MonthlyCosts) {
  return Object.values(costs).reduce((total, value) => total + Math.max(0, value), 0);
}

function contributionForGoal(
  goal: number,
  startingBalance: number,
  months: number,
  annualRate: number
): number {
  if (goal <= startingBalance) return 0;
  const periods = Math.max(1, months);
  const monthlyRate = Math.max(0, annualRate) / 100 / 12;

  if (monthlyRate === 0) {
    return Math.max(0, (goal - startingBalance) / periods);
  }

  const growth = (1 + monthlyRate) ** periods;
  const futureStartingBalance = startingBalance * growth;
  const annuityFactor = (growth - 1) / monthlyRate;
  return Math.max(0, (goal - futureStartingBalance) / annuityFactor);
}

function MoneyField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  max,
  step = 100,
}: MoneyFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-dust">
        {label}
      </span>
      <span className="flex h-12 items-center rounded-lg border border-ink/10 bg-white px-4 focus-within:border-cobalt/50 focus-within:ring-3 focus-within:ring-cobalt/10">
        {prefix ? <span className="mr-2 text-dust">{prefix}</span> : null}
        <input
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(safeNumber(event.target.value))}
          className="min-w-0 flex-1 bg-transparent text-base font-semibold outline-none"
        />
        {suffix ? <span className="ml-2 text-xs text-dust">{suffix}</span> : null}
      </span>
    </label>
  );
}

export function VanFundCalculator() {
  const [vanCost, setVanCost] = useState(18000);
  const [setupCost, setSetupCost] = useState(3500);
  const [buffer, setBuffer] = useState(2500);
  const [saved, setSaved] = useState(2000);
  const [months, setMonths] = useState(24);
  const [interestRate, setInterestRate] = useState(4.5);

  const [tripMode, setTripMode] = useState<TripMode>("monthly");
  const [tripStyle, setTripStyle] = useState<TripStyle>("vanes");
  const [monthlyCosts, setMonthlyCosts] = useState<MonthlyCosts>(TRIP_STYLES[1].costs);
  const [travelMonths, setTravelMonths] = useState(3);
  const [customTripTotal, setCustomTripTotal] = useState(9000);
  const [monthlyTripIncome, setMonthlyTripIncome] = useState(0);

  const result = useMemo(() => {
    const safeTravelMonths = Math.max(0.25, travelMonths);
    const monthlyTripCost = monthlyCostTotal(monthlyCosts);
    const grossTripCost = tripMode === "monthly"
      ? monthlyTripCost * safeTravelMonths
      : Math.max(0, customTripTotal);
    const expectedTripIncome = Math.max(0, monthlyTripIncome) * safeTravelMonths;
    const tripAmountToFund = Math.max(0, grossTripCost - expectedTripIncome);
    const goal = Math.max(0, vanCost + setupCost + tripAmountToFund + buffer);
    const safeMonths = Math.max(1, months);
    const monthly = contributionForGoal(goal, saved, safeMonths, interestRate);
    const weekly = (monthly * 12) / 52;
    const delay = Math.min(6, Math.max(0, safeMonths - 1));
    const monthlyRate = Math.max(0, interestRate) / 100 / 12;
    const savedAfterDelay = saved * (1 + monthlyRate) ** delay;
    const delayedMonthly = contributionForGoal(
      goal,
      savedAfterDelay,
      safeMonths - delay,
      interestRate
    );

    return {
      goal,
      monthly,
      weekly,
      delay,
      delayedMonthly,
      extraAfterDelay: Math.max(0, delayedMonthly - monthly),
      monthlyTripCost,
      grossTripCost,
      expectedTripIncome,
      tripAmountToFund,
      safeTravelMonths,
    };
  }, [buffer, customTripTotal, interestRate, monthlyCosts, monthlyTripIncome, months, saved, setupCost, travelMonths, tripMode, vanCost]);

  function selectStyle(style: (typeof TRIP_STYLES)[number]) {
    setTripStyle(style.id);
    setMonthlyCosts({ ...style.costs });
    setTripMode("monthly");
  }

  function updateMonthlyCost(key: keyof MonthlyCosts, value: number) {
    setTripStyle("edited");
    setMonthlyCosts((current) => ({ ...current, [key]: value }));
  }

  function changeTripMode(mode: TripMode) {
    if (mode === "custom" && tripMode === "monthly") {
      setCustomTripTotal(result.grossTripCost);
    }
    setTripMode(mode);
  }

  return (
    <div className="overflow-hidden rounded-[1.25rem] bg-paper shadow-[0_30px_80px_rgba(18,20,26,0.16)] ring-1 ring-ink/10">
      <div className="bg-espresso p-6 text-linen sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ochre">Your live plan</p>
            <h2 className="mt-2 font-heading text-3xl font-medium italic">The Van Fund calculator</h2>
          </div>
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ochre text-espresso"><WalletCards className="size-5" /></span>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-linen/60">
          An estimate, not a prediction. Every example below is editable—replace it with your route, travel style, current quotes, and dependable income.
        </p>
      </div>

      <section className="border-b border-ink/10 bg-linen p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cobalt"><Route className="size-4" />Plan your time on the road</p>
            <h3 className="mt-2 font-heading text-3xl font-medium italic">What will the trip itself cost?</h3>
          </div>
          <div className="grid grid-cols-2 rounded-full border border-ink/10 bg-paper p-1 text-xs font-semibold">
            <button type="button" onClick={() => changeTripMode("monthly")} className={`rounded-full px-4 py-2 transition ${tripMode === "monthly" ? "bg-espresso text-linen" : "text-dust hover:text-ink"}`}>Monthly plan</button>
            <button type="button" onClick={() => changeTripMode("custom")} className={`rounded-full px-4 py-2 transition ${tripMode === "custom" ? "bg-espresso text-linen" : "text-dust hover:text-ink"}`}>Custom total</button>
          </div>
        </div>

        {tripMode === "monthly" ? (
          <>
            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {TRIP_STYLES.map((style) => {
                const active = tripStyle === style.id;
                const total = monthlyCostTotal(style.costs);
                return (
                  <button key={style.id} type="button" onClick={() => selectStyle(style)} className={`rounded-xl border p-4 text-left transition ${active ? "border-cobalt bg-cobalt text-linen shadow-md" : "border-ink/10 bg-paper hover:border-cobalt/30"}`}>
                    <span className="flex items-center justify-between gap-3"><span className="text-sm font-bold">{style.label}</span>{active ? <Check className="size-4" /> : null}</span>
                    <span className={`mt-2 block font-heading text-2xl font-semibold italic ${active ? "text-sun" : "text-ink"}`}>{currency.format(total)}<span className="ml-1 font-sans text-[10px] font-semibold not-italic opacity-60">/ month</span></span>
                    <span className={`mt-2 block text-xs leading-5 ${active ? "text-linen/60" : "text-dust"}`}>{style.note}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-start gap-2 text-[10px] leading-5 text-dust"><Sparkles className="mt-0.5 size-3.5 shrink-0 text-clay" /><p>These are editable planning examples, not typical-spend claims. “Vanes pace” is our balanced middle starting point, not a recommendation.</p></div>

            <div className="mt-7 rounded-xl border border-ink/10 bg-paper p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-dust">Monthly breakdown</p><p className="mt-1 text-sm text-dust">Edit any line to make this your plan.</p></div>
                <div className="text-right"><p className="font-heading text-3xl font-semibold italic text-cobalt">{currency.format(result.monthlyTripCost)}</p><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-dust">per month</p></div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {COST_FIELDS.map((field) => <MoneyField key={field.key} label={field.label} prefix="$" suffix="/ mo" value={monthlyCosts[field.key]} onChange={(value) => updateMonthlyCost(field.key, value)} />)}
              </div>
              {tripStyle === "edited" ? <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-clay">Edited plan · now this one is yours</p> : null}
            </div>
          </>
        ) : (
          <div className="mt-7 rounded-xl border border-ink/10 bg-paper p-5 sm:p-6">
            <MoneyField label="Your total trip-spending estimate" prefix="$" value={customTripTotal} onChange={setCustomTripTotal} step={500} />
            <p className="mt-3 text-xs leading-5 text-dust">Use this option if you already have a route budget or want one number instead of monthly categories.</p>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <MoneyField label="How long do you want to travel?" value={travelMonths} onChange={setTravelMonths} suffix="months" min={0.25} max={120} step={0.25} />
          <MoneyField label="Expected usable income while travelling" prefix="$" value={monthlyTripIncome} onChange={setMonthlyTripIncome} suffix="/ month" step={100} />
        </div>
        <p className="mt-3 text-xs leading-5 text-dust">For income, use a conservative amount you reasonably expect to keep after work costs and tax—not hoped-for sales. If income is uncertain, enter $0.</p>

        <div className="mt-7 grid overflow-hidden rounded-xl border border-ink/10 bg-paper sm:grid-cols-3">
          <div className="p-5"><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-dust">Gross trip spending</p><p className="mt-2 font-heading text-3xl font-semibold italic">{currency.format(result.grossTripCost)}</p><p className="mt-1 text-xs text-dust">Across {result.safeTravelMonths} months</p></div>
          <div className="border-y border-ink/10 p-5 sm:border-x sm:border-y-0"><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-dust">Expected trip income</p><p className="mt-2 font-heading text-3xl font-semibold italic text-olive">− {currency.format(result.expectedTripIncome)}</p><p className="mt-1 text-xs text-dust">Conservative usable estimate</p></div>
          <div className="bg-espresso p-5 text-linen"><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-linen/50">Trip amount to pre-fund</p><p className="mt-2 font-heading text-3xl font-semibold italic text-sun">{currency.format(result.tripAmountToFund)}</p><p className="mt-1 text-xs text-linen/50">Spending less expected income</p></div>
        </div>
      </section>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-6 sm:p-8">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cobalt">Before you leave</p><h3 className="mt-2 font-heading text-3xl font-medium italic">Price the van and the runway.</h3></div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <MoneyField label="Van or vehicle" prefix="$" value={vanCost} onChange={setVanCost} />
            <MoneyField label="Setup + first repairs" prefix="$" value={setupCost} onChange={setSetupCost} />
            <MoneyField label="Van-specific buffer" prefix="$" value={buffer} onChange={setBuffer} />
            <MoneyField label="Already saved" prefix="$" value={saved} onChange={setSaved} />
            <MoneyField label="Time to departure" value={months} onChange={setMonths} suffix="months" min={1} max={120} step={1} />
            <MoneyField label="Savings interest estimate" value={interestRate} onChange={setInterestRate} suffix="% p.a." min={0} max={20} step={0.1} />
          </div>
        </div>

        <div className="flex flex-col justify-between bg-ochre p-6 text-espresso sm:p-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em]">Your full target</p>
            <p className="mt-2 font-heading text-5xl font-semibold tracking-tight">{currency.format(result.goal)}</p>
            <div className="mt-5 space-y-2 border-t border-espresso/15 pt-4 text-xs">
              <p className="flex justify-between gap-4"><span>Van + setup</span><strong>{currency.format(vanCost + setupCost)}</strong></p>
              <p className="flex justify-between gap-4"><span>Trip to pre-fund</span><strong>{currency.format(result.tripAmountToFund)}</strong></p>
              <p className="flex justify-between gap-4"><span>Van-specific buffer</span><strong>{currency.format(buffer)}</strong></p>
            </div>
            <div className="mt-6 rounded-xl bg-paper/70 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-dust">Start now</p>
              <p className="mt-2 font-heading text-3xl font-semibold">{currency.format(result.weekly)}<span className="ml-1 font-sans text-sm font-medium text-dust">/ week</span></p>
              <p className="mt-2 text-sm text-dust">About {currency.format(result.monthly)} each month for {Math.max(1, months)} months.</p>
            </div>
          </div>

          {result.delay > 0 ? (
            <div className="mt-6 border-t border-espresso/15 pt-5">
              <p className="flex items-center gap-2 text-sm font-bold"><CalendarClock className="size-4" />If you wait {result.delay} months</p>
              <p className="mt-2 text-sm leading-6 text-espresso/70">The monthly target becomes {currency.format(result.delayedMonthly)}—about {currency.format(result.extraAfterDelay)} more every month.</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-start gap-3 border-t border-ink/10 bg-linen px-6 py-5 text-sm leading-6 text-dust sm:px-8">
        <Coins className="mt-0.5 size-4 shrink-0 text-clay" />
        <p>
          Interest helps, but time and regular contributions usually do most of the work on a short goal. Confirm costs independently; this simplified model does not include inflation, tax on interest, changing rates, fees, or income variability. <Link href="/courses/van-fund/learn/start-before-ready" className="font-semibold text-cobalt underline-offset-4 hover:underline">Learn why <ArrowRight className="inline size-3.5" /></Link>
        </p>
      </div>
    </div>
  );
}
