import React from "react";
import { TerminalDemo } from "../components/TerminalDemo";
import { WaitlistForm } from "../components/WaitlistForm";
import { PageView, Theme } from "../types";
import {
  GitCommit,
  Terminal,
  BookOpen,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Database,
} from "lucide-react";

interface HomePageProps {
  setCurrentPage: (page: PageView) => void;
  onOpenWaitlist: () => void;
  onOpenArticle: () => void;
  theme?: Theme;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentPage,
  onOpenWaitlist,
  onOpenArticle,
  theme = "light",
}) => {
  const isLight = theme === "light";

  return (
    <div
      className={`space-y-24 pb-20 transition-colors ${
        isLight ? "text-[#211D1A]" : "text-[#F5F2EA]"
      }`}
    >
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Subtle background grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#8C5E3C 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left 5 cols: Copy & Buttons */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-none bg-[#8C5E3C]/10 border border-[#8C5E3C]/30 text-[#8C5E3C] text-xs font-serif uppercase tracking-widest font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#8C5E3C]" />
                <span>The Developer Visibility Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-serif font-extrabold tracking-tight text-[#8C5E3C] leading-[1.15]">
                Every backend engineer has a story.{" "}
                <span
                  className={`font-serif italic font-normal block pt-1.5 ${
                    isLight ? "text-[#4A423A]" : "text-[#C5CCC0]"
                  }`}
                >
                  Most of it disappears.
                </span>
              </h1>

              <p
                className={`text-base leading-relaxed ${isLight ? "text-[#605549]" : "text-[#A0A8B0]"}`}
              >
                Every database decision, architectural trade-off, debugging
                breakthrough, and engineering lesson contributes to the software
                you build. Yet when the product ships, almost all of that work
                becomes invisible.
              </p>

              <p className="text-sm font-serif font-semibold border-l-2 border-[#8C5E3C] pl-3 py-1 text-[#8C5E3C]">
                WaitForIt helps you capture your engineering journey directly
                from your terminal and transform it into a living record of how
                your software was built.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={onOpenWaitlist}
                  className="px-6 py-3.5 rounded-none bg-[#6B7A3D] hover:bg-[#576431] text-[#FAF8F3] text-xs font-serif uppercase tracking-widest font-bold border border-[#576431] shadow-md flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Join the Waitlist</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentPage("how-it-works")}
                  className={`px-6 py-3.5 rounded-none text-xs font-serif uppercase tracking-wider font-semibold border transition-colors text-center ${
                    isLight
                      ? "bg-[#F2ECE1] border-[#DCD5C9] text-[#2C2825] hover:bg-[#E8E0D2]"
                      : "bg-[#1A1D1A] border-[#2C3325] text-[#F5F2EA] hover:bg-[#252B25]"
                  }`}
                >
                  See How It Works
                </button>
              </div>

              <div
                className={`pt-2 flex items-center space-x-4 text-xs font-mono ${
                  isLight ? "text-[#786E65]" : "text-[#A0A8B0]"
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6B7A3D]" />
                  <span>No IDE switching</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6B7A3D]" />
                  <span>No manual docs</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6B7A3D]" />
                  <span>No interruptions</span>
                </span>
              </div>
            </div>

            {/* Right 7 cols: Terminal */}
            <div className="lg:col-span-7">
              <TerminalDemo onArticleClick={onOpenArticle} />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section
        className={`py-8 border-y ${
          isLight
            ? "border-[#DCD5C9] bg-[#F2ECE1]/60"
            : "border-[#2C3325] bg-[#0D0F0D]/60"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs uppercase tracking-widest text-[#8C5E3C] font-serif font-bold">
            Built Specifically For
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono">
            {[
              "Backend Engineers",
              "Platform Engineers",
              "DevOps",
              "AI Engineers",
              "Open Source Maintainers",
            ].map((role) => (
              <span
                key={role}
                className={`px-4 py-2 rounded-none border transition-colors flex items-center space-x-2 ${
                  isLight
                    ? "bg-white border-[#DCD5C9] text-[#2C2825]"
                    : "bg-[#1A1D1A] border-[#2C3325] text-[#F5F2EA]"
                }`}
              >
                <span className="w-2 h-2 rounded-none bg-[#6B7A3D]"></span>
                <span>{role}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION TWO: THE INVISIBLE PROBLEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`border rounded-none p-8 sm:p-12 space-y-8 shadow-sm ${
            isLight
              ? "bg-[#F2ECE1]/70 border-[#DCD5C9]"
              : "bg-[#1A1D1A]/70 border-[#2C3325]"
          }`}
        >
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#6B7A3D]">
              The Core Problem
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#8C5E3C]">
              Backend engineering is invisible.
            </h2>
            <p
              className={`text-sm leading-relaxed ${isLight ? "text-[#605549]" : "text-[#A0A8B0]"}`}
            >
              A frontend interface can showcase months of design and engineering
              effort in a single screenshot. Backend engineering doesn't have
              that luxury.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div
              className={`p-6 rounded-none border space-y-2 ${
                isLight
                  ? "bg-white border-[#DCD5C9]"
                  : "bg-[#131513] border-[#2C3325]"
              }`}
            >
              <span className="text-xs text-[#8C5E3C] font-serif font-bold uppercase tracking-wider">
                01. Hidden Depth
              </span>
              <h4 className="text-sm font-serif font-bold text-[#2C2825] dark:text-[#e37347]">
                Clients don't see migrations
              </h4>
              <p className="text-xs text-[#786E65] leading-relaxed">
                Database indexes, lock strategies, and transaction boundaries
                disappear after deployment.
              </p>
            </div>

            <div
              className={`p-6 rounded-none border space-y-2 ${
                isLight
                  ? "bg-white border-[#DCD5C9]"
                  : "bg-[#131513] border-[#2C3325]"
              }`}
            >
              <span className="text-xs text-[#8C5E3C] font-serif font-bold uppercase tracking-wider">
                02. Unread Details
              </span>
              <h4 className="text-sm font-serif font-bold text-[#2C2825] dark:text-[#e37347]">
                Recruiters don't read PRs
              </h4>
              <p className="text-xs text-[#786E65] leading-relaxed">
                Pull requests show what lines changed, but obscure the reasoning
                behind technical trade-offs.
              </p>
            </div>

            <div
              className={`p-6 rounded-none border space-y-2 ${
                isLight
                  ? "bg-white border-[#DCD5C9]"
                  : "bg-[#131513] border-[#2C3325]"
              }`}
            >
              <span className="text-xs text-[#8C5E3C] font-serif font-bold uppercase tracking-wider">
                03. Lost Memory
              </span>
              <h4 className="text-sm font-serif font-bold text-[#2C2825] dark:text-[#e37347]">
                Context fades over time
              </h4>
              <p className="text-xs text-[#786E65] leading-relaxed">
                Even you will struggle to remember why a problem was solved a
                particular way six months later.
              </p>
            </div>
          </div>

          {/* Diagram: Invisible Pipeline */}
          <div
            className={`p-6 rounded-none border flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono ${
              isLight
                ? "bg-white border-[#6B7A3D]/40"
                : "bg-[#131513] border-[#6B7A3D]/40"
            }`}
          >
            <div className="flex items-center space-x-2.5 text-[#2C2825] dark:text-[#e37347]">
              <span className="w-7 h-7 rounded-none bg-[#8C5E3C]/10 text-[#8C5E3C] border border-[#8C5E3C]/30 flex items-center justify-center font-bold">
                1
              </span>
              <span>Developer writes code</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#8C5E3C] hidden md:block" />
            <div className="flex items-center space-x-2.5 text-[#2C2825] dark:text-[#e37347]">
              <span className="w-7 h-7 rounded-none bg-[#8C5E3C]/10 text-[#8C5E3C] border border-[#8C5E3C]/30 flex items-center justify-center font-bold">
                2
              </span>
              <span>Git Commit & Push</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#8C5E3C] hidden md:block" />
            <div className="flex items-center space-x-2.5 text-[#2C2825] dark:text-[#e37347]">
              <span className="w-7 h-7 rounded-none bg-[#8C5E3C]/10 text-[#8C5E3C] border border-[#8C5E3C]/30 flex items-center justify-center font-bold">
                3
              </span>
              <span>Production Release</span>
            </div>
            <ArrowRight className="w-4 h-4 text-red-600 hidden md:block" />
            <div className="p-3 rounded-none bg-red-950/10 text-red-700 dark:text-red-300 border border-red-500/30 font-serif font-medium">
              ⚠️ Context lost between commits
            </div>
          </div>
        </div>
      </section>

      {/* SECTION THREE: THE MISSING LAYER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#6B7A3D]">
            The Missing Layer
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#8C5E3C]">
            Git tracks your code.{" "}
            <span className="text-[#6B7A3D] italic">
              WaitForIt tracks your thinking.
            </span>
          </h2>
          <p
            className={`text-sm ${isLight ? "text-[#605549]" : "text-[#A0A8B0]"}`}
          >
            Git tells you what changed. WaitForIt explains why it changed —
            preserved alongside the software that inspired it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Git Card */}
          <div
            className={`p-8 rounded-none border space-y-5 ${
              isLight
                ? "bg-[#F2ECE1]/60 border-[#6B7A3D]"
                : "bg-[#1A1D1A]/60 border-[#6B7A3D]"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-none bg-orange-500/10 border border-orange-500/30 text-orange-600 flex items-center justify-center">
                <GitCommit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#2C2825] dark:text-[#8C5E3C]">
                  Git
                </h3>
                <p className="text-xs text-[#786E65]">
                  Source Code Version Control
                </p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-[#605549] dark:text-[#8C5E3C]">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-none bg-orange-500"></span>
                <span>Tracks source code lines & delta diffs</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-none bg-orange-500"></span>
                <span>Stores isolated commit messages</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-none bg-orange-500"></span>
                <span>Great for team synchronization</span>
              </li>
              <li className="flex items-center space-x-2 text-red-600 font-serif">
                <span>
                  ✕ Does not preserve technical reasoning or debugging context
                </span>
              </li>
            </ul>
          </div>

          {/* WaitForIt Card */}
          <div
            className={`p-8 rounded-none border shadow-md space-y-5 relative overflow-hidden ${
              isLight
                ? "bg-white border-[#6B7A3D]"
                : "bg-[#1A1D1A] border-[#6B7A3D]"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-none bg-[#6B7A3D]/20 border border-[#6B7A3D]/40 text-[#6B7A3D] flex items-center justify-center">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#8C5E3C]">
                  WaitForIt
                </h3>
                <p className="text-xs text-[#6B7A3D] font-serif font-semibold">
                  Engineering Journal Platform
                </p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-[#2C2825] dark:text-[#8C5E3C]">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#6B7A3D]" />
                <span>Tracks architecture decisions & trade-offs</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#6B7A3D]" />
                <span>Captures debugging sessions while coding</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#6B7A3D]" />
                <span>
                  AI synthesizes terminal logs into polished technical articles
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#6B7A3D]" />
                <span>
                  Builds a searchable technical portfolio automatically
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION FIVE: WHY IT MATTERS (3 CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#8C5E3C]">
            Value Proposition
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#8C5E3C]">
            Why It Matters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className={`p-6 rounded-none border space-y-3 ${
              isLight
                ? "bg-white border-[#DCD5C9]"
                : "bg-[#1A1D1A] border-[#2C3325]"
            }`}
          >
            <div className="w-9 h-9 rounded-none bg-[#8C5E3C]/10 border border-[#8C5E3C]/30 text-[#8C5E3C] flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#2C2825] dark:text-[#8C5E3C]">
              Preserve Engineering Decisions
            </h3>
            <p className="text-xs text-[#786E65] leading-relaxed">
              Remember not only what you built, but why you built it that way.
              Save your future team hundreds of onboarding hours.
            </p>
          </div>

          <div
            className={`p-6 rounded-none border space-y-3 ${
              isLight
                ? "bg-white border-[#DCD5C9]"
                : "bg-[#1A1D1A] border-[#2C3325]"
            }`}
          >
            <div className="w-9 h-9 rounded-none bg-[#6B7A3D]/10 border border-[#6B7A3D]/30 text-[#6B7A3D] flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#2C2825] dark:text-[#8C5E3C]">
              Build Technical Credibility
            </h3>
            <p className="text-xs text-[#786E65] leading-relaxed">
              Show clients, recruiters, and teammates the deep engineering
              thinking behind your work—not just the finished UI.
            </p>
          </div>

          <div
            className={`p-6 rounded-none border space-y-3 ${
              isLight
                ? "bg-white border-[#DCD5C9]"
                : "bg-[#1A1D1A] border-[#2C3325]"
            }`}
          >
            <div className="w-9 h-9 rounded-none bg-[#8C5E3C]/10 border border-[#8C5E3C]/30 text-[#8C5E3C] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#2C2825] dark:text-[#8C5E3C]">
              Learn From Yourself
            </h3>
            <p className="text-xs text-[#786E65] leading-relaxed">
              Your future self becomes one of your most valuable readers. Search
              your past debugging breakthroughs whenever needed.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION SIX: PREVIEW ARTICLE CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`border rounded-none p-8 sm:p-10 space-y-6 ${
            isLight
              ? "bg-[#F2ECE1] border-[#DCD5C9]"
              : "bg-[#1A1D1A] border-[#2C3325]"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-serif font-bold text-[#6B7A3D] uppercase tracking-wider">
                Sample Generated Journal Entry
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#8C5E3C]">
                Every project becomes a living engineering journal.
              </h3>
            </div>

            <button
              onClick={onOpenArticle}
              className="px-5 py-2.5 rounded-none bg-[#6B7A3D] text-[#FAF8F3] text-xs font-serif uppercase tracking-wider font-semibold hover:bg-[#576431] transition-colors border border-[#576431]"
            >
              Read Full Article →
            </button>
          </div>

          <div
            onClick={onOpenArticle}
            className={`p-6 rounded-none cursor-pointer border hover:shadow-md transition-all space-y-3 ${
              isLight
                ? "bg-white border-[#DCD5C9]"
                : "bg-[#131513] border-[#2C3325]"
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-none bg-[#8C5E3C]/10 text-[#8C5E3C] text-[11px] font-serif font-bold uppercase tracking-wider">
                Redis Streams
              </span>
              <span className="px-2.5 py-1 rounded-none bg-[#6B7A3D]/10 text-[#6B7A3D] text-[11px] font-serif font-bold uppercase tracking-wider">
                Architecture
              </span>
            </div>

            <h4 className="text-lg font-bold font-serif text-[#8C5E3C]">
              Building Reliable Inventory Synchronization with Redis Streams
            </h4>

            <p className="text-xs text-[#786E65] leading-relaxed line-clamp-2">
              Today started with a frustrating discovery. Under concurrent
              inventory updates, optimistic locking proved insufficient for
              real-time race prevention. Here is how we redesigned our stream
              consumer pipeline...
            </p>

            <div className="pt-2 text-xs font-serif font-bold text-[#6B7A3D] flex items-center justify-between">
              <span>View full technical breakdown & terminal logs</span>
              <span>Click to view →</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION SEVEN: FINAL CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6 pt-6">
        <div
          className={`border rounded-none p-8 sm:p-12 space-y-6 shadow-md ${
            isLight
              ? "bg-[#F2ECE1] border-[#8C5E3C]/30"
              : "bg-[#1A1D1A] border-[#8C5E3C]/30"
          }`}
        >
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#8C5E3C]">
              Great software deserves a better story.
            </h2>
            <p className="text-sm text-[#786E65] max-w-xl mx-auto leading-relaxed">
              Backend engineering is full of invisible moments that shape every
              successful product. Capture those moments before they're
              forgotten. Join the developers building a more visible engineering
              future.
            </p>
          </div>

          <div className="max-w-md mx-auto pt-2 text-left">
            <WaitlistForm source="home_final_cta" theme={theme} />
          </div>
        </div>
      </section>
    </div>
  );
};
