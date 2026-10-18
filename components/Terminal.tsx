"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { RotateCcw, TerminalSquare } from "lucide-react";
import { useCake } from "@/components/Providers";
import { SectionHeading } from "@/components/SectionHeading";
import { megaCelebration } from "@/lib/celebrate";
import { sfx } from "@/lib/sound";

type Tone = "fg" | "muted" | "ok" | "warn" | "info" | "kw" | "str" | "fn" | "num" | "cm" | "type" | "err";
type Seg = [Tone, string];
type Line = { kind: "cmd"; text: string } | { kind: "out"; segs: Seg[] } | { kind: "code"; n: number; segs: Seg[] };

const TONE: Record<Tone, string> = {
  fg: "text-fg",
  muted: "text-muted",
  ok: "text-primary-bright",
  warn: "text-gold",
  info: "text-cyan",
  kw: "text-[#c792ea]",
  str: "text-primary-bright",
  fn: "text-cyan",
  num: "text-orange-300",
  cm: "text-muted italic",
  type: "text-gold",
  err: "text-rose-400",
};

// --- tiny TypeScript highlighter -------------------------------------------
const TOKEN =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*")|\b(import|from|const|await|new|true|false|async|export|type)\b|\b(\d+(?:\.\d+)?)\b|([A-Za-z_]\w*)(?=\()|\b([A-Z]\w*)\b/g;

function highlight(src: string): Seg[] {
  const segs: Seg[] = [];
  let last = 0;
  for (const m of src.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) segs.push(["fg", src.slice(last, i)]);
    const tone: Tone = m[1] ? "cm" : m[2] ? "str" : m[3] ? "kw" : m[4] ? "num" : m[5] ? "fn" : "type";
    segs.push([tone, m[0]]);
    last = i + m[0].length;
  }
  if (last < src.length) segs.push(["fg", src.slice(last)]);
  return segs;
}

const SOURCE = `import { Engineer, Party } from "@life/core";

const usama = new Engineer({
  name: "Usama Riaz",
  role: "Software Engineer",
  birthday: "today",
});

const party = new Party({ guestOfHonour: usama, cake: true });
await party.lightCandles(5);
usama.level++; // another year, fully shipped
await party.celebrate({ volume: "MAX" });`;

const out = (...segs: Seg[]): Line => ({ kind: "out", segs });

const SCRIPT: Line[] = [
  { kind: "cmd", text: "git checkout -b birthday/usama" },
  out(["muted", "Switched to a new branch '"], ["ok", "birthday/usama"], ["muted", "'"]),
  { kind: "cmd", text: 'git commit -m "Happy Birthday Usama"' },
  out(["muted", "["], ["warn", "birthday/usama 1e2026b"], ["muted", "] "], ["fg", "Happy Birthday Usama"]),
  out(["muted", " 1 file changed, "], ["ok", "365 insertions(+)"], ["muted", ", "], ["err", "0 deletions(-)"]),
  { kind: "cmd", text: "cat celebrate.ts" },
  ...SOURCE.split("\n").map((l, i): Line => ({ kind: "code", n: i + 1, segs: highlight(l) })),
  { kind: "cmd", text: "npx tsx celebrate.ts" },
  out(["ok", "  ✔ "], ["fn", "party.lightCandles(5)"], ["muted", "    → "], ["fg", "5 flames burning 🕯"]),
  out(["ok", "  ✔ "], ["fn", "usama.level++"], ["muted", "            → "], ["fg", "level up! zero bugs 🎂"]),
  out(["ok", "  ✔ "], ["fn", "wishes.load()"], ["muted", "            → "], ["fg", "happiness, health, big wins"]),
  out(["ok", "  ✔ "], ["fn", "party.celebrate()"], ["muted", "        → "], ["warn", "volume: MAX 🎉"]),
  out(["ok", "  ✨ Done in 0.01s. "], ["warn", "Happy Birthday, Usama!"]),
  out(["muted", "  Type "], ["info", "cake"], ["muted", " or "], ["info", "help"], ["muted", " to explore."]),
];

type Ctx = { openCake: () => void };

const COMMANDS: Record<string, (ctx: Ctx) => Line[]> = {
  help: () => [
    out(["muted", "  available commands:"]),
    ...(
      [
        ["cake", "🎂 open the birthday cake"],
        ["party", "🎉 (try it)"],
        ["whoami", "who is this site for?"],
        ["wish", "send a birthday wish"],
        ["date", "what day is it?"],
        ["clear", "clear the screen"],
      ] as const
    ).map(([c, d]) => out(["info", `    ${c.padEnd(10)}`], ["muted", d])),
  ],
  cake: ({ openCake }) => {
    setTimeout(openCake, 300);
    return [out(["ok", "  ✔ "], ["fg", "serving cake… 🎂"])];
  },
  whoami: () => [out(["fg", "  Usama Riaz"], ["muted", " — Software Engineer & today's birthday star ⭐"])],
  wish: () => [
    out(["ok", "  ✔ "], ["fg", "wish queued for delivery 💌"]),
    out(["muted", "  scroll down to the guestbook to sign it for real"]),
  ],
  party: () => {
    megaCelebration();
    sfx.fanfare();
    sfx.partyHorn();
    sfx.firework(0.2);
    sfx.cheer(2);
    return [out(["warn", "  🎉🎉🎉 "], ["fg", "PARTY MODE ENGAGED"], ["warn", " 🎉🎉🎉"])];
  },
  date: () => [
    out(["fg", `  ${new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`]),
    out(["muted", "  …a great day to celebrate Usama"]),
  ],
  sudo: () => [out(["err", "  nice try. "], ["muted", "only the birthday boy has root today."])],
};

