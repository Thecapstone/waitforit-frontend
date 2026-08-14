import React from "react";
import { PageView, Theme } from "../types";
import { WaitlistForm } from "../components/WaitlistForm";
import {
  Terminal,
  Layers,
  Bot,
  History,
  Search,
  Briefcase,
} from "lucide-react";

interface FeaturesPageProps {
  setCurrentPage: (page: PageView) => void;
  onOpenWaitlist: () => void;
  theme?: Theme;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({
  setCurrentPage,
  onOpenWaitlist,
  theme = "light",
}) => {
  const isLight = theme === "light";

  const features = [
    {
      num: "01",
      title: "Terminal-First Documentation",
      subtitle: "Document your thinking without changing your workflow.",
      icon: Terminal,
      color: "#8C5E3C",
      body: "Documentation often becomes an afterthought because it interrupts active problem-solving. WaitForIt removes that friction by integrating directly into your terminal. Logging a technical decision feels as natural as writing a Git commit.",
      example: `$ wfi log\nMigrated cache invalidation to Redis Streams after identifying duplicate event processing.\n✓ Log recorded.`,
    },
    {
      num: "02",
      title: "Smart Context Building",
      subtitle: "Your logs become one coherent article.",
      icon: Layers,
      color: "#6B7A3D",
      body: "Most engineering work cannot be explained in a single paragraph. Instead of generating one noisy article per log, WaitForIt patiently gathers related engineering decisions over time before generating one complete narrative.",
      example: `Log 1 (Cache issue) + Log 2 (Streams test) + Log 3 (Benchmarking)\n↓\nGenerated: "Building Reliable Inventory Synchronization"`,
    },
    {
      num: "03",
      title: "AI That Writes Like You",
      subtitle: "Preserve your voice, not just your code.",
      icon: Bot,
      color: "#8C5E3C",
      body: "WaitForIt studies your previous engineering articles to understand your writing style. Rather than copying your words, it learns your pacing, tone, structure, and technical depth so every article feels like something you genuinely wrote.",
      example: `Style Profile: Senior Systems Engineer\nTone: Technical, Reflective, Precise\nOutput: High-fidelity engineering documentation.`,
    },
    {
      num: "04",
      title: "Engineering Timeline",
      subtitle: "Watch your projects evolve.",
      icon: History,
      color: "#6B7A3D",
      body: "Every project becomes a chronological engineering timeline. Revisit previous decisions, understand how a system evolved, and reconnect with the context behind changes that would otherwise disappear.",
      example: `Jan: Architecture → Feb: Authentication → Mar: Redis Queue → Apr: Production Deployment`,
    },
    {
      num: "05",
      title: "Searchable Knowledge Base",
      subtitle: "Never solve the same problem twice.",
      icon: Search,
      color: "#8C5E3C",
      body: "Every article becomes part of your personal engineering knowledge base. Search previous debugging sessions, architectural experiments, production incidents, and lessons learned whenever you need them.",
      example: `Query: "Redis Streams memory leak"\nFound: 2 prior incident notes with resolution steps.`,
    },
    {
      num: "06",
      title: "Engineering Portfolio",
      subtitle: "Show your thinking—not just your code.",
      icon: Briefcase,
      color: "#6B7A3D",
      body: "Recruiters can browse GitHub. Clients can look at screenshots. WaitForIt tells the story behind the software. Your portfolio becomes a collection of engineering journeys rather than isolated repositories.",
      example: `Portfolio URL: waitforit.dev/@yourname\nContains: 14 Capsules, 42 Deep Engineering Articles.`,
    },
  ];

  return (
    <div
      className={`pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-16 transition-colors ${
        isLight ? "text-[#2C2825]" : "text-[#F5F2EA]"
      }`}
    >
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#8C5E3C]">
          Platform Capabilities
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-[#8C5E3C] tracking-tight">
          Designed for the work nobody gets to see.
        </h1>
        <p className="text-base text-[#786E65]">
          The software you ship is only part of your engineering story.
          WaitForIt captures everything that happens before deployment and turns
          that invisible work into a lasting record of your expertise.
        </p>
      </div>

      {/* Feature Grids */}
      <div className="space-y-8">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.num}
              className={`border rounded-none p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-sm transition-all ${
                isLight
                  ? "bg-[#F2ECE1]/70 border-[#DCD5C9]"
                  : "bg-[#1A1D1A]/70 border-[#2C3325]"
              }`}
            >
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-none flex items-center justify-center border"
                    style={{
                      backgroundColor: `${feat.color}15`,
                      borderColor: `${feat.color}40`,
                      color: feat.color,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-serif font-bold text-[#8C5E3C] uppercase tracking-wider">
                      Feature {feat.num}
                    </span>
                    <h2 className="text-xl font-serif font-bold text-[#2C2825] dark:text-[#8C5E3C]">
                      {feat.title}
                    </h2>
                  </div>
                </div>

                <p className="text-sm font-serif font-semibold text-[#6B7A3D]">
                  {feat.subtitle}
                </p>
                <p
                  className={`text-xs leading-relaxed ${isLight ? "text-[#605549]" : "text-[#A0A8B0]"}`}
                >
                  {feat.body}
                </p>
              </div>

              <div
                className={`lg:col-span-5 p-5 rounded-none border font-mono text-xs space-y-2 ${
                  isLight
                    ? "bg-[#212521] text-[#E0E5DF] border-[#323832]"
                    : "bg-[#0B0C0B] text-[#E0E5DF] border-[#2C3325]"
                }`}
              >
                <span className="text-[10px] text-[#C49A6C] uppercase tracking-wider font-bold">
                  Workflow Example:
                </span>
                <pre className="whitespace-pre-wrap text-[#A8C898] font-mono text-[11px] leading-relaxed">
                  {feat.example}
                </pre>
              </div>
            </div>
          );
        })}
      </div>

      {/* Closing CTA */}
      <div
        className={`border rounded-none p-8 text-center space-y-6 ${
          isLight
            ? "bg-[#F2ECE1] border-[#DCD5C9]"
            : "bg-[#111315] border-[#2C3325]"
        }`}
      >
        <h3 className="text-2xl font-serif font-bold text-[#8C5E3C]">
          Every project deserves a history.
        </h3>
        <div className="max-w-md mx-auto text-left">
          <WaitlistForm source="features_page_cta" theme={theme} />
        </div>
      </div>
    </div>
  );
};
