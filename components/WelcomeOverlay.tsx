"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";
import { sfx } from "@/lib/sound";

const COUNT_FROM = 3;

/** First screen on load: counts down 3-2-1, then opens the birthday cake. */
export function WelcomeOverlay({ open, onEnter }: { open: boolean; onEnter: () => void }) {
  const [count, setCount] = useState(COUNT_FROM);
  const onEnterRef = useRef(onEnter);

  useEffect(() => {
    onEnterRef.current = onEnter;
  }, [onEnter]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Start ticking once the intro animation has played.
    let n = COUNT_FROM;
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        n -= 1;
        if (n <= 0) {
          clearInterval(timer);
          sfx.pop();
          onEnterRef.current();
        } else {
          setCount(n);
          sfx.candle(COUNT_FROM - n - 1);
        }
      }, 1000);
    }, 900);

    return () => {
      document.body.style.overflow = prev;
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-bg px-4"
          exit={{ opacity: 0, scale: 1.08, filter: "blur(10px)" }}
          transition={{ duration: 0.6 }}
        >
          <div aria-hidden className="absolute inset-0 bg-grid" />
          <div aria-hidden className="absolute top-1/2 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[140px]" />
          <div aria-hidden className="rays absolute top-1/2 left-1/2 size-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70" />

          <div className="relative text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-2 font-mono text-xs tracking-[0.3em] text-primary-bright uppercase"
            >
              <Sparkles className="size-3.5" /> A surprise is waiting <Sparkles className="size-3.5" />
            </motion.p>
            <motion.h1
              id="welcome-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl"
            >
              Hey <span className="text-gradient-hero font-serif font-normal italic">Usama</span>,
              <br />
              this one&apos;s for you.
            </motion.h1>

            {/* countdown */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
              className="relative mx-auto mt-10 flex size-40 items-center justify-center sm:size-48"
              aria-live="assertive"
            >
              <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
                <defs>
                  <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#a855f7" />
                    <stop offset="0.5" stopColor="#f472b6" />
                    <stop offset="1" stopColor="#f5c86a" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="4" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#ring)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 1 }}
                  animate={{ pathLength: 0 }}
                  transition={{ duration: COUNT_FROM, delay: 0.9, ease: "linear" }}
                />
              </svg>
              <div className="absolute inset-4 rounded-full bg-primary/10 blur-xl" aria-hidden />
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={count}
                  initial={{ scale: 2.2, opacity: 0, filter: "blur(8px)" }}
                  animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="relative text-7xl font-bold tabular-nums text-gradient-gold sm:text-8xl"
                >
                  {count}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            <motion.button
              type="button"
              onClick={() => {
                sfx.pop();
                sfx.sparkle(10);
                onEnter();
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="mt-10 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-primary-bright hover:bg-primary/15"
            >
              <Gift className="size-4" /> Open now
            </motion.button>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-3 text-xs text-muted">
              🔊 Tap for sound
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
