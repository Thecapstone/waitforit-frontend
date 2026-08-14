import React from 'react';
import { WaitlistForm } from './WaitlistForm';
import { X, Terminal } from 'lucide-react';
import { Theme } from '../types';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
  theme?: Theme;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose, source = 'modal', theme = 'light' }) => {
  if (!isOpen) return null;

  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div 
        className={`relative w-full max-w-lg border rounded-none p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden ${
          isLight
            ? 'bg-[#FAF8F3] border-[#DCD5C9] text-[#2C2825]'
            : 'bg-[#131513] border-[#2C3325] text-[#F5F2EA]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`flex items-center justify-between border-b pb-4 ${
          isLight ? 'border-[#DCD5C9]' : 'border-[#2C3325]'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-none border flex items-center justify-center ${
              isLight ? 'bg-[#8C5E3C]/10 border-[#8C5E3C]/30 text-[#8C5E3C]' : 'bg-[#8C5E3C]/20 border-[#8C5E3C]/40 text-[#C49A6C]'
            }`}>
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#8C5E3C]">Join the WaitForIt Waitlist</h3>
              <p className="text-xs text-[#786E65]">Get private beta access to terminal-first documentation.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-none border text-xs transition-colors ${
              isLight
                ? 'bg-[#F2ECE1] border-[#DCD5C9] text-[#605549] hover:bg-[#E8E0D2]'
                : 'bg-[#1A1D1A] border-[#2C3325] text-[#A0A8B0] hover:text-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <WaitlistForm source={source} theme={theme} onSuccess={() => {}} />
      </div>
    </div>
  );
};

