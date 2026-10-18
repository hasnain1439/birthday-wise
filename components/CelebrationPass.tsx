"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Crown, Sparkles, Ticket } from "lucide-react";
import { seeded } from "@/lib/random";

const rand = seeded(1018);
const BARCODE = Array.from({ length: 46 }, () => ({ w: 1 + Math.floor(rand() * 3), gap: 1 + Math.floor(rand() * 2) }));

const DETAILS = [
  { label: "Guest of honour", value: "USAMA RIAZ" },
  { label: "Occasion", value: "BIRTHDAY" },
  { label: "Date", value: "TODAY" },
  { label: "Seat", value: "VIP-01" },
  { label: "Dress code", value: "PARTY" },
  { label: "Access", value: "ALL AREAS" },
];

function PartyMeter() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: 2.6,
      delay: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setPct(Math.round(v)),
    });
    return () => controls.stop();
  }, []);

  return (
    <div className="mt-5 rounded-xl border border-gold/25 bg-black/30 p-3.5">
      <div className="mb-2 flex items-center justify-between gap-3 font-mono text-[11px] tracking-wider uppercase">
        <span className="flex items-center gap-1.5 text-gold">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-gold" />
          </span>
          Party mode
        </span>
        <span className="text-fg tabular-nums">
          {pct}% <span className="text-muted">{pct === 100 ? "Loaded" : "Loading"}</span>
        </span>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Party mode" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <motion.div
          className="stripes absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-rose to-gold"
          style={{ width: `${pct}%` }}
          animate={{ opacity: [1, 0.75, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      </div>
      <p className="mt-2 font-mono text-[11px] text-muted">
        <span className="text-cyan">›</span> cake.status = &quot;ready&quot;
        <span className="caret" />
      </p>
    </div>
  );
}

export function CelebrationPass() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 150, damping: 18 });
  const glareX = useTransform(mx, [0, 1], [0, 100]);
  const glareY = useTransform(my, [0, 1], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.18), transparent 45%)`;

  function onPointerMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  return (
    <div className="[perspective:1200px]">
      <motion.div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        initial={{ opacity: 0, y: 40, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-2 via-surface to-[#1a0b24] shadow-[0_30px_80px_-20px_rgb(168_85_247/0.45)]"
      >
        <div aria-hidden className="holo pointer-events-none absolute inset-0" />
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glare }} />

        <div className="relative flex flex-col sm:flex-row">
          <div className="flex-1 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
                <Ticket className="size-3.5 text-primary-bright" />
                Celebration Pass
              </div>
              <span className="rounded-md bg-gold/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-gold">VIP</span>
            </div>

            <div className="mt-5 flex items-center justify-between gap-2">
              <div>
                <div className="text-4xl font-bold tracking-tight sm:text-5xl">LVL</div>
                <div className="mt-1 text-xs text-muted">Current level</div>
              </div>
              <div className="relative mx-2 flex-1">
                <div className="h-px w-full border-t border-dashed border-white/25" />
                <motion.div
                  className="absolute -top-3 left-0"
                  animate={{ left: ["0%", "88%"] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
                >
                  <Sparkles className="size-6 text-gold drop-shadow-[0_0_8px_rgb(245_200_106/0.8)]" />
                </motion.div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold tracking-tight text-gradient-hero sm:text-5xl">UP</div>
                <div className="mt-1 text-xs text-muted">Next level</div>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-3 gap-x-3 gap-y-4">
              {DETAILS.map((d, i) => (
                <div key={d.label} className={i === 0 ? "col-span-3 sm:col-span-1" : ""}>
                  <dt className="truncate font-mono text-[10px] tracking-widest text-muted uppercase">{d.label}</dt>
                  <dd className="mt-0.5 truncate font-mono text-sm font-semibold">{d.value}</dd>
                </div>
              ))}
            </dl>

            <PartyMeter />
          </div>

          {/* perforation */}
          <div aria-hidden className="relative h-6 sm:h-auto sm:w-6">
            <div className="absolute inset-x-5 top-1/2 border-t-2 border-dashed border-white/15 sm:inset-x-auto sm:inset-y-5 sm:top-auto sm:left-1/2 sm:border-t-0 sm:border-l-2" />
            <div className="absolute top-0 -left-3 size-6 rounded-full bg-bg sm:-top-3 sm:left-0" />
            <div className="absolute top-0 -right-3 size-6 rounded-full bg-bg sm:top-auto sm:right-0 sm:-bottom-3" />
          </div>

          <div className="flex items-center justify-between gap-4 p-5 sm:w-40 sm:flex-col sm:items-stretch">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-muted uppercase">Admit one</div>
              <div className="mt-0.5 font-serif text-2xl italic text-gradient-gold">Birthday Star</div>
              <div className="mt-2 flex items-center gap-1 font-mono text-[10px] text-primary-bright">
                <Crown className="size-3.5" /> GUEST OF HONOUR
              </div>
            </div>
            <div aria-label="Barcode" role="img" className="flex h-14 items-stretch sm:h-16">
              {BARCODE.map((b, i) => (
                <span key={i} className="bg-white/80" style={{ width: b.w, marginRight: b.gap }} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
