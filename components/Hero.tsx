"use client";

import { motion } from "framer-motion";
import { ArrowDown, Cake, Heart, PartyPopper, Sparkles } from "lucide-react";
import { CelebrationPass } from "@/components/CelebrationPass";
import { OpenCakeButton } from "@/components/OpenCakeButton";

const WORDS = ["Happy", "Birthday,"];

export function Hero() {
  return (
    <section id="top" className="relative mx-auto max-w-6xl px-4 pt-28 pb-20 sm:pt-36 lg:pb-28">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 py-1.5 pr-4 pl-1.5 text-sm font-medium text-primary-bright shadow-[0_0_30px_-6px_rgb(168_85_247/0.6)]"
          >
            <span className="relative flex items-center justify-center rounded-full bg-primary/25 p-1.5">
              <motion.span
                className="absolute inset-0 rounded-full border border-primary-bright/60"
                animate={{ scale: [1, 1.6], opacity: [0.8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <PartyPopper className="size-3.5" />
            </span>
            It&apos;s celebration day
          </motion.div>

          <h1 className="mt-6 text-5xl leading-[0.95] font-bold tracking-tighter sm:text-7xl lg:text-8xl">
            <span className="sr-only">Happy Birthday, Usama Riaz</span>
            <span aria-hidden>
              {WORDS.map((w, i) => (
                <motion.span
                  key={w}
                  className="mr-[0.22em] inline-block"
                  initial={{ opacity: 0, y: 60, rotateX: -60 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  {w}
                </motion.span>
              ))}
              <br />
              <motion.span
                className="text-gradient-hero inline-block font-serif font-normal tracking-tight italic"
                initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                Usama Riaz
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="mx-auto mt-6 max-w-xl text-lg text-pretty text-muted lg:mx-0"
          >
            Software Engineer, problem solver and an amazing friend. Another year successfully{" "}
            <span className="text-fg">shipped to production</span> — today we celebrate{" "}
            <span className="text-gold">you</span>.
          </motion.p>

          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.95 } } }}
            className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start"
          >
            {[
              { icon: Cake, text: "Cake ready", tone: "text-gold" },
              { icon: Sparkles, text: "Wishes loading", tone: "text-primary-bright" },
              { icon: Heart, text: "Love: 100%", tone: "text-rose" },
            ].map(({ icon: Icon, text, tone }) => (
              <motion.li
                key={text}
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                className="glass flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm"
              >
                <Icon className={`size-4 ${tone}`} />
                {text}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <OpenCakeButton />
            <a
              href="#wishes"
              className="group inline-flex items-center gap-2 rounded-xl px-4 py-3 font-medium text-muted transition-colors hover:text-fg"
            >
              Leave a wish <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            </a>
          </motion.div>
        </div>

        <div className="mx-auto w-full max-w-lg lg:max-w-none">
          <CelebrationPass />
        </div>
      </div>
    </section>
  );
}
