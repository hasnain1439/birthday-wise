"use client";

import { motion } from "framer-motion";

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto mb-10 max-w-2xl text-center sm:mb-14"
    >
      <p className="mb-3 font-mono text-xs tracking-[0.25em] text-primary-bright uppercase">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
        {title} <span className="font-serif font-normal italic text-gradient-gold">{accent}</span>
      </h2>
      {description && <p className="mt-4 text-base text-pretty text-muted sm:text-lg">{description}</p>}
    </motion.div>
  );
}
