"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, PartyPopper, RotateCcw, Volume2, Wand2, X } from "lucide-react";
import { burstAt, megaCelebration } from "@/lib/celebrate";
import { audioStore, sfx } from "@/lib/sound";

// x/y offsets (px) from the centre of the top tier; back-row candles sit higher.
const CANDLES = [
  { x: -62, y: -2, color: "from-primary-bright to-primary" },
  { x: -31, y: 9, color: "from-gold to-gold-deep" },
  { x: 0, y: -6, color: "from-cyan to-sky-600" },
  { x: 31, y: 9, color: "from-rose to-pink-600" },
  { x: 62, y: -2, color: "from-primary-bright to-primary" },
];

const DRIPS = [14, 22, 12, 26, 16, 20, 11, 24, 15, 18];
const AUTO_CLOSE_MS = 8000;

function Candle({ index, lit, onBlow }: { index: number; lit: boolean; onBlow: (i: number, e: React.MouseEvent<HTMLButtonElement>) => void }) {
  const c = CANDLES[index];
  return (
    <button
      type="button"
      onClick={(e) => onBlow(index, e)}
      disabled={!lit}
      aria-label={lit ? `Blow out candle ${index + 1}` : `Candle ${index + 1} is out`}
      className="group absolute flex w-11 -translate-x-1/2 cursor-pointer flex-col items-center outline-none disabled:cursor-default"
      style={{ left: `calc(50% + ${c.x}px)`, bottom: `${8 - c.y}px`, zIndex: c.y > 0 ? 3 : 2 }}
    >
      <span className="relative flex h-10 w-full items-end justify-center">
        <AnimatePresence>
          {lit ? (
            <motion.span
              key="flame"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0, y: -6 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative mb-0.5 flex justify-center"
            >
              <span className="absolute -top-3 size-10 rounded-full bg-gold/40 blur-xl" />
              <span className="flame relative block h-6 w-3.5 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-50 shadow-[0_0_18px_6px_rgb(251_191_36/0.55)] transition-transform group-hover:scale-110 group-focus-visible:scale-110">
                <span className="absolute inset-x-1 bottom-0.5 h-2.5 rounded-full bg-sky-400/60 blur-[2px]" />
              </span>
            </motion.span>
          ) : (
            <motion.span
              key="smoke"
              initial={{ opacity: 0.8, y: 0, scale: 0.6 }}
              animate={{ opacity: 0, y: -40, scale: 1.8 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="absolute bottom-1 size-4 rounded-full bg-zinc-300/50 blur-[3px]"
            />
          )}
        </AnimatePresence>
      </span>
      <span className="h-1.5 w-0.5 bg-zinc-800" />
      <span
        className={`relative h-12 w-2.5 overflow-hidden rounded-t-sm bg-gradient-to-r ${c.color} shadow-[inset_-2px_0_3px_rgb(0_0_0/0.35)] ring-offset-2 ring-offset-bg group-focus-visible:ring-2 group-focus-visible:ring-cyan`}
      >
        <span className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_5px,rgb(255_255_255/0.45)_5px_8px)]" />
      </span>
    </button>
  );
}

