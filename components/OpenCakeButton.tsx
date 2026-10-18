"use client";

import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { useCake } from "@/components/Providers";
import { sfx } from "@/lib/sound";

/** The main call-to-action: opens the birthday cake reveal. */
export function OpenCakeButton({ label = "Open your birthday cake", className = "" }: { label?: string; className?: string }) {
  const { openCake } = useCake();

  return (
    <motion.button
      type="button"
      onClick={() => {
        sfx.pop();
        openCake();
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-rose to-gold px-7 py-4 text-lg font-semibold text-white shadow-[0_18px_50px_-12px_rgb(168_85_247/0.9)] ${className}`}
    >
      <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <motion.span
        aria-hidden
        animate={{ rotate: [0, -14, 14, -8, 0] }}
        transition={{ duration: 1, repeat: Infinity, repeatDelay: 1.6 }}
        className="relative"
      >
        <Gift className="size-6" />
      </motion.span>
      <span className="relative">{label}</span>
      <span aria-hidden className="absolute -inset-1 -z-10 animate-pulse rounded-2xl bg-primary/40 blur-xl" />
    </motion.button>
  );
}
