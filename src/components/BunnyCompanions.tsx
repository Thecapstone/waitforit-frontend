import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Theme } from "../types";

/**
 * A decorative bunny that hops along the bottom of the screen. Hovering,
 * focusing or tapping it pauses it and shows a short line. Purely cosmetic: the overlay ignores pointer
 * events except on the bunny, honours prefers-reduced-motion, and can be
 * hidden (remembered per browser).
 */

const LINES = [
  "Spying on your logs 👀",
  "I won't tell if you give me carrots 🥕",
  "Let the decisions out of your head.",
  "It's so quiet in here. No logs?",
  "Psst… `wfi log` takes five seconds.",
  "That trade-off deserves a log.",
];

const HIDE_KEY = "wfi_hide_bunnies";
const SIZE = 44; // px
const EDGE = 16; // px gutter

function readHidden(): boolean {
  try {
    return window.localStorage.getItem(HIDE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeHidden() {
  try {
    window.localStorage.setItem(HIDE_KEY, "1");
  } catch {
    /* storage unavailable: hidden for this visit only */
  }
}

function useViewport() {
  const [size, setSize] = useState(() => ({
    w: typeof window === "undefined" ? 1024 : window.innerWidth,
  }));
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

/** Pick a line, avoiding an immediate repeat. */
function useLines() {
  const last = useRef(-1);
  return useCallback(() => {
    let i = Math.floor(Math.random() * LINES.length);
    if (i === last.current) i = (i + 1) % LINES.length;
    last.current = i;
    return LINES[i];
  }, []);
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

// ---------------------------------------------------------------- artwork

const BunnySvg: React.FC<{ isLight: boolean; sniffing?: boolean }> = ({
  isLight,
  sniffing,
}) => {
  const fur = isLight ? "#F5F2EA" : "#E8E1D3";
  const line = "#8C5E3C";
  const inner = "#E9B9A4";
  return (
    <svg
      viewBox="0 0 48 48"
      width={SIZE}
      height={SIZE}
      aria-hidden="true"
      className="drop-shadow-sm"
    >
      {/* ears */}
      <g className={sniffing ? "bunny-ears" : undefined}>
        <ellipse cx="27" cy="10" rx="3.6" ry="9" fill={fur} stroke={line} strokeWidth="1.5" transform="rotate(-12 27 10)" />
        <ellipse cx="27" cy="10" rx="1.6" ry="6" fill={inner} transform="rotate(-12 27 10)" />
        <ellipse cx="34" cy="11" rx="3.6" ry="9" fill={fur} stroke={line} strokeWidth="1.5" transform="rotate(14 34 11)" />
        <ellipse cx="34" cy="11" rx="1.6" ry="6" fill={inner} transform="rotate(14 34 11)" />
      </g>
      {/* tail + body */}
      <circle cx="9" cy="33" r="4" fill={fur} stroke={line} strokeWidth="1.5" />
      <ellipse cx="21" cy="34" rx="13" ry="10" fill={fur} stroke={line} strokeWidth="1.5" />
      {/* head */}
      <circle cx="32" cy="25" r="8.5" fill={fur} stroke={line} strokeWidth="1.5" />
      <circle cx="35" cy="23.5" r="1.4" fill="#2C2825" />
      <ellipse cx="40" cy="27" rx="1.3" ry="1" fill={inner} />
      {/* feet */}
      <ellipse cx="14" cy="43.5" rx="5" ry="2.2" fill={fur} stroke={line} strokeWidth="1.3" />
      <ellipse cx="28" cy="43.5" rx="4" ry="2" fill={fur} stroke={line} strokeWidth="1.3" />
    </svg>
  );
};

const Bubble: React.FC<{
  text: string;
  isLight: boolean;
  align: "left" | "right";
  onHide: () => void;
}> = ({ text, isLight, align, onHide }) => (
  <motion.div
    role="status"
    initial={{ opacity: 0, y: 6, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 4, scale: 0.95 }}
    transition={{ duration: 0.15 }}
    className={`absolute bottom-full mb-2 w-max max-w-[220px] rounded-2xl border px-3 py-2 text-xs font-serif shadow-soft ${
      align === "right" ? "right-0" : "left-0"
    } ${
      isLight
        ? "bg-[#FAF8F3] border-[#DCD5C9] text-[#2C2825]"
        : "bg-[#1A1D1A] border-[#2C3325] text-[#F5F2EA]"
    }`}
  >
    <p>{text}</p>
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onHide();
      }}
      className="mt-1 text-[10px] uppercase tracking-wider text-[#786E65] hover:text-[#8C5E3C] underline-offset-2 hover:underline"
    >
      hide bunny
    </button>
  </motion.div>
);

/** Shared interactive wrapper: hover/focus/tap shows a line and pauses. */
function useChatter(nextLine: () => string) {
  const [line, setLine] = useState<string | null>(null);
  const open = useCallback(() => setLine((cur) => cur ?? nextLine()), [nextLine]);
  const close = useCallback(() => setLine(null), []);
  const toggle = useCallback(
    () => setLine((cur) => (cur ? null : nextLine())),
    [nextLine],
  );
  // Hover only for real mice: touch browsers fire an emulated enter right
  // before the click, which would open and then instantly toggle closed.
  const handlers = {
    onPointerEnter: (event: React.PointerEvent) => {
      if (event.pointerType === "mouse") open();
    },
    onPointerLeave: (event: React.PointerEvent) => {
      if (event.pointerType === "mouse") close();
    },
    onFocus: open,
    onBlur: close,
    onClick: (event: React.MouseEvent) => {
      // A mouse click while hovering keeps the bubble; taps toggle it.
      if ((event.nativeEvent as PointerEvent).pointerType !== "mouse") toggle();
    },
  };
  return { line, handlers };
}

// ---------------------------------------------------------------- bunnies

const HOP_PX = 46;
const HOP_MS = 520;

const Hopper: React.FC<{
  isLight: boolean;
  reduced: boolean;
  nextLine: () => string;
  onHide: () => void;
}> = ({ isLight, reduced, nextLine, onHide }) => {
  const { w } = useViewport();
  const { line, handlers } = useChatter(nextLine);
  // Position and direction live in refs so the hop loop reads current values
  // without restarting; state mirrors them for rendering.
  const pos = useRef({ x: rand(EDGE, Math.max(EDGE, w * 0.4)), dir: 1 as 1 | -1 });
  const [x, setX] = useState(pos.current.x);
  const [dir, setDir] = useState<1 | -1>(1);
  const [hop, setHop] = useState(0); // increments to replay the hop arc
  const [sniffing, setSniffing] = useState(false);
  const paused = line !== null || reduced;

  useEffect(() => {
    if (paused) return;
    let timer: number;
    const step = () => {
      // Every so often, stop and sniff for a moment.
      if (Math.random() < 0.12) {
        setSniffing(true);
        timer = window.setTimeout(() => {
          setSniffing(false);
          step();
        }, rand(1500, 3200));
        return;
      }
      const max = Math.max(EDGE, w - SIZE - EDGE);
      const p = pos.current;
      let next = p.x + p.dir * HOP_PX;
      if (next > max || next < EDGE) {
        p.dir = p.dir === 1 ? -1 : 1; // turn around at the edge
        next = Math.min(max, Math.max(EDGE, p.x + p.dir * HOP_PX));
      }
      p.x = next;
      setX(next);
      setDir(p.dir);
      setHop((n) => n + 1);
      timer = window.setTimeout(step, HOP_MS + rand(80, 420));
    };
    timer = window.setTimeout(step, 600);
    return () => window.clearTimeout(timer);
  }, [paused, w]);

  return (
    <motion.div
      className="pointer-events-auto absolute bottom-3"
      initial={false}
      animate={{ x: Math.min(x, w - SIZE - EDGE) }}
      transition={{ duration: HOP_MS / 1000, ease: "easeInOut" }}
      style={{ left: 0 }}
    >
      <AnimatePresence>
        {line && (
          <Bubble
            text={line}
            isLight={isLight}
            align={x > w / 2 ? "right" : "left"}
            onHide={onHide}
          />
        )}
      </AnimatePresence>
      <button
        type="button"
        aria-label="Bunny: say something"
        className="block cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-[#6B7A3D]"
        {...handlers}
      >
        <motion.div
          key={hop}
          initial={{ y: 0 }}
          animate={reduced ? { y: 0 } : { y: [0, -16, 0] }}
          transition={{ duration: HOP_MS / 1000, ease: "easeOut" }}
          style={{ scaleX: dir }}
        >
          <BunnySvg isLight={isLight} sniffing={sniffing || line !== null} />
        </motion.div>
      </button>
    </motion.div>
  );
};

// ---------------------------------------------------------------- export

export const BunnyCompanions: React.FC<{ theme?: Theme }> = ({ theme = "light" }) => {
  const reduced = useReducedMotion() ?? false;
  const nextLine = useLines();
  const [hidden, setHidden] = useState(readHidden);
  const isLight = theme === "light";

  if (hidden) return null;
  const hide = () => {
    writeHidden();
    setHidden(true);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-label="Decorative bunny">
      <Hopper isLight={isLight} reduced={reduced} nextLine={nextLine} onHide={hide} />
    </div>
  );
};
