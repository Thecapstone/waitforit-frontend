import React from "react";
import { PageView, Theme } from "../types";
import { WaitlistForm } from "../components/WaitlistForm";
import { CheckCircle2, Rocket } from "lucide-react";

interface RoadmapPageProps {
  setCurrentPage: (page: PageView) => void;
  onOpenWaitlist: () => void;
  theme?: Theme;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({
  setCurrentPage,
  onOpenWaitlist,
  theme = "light",
}) => {
  const isLight = theme === "light";

  const phases = [
    {
      phase: "Phase 1",
      title: "Foundation & Waitlist",
      status: "Live Now",
      statusColor: "#6B7A3D",
      desc: "Building the core brand identity, waitlist pipeline, welcome email automated delivery system, and community hub.",
      items: [
        "Marketing Website",
        "Waitlist Pipeline",
        "Brand Identity",
        "Developer Community",
      ],
    },
    {
      phase: "Phase 2",
      title: "Core Terminal Engine",
      status: "In Development",
      statusColor: "#8C5E3C",
      desc: "Constructing the command-line interface ($ wfi cli), capsule store, terminal logging handlers, and async queue worker.",
      items: [
        "CLI Tooling ($ wfi)",
        "Capsule Engine",
        "Terminal Logging",
        "Async Queue Worker",
      ],
    },
    {
      phase: "Phase 3",
      title: "AI Synthesis & Timeline",
      status: "Planned",
      statusColor: "#6B7A3D",
      desc: "Integrating Gemini AI synthesis engine, voice & style matching, searchable engineering knowledge base, and timeline views.",
      items: [
        "AI Article Generation",
        "Engineering Timeline",
        "Searchable Knowledge Base",
        "Writing Style Learning",
      ],
    },
    {
      phase: "Phase 4",
      title: "IDE & Team Extensions",
      status: "Future",
      statusColor: "#8C5E3C",
      desc: "Building native plugins for VSCode, JetBrains, GitHub commit hooks, and shared team capsules.",
      items: [
        "VSCode Extension",
        "JetBrains Plugin",
        "GitHub Hook Integration",
        "Team Capsules",
      ],
    },
    {
      phase: "Phase 5",
      title: "Public Launch & Enterprise",
      status: "Future",
      statusColor: "#8C5E3C",
      desc: "Public beta release, REST API, developer SDKs, integrations marketplace, and enterprise compliance.",
      items: [
        "Public Launch",
        "REST API & SDK",
        "Plugin Marketplace",
        "Enterprise Security",
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
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-none bg-[#8C5E3C]/10 border border-[#8C5E3C]/30 text-[#8C5E3C] text-xs font-serif uppercase tracking-widest font-bold">
          <Rocket className="w-3.5 h-3.5" />
          <span>Public Development Roadmap</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-[#8C5E3C] tracking-tight">
          Building WaitForIt in public.
        </h1>

        <p className="text-base text-[#786E65]">
          We're taking the same approach to building WaitForIt that we hope
          developers will use for their own projects: documenting the journey as
          we go.
        </p>
      </div>

      {/* Timeline Phases */}
      <div className="space-y-6">
        {phases.map((p) => (
          <div
            key={p.phase}
            className={`border rounded-none p-6 sm:p-8 space-y-4 shadow-sm transition-all ${
              isLight
                ? "bg-[#F2ECE1]/70 border-[#DCD5C9]"
                : "bg-[#1A1D1A]/70 border-[#2C3325]"
            }`}
          >
            <div
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b pb-4 ${
                isLight ? "border-[#DCD5C9]" : "border-[#2C3325]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xs font-serif font-bold uppercase tracking-wider px-3 py-1 rounded-none bg-[#8C5E3C]/10 text-[#8C5E3C] border border-[#8C5E3C]/30">
                  {p.phase}
                </span>
                <h2 className="text-xl font-serif font-bold text-[#2C2825] dark:text-[#8C5E3C]">
                  {p.title}
                </h2>
              </div>

              <span
                className="text-xs font-serif font-bold uppercase tracking-wider px-3 py-1 rounded-none flex items-center space-x-1.5"
                style={{
                  backgroundColor: `${p.statusColor}15`,
                  color: p.statusColor,
                  border: `1px solid ${p.statusColor}40`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-none animate-pulse"
                  style={{ backgroundColor: p.statusColor }}
                ></span>
                <span>{p.status}</span>
              </span>
            </div>

            <p
              className={`text-xs leading-relaxed ${isLight ? "text-[#605549]" : "text-[#A0A8B0]"}`}
            >
              {p.desc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {p.items.map((item) => (
                <div
                  key={item}
                  className={`p-3 rounded-none border text-xs font-mono flex items-center space-x-2 ${
                    isLight
                      ? "bg-white border-[#DCD5C9] text-[#2C2825]"
                      : "bg-[#131513] border-[#2C3325] text-[#F5F2EA]"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6B7A3D]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Final CTA */}
      <div
        className={`border rounded-none p-8 text-center space-y-6 ${
          isLight
            ? "bg-[#F2ECE1] border-[#DCD5C9]"
            : "bg-[#111315] border-[#2C3325]"
        }`}
      >
        <h3 className="text-2xl font-serif font-bold text-[#8C5E3C]">
          Follow our journey as we build in public.
        </h3>
        <div className="max-w-md mx-auto text-left">
          <WaitlistForm source="roadmap_page_cta" theme={theme} />
        </div>
      </div>
    </div>
  );
};
