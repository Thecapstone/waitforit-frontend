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
          We're preserving the engineering journey.
        </h1>
        <p className="text-base text-[#786E65] italic font-serif">
          "Software engineering is filled with ideas that quietly disappear. WaitForIt exists to make sure they don't."
        </p>
      </div>

      {/* Founder Story */}
      <div className={`border rounded-none p-8 sm:p-10 space-y-6 shadow-sm ${
        isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A]/70 border-[#2C3325]'
      }`}>
        <h2 className="text-2xl font-serif font-bold text-[#8C5E3C]">The Origin Story</h2>
        <div className={`space-y-4 text-sm leading-relaxed ${isLight ? 'text-[#4A423A]' : 'text-[#A0A8B0]'}`}>
          <p>
            WaitForIt began as a personal attempt to solve a problem the founder experienced while building backend systems. Months after completing each project, they realized they could no longer explain many of the engineering decisions that made it successful.
          </p>
          <p>
            That experience became the foundation for WaitForIt. Today, we're building tools that help developers preserve not only their code, but the thinking that shaped it.
          </p>
        </div>
      </div>

      {/* Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-none border space-y-2 ${
          isLight ? 'bg-white border-[#DCD5C9]' : 'bg-[#1A1D1A] border-[#2C3325]'
        }`}>
          <CheckCircle2 className="w-5 h-5 text-[#6B7A3D]" />
          <h3 className="text-base font-serif font-bold text-[#8C5E3C]">Preserve Knowledge</h3>
          <p className="text-xs text-[#786E65]">Ensure no architectural decision, bug fix, or lesson is ever lost again.</p>
        </div>

        <div className={`p-6 rounded-none border space-y-2 ${
          isLight ? 'bg-white border-[#DCD5C9]' : 'bg-[#1A1D1A] border-[#2C3325]'
        }`}>
          <CheckCircle2 className="w-5 h-5 text-[#8C5E3C]" />
          <h3 className="text-base font-serif font-bold text-[#8C5E3C]">Celebrate Software</h3>
          <p className="text-xs text-[#786E65]">Celebrate thoughtful engineering and backend craftsmanship.</p>
        </div>

        <div className={`p-6 rounded-none border space-y-2 ${
          isLight ? 'bg-white border-[#DCD5C9]' : 'bg-[#1A1D1A] border-[#2C3325]'
        }`}>
          <CheckCircle2 className="w-5 h-5 text-[#6B7A3D]" />
          <h3 className="text-base font-serif font-bold text-[#8C5E3C]">Stronger Portfolios</h3>
          <p className="text-xs text-[#786E65]">Help developers build technical portfolios that showcase how they think.</p>
        </div>
      </div>

      {/* Final CTA */}
      <div className={`border rounded-none p-8 text-center space-y-6 ${
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