function Cake({ lit, onBlow }: { lit: boolean[]; onBlow: (i: number, e: React.MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <div className="relative mx-auto h-[360px] w-[320px] select-none">
      <div className="absolute bottom-6 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />

      {/* plate */}
      <div className="absolute bottom-2 left-1/2 h-12 w-[320px] -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-zinc-200 to-zinc-500 shadow-[0_18px_40px_rgb(0_0_0/0.6)]" />
      <div className="absolute bottom-4 left-1/2 h-9 w-[296px] -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-white to-zinc-300" />

      {/* bottom tier: chocolate with gold ribbon */}
      <div className="absolute bottom-[34px] left-1/2 h-[104px] w-[260px] -translate-x-1/2">
        <div className="absolute inset-x-0 top-[18px] bottom-0 rounded-b-[50%_22px] bg-gradient-to-r from-[#2a1710] via-[#4a2a1c] to-[#1f110b]">
          <div className="absolute inset-x-0 top-[44%] h-3 bg-gradient-to-r from-gold-deep via-gold to-gold-deep shadow-[0_0_14px_rgb(245_200_106/0.5)]" />
          <div className="absolute inset-x-0 bottom-3 text-center font-serif text-lg italic text-gold/95">Usama</div>
        </div>
        <div className="absolute inset-x-0 top-0 h-[38px] rounded-[50%] bg-gradient-to-b from-[#fdf3dc] to-[#e9d6ad]" />
        <div className="absolute inset-x-3 top-[19px] flex justify-between">
          {DRIPS.map((h, i) => (
            <span key={i} className="w-3.5 rounded-b-full bg-[#efe0bd]" style={{ height: h }} />
          ))}
        </div>
      </div>

      {/* top tier: berry frosting */}
      <div className="absolute bottom-[118px] left-1/2 h-[92px] w-[184px] -translate-x-1/2">
        <div className="absolute inset-x-0 top-[16px] bottom-0 rounded-b-[50%_18px] bg-gradient-to-r from-[#6b21a8] via-primary to-[#581c87]">
          <div className="absolute inset-x-0 bottom-3 text-center text-sm font-bold tracking-[0.3em] text-white/85">HBD</div>
        </div>
        <div className="absolute inset-x-0 top-0 h-[34px] rounded-[50%] bg-gradient-to-b from-[#fbcfe8] to-rose" />
        <div className="absolute inset-x-2 top-[17px] flex justify-between">
          {DRIPS.slice(0, 8).map((h, i) => (
            <span key={i} className="w-3 rounded-b-full bg-[#f9a8d4]" style={{ height: h * 0.8 }} />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-[66px] h-28">
          {CANDLES.map((_, i) => (
            <Candle key={i} index={i} lit={lit[i]} onBlow={onBlow} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Gift box whose lid pops off before the cake rises out. */
function GiftBox() {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 mx-auto h-48 w-56"
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, rotate: [0, -6, 6, -6, 6, 0] }}
      exit={{ y: 120, opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.9 }}
    >
      <motion.div
        className="absolute inset-x-[-8px] top-0 z-10 h-12 rounded-lg bg-gradient-to-b from-rose to-pink-700 shadow-lg"
        animate={{ y: [0, 0, -220], rotate: [0, 0, -40], opacity: [1, 1, 0] }}
        transition={{ duration: 1.3, times: [0, 0.6, 1] }}
      >
        <div className="absolute inset-y-0 left-1/2 w-6 -translate-x-1/2 bg-gold" />
        <div className="absolute -top-7 left-1/2 flex -translate-x-1/2 gap-1">
          <span className="h-8 w-10 rotate-[-25deg] rounded-full border-[6px] border-gold" />
          <span className="h-8 w-10 rotate-[25deg] rounded-full border-[6px] border-gold" />
        </div>
      </motion.div>
      <div className="absolute inset-x-0 top-10 bottom-0 rounded-b-xl bg-gradient-to-b from-primary to-[#4c1d95] shadow-2xl">
        <div className="absolute inset-y-0 left-1/2 w-6 -translate-x-1/2 bg-gold" />
      </div>
    </motion.div>
  );
}

export function CakeModal({
  open,
  onClose,
  autoCelebrate = false,
}: {
  open: boolean;
  onClose: () => void;
  /** Skip the gift box and candle blowing — celebrate the moment it opens. */
  autoCelebrate?: boolean;
}) {
  const [revealed, setRevealed] = useState(false);
  const [lit, setLit] = useState<boolean[]>(() => CANDLES.map(() => true));
  const [celebrated, setCelebrated] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const unlocked = useSyncExternalStore(audioStore.subscribe, audioStore.getSnapshot, audioStore.getServerSnapshot);
  // Celebration fired while the browser still had audio blocked — replay it once sound unlocks.
  const missedSound = useRef(false);

  useEffect(() => {
    if (unlocked && open && missedSound.current) {
      missedSound.current = false;
      sfx.bigCelebration();
    }
  }, [unlocked, open]);
  const remaining = lit.filter(Boolean).length;

  // After the celebration plays out, take the visitor to the landing page.
  useEffect(() => {
    if (!celebrated) return;
    const t = setTimeout(onClose, AUTO_CLOSE_MS);
    return () => clearTimeout(t);
  }, [celebrated, onClose]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    sfx.stopMusic();
    if (!autoCelebrate) sfx.drumroll(1.2);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const timers = [
      setTimeout(() => {
        setRevealed(true);
        sfx.tada();
        sfx.whoosh();
        sfx.sparkle(14);
      }, autoCelebrate ? 0 : 1250),
    ];
    if (autoCelebrate) {
      // Straight from the countdown: blow the candles and party immediately.
      timers.push(
        setTimeout(() => {
          setLit(CANDLES.map(() => false));
          setCelebrated(true);
          megaCelebration();
          sfx.blow();
          if (!audioStore.getSnapshot()) missedSound.current = true;
          sfx.bigCelebration();
        }, 350),
      );
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      timers.forEach(clearTimeout);
    };
  }, [open, onClose, autoCelebrate]);

  function reset() {
    setRevealed(false);
    setLit(CANDLES.map(() => true));
    setCelebrated(false);
  }

  function celebrate() {
    setTimeout(() => {
      setCelebrated(true);
      megaCelebration();
      if (!audioStore.getSnapshot()) missedSound.current = true;
      sfx.bigCelebration();
    }, 350);
  }

  function blow(i: number, e: React.MouseEvent<HTMLButtonElement>) {
    if (!lit[i]) return;
    const next = lit.map((v, idx) => (idx === i ? false : v));
    setLit(next);
    sfx.blow();
    const r = e.currentTarget.getBoundingClientRect();
    burstAt(r.left + r.width / 2, r.top + 12);
    if (next.every((v) => !v)) celebrate();
    else sfx.candle(next.filter((v) => !v).length - 1);
  }

  function blowAll() {
    if (remaining === 0) return;
    setLit(CANDLES.map(() => false));
    sfx.blow();
    celebrate();
  }

  function relight() {
    setLit(CANDLES.map(() => true));
    setCelebrated(false);
    sfx.success();
    sfx.sparkle(8);
  }

  return (
    <AnimatePresence onExitComplete={reset}>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cake-title"
          className="fixed inset-0 z-[60] overflow-y-auto bg-black/75 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          {!unlocked && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0, scale: [1, 1.06, 1] }}
              transition={{ scale: { duration: 1.2, repeat: Infinity } }}
              className="fixed top-4 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-gradient-to-r from-primary via-rose to-gold px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgb(168_85_247/0.9)]"
            >
              <Volume2 className="size-4" /> Tap for sound
            </motion.button>
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="fixed top-4 right-4 z-10 rounded-full border border-white/15 bg-white/5 p-2.5 text-fg transition-colors hover:bg-white/15"
          >
            <X className="size-5" />
          </button>

          <div className="flex min-h-full flex-col items-center justify-center px-4 py-16" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="text-center">
              <p className="font-mono text-xs tracking-[0.3em] text-primary-bright uppercase">A surprise for you</p>
              <h2 id="cake-title" className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                {celebrated ? (
                  <>Happy Birthday, <span className="font-serif font-normal italic text-gradient-hero">Usama!</span></>
                ) : (
                  <>Make a wish, <span className="font-serif font-normal italic text-gradient-gold">Usama</span></>
                )}
              </h2>
            </motion.div>

            <div className="relative mt-4 h-[330px] w-[320px] origin-top scale-[0.9] sm:h-[370px] sm:scale-100">
              <div aria-hidden className="rays absolute top-1/2 left-1/2 size-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
              <AnimatePresence mode="wait">
                {!revealed ? (
                  <GiftBox key="gift" />
                ) : (
                  <motion.div
                    key="cake"
                    initial={{ y: 140, scale: 0.6, opacity: 0 }}
                    animate={celebrated ? { y: [0, -14, 0], scale: 1, opacity: 1, rotate: [0, -3, 3, 0] } : { y: 0, scale: 1, opacity: 1 }}
                    transition={
                      celebrated
                        ? { duration: 0.8, ease: "easeInOut" }
                        : { type: "spring", stiffness: 160, damping: 16 }
                    }
                    className="absolute inset-x-0 bottom-0"
                  >
                    <Cake lit={lit} onBlow={blow} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {revealed && (
                <motion.div
                  key={celebrated ? "done" : "play"}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 w-full max-w-md text-center"
                >
                  {celebrated ? (
                    <>
                      <PartyPopper className="mx-auto size-10 text-gold" />
                      <div className="mx-auto mt-4 h-1 w-48 overflow-hidden rounded-full bg-white/10" aria-hidden>
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-primary via-rose to-gold"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: AUTO_CLOSE_MS / 1000, ease: "linear" }}
                        />
                      </div>
                      <p className="mt-2 font-mono text-[11px] text-muted">Taking you to the party…</p>
                      <p className="mt-3 text-pretty text-muted">
                        Your wish has been deployed to production. 🎉 Wishing you a year full of happiness, health, big wins and
                        beautiful moments.
                      </p>
                      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={relight}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary-bright hover:text-primary-bright"
                        >
                          <RotateCcw className="size-4" /> Relight candles
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-fg px-5 py-2.5 text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5"
                        >
                          Continue to the party →
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-muted">Tap each flame to blow it out.</p>
                      <div className="mx-auto mt-3 flex max-w-xs gap-2" aria-hidden>
                        {lit.map((on, i) => (
                          <motion.span
                            key={i}
                            animate={{ opacity: on ? 1 : 0.25, scale: on ? 1 : 0.85 }}
                            className="flex h-9 flex-1 items-center justify-center rounded-lg border border-white/10 bg-white/5"
                          >
                            <Flame className={`size-4 ${on ? "text-gold" : "text-muted"}`} />
                          </motion.span>
                        ))}
                      </div>
                      <p className="mt-2 font-mono text-xs text-muted tabular-nums">
                        {remaining} / {CANDLES.length} candles lit
                      </p>
                      <button
                        type="button"
                        onClick={blowAll}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-deep px-5 py-3 font-semibold text-black shadow-[0_10px_40px_-12px_rgb(245_200_106/0.9)] transition-transform hover:-translate-y-0.5"
                      >
                        <Wand2 className="size-5" /> Blow them all at once
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
