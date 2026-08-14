import React from 'react';
import { PageView, Theme } from '../types';
import { WaitlistForm } from '../components/WaitlistForm';
import { Hourglass } from 'lucide-react';

interface LoginPageProps {
  setCurrentPage: (page: PageView) => void;
  theme?: Theme;
}

export const LoginPage: React.FC<LoginPageProps> = ({ theme = 'light' }) => {
  const isLight = theme === 'light';

  return (
    <div className={`pt-28 pb-20 max-w-lg mx-auto px-4 space-y-8 transition-colors ${
      isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'
    }`}>
      <div className={`border rounded-none p-8 text-center space-y-6 shadow-sm relative overflow-hidden ${
        isLight ? 'bg-[#F2ECE1]/80 border-[#DCD5C9]' : 'bg-[#1A1D1A]/80 border-[#2C3325]'
      }`}>
        <div className="w-16 h-16 rounded-none bg-[#8C5E3C]/10 text-[#8C5E3C] border border-[#8C5E3C]/30 mx-auto flex items-center justify-center">
          <Hourglass className="w-8 h-8 animate-pulse text-[#8C5E3C]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#8C5E3C]">
            Private Beta Gateway
          </span>
          <h1 className="text-2xl font-serif font-extrabold text-[#8C5E3C]">
            Developer Accounts Coming Soon
          </h1>
          <p className="text-xs text-[#786E65] leading-relaxed">
            Developer accounts will open alongside the private beta. Join the waitlist today and we'll notify you as soon as registrations become available.
          </p>
        </div>

        <div className="text-left pt-2">
          <WaitlistForm source="login_page" theme={theme} />
        </div>
      </div>
    </div>
  );
};

