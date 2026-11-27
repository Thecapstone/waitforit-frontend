import React from 'react';
import { PageView, Theme } from '../types';
import { WaitlistForm } from '../components/WaitlistForm';
import { CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  setCurrentPage: (page: PageView) => void;
  onOpenWaitlist: () => void;
  theme?: Theme;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentPage, onOpenWaitlist, theme = 'light' }) => {
  const isLight = theme === 'light';

  return (
    <div className={`pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 space-y-16 transition-colors ${
      isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'
    }`}>
      {/* Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#8C5E3C]">
          Company & Mission
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-[#8C5E3C] tracking-tight">
          We preserve the reasoning behind how software gets built.
        </h1>
        <p className="text-base text-[#786E65] italic font-serif">
          "Code tells us what was built. WaitForIt exists to preserve why."
        </p>
      </div>

      {/* Founder Story */}
      <div className={`border rounded-3xl p-8 sm:p-10 space-y-6 shadow-soft ${
        isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A]/70 border-[#2C3325]'
      }`}>
        <h2 className="text-2xl font-serif font-bold text-[#8C5E3C]">The Origin Story</h2>
        <div className={`space-y-4 text-sm leading-relaxed ${isLight ? 'text-[#4A423A]' : 'text-[#A0A8B0]'}`}>
          <p>
            WaitForIt began as a personal attempt to solve a problem the founder experienced while building backend systems. Months after completing each project, they realized they could no longer explain many of the engineering decisions that made it successful.
          </p>
          <p>
            That experience became the foundation for WaitForIt: developer visibility software that preserves the decisions, trade-offs, and architectural reasoning behind how engineers build. Instead of asking engineers to stop and write documentation, it fits into the workflow they already have. Log from the terminal, from the website, or simply by talking to your terminal.
          </p>
        </div>
      </div>

      {/* Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`shadow-soft p-6 rounded-2xl border space-y-2 ${
          isLight ? 'bg-white border-[#DCD5C9]' : 'bg-[#1A1D1A] border-[#2C3325]'
        }`}>
          <CheckCircle2 className="w-5 h-5 text-[#6B7A3D]" />
          <h3 className="text-base font-serif font-bold text-[#8C5E3C]">Preserve Decisions</h3>
          <p className="text-xs text-[#786E65]">Keep the decisions, trade-offs, and reasoning behind your work, not just the code.</p>
        </div>

        <div className={`shadow-soft p-6 rounded-2xl border space-y-2 ${
          isLight ? 'bg-white border-[#DCD5C9]' : 'bg-[#1A1D1A] border-[#2C3325]'
        }`}>
          <CheckCircle2 className="w-5 h-5 text-[#8C5E3C]" />
          <h3 className="text-base font-serif font-bold text-[#8C5E3C]">Make Expertise Visible</h3>
          <p className="text-xs text-[#786E65]">Help engineers show the depth of their work without exposing sensitive code.</p>
        </div>

        <div className={`shadow-soft p-6 rounded-2xl border space-y-2 ${
          isLight ? 'bg-white border-[#DCD5C9]' : 'bg-[#1A1D1A] border-[#2C3325]'
        }`}>
          <CheckCircle2 className="w-5 h-5 text-[#6B7A3D]" />
          <h3 className="text-base font-serif font-bold text-[#8C5E3C]">Keep Team Knowledge</h3>
          <p className="text-xs text-[#786E65]">Make sure institutional knowledge stays with the project when engineers move on.</p>
        </div>
      </div>

      {/* Final CTA */}
      <div className={`shadow-soft border rounded-3xl p-8 text-center space-y-6 ${
        isLight ? 'bg-[#F2ECE1] border-[#DCD5C9]' : 'bg-[#111315] border-[#2C3325]'
      }`}>
        <h3 className="text-2xl font-serif font-bold text-[#8C5E3C]">Be part of the WaitForIt story.</h3>
        <div className="max-w-md mx-auto text-left">
          <WaitlistForm source="about_page_cta" theme={theme} />
        </div>
      </div>
    </div>
  );
};

