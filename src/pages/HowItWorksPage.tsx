import React from "react";
import { PageView, Theme } from "../types";
import { WaitlistForm } from "../components/WaitlistForm";
import {
  Terminal,
  FolderPlus,
  Code2,
  Cpu,
  BookOpen,
  Sparkles,
  Download,
  Search,
  Image as ImageIcon,
  Globe,
  PenLine,
  Lock,
  Mic,
} from "lucide-react";

interface HowItWorksProps {
  setCurrentPage: (page: PageView) => void;
  onOpenWaitlist: () => void;
  theme?: Theme;
}

/** One line in a terminal block: a command, its output, or a comment. */
type Line = { cmd?: string; out?: string; note?: string };

const TerminalBlock: React.FC<{ lines: Line[]; isLight: boolean }> = ({
  lines,
  isLight,
}) => (
  <div
    className={`shadow-soft p-4 rounded-xl border font-mono text-xs space-y-1 overflow-x-auto ${
      isLight
        ? "bg-[#212521] text-[#A8C898] border-[#323832]"
        : "bg-[#0B0C0B] text-[#A8C898] border-[#2C3325]"
    }`}
  >
    {lines.map((line, i) => (
      <p key={i} className="whitespace-pre">
        {line.note && <span className="text-[#786E65]"># {line.note}</span>}
        {line.cmd && <span className="text-[#C49A6C]">$ {line.cmd}</span>}
        {line.out && <span className="text-[#E0E5DF]">{line.out}</span>}
      </p>
    ))}
  </div>
);

export const HowItWorksPage: React.FC<HowItWorksProps> = ({ theme = "light" }) => {
  const isLight = theme === "light";
  const body = isLight ? "text-[#4A423A]" : "text-[#A0A8B0]";
  const card = `border rounded-3xl p-6 sm:p-8 space-y-4 shadow-soft transition-all ${
    isLight ? "bg-[#F2ECE1]/70 border-[#DCD5C9]" : "bg-[#1A1D1A]/70 border-[#2C3325]"
  }`;
  const divider = isLight ? "border-[#DCD5C9]" : "border-[#2C3325]";
  const code = "font-mono text-[#6B7A3D]";

  const steps: {
    step: string;
    title: string;
    subtitle: string;
    icon: React.ElementType;
    color: string;
    desc: React.ReactNode;
    terminal?: Line[];
  }[] = [
    {
      step: "01",
      title: "Install and Sign In",
      subtitle: "One package, one command: wfi.",
      icon: Download,
      color: "#8C5E3C",
      desc: (
        <>
          WaitForIt ships as a Python package (Python 3.12+). Install it with{" "}
          <code className={code}>pip</code> (or <code className={code}>pipx</code>{" "}
          to keep it isolated). <code className={code}>wfi login</code> prints a
          short code: approve it on this site while signed in, and the terminal
          is connected. Signing in from the terminal never signs you out of the
          website.
        </>
      ),
      terminal: [
        { cmd: "pip install waitforit-tech" },
        { cmd: "wfi version" },
        { out: "WaitForIt CLI v0.1.3" },
        { cmd: "wfi --help" },
        { note: "lists every command; wfi <command> --help shows its options" },
        { cmd: "wfi init" },
        { cmd: "wfi login" },
        { out: "Open this URL in your browser and approve the terminal login:" },
        { out: "Code: ABC-123" },
        { out: "Signed in as you@example.com" },
        { cmd: "wfi whoami" },
      ],
    },
    {
      step: "02",
      title: "Create a Capsule",
      subtitle: "Every project begins with a capsule.",
      icon: FolderPlus,
      color: "#6B7A3D",
      desc: (
        <>
          A capsule is the home for one project: its logs, generated articles,
          media, and engineering history. Capsules are private by default; add{" "}
          <code className={code}>--public</code> to share its articles on the
          Blog. The capsule's timezone decides when "your day" ends, which is
          when its logs are turned into articles. It defaults to your system
          timezone. Set the active capsule once and every log goes there.
        </>
      ),
      terminal: [
        {
          cmd: 'wfi create-capsule -t "Payments API" -d "Billing service rebuild"',
        },
        { out: "Created capsule: Payments API (b10d253a2f)" },
        { note: "optional: --public  --timezone Africa/Lagos  --maturity-date 2027-01-01T00:00:00Z" },
        { cmd: "wfi capsules" },
        { cmd: 'wfi set-capsule "Payments API"' },
        { cmd: "wfi check-capsule" },
        { out: "Payments API: b10d253a2f" },
      ],
    },
    {
      step: "03",
      title: "Log While You Build",
      subtitle: "Write logs directly from your terminal.",
      icon: Terminal,
      color: "#8C5E3C",
      desc: (
        <>
          Whenever you solve a problem or make a decision, run{" "}
          <code className={code}>wfi log</code>. WaitForIt detects your
          project's language and framework automatically. Write a few real
          sentences: articles are only generated from logs with enough recorded
          detail, and they never invent facts that are not in your logs.
        </>
      ),
      terminal: [
        {
          cmd: 'wfi log -t "Redis Streams" -m "Replaced polling with Redis Streams; consumer groups fixed ordering under load."',
        },
        { out: "Successfully created log 9de3b432b8 🪵📝" },
        { note: "log into a different capsule without switching" },
        { cmd: 'wfi log -t "Hotfix" -m "..." -c 777ee740fa' },
      ],
    },
    {
      step: "04",
      title: "Log by Voice",
      subtitle: "Talk to your terminal; it writes the logs.",
      icon: Mic,
      color: "#6B7A3D",
      desc: (
        <>
          Install the optional voice extra and run{" "}
          <code className={code}>wfi log -a</code>, then just talk. Speech is
          transcribed on your machine and works offline; nothing is sent until a
          log is saved. Every <code className={code}>--max-words</code> words
          (150 by default) the transcript is saved as a log at a natural pause,
          and a new one starts. Say <code className={code}>"stop logging"</code>,
          press <code className={code}>Ctrl+C</code>, or stay silent for a
          minute to save what you said and exit. The first run downloads the
          speech model (about 150 MB).
        </>
      ),
      terminal: [
        { cmd: 'pip install -U "waitforit-tech[voice]"' },
        { cmd: "wfi log -a" },
        { out: "🎙  Listening…   Words 87/150   ·   Log #1" },
        { note: 'say "stop logging", press Ctrl+C, or stay silent to save & exit' },
        { out: "Voice session ended (voice command). Saved 2 log(s) 🎙️📝" },
        { note: "optional: --max-words 80  --silence-timeout 30  --voice-model small" },
      ],
    },
    {
      step: "05",
      title: "Attach Screenshots or Recordings",
      subtitle: "Optional media, from a path or a file picker.",
      icon: ImageIcon,
      color: "#8C5E3C",
      desc: (
        <>
          Attach one image or one video to a log. Pass a path with{" "}
          <code className={code}>--image</code> /{" "}
          <code className={code}>--video</code>, or add{" "}
          <code className={code}>--gui</code> (<code className={code}>-g</code>)
          to choose a file in your system's file picker. Images: png, jpg, gif,
          webp, bmp. Videos: mp4, mov, avi, mkv, webm. Up to 100 MB. The picker
          is never required, and on a headless server you can turn it off with{" "}
          <code className={code}>WAITFORIT_NO_GUI=1</code>.
        </>
      ),
      terminal: [
        { cmd: 'wfi log -t "Latency graph" -m "p99 after the fix" --image ./p99.png' },
        { cmd: 'wfi log -t "Demo" -m "New checkout flow" --video ./demo.mp4' },
        { cmd: 'wfi log -t "Dashboard" -m "Before/after" --gui' },
      ],
    },
    {
      step: "06",
      title: "Keep Coding",
      subtitle: "Zero workflow friction.",
      icon: Code2,
      color: "#6B7A3D",
      desc: "After saving a log, keep building. No forms, no context switching. WaitForIt collects related logs in the background.",
    },
    {
      step: "07",
      title: "AI Builds the Bigger Picture",
      subtitle: "Logs grouped into complete technical articles.",
      icon: Cpu,
      color: "#8C5E3C",
      desc: "Once a day has fully ended in your capsule's timezone, WaitForIt groups that day's unused logs into a single article instead of one article per log. Thin days are merged with the following days until there is enough material. Each log is used in one article only. By default, in shared capsules each contributor's logs become their own articles.",
    },
    {
      step: "08",
      title: "Search Your Engineering Journal",
      subtitle: "Find the reasoning, not just the code.",
      icon: Search,
      color: "#6B7A3D",
      desc: (
        <>
          Every log stays searchable from the terminal across all capsules you
          can access. Narrow the search to one capsule (by title or id) or to
          logs whose title matches.
        </>
      ),
      terminal: [
        { cmd: 'wfi search "redis"' },
        { out: "Payments API / Redis Streams  (9de3b432b8)" },
        { cmd: 'wfi search "timeout" -c "Payments API" -t "hotfix"' },
      ],
    },
  ];

  const display = [
    {
      icon: BookOpen,
      title: "Your Articles page",
      desc: "Every article from capsules you own or belong to, newest first, as cards you can open to read in full: a title, the article body, and a closing conclusion. Each capsule's page shows its full log timeline alongside.",
    },
    {
      icon: PenLine,
      title: "Editable by the capsule owner",
      desc: "The capsule creator can edit an article's title, body, and conclusion directly. Edits are saved as the final version.",
    },
    {
      icon: Globe,
      title: "Public capsules on the Blog",
      desc: "Articles from public capsules also appear on the Blog for signed-in readers, credited to the author.",
    },
    {
      icon: Lock,
      title: "Private stays private",
      desc: "Articles from private capsules are only visible to that capsule's creator, members, and contributors. Capsules can also be sealed until a maturity date.",
    },
  ];

  const compare = [
    {
      label: "Terminal (wfi)",
      items: [
        "Create, list, and switch capsules",
        "Record logs with optional image or video",
        "Log by voice with wfi log -a: speech becomes logs",
        "Search logs across capsules",
        "Articles are generated automatically each day",
      ],
    },
    {
      label: "Website",
      items: [
        "Generate an article on demand from a capsule's unused logs",
        "Style or focus instructions (up to 5,000 characters), for example \"postmortem structure, explain trade-offs\"",
        "A sample article (up to 12,000 characters) whose tone and structure guide the writing; its facts are never used",
        "Read, edit, and share articles; manage capsule members",
      ],
    },
  ];

  return (
    <div
      className={`pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 space-y-16 transition-colors ${
        isLight ? "text-[#2C2825]" : "text-[#F5F2EA]"
      }`}
    >
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#6B7A3D]/10 border border-[#6B7A3D]/30 text-[#6B7A3D] text-xs font-serif uppercase tracking-widest font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Workflow Architecture</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-[#8C5E3C] tracking-tight">
          Capture the why as easily as you commit the what.
        </h1>
        <p className="text-base text-[#786E65] max-w-xl mx-auto">
          Type it or say it in your terminal, or log from the website. WaitForIt fits inside the workflow you already have.
        </p>
        <div className="max-w-sm mx-auto text-left">
          <TerminalBlock
            isLight={isLight}
            lines={[{ cmd: "pip install waitforit-tech" }, { cmd: "wfi --help" }]}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-10">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.step} className={card}>
              <div
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 ${divider}`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0"
                    style={{
                      backgroundColor: `${item.color}15`,
                      borderColor: `${item.color}40`,
                      color: item.color,
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-serif font-bold text-[#8C5E3C] uppercase tracking-wider">
                      Step {item.step}
                    </span>
                    <h2 className="text-xl font-serif font-bold text-[#2C2825] dark:text-[#8C5E3C]">
                      {item.title}
                    </h2>
                  </div>
                </div>
                <span className="text-xs text-[#6B7A3D] font-serif font-semibold bg-[#6B7A3D]/10 px-3 py-1 rounded-full border border-[#6B7A3D]/30">
                  {item.subtitle}
                </span>
              </div>
              <p className={`text-sm leading-relaxed ${body}`}>{item.desc}</p>
              {item.terminal && (
                <TerminalBlock isLight={isLight} lines={item.terminal} />
              )}
            </div>
          );
        })}
      </div>

      {/* How articles are displayed */}
      <section className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-serif font-extrabold text-[#8C5E3C]">
            How articles are displayed
          </h2>
          <p className="text-sm text-[#786E65] max-w-xl mx-auto">
            Generated articles live on the website, next to the logs they came from.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {display.map(({ icon: Icon, title, desc }) => (
            <div key={title} className={`${card} !space-y-2 !p-6`}>
              <div className="flex items-center gap-2 text-[#6B7A3D]">
                <Icon className="w-5 h-5" />
                <h3 className="font-serif font-bold text-[#8C5E3C]">{title}</h3>
              </div>
              <p className={`text-sm leading-relaxed ${body}`}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Terminal vs website */}
      <section className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-serif font-extrabold text-[#8C5E3C]">
            Terminal or website?
          </h2>
          <p className="text-sm text-[#786E65] max-w-xl mx-auto">
            Capture in the terminal. Shape the writing on the website, where you
            can guide each article's style, and add a sample article to match.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {compare.map(({ label, items }) => (
            <div key={label} className={`${card} !p-6`}>
              <h3 className="font-serif font-bold text-[#8C5E3C]">{label}</h3>
              <ul className={`text-sm leading-relaxed list-disc pl-5 space-y-1 ${body}`}>
                {items.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-xs text-center text-[#786E65]">
          On-demand generation from the website requires an active subscription.
        </p>
      </section>

      {/* Closing CTA */}
      <div
        className={`shadow-soft border rounded-3xl p-8 text-center space-y-6 ${
          isLight ? "bg-[#F2ECE1] border-[#DCD5C9]" : "bg-[#111315] border-[#2C3325]"
        }`}
      >
        <h3 className="text-2xl font-serif font-bold text-[#8C5E3C]">
          Ready to make your engineering process visible?
        </h3>
        <p className="text-xs text-[#786E65]">
          Preserve your reasoning without changing the way you build.
        </p>
        <div className="max-w-md mx-auto text-left">
          <WaitlistForm source="how_it_works_cta" theme={theme} />
        </div>
      </div>
    </div>
  );
};
