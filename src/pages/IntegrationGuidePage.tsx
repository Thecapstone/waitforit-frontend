import React, { useState } from 'react';
import { PageView, Theme } from '../types';
import { WaitlistForm } from '../components/WaitlistForm';
import { Terminal, Check, Copy } from 'lucide-react';

interface IntegrationGuidePageProps {
  setCurrentPage: (page: PageView) => void;
  onOpenWaitlist: () => void;
  theme?: Theme;
}

export const IntegrationGuidePage: React.FC<IntegrationGuidePageProps> = ({ setCurrentPage, onOpenWaitlist, theme = 'light' }) => {
  const [copied, setCopied] = useState(false);
  const installCmd = 'python -m pip install waitforit-tech';
  const isLight = theme === 'light';

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const integrations = [
    {
      title: 'CLI Tooling',
      badge: 'Terminal Native',
      desc: 'Command-line tool for `$ wfi init`, `$ wfi log`, `$ wfi capsule`, and `$ wfi publish`.',
      status: 'In Alpha'
    },
    {
      title: 'VSCode Extension',
      badge: 'Editor Plugin',
      desc: 'Automatic commit message context capturing and inline engineering journal viewer.',
      status: 'Coming Soon'
    },
    {
      title: 'JetBrains Plugin',
      badge: 'IDE Plugin',
      desc: 'Native support for IntelliJ IDEA, PyCharm, WebStorm, and GoLand.',
      status: 'Coming Soon'
    },
    {
      title: 'Git Hooks',
      badge: 'Automation',
      desc: 'Post-commit hook that automatically prompts for lightweight technical notes.',
      status: 'Beta'
    },
    {
      title: 'REST API',
      badge: 'Programmatic',
      desc: 'Integrate custom CI/CD pipelines, GitHub Actions, or deployment logs into capsules.',
      status: 'Docs Preview'
    },
    {
      title: 'SDK Examples',
      badge: 'Node / Python / Go',
      desc: 'Programmatically record engineering milestones directly from backend code.',
      status: 'In Alpha'
    }
  ];

  return (
    <div className={`pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 space-y-16 transition-colors ${
      isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'
    }`}>
      {/* Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-none bg-[#8C5E3C]/10 border border-[#8C5E3C]/30 text-[#8C5E3C] text-xs font-serif uppercase tracking-widest font-bold">
          <Terminal className="w-3.5 h-3.5" />
          <span>Integration Documentation</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-[#8C5E3C] tracking-tight">
          Connect your terminal to WaitForIt
        </h1>

        <p className="text-base text-[#786E65]">
          Create an account on the website, then sign in from the terminal with the same account. The CLI can also open the website to approve a terminal session.
        </p>
      </div>

      {/* CLI Installation Box */}
      <div className={`border rounded-none p-6 sm:p-8 space-y-4 shadow-sm ${
        isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A]/70 border-[#2C3325]'
      }`}>
        <h3 className="text-base font-serif font-bold text-[#8C5E3C] flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-[#8C5E3C]" />
          <span>Install and sign in</span>
        </h3>

        <div className={`p-4 rounded-none border flex items-center justify-between text-xs font-mono ${
          isLight ? 'bg-[#212521] text-[#FAF8F3] border-[#323832]' : 'bg-[#111315] text-[#FAF8F3] border-[#2C3325]'
        }`}>
          <span className="text-[#A8C898]">$ {installCmd}</span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-none bg-[#323832] text-[#FAF8F3] hover:bg-[#6B7A3D] text-xs flex items-center space-x-1 font-serif font-bold uppercase transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className={`border p-6 space-y-3 ${isLight ? 'bg-white border-[#DCD5C9]' : 'bg-[#1A1D1A] border-[#2C3325]'}`}>
        <h3 className="font-serif font-bold text-[#8C5E3C]">First commands</h3>
        <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-7"><code>{`wfi --help\nwfi login\nwfi capsules\nwfi create-capsule --title "my-project" --description "Project notes"\nwfi set-capsule "my-project"\nwfi log --title "Cache decision" --message "Chose Redis for shared cache state."\nwfi search "Redis"`}</code></pre>
        <p className="text-xs text-[#786E65]">Website users can create an account and sign in there. Terminal users run <code>wfi login</code>, then approve the one-time code in their browser.</p>
      </div>

      {/* Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((item) => (
          <div key={item.title} className={`p-6 rounded-none border space-y-3 ${
            isLight ? 'bg-white border-[#DCD5C9]' : 'bg-[#1A1D1A] border-[#2C3325]'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#8C5E3C] bg-[#8C5E3C]/10 px-2.5 py-1 rounded-none border border-[#8C5E3C]/20">
                {item.badge}
              </span>
              <span className="text-[11px] font-mono text-[#786E65]">{item.status}</span>
            </div>

            <h4 className="text-lg font-serif font-bold text-[#8C5E3C]">{item.title}</h4>
            <p className="text-xs text-[#786E65] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Final CTA */}
      <div className={`border rounded-none p-8 text-center space-y-6 ${
        isLight ? 'bg-[#F2ECE1] border-[#DCD5C9]' : 'bg-[#111315] border-[#2C3325]'
      }`}>
        <h3 className="text-2xl font-serif font-bold text-[#8C5E3C]">Be among the first developers to integrate WaitForIt.</h3>
        <p className="text-xs text-[#786E65]">Join the waitlist below to get early access keys.</p>
        <div className="max-w-md mx-auto text-left">
          <WaitlistForm source="integration_guide_cta" theme={theme} />
        </div>
      </div>
    </div>
  );
};

