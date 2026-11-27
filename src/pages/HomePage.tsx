import React from "react";
import { TerminalDemo } from "../components/TerminalDemo";
import { WaitlistForm } from "../components/WaitlistForm";
import { AuthUser, BlogPost, PageView, Theme } from "../types";
import { usePublicArticles } from "../lib/articles";
import {
  GitCommit,
  Terminal,
  BookOpen,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Database,
  Globe,
} from "lucide-react";

interface HomePageProps {
  setCurrentPage: (page: PageView) => void;
  onOpenWaitlist: () => void;
  onOpenArticle: (art?: BlogPost) => void;
  theme?: Theme;
  currentUser?: AuthUser | null;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentPage,
  onOpenWaitlist,
  onOpenArticle,
  theme = "light",
  currentUser = null,
}) => {
  const isLight = theme === "light";
  const community = usePublicArticles(Boolean(currentUser));
  const latestCommunity = community.articles.slice(0, 3);

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
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#8C5E3C]/10 border border-[#8C5E3C]/30 text-[#8C5E3C] text-xs font-serif uppercase tracking-widest font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#8C5E3C]" />
                <span>The Developer Visibility Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-serif font-extrabold tracking-tight text-[#8C5E3C] leading-[1.15]">
                When you revisit an engineering decision,{" "}
                <span
                  className={`font-serif italic font-normal block pt-1.5 ${
                    isLight ? "text-[#4A423A]" : "text-[#C5CCC0]"
                  }`}
                >
                  will you remember why you made it?
                </span>
              </h1>

              <p
                className={`text-base leading-relaxed ${isLight ? "text-[#605549]" : "text-[#A0A8B0]"}`}
              >
                Every system is a collection of trade-offs: the database you
                chose, the abstraction you introduced, the alternative you
                rejected. That reasoning lives in conversations, debugging
                sessions, and your head, and it fades long before anyone writes
                it down.
              </p>

              <p className="text-sm font-serif font-semibold border-l-2 border-[#8C5E3C] pl-3 py-1 text-[#8C5E3C]">
                WaitForIt captures the why behind your work as you build. Type
                it in your terminal, log it on the website, or just say it out
                loud, and it becomes a lasting record of how your software was
                built.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={onOpenWaitlist}
                  className="shadow-glow px-6 py-3.5 rounded-full bg-[#6B7A3D] hover:bg-[#576431] text-[#FAF8F3] text-xs font-serif uppercase tracking-widest font-bold border border-[#576431] flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Join the Waitlist</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentPage("how-it-works")}
                  className={`px-6 py-3.5 rounded-full text-xs font-serif uppercase tracking-wider font-semibold border transition-colors text-center ${
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
                  <span>Log like you commit</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6B7A3D]" />
                  <span>Type it or say it</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6B7A3D]" />
                  <span>No docs backlog</span>
                </span>
              </div>
            </div>

            {/* Right 7 cols: Terminal */}
            <div className="lg:col-span-7">
              <TerminalDemo onArticleClick={() => onOpenArticle()} />
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
              "Platform & DevOps",
              "AI Engineers",
              "Engineering Teams",
              "Technical Project Managers",
            ].map((role) => (
              <span
                key={role}
                className={`px-4 py-2 rounded-full border transition-colors flex items-center space-x-2 ${
                  isLight
                    ? "bg-white border-[#DCD5C9] text-[#2C2825]"
                    : "bg-[#1A1D1A] border-[#2C3325] text-[#F5F2EA]"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#6B7A3D]"></span>
                <span>{role}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION TWO: THE INVISIBLE PROBLEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`border rounded-3xl p-8 sm:p-12 space-y-8 shadow-soft ${
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
              Code tells us what was built. It doesn't always tell us why.
            </h2>
            <p
              className={`text-sm leading-relaxed ${isLight ? "text-[#605549]" : "text-[#A0A8B0]"}`}
            >
              Engineering is decision-making, and decisions are rarely
              isolated. One shapes the next until, together, they become the
              architecture of the whole system. The reasoning behind them
              rarely makes it into the code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div
              className={`shadow-soft p-6 rounded-2xl border space-y-2 ${
                isLight
                  ? "bg-white border-[#DCD5C9]"
                  : "bg-[#131513] border-[#2C3325]"
              }`}
            >
              <span className="text-xs text-[#8C5E3C] font-serif font-bold uppercase tracking-wider">
                01. Unwritten Reasoning
              </span>
              <h4 className="text-sm font-serif font-bold text-[#2C2825] dark:text-[#e37347]">
                It lives in your head
              </h4>
              <p className="text-xs text-[#786E65] leading-relaxed">
                Trade-offs get argued in conversations and discovered while
                debugging, then never written down anywhere.
              </p>
            </div>

            <div
              className={`shadow-soft p-6 rounded-2xl border space-y-2 ${
                isLight
                  ? "bg-white border-[#DCD5C9]"
                  : "bg-[#131513] border-[#2C3325]"
              }`}
            >
              <span className="text-xs text-[#8C5E3C] font-serif font-bold uppercase tracking-wider">
                02. Late Documentation
              </span>
              <h4 className="text-sm font-serif font-bold text-[#2C2825] dark:text-[#e37347]">
                Docs become another chore
              </h4>
              <p className="text-xs text-[#786E65] leading-relaxed">
                By the time someone gets around to writing it up, the most
                important context has already been forgotten.
              </p>
            </div>

            <div
              className={`shadow-soft p-6 rounded-2xl border space-y-2 ${
                isLight
                  ? "bg-white border-[#DCD5C9]"
                  : "bg-[#131513] border-[#2C3325]"
              }`}
            >
              <span className="text-xs text-[#8C5E3C] font-serif font-bold uppercase tracking-wider">
                03. Lost Memory
              </span>
              <h4 className="text-sm font-serif font-bold text-[#2C2825] dark:text-[#e37347]">
                Six months later, it's gone
              </h4>
              <p className="text-xs text-[#786E65] leading-relaxed">
                You spot a better approach, but first you need to know why it
                was built this way. And you can't remember.
              </p>
            </div>
          </div>

          {/* Diagram: Invisible Pipeline */}
          <div
            className={`shadow-soft p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono ${
              isLight
                ? "bg-white border-[#6B7A3D]/40"
                : "bg-[#131513] border-[#6B7A3D]/40"
            }`}
          >
            <div className="flex items-center space-x-2.5 text-[#2C2825] dark:text-[#e37347]">
              <span className="w-7 h-7 rounded-xl bg-[#8C5E3C]/10 text-[#8C5E3C] border border-[#8C5E3C]/30 flex items-center justify-center font-bold">
                1
              </span>
              <span>Decide & build</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#8C5E3C] hidden md:block" />
            <div className="flex items-center space-x-2.5 text-[#2C2825] dark:text-[#e37347]">
              <span className="w-7 h-7 rounded-xl bg-[#8C5E3C]/10 text-[#8C5E3C] border border-[#8C5E3C]/30 flex items-center justify-center font-bold">
                2
              </span>
              <span>Commit & push</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#8C5E3C] hidden md:block" />
            <div className="flex items-center space-x-2.5 text-[#2C2825] dark:text-[#e37347]">
              <span className="w-7 h-7 rounded-xl bg-[#8C5E3C]/10 text-[#8C5E3C] border border-[#8C5E3C]/30 flex items-center justify-center font-bold">
                3
              </span>
              <span>Ship to production</span>
            </div>
            <ArrowRight className="w-4 h-4 text-red-600 hidden md:block" />
            <div className="shadow-soft p-3 rounded-xl bg-red-950/10 text-red-700 dark:text-red-300 border border-red-500/30 font-serif font-medium">
              ⚠️ The why is lost
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
            You already commit your changes. With WaitForIt, you capture the
            reasoning behind them just as easily, right where you work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Git Card */}
          <div
            className={`shadow-soft p-8 rounded-3xl border space-y-5 ${
              isLight
                ? "bg-[#F2ECE1]/60 border-[#6B7A3D]"
                : "bg-[#1A1D1A]/60 border-[#6B7A3D]"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-600 flex items-center justify-center">
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
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <span>Tracks source code lines & delta diffs</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <span>Stores isolated commit messages</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
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
            className={`p-8 rounded-3xl border shadow-lift space-y-5 relative overflow-hidden ${
              isLight
                ? "bg-white border-[#6B7A3D]"
                : "bg-[#1A1D1A] border-[#6B7A3D]"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#6B7A3D]/20 border border-[#6B7A3D]/40 text-[#6B7A3D] flex items-center justify-center">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#8C5E3C]">
                  WaitForIt
                </h3>
                <p className="text-xs text-[#6B7A3D] font-serif font-semibold">
                  Developer Visibility Platform
                </p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-[#2C2825] dark:text-[#8C5E3C]">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#6B7A3D]" />
                <span>Captures decisions, trade-offs & architectural reasoning</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#6B7A3D]" />
                <span>Log by typing, or just talk to your terminal</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#6B7A3D]" />
                <span>
                  Turns your logs into detailed technical articles
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#6B7A3D]" />
                <span>
                  Shows your expertise without exposing sensitive code
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
            Why It Matters
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#8C5E3C]">
            From individual visibility to collective knowledge.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className={`shadow-soft p-6 rounded-2xl border space-y-3 ${
              isLight
                ? "bg-white border-[#DCD5C9]"
                : "bg-[#1A1D1A] border-[#2C3325]"
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#8C5E3C]/10 border border-[#8C5E3C]/30 text-[#8C5E3C] flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#2C2825] dark:text-[#8C5E3C]">
              Remember Your Own Decisions
            </h3>
            <p className="text-xs text-[#786E65] leading-relaxed">
              Revisit any decision with its context intact: what you
              considered, what you rejected, and why you settled where you did.
            </p>
          </div>

          <div
            className={`shadow-soft p-6 rounded-2xl border space-y-3 ${
              isLight
                ? "bg-white border-[#DCD5C9]"
                : "bg-[#1A1D1A] border-[#2C3325]"
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#6B7A3D]/10 border border-[#6B7A3D]/30 text-[#6B7A3D] flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#2C2825] dark:text-[#8C5E3C]">
              Make Your Expertise Visible
            </h3>
            <p className="text-xs text-[#786E65] leading-relaxed">
              Turn your logs into articles that show the depth of your work to
              clients, recruiters, and peers, without exposing sensitive code.
            </p>
          </div>

          <div
            className={`shadow-soft p-6 rounded-2xl border space-y-3 ${
              isLight
                ? "bg-white border-[#DCD5C9]"
                : "bg-[#1A1D1A] border-[#2C3325]"
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#8C5E3C]/10 border border-[#8C5E3C]/30 text-[#8C5E3C] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#2C2825] dark:text-[#8C5E3C]">
              Keep Knowledge on the Team
            </h3>
            <p className="text-xs text-[#786E65] leading-relaxed">
              When an engineer moves on, their reasoning stays. Whoever inherits
              the code inherits the why, and managers see the real progress.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION SIX: LATEST FROM PUBLIC CAPSULES (signed in) */}
      {latestCommunity.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`shadow-soft border rounded-3xl p-8 sm:p-10 space-y-6 ${
              isLight
                ? "bg-[#F2ECE1] border-[#DCD5C9]"
                : "bg-[#1A1D1A] border-[#2C3325]"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#6B7A3D] uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5" />
                  Latest From Public Capsules
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#8C5E3C]">
                  Fresh from developers' engineering journals.
                </h3>
              </div>

              <button
                onClick={() => setCurrentPage("blog")}
                className="shadow-glow px-5 py-2.5 rounded-full bg-[#6B7A3D] text-[#FAF8F3] text-xs font-serif uppercase tracking-wider font-semibold hover:bg-[#576431] transition-colors border border-[#576431]"
              >
                Read the Journal →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestCommunity.map((article) => (
                <div
                  key={article.id}
                  onClick={() => onOpenArticle(article)}
                  className={`group shadow-soft p-6 rounded-2xl cursor-pointer border hover:shadow-lift hover:-translate-y-0.5 hover:border-[#8C5E3C] transition-all space-y-3 flex flex-col justify-between ${
                    isLight
                      ? "bg-white border-[#DCD5C9]"
                      : "bg-[#131513] border-[#2C3325]"
                  }`}
                >
                  <div className="space-y-3">
                    {article.tags[0] && (
                      <span className="inline-block px-2.5 py-1 rounded-full bg-[#8C5E3C]/10 text-[#8C5E3C] text-[11px] font-serif font-bold uppercase tracking-wider">
                        {article.tags[0]}
                      </span>
                    )}
                    <h4 className="text-lg font-bold font-serif text-[#8C5E3C] group-hover:text-[#6B7A3D] transition-colors leading-snug">
                      {article.title}
                    </h4>
                    <p className="text-xs text-[#786E65] leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="pt-2 text-xs font-mono text-[#786E65] flex items-center justify-between gap-2">
                    <span className="truncate">{article.author}</span>
                    <span className="shrink-0">{article.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION SIX: PREVIEW ARTICLE CARD */}
      {latestCommunity.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`shadow-soft border rounded-3xl p-8 sm:p-10 space-y-6 ${
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
                onClick={() => onOpenArticle()}
                className="shadow-glow px-5 py-2.5 rounded-full bg-[#6B7A3D] text-[#FAF8F3] text-xs font-serif uppercase tracking-wider font-semibold hover:bg-[#576431] transition-colors border border-[#576431]"
              >
                Read Full Article →
              </button>
            </div>

            <div
              onClick={() => onOpenArticle()}
              className={`shadow-soft p-6 rounded-2xl cursor-pointer border hover:shadow-md transition-all space-y-3 ${
                isLight
                  ? "bg-white border-[#DCD5C9]"
                  : "bg-[#131513] border-[#2C3325]"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full bg-[#8C5E3C]/10 text-[#8C5E3C] text-[11px] font-serif font-bold uppercase tracking-wider">
                  Redis Streams
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#6B7A3D]/10 text-[#6B7A3D] text-[11px] font-serif font-bold uppercase tracking-wider">
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
      )}

      {/* SECTION SEVEN: FINAL CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6 pt-6">
        <div
          className={`border rounded-3xl p-8 sm:p-12 space-y-6 shadow-lift ${
            isLight
              ? "bg-[#F2ECE1] border-[#8C5E3C]/30"
              : "bg-[#1A1D1A] border-[#8C5E3C]/30"
          }`}
        >
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#8C5E3C]">
              Engineering knowledge shouldn't disappear when the work is done.
            </h2>
            <p className="text-sm text-[#786E65] max-w-xl mx-auto leading-relaxed">
              The most important part of building software isn't always what
              you ship. Sometimes, it's everything you had to figure out along
              the way. Capture it before it's forgotten.
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
