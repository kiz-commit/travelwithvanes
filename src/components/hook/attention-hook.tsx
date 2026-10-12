import type { HomeHookMoment } from "@/types";

type AttentionHookProps = {
  hookMoment: HomeHookMoment;
};

export function HookStage({ children }: { children: React.ReactNode }) {
  return <div className="homepage-hook-stage">{children}</div>;
}

export function AttentionHook({ hookMoment }: AttentionHookProps) {
  const hookVideo = hookMoment.backgroundVideoUrl || "/hook-moment-bg.mp4";

  return (
    <div
      className="homepage-attention-hook fixed inset-0 z-[80] flex items-center justify-center overflow-hidden px-5 text-center text-linen"
      aria-hidden="true"
    >
      <div className="hero-wash absolute inset-0" />
      <div className="hook-moment-bg absolute inset-0">
        <video
          src={hookVideo}
          className="hook-moment-bg-image opacity-55 mix-blend-luminosity"
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(37,37,31,0.35)_0%,rgba(49,88,74,0.72)_52%,rgba(37,37,31,0.88)_100%)]" />
      </div>
      <div
        aria-hidden
        className="paper-grain pointer-events-none absolute inset-0 opacity-70"
      />
      <div className="homepage-attention-ring stamp-ring absolute size-[34rem] rounded-full text-linen/20" />
      <div className="homepage-attention-ring homepage-attention-ring-two stamp-ring absolute size-[22rem] rounded-full text-sun/35" />
      <div className="hook-moment hook-moment-one relative z-10 mx-auto max-w-5xl">
        <p className="section-eyebrow mb-5 text-linen/55">Creator portfolio</p>
        <p className="hook-line font-heading text-[clamp(3.2rem,12vw,9rem)] font-medium italic leading-[0.84] tracking-[-0.05em] text-linen drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)]">
          {hookMoment.line1}
        </p>
      </div>
      <div className="hook-moment hook-moment-two absolute inset-x-5 mx-auto max-w-5xl">
        <p className="hook-line font-heading text-[clamp(2.6rem,8.5vw,6.5rem)] font-medium italic leading-[0.86] tracking-[-0.05em] text-sun">
          {hookMoment.line2}
        </p>
      </div>
      <div className="hook-moment hook-moment-three absolute inset-x-5 mx-auto max-w-5xl">
        <p className="hook-line hook-line-small mx-auto max-w-3xl font-heading text-[clamp(2.4rem,9vw,6rem)] font-medium italic leading-[0.88] tracking-[-0.05em] text-clay">
          {hookMoment.line3}
        </p>
      </div>
    </div>
  );
}
