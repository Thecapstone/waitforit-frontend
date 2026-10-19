import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Check, Sparkles, Terminal as TerminalIcon, FileText } from 'lucide-react';

interface TerminalDemoProps {
  onArticleClick?: () => void;
}

export const TerminalDemo: React.FC<TerminalDemoProps> = ({ onArticleClick }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 6);
    }, 3200);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="bg-[#111315] border border-[#1A1D21] rounded-2xl shadow-2xl overflow-hidden text-xs font-mono text-[#F3F5F7] transition-all">
      {/* Window Titlebar */}
      <div className="bg-[#1A1D21] px-4 py-3 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <span className="ml-2 text-[11px] text-[#A0A8B0] flex items-center space-x-1.5 font-sans font-medium">
            <TerminalIcon className="w-3.5 h-3.5 text-[#5E81AC]" />
            <span>terminal — WaitForIt CLI</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 rounded bg-[#111315] text-[#A0A8B0] hover:text-[#F3F5F7] text-[10px] flex items-center space-x-1 px-2 border border-white/5"
          >
            <Play className={`w-3 h-3 ${isPlaying ? 'text-[#8FAF9A]' : ''}`} />
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          
          <button
            onClick={() => setStep(0)}
            className="p-1 rounded bg-[#111315] text-[#A0A8B0] hover:text-[#F3F5F7] text-[10px] flex items-center space-x-1 px-2 border border-white/5"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Terminal Canvas */}
      <div className="p-5 sm:p-6 space-y-4 min-h-[360px] max-h-[420px] overflow-y-auto bg-[#0E1012] leading-relaxed">
        {/* Step 0: init */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[#5E81AC]">
            <span className="text-[#8FAF9A] font-bold">$</span>
            <span className="font-semibold">python -m pip install waitforit-tech</span>
          </div>
          <div className="text-[#8FAF9A] flex items-center space-x-1.5 pl-4">
            <Check className="w-3.5 h-3.5" />
            <span>CLI installed. Run wfi login to connect your account.</span>
          </div>
        </div>

        {/* Step 1: capsule create */}
        {step >= 1 && (
          <div className="space-y-1 animate-fadeIn">
            <div className="flex items-center space-x-2 text-[#5E81AC]">
              <span className="text-[#8FAF9A] font-bold">$</span>
              <span className="font-semibold">wfi login</span>
            </div>
            <div className="text-[#8FAF9A] flex items-center space-x-1.5 pl-4">
              <Check className="w-3.5 h-3.5" />
              <span>Approve the one-time code in your browser to sign in.</span>
            </div>
          </div>
        )}

        {/* Step 2: wfi log */}
        {step >= 2 && (
          <div className="space-y-2.5 animate-fadeIn">
            <div className="flex items-center space-x-2 text-[#5E81AC]">
              <span className="text-[#8FAF9A] font-bold">$</span>
              <span className="font-semibold">wfi create-capsule --title "inventory-service"</span>
            </div>
            <div className="bg-[#1A1D21]/90 border border-[#6B7A3D]/40 p-3.5 rounded-xl space-y-1 text-slate-300">
              <p className="text-[#E8C8D8] font-bold text-[11px] uppercase tracking-wider">Select the capsule</p>
              <p>wfi set-capsule "inventory-service"</p>
              <p className="text-[#A0A8B0]">New terminal logs now go to this capsule.</p>
            </div>
            <div className="text-[#8FAF9A] flex items-center space-x-1.5 pl-4">
              <Check className="w-3.5 h-3.5" />
              <span>Capsule created. Ready for logs.</span>
            </div>
          </div>
        )}

        {/* Step 3 & 4: Context collecting */}
        {step >= 3 && (
          <div className="space-y-1 text-[#E8C8D8] flex items-center space-x-2 animate-pulse pl-4 pt-1">
            <span className="text-sm">⏳</span>
            <span>wfi log --title "Redis decision" --message "Using Streams for ordered writes."</span>
          </div>
        )}

        {/* Step 5: Article generated */}
        {step >= 4 && (
          <div className="pt-2 animate-fadeIn space-y-3">
            <div className="flex items-center space-x-2 text-[#8FAF9A]">
              <Sparkles className="w-4 h-4" />
              <span className="font-bold">Search your saved logs:</span>
            </div>

            <div 
              onClick={onArticleClick}
              className="group bg-[#1A1D21] border border-[#5E81AC]/40 hover:border-[#5E81AC] p-4 rounded-xl cursor-pointer transition-all shadow-lg hover:shadow-[#5E81AC]/10"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#5E81AC]" />
                    <span className="font-bold text-sm text-[#F3F5F7] group-hover:text-[#5E81AC] transition-colors font-sans">
                      wfi search "Redis"
                    </span>
                  </div>
                  <p className="text-xs text-[#A0A8B0] font-sans line-clamp-2">
                    Search prints matching log titles, capsule names, and saved message details in your terminal.
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-[#5E81AC] font-sans pt-2 border-t border-white/5">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-[#8FAF9A]"></span>
                  <span>Matching logs found</span>
                </span>
                <span className="group-hover:translate-x-1 transition-transform font-medium">wfi --help</span>
              </div>
            </div>
          </div>
        )}

        {/* Active Cursor */}
        <div className="pt-1 flex items-center space-x-2 text-[#A0A8B0]">
          <span className="text-[#8FAF9A] font-bold">$</span>
          <span className="w-2 h-4 bg-[#5E81AC] animate-pulse"></span>
        </div>
      </div>

      {/* Footer bar */}
      <div className="bg-[#1A1D21] px-4 py-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#A0A8B0]">
        <span>Step {step + 1} of 6 — Automated Workflow</span>
        <div className="flex items-center space-x-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setStep(i); setIsPlaying(false); }}
              className={`w-2 h-2 rounded-full transition-all ${
                step === i ? 'bg-[#5E81AC] w-4' : 'bg-[#A0A8B0]/30 hover:bg-[#A0A8B0]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
