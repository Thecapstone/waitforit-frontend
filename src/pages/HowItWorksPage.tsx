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
} from "lucide-react";

interface HowItWorksProps {
  setCurrentPage: (page: PageView) => void;
  onOpenWaitlist: () => void;
  theme?: Theme;
}

export const HowItWorksPage: React.FC<HowItWorksProps> = ({
  setCurrentPage,
  onOpenWaitlist,
  theme = "light",
}) => {
  const isLight = theme === "light";

  const steps = [
    {
      step: "01",
      title: "Create a Capsule",
      subtitle: "Every project begins with a capsule.",
      icon: FolderPlus,
      color: "#8C5E3C",
      desc: "A capsule is a dedicated space for everything related to a single software project—its logs, generated articles, supporting media, and engineering history. Whether building an API, library, or microservice, each project has its own timeline.",
    },
    {
      step: "02",
      title: "Log While You Build",
      subtitle: "Write logs directly from your terminal.",
      icon: Terminal,
      color: "#6B7A3D",
      desc: "Instead of opening a documentation tool, simply run `$ wfi log` whenever you solve a problem or make an architectural decision. Logs are lightweight by design and capture thoughts while fresh.",
    },
    {
      step: "03",
      title: "Keep Coding",
      subtitle: "Zero workflow friction.",
      icon: Code2,
      color: "#8C5E3C",
      desc: "After saving your log, continue building. No additional forms, no context switching, and no interruptions. WaitForIt quietly collects related logs over time.",
    },
    {
      step: "04",
      title: "AI Builds the Bigger Picture",
      subtitle: "Smart context grouping into complete technical articles.",
      icon: Cpu,
      color: "#6B7A3D",
      desc: "Rather than generating an article for every individual log, WaitForIt intelligently groups related engineering entries over time into a single, cohesive narrative written in your voice.",
    },
    {
      step: "05",
      title: "Build a Searchable Engineering Journal",
      subtitle: "Knowledge grows alongside your software.",
      icon: BookOpen,
      color: "#8C5E3C",
      desc: "Every generated article becomes part of your personal engineering knowledge base. Months later, revisit not just the code, but the reasoning and lessons behind it.",
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
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-none bg-[#6B7A3D]/10 border border-[#6B7A3D]/30 text-[#6B7A3D] text-xs font-serif uppercase tracking-widest font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Workflow Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-[#8C5E3C] tracking-tight">
          Built around the way developers already work.
        </h1>

        <p className="text-base text-[#786E65] max-w-xl mx-auto">
          WaitForIt doesn't replace your workflow. It quietly fits inside it.
        </p>
      </div>

      {/* Steps Timeline */}
      <div className="space-y-10 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className={`border rounded-none p-6 sm:p-8 space-y-4 shadow-sm transition-all ${
                isLight
                  ? "bg-[#F2ECE1]/70 border-[#DCD5C9]"
                  : "bg-[#1A1D1A]/70 border-[#2C3325]"
              }`}
            >
              <div
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 ${
                  isLight ? "border-[#DCD5C9]" : "border-[#2C3325]"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-none flex items-center justify-center border flex-shrink-0"
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

                <span className="text-xs text-[#6B7A3D] font-serif font-semibold bg-[#6B7A3D]/10 px-3 py-1 rounded-none border border-[#6B7A3D]/30">
                  {item.subtitle}
                </span>
              </div>

              <p
                className={`text-sm leading-relaxed ${isLight ? "text-[#4A423A]" : "text-[#A0A8B0]"}`}
              >
                {item.desc}
              </p>

              {idx === 1 && (
                <div
                  className={`p-4 rounded-none border font-mono text-xs space-y-1 ${
                    isLight
                      ? "bg-[#212521] text-[#A8C898] border-[#323832]"
                      : "bg-[#0B0C0B] text-[#A8C898] border-[#2C3325]"
                  }`}
                >
                  <p className="text-[#C49A6C]">$ wfi log</p>
                  <p className="text-[#E0E5DF]">
                    Replaced polling with Redis Streams. Improved ordering
                    guarantees under load.
                  </p>
                  <p className="text-[#A8C898]">✓ Log recorded instantly.</p>
                </div>
              )}
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
          Ready to make your engineering process visible?
        </h3>
        <p className="text-xs text-[#786E65]">
          Start documenting your work without changing the way you build.
        </p>
        <div className="max-w-md mx-auto text-left">
          <WaitlistForm source="how_it_works_cta" theme={theme} />
        </div>
      </div>
    </div>
  );
};