function Prompt() {
  return (
    <span className="shrink-0 select-none">
      <span className="text-primary-bright">usama</span>
      <span className="text-muted">@</span>
      <span className="text-cyan">birthday</span>
      <span className="text-gold"> ~ %</span>{" "}
    </span>
  );
}

function RenderLine({ line }: { line: Line }) {
  if (line.kind === "cmd") {
    return (
      <div className="flex">
        <Prompt />
        <span className="break-all text-fg">{line.text}</span>
      </div>
    );
  }
  if (line.kind === "code") {
    return (
      <div className="flex">
        <span className="w-7 shrink-0 pr-3 text-right text-white/20 select-none">{line.n}</span>
        <span className="whitespace-pre">
          {line.segs.map(([t, s], i) => (
            <span key={i} className={TONE[t]}>
              {s}
            </span>
          ))}
        </span>
      </div>
    );
  }
  return (
    <div className="whitespace-pre">
      {line.segs.map(([t, s], i) => (
        <span key={i} className={TONE[t]}>
          {s}
        </span>
      ))}
    </div>
  );
}

export function Terminal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-120px" });
  const { openCake } = useCake();

  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [run, setRun] = useState(0);
  const [input, setInput] = useState("");

  // Play the scripted session.
  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    (async () => {
      await sleep(400);
      for (const line of SCRIPT) {
        if (cancelled) return;
        if (line.kind === "cmd") {
          for (let i = 1; i <= line.text.length; i++) {
            if (cancelled) return;
            setTyping(line.text.slice(0, i));
            sfx.key();
            await sleep(28 + Math.random() * 45);
          }
          await sleep(250);
          setTyping(null);
          setLines((l) => [...l, line]);
          await sleep(350);
        } else {
          setLines((l) => [...l, line]);
          await sleep(line.kind === "code" ? 70 : 160);
        }
      }
      if (!cancelled) setDone(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [inView, run]);

  // Keep the newest output in view (scroll the terminal, not the page).
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, typing]);

  function replay() {
    setLines([]);
    setTyping(null);
    setDone(false);
    setRun((r) => r + 1);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input.trim();
    setInput("");
    if (!cmd) return;
    const key = cmd.toLowerCase().split(/\s+/)[0];
    if (key === "clear") {
      setLines([]);
      return;
    }
    const handler = COMMANDS[key];
    const result = handler
      ? handler({ openCake })
      : [out(["err", `  zsh: command not found: ${key}`], ["muted", " — try "], ["info", "help"])];
    sfx.key();
    setLines((l) => [...l, { kind: "cmd", text: cmd }, ...result]);
  }

  return (
    <section id="terminal" className="relative mx-auto max-w-5xl scroll-mt-24 px-4 py-20 sm:py-28">
      <SectionHeading
        eyebrow="// live session"
        title="Compiling a"
        accent="milestone."
        description="A celebration, written the only way a software engineer would appreciate it."
      />

      <motion.div
        ref={sectionRef}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-[#070b0e]/95 shadow-[0_40px_100px_-30px_rgb(34_211_238/0.35)]"
        onClick={() => done && inputRef.current?.focus({ preventScroll: true })}
      >
        {/* title bar */}
        <div className="flex items-center gap-3 border-b border-white/5 bg-white/[0.03] px-4 py-3">
          <div className="flex gap-2" aria-hidden>
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex flex-1 items-center justify-center gap-2 font-mono text-xs text-muted">
            <TerminalSquare className="size-3.5" />
            <span className="truncate">usama — celebrate.ts — zsh</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              replay();
            }}
            aria-label="Replay terminal session"
            className="rounded-md p-1 text-muted transition-colors hover:bg-white/5 hover:text-fg"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>

        <div
          ref={bodyRef}
          className="h-[440px] overflow-auto px-4 py-4 font-mono text-[12px] leading-relaxed sm:h-[500px] sm:px-5 sm:text-[13.5px]"
          aria-live="polite"
        >
          {lines.map((line, i) => (
            <RenderLine key={i} line={line} />
          ))}

          {typing !== null && (
            <div className="flex">
              <Prompt />
              <span className="caret break-all text-fg">{typing}</span>
            </div>
          )}

          {done && (
            <form onSubmit={submit} className="flex items-center">
              <Prompt />
              <label htmlFor="term-input" className="sr-only">
                Terminal command
              </label>
              <input
                id="term-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                enterKeyHint="send"
                placeholder="type 'help'"
                className="min-w-0 flex-1 bg-transparent text-base text-fg sm:text-[13.5px] caret-primary-bright outline-none placeholder:text-white/20"
              />
            </form>
          )}

          {!inView && <span className="caret text-muted" />}
        </div>
      </motion.div>
    </section>
  );
}
