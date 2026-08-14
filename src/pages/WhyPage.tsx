import React from 'react';
import { PageView, Theme } from '../types';
import { WaitlistForm } from '../components/WaitlistForm';
import { Quote, HeartHandshake } from 'lucide-react';

interface WhyPageProps {
  setCurrentPage: (page: PageView) => void;
  onOpenWaitlist: () => void;
  theme?: Theme;
}

export const WhyPage: React.FC<WhyPageProps> = ({ setCurrentPage, onOpenWaitlist, theme = 'light' }) => {
  const isLight = theme === 'light';

  return (
    <div className={`pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 space-y-16 transition-colors ${
      isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'
    }`}>
      {/* Hero */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-none bg-[#8C5E3C]/10 border border-[#8C5E3C]/30 text-[#8C5E3C] text-xs font-serif uppercase tracking-widest font-bold">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>The Founder's Story</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-[#8C5E3C] tracking-tight">
          Why WaitForIt Exists
        </h1>

        <p className="text-base text-[#786E65] max-w-2xl mx-auto italic font-serif leading-relaxed">
          "Every company starts with a problem. WaitForIt started with a forgotten engineering decision."
        </p>
      </div>

      {/* Section One: Building */}
      <div className={`border rounded-none p-8 sm:p-10 space-y-4 shadow-sm ${
        isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A]/70 border-[#2C3325]'
      }`}>
        <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#6B7A3D]">
          Section 01 — Building
        </span>
        <h2 className="text-2xl font-serif font-bold text-[#8C5E3C]">
          It started with a backend project.
        </h2>
        <div className={`space-y-3 text-sm leading-relaxed ${isLight ? 'text-[#4A423A]' : 'text-[#A0A8B0]'}`}>
          <p>
            Earlier this year, I began building a backend-heavy application that I had spent months planning. I studied system design, experimented with different architectural patterns, and carefully considered every technical decision before writing the first line of code.
          </p>
          <p>
            By the time the backend was finally ready, I felt proud of what I had built. Then something unexpected happened.
          </p>
        </div>
      </div>

      {/* Section Two: The Realization */}
      <div className={`border rounded-none p-8 sm:p-10 space-y-4 shadow-sm ${
        isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A]/70 border-[#2C3325]'
      }`}>
        <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#8C5E3C]">
          Section 02 — The Realization
        </span>
        <h2 className="text-2xl font-serif font-bold text-[#8C5E3C]">
          I couldn't explain how I got there.
        </h2>
        <div className={`space-y-3 text-sm leading-relaxed ${isLight ? 'text-[#4A423A]' : 'text-[#A0A8B0]'}`}>
          <p>
            As I looked back through the project, I realized something important: I remembered *what* I had built, but I couldn't remember *why* I had built it that way.
          </p>
          <p>
            Countless debugging sessions, architecture experiments, and design decisions had quietly disappeared. The most valuable lessons from the project were already fading.
          </p>
        </div>
      </div>

      {/* Section Three: Searching & The Big Quote */}
      <div className={`border rounded-none p-8 sm:p-12 space-y-6 shadow-md relative overflow-hidden ${
        isLight ? 'bg-white border-[#8C5E3C]' : 'bg-[#111315] border-[#8C5E3C]'
      }`}>
        <Quote className="w-10 h-10 text-[#8C5E3C] opacity-40" />

        <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#8C5E3C] leading-snug">
          "When you take away the pretty UIs, what do backend developers use to display proof of competence?"
        </h3>

        <div className={`space-y-3 text-sm leading-relaxed border-t pt-4 ${
          isLight ? 'border-[#DCD5C9] text-[#605549]' : 'border-white/10 text-[#A0A8B0]'
        }`}>
          <p>The answers were familiar: API documentation, GitHub repositories, or building a frontend. But none of them captured the engineering journey.</p>
          <p>
            GitHub stores code. Swagger documents endpoints. Landing pages showcase products. None of them explain the decisions that shaped the software.
          </p>
        </div>
      </div>

      {/* Section Four: The Idea */}
      <div className={`border rounded-none p-8 sm:p-10 space-y-4 shadow-sm ${
        isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A]/70 border-[#2C3325]'
      }`}>
        <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#6B7A3D]">
          Section 04 — The Idea
        </span>
        <h2 className="text-2xl font-serif font-bold text-[#8C5E3C]">
          Engineering deserves memory.
        </h2>
        <div className={`space-y-3 text-sm leading-relaxed ${isLight ? 'text-[#4A423A]' : 'text-[#A0A8B0]'}`}>
          <p>
            Software isn't only the final product. It's every failed experiment, every architecture discussion, every debugging breakthrough, every trade-off, and every lesson learned.
          </p>
          <p className="text-[#8C5E3C] font-serif font-bold text-base border-l-2 border-[#6B7A3D] pl-3 py-0.5">
            Those moments deserve to be preserved. That belief became WaitForIt.
          </p>
        </div>
      </div>

      {/* Final CTA */}
      <div className={`border rounded-none p-8 text-center space-y-6 ${
        isLight ? 'bg-[#F2ECE1] border-[#DCD5C9]' : 'bg-[#111315] border-[#2C3325]'
      }`}>
        <h3 className="text-2xl font-serif font-bold text-[#8C5E3C]">Ready to preserve your engineering journey?</h3>
        <div className="max-w-md mx-auto text-left">
          <WaitlistForm source="why_page" theme={theme} />
        </div>
      </div>
    </div>
  );
};

