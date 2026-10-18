"use client";

import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Heart, MessageCircle, Quote, Send, Trash2 } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { burstAt } from "@/lib/celebrate";
import { sfx } from "@/lib/sound";

type Wish = { id: string; name: string; message: string; emoji: string; createdAt: number };

const EMOJIS = ["🎂", "🎉", "🎁", "🎈", "🥳", "💜"];
const NAME_MAX = 40;
const MESSAGE_MAX = 280;

const SHARE_TEXT =
  "🎉 Happy Birthday Usama Riaz! 🎂\n\nWishing you a year full of happiness, health, success and amazing moments. Another year, fully shipped! 🥳🎈\n\nCome celebrate & leave a wish:";

// ---- localStorage-backed store ---------------------------------------------
// Wishes are saved in this browser only; there's no backend.
const KEY = "usama-birthday:wishes:v1";
const EMPTY: Wish[] = [];
let cache: Wish[] | null = null;
const subs = new Set<() => void>();

const wishStore = {
  subscribe(cb: () => void) {
    subs.add(cb);
    return () => subs.delete(cb);
  },
  getSnapshot(): Wish[] {
    if (cache) return cache;
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      cache = Array.isArray(parsed) ? (parsed as Wish[]) : [];
    } catch {
      cache = [];
    }
    return cache;
  },
  getServerSnapshot: () => EMPTY,
  set(next: Wish[]) {
    cache = next;
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage full or blocked — keep in memory */
    }
    subs.forEach((s) => s());
  },
};

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function shareUrl() {
  return typeof window === "undefined" ? "" : window.location.href.split("#")[0];
}

export function WishesWall() {
  const wishes = useSyncExternalStore(wishStore.subscribe, wishStore.getSnapshot, wishStore.getServerSnapshot);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const n = name.trim();
    const m = message.trim();
    if (!n || !m) {
      setError(!n ? "Add your name so Usama knows who it's from." : "Write a little something first.");
      return;
    }
    wishStore.set([{ id: newId(), name: n, message: m, emoji, createdAt: Date.now() }, ...wishes]);
    setName("");
    setMessage("");
    setError(null);
    sfx.success();
    sfx.sparkle(8);
    const btn = (e.nativeEvent as SubmitEvent).submitter?.getBoundingClientRect();
    if (btn) burstAt(btn.left + btn.width / 2, btn.top);
  }

  function remove(id: string) {
    wishStore.set(wishes.filter((w) => w.id !== id));
  }

  function shareWhatsApp(text = SHARE_TEXT) {
    const url = `https://wa.me/?text=${encodeURIComponent(`${text}\n${shareUrl()}`)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable (e.g. insecure context) */
    }
  }

  const input =
    "w-full rounded-xl border border-line bg-black/30 px-4 py-3 text-base text-fg placeholder:text-white/25 outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20";

  return (
    <section id="wishes" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:py-28">
      <SectionHeading
        eyebrow="// guestbook"
        title="Sign the"
        accent="wishes wall."
        description="Drop a birthday message, then spread the word on WhatsApp."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <div className="flex flex-col gap-6">
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-5 sm:p-7"
            noValidate
          >
            <label htmlFor="wish-name" className="mb-1.5 block text-sm font-medium">
              Your name
            </label>
            <input
              id="wish-name"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, NAME_MAX))}
              placeholder="e.g. Ali from the dev team"
              autoComplete="name"
              className={input}
            />

            <div className="mt-4 mb-1.5 flex items-baseline justify-between">
              <label htmlFor="wish-message" className="text-sm font-medium">
                Your wish
              </label>
              <span className={`font-mono text-[11px] tabular-nums ${message.length > MESSAGE_MAX - 20 ? "text-gold" : "text-muted"}`}>
                {message.length}/{MESSAGE_MAX}
              </span>
            </div>
            <textarea
              id="wish-message"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
              rows={4}
              placeholder="Happy birthday Usama! Wishing you an amazing year ahead…"
              className={`${input} resize-none`}
            />

            <fieldset className="mt-4">
              <legend className="mb-2 text-sm font-medium">Pick a sticker</legend>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setEmoji(em)}
                    aria-pressed={emoji === em}
                    aria-label={`Sticker ${em}`}
                    className={`flex size-11 items-center justify-center rounded-xl border text-xl transition-all ${
                      emoji === em
                        ? "scale-105 border-primary bg-primary/15 shadow-[0_0_20px_-4px_rgb(168_85_247/0.8)]"
                        : "border-line bg-black/20 hover:border-white/20"
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </fieldset>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 text-sm text-rose-400"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-black transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Send className="size-4" /> Post wish
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-[#25D366]/30 bg-gradient-to-br from-[#25D366]/15 to-transparent p-5 sm:p-6"
          >
            <h3 className="text-lg font-semibold">Spread the celebration</h3>
            <p className="mt-1 text-sm text-muted">One tap sends a ready-made congratulations message with a link to this page.</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => shareWhatsApp()}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-semibold text-black shadow-[0_10px_30px_-10px_rgb(37_211_102/0.8)] transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="size-5" /> Share on WhatsApp
              </button>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-sm font-medium transition-colors hover:border-white/25"
              >
                {copied ? <Check className="size-4 text-primary-bright" /> : <Copy className="size-4" />}
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="glass flex min-h-[420px] flex-col rounded-3xl p-5 sm:p-7"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold">
              <Heart className="size-4 fill-rose-500 text-rose-500" /> Wishes
            </h3>
            <span className="rounded-full bg-white/5 px-2.5 py-0.5 font-mono text-xs text-muted tabular-nums">
              {wishes.length}
            </span>
          </div>

          {wishes.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-line p-8 text-center">
              <Quote className="size-8 text-primary/50" />
              <p className="mt-3 font-medium">The wall is waiting for its first wish.</p>
              <p className="mt-1 text-sm text-muted">Be the first to sign it — your message shows up here instantly.</p>
            </div>
          ) : (
            <ul className="-mr-2 max-h-[560px] space-y-3 overflow-y-auto pr-2">
              <AnimatePresence initial={false}>
                {wishes.map((w) => (
                  <motion.li
                    key={w.id}
                    layout
                    initial={{ opacity: 0, y: -16, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                    className="group relative rounded-2xl border border-line bg-black/25 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl" aria-hidden>
                        {w.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="truncate font-semibold">{w.name}</p>
                          <time className="shrink-0 font-mono text-[11px] text-muted" dateTime={new Date(w.createdAt).toISOString()}>
                            {new Date(w.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          </time>
                        </div>
                        <p className="mt-1 text-sm break-words whitespace-pre-line text-fg/85">{w.message}</p>
                        <div className="mt-2 flex gap-3 text-xs text-muted">
                          <button
                            type="button"
                            onClick={() => shareWhatsApp(`${w.emoji} ${w.message}\n— ${w.name}\n\nHappy Birthday Usama Riaz! 🎂`)}
                            className="inline-flex items-center gap-1 transition-colors hover:text-[#25D366]"
                          >
                            <MessageCircle className="size-3.5" /> Share
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(w.id)}
                            className="inline-flex items-center gap-1 transition-colors hover:text-rose-400"
                            aria-label={`Delete wish from ${w.name}`}
                          >
                            <Trash2 className="size-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
          <p className="mt-4 text-center text-[11px] text-muted">Wishes are saved in this browser.</p>
        </motion.div>
      </div>
    </section>
  );
}
