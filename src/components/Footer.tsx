import React, { useState } from 'react';
import { PageView, Theme } from '../types';
import { Terminal, Github, Linkedin, Twitter, Mail, Check, ArrowRight } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: PageView) => void;
  onOpenWaitlist: () => void;
  theme?: Theme;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage, onOpenWaitlist, theme = 'light' }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const isLight = theme === 'light';

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setLoading(true);

    try {
      await fetch('/api/v1/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newsletterEmail.split('@')[0],
          email: newsletterEmail,
          is_developer: true,
          role: 'Backend Engineer',
          source: 'footer_newsletter'
        })
      });
      setSubscribed(true);
      setNewsletterEmail('');
    } catch (err) {
      console.error("Newsletter error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className={`pt-16 pb-12 border-t transition-colors ${
      isLight
        ? 'bg-[#F2ECE1] text-[#4A423A] border-[#DCD5C9]'
        : 'bg-[#0D0F0D] text-[#A0A8B0] border-[#2C3325]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Layout */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b ${
          isLight ? 'border-[#DCD5C9]' : 'border-[#2C3325]'
        }`}>
          
          {/* Brand Info - Warm Brown Logo */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className={`w-9 h-9 rounded-none border flex items-center justify-center transition-all ${
                isLight ? 'bg-[#8C5E3C]/10 border-[#8C5E3C]/30 text-[#8C5E3C]' : 'bg-[#8C5E3C]/20 border-[#8C5E3C]/40 text-[#C49A6C]'
              }`}>
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-serif font-extrabold text-2xl text-[#8C5E3C] tracking-tight">
                WaitForIt
              </span>
            </div>
            
            <p className="text-sm font-serif italic text-[#8C5E3C]">
              "Preserving Engineering Decisions."
            </p>
            
            <p className={`text-xs leading-relaxed max-w-sm ${isLight ? 'text-[#605549]' : 'text-[#A0A8B0]'}`}>
              Built for developers who believe the journey behind great software deserves to be remembered.
            </p>

            {/* Newsletter Input - Olive Button */}
            <div className="pt-2">
              <span className={`block text-xs font-serif font-bold mb-2 ${isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'}`}>
                Stay updated as we build WaitForIt in public.
              </span>
              {subscribed ? (
                <div className="flex items-center space-x-2 text-xs text-[#6B7A3D] bg-[#6B7A3D]/10 px-3.5 py-2.5 rounded-none border border-[#6B7A3D]/30 font-serif">
                  <Check className="w-4 h-4" />
                  <span>You're subscribed! Welcome to the loop.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex max-w-sm space-x-2">
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className={`text-xs rounded-none px-3.5 py-2.5 focus:outline-none flex-grow border ${
                      isLight
                        ? 'bg-white border-[#DCD5C9] text-[#1C1917] placeholder-[#786E65] focus:border-[#6B7A3D]'
                        : 'bg-[#1A1D1A] border-[#2C3325] text-white placeholder-[#A0A8B0]/60 focus:border-[#6B7A3D]'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#6B7A3D] hover:bg-[#576431] text-[#FAF8F3] text-xs px-4 py-2.5 rounded-none font-serif uppercase tracking-wider font-semibold border border-[#576431] transition-colors flex items-center space-x-1"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-3">
            <h4 className={`text-xs font-serif font-bold uppercase tracking-wider ${isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'}`}>
              Product
            </h4>
            <ul className="space-y-2 text-xs font-serif">
              <li>
                <button onClick={() => { setCurrentPage('home'); window.scrollTo(0,0); }} className="hover:text-[#8C5E3C] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('features'); window.scrollTo(0,0); }} className="hover:text-[#8C5E3C] transition-colors">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('how-it-works'); window.scrollTo(0,0); }} className="hover:text-[#8C5E3C] transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('roadmap'); window.scrollTo(0,0); }} className="hover:text-[#8C5E3C] transition-colors">
                  Roadmap
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('developers'); window.scrollTo(0,0); }} className="hover:text-[#8C5E3C] transition-colors">
                  Developers
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-3">
            <h4 className={`text-xs font-serif font-bold uppercase tracking-wider ${isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'}`}>
              Resources
            </h4>
            <ul className="space-y-2 text-xs font-serif">
              <li>
                <button onClick={() => { setCurrentPage('blog'); window.scrollTo(0,0); }} className="hover:text-[#8C5E3C] transition-colors">
                  Blog
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('contact'); window.scrollTo(0,0); }} className="hover:text-[#8C5E3C] transition-colors">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('integration-guide'); window.scrollTo(0,0); }} className="hover:text-[#8C5E3C] transition-colors">
                  Integration Guide
                </button>
              </li>
              <li>
                <span className="text-xs text-[#6B7A3D] flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-none bg-[#6B7A3D] animate-ping"></span>
                  <span>Status: Operational</span>
                </span>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('dashboard'); window.scrollTo(0,0); }} className="text-[#6B7A3D] hover:underline transition-colors flex items-center space-x-1 font-mono">
                  <span>Metrics Dashboard</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <h4 className={`text-xs font-serif font-bold uppercase tracking-wider ${isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'}`}>
              Company
            </h4>
            <ul className="space-y-2 text-xs font-serif">
              <li>
                <button onClick={() => { setCurrentPage('about'); window.scrollTo(0,0); }} className="hover:text-[#8C5E3C] transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('why-waitforit'); window.scrollTo(0,0); }} className="hover:text-[#8C5E3C] transition-colors">
                  Why WaitForIt
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('contact'); window.scrollTo(0,0); }} className="hover:text-[#8C5E3C] transition-colors">
                  Contact
                </button>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("WaitForIt respects developer privacy. Your terminal logs stay strictly confidential."); }} className="hover:text-[#8C5E3C] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert("WaitForIt terms of service."); }} className="hover:text-[#8C5E3C] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Socials & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} <span className="font-serif text-[#8C5E3C] font-bold">WaitForIt</span> Inc. All rights reserved.</p>

          <div className={`flex items-center space-x-5 ${isLight ? 'text-[#605549]' : 'text-[#A0A8B0]'}`}>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#8C5E3C] transition-colors" title="GitHub">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#8C5E3C] transition-colors" title="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#8C5E3C] transition-colors" title="X (Twitter)">
              <Twitter className="w-4 h-4" />
            </a>
            <button onClick={() => setCurrentPage('contact')} className="hover:text-[#8C5E3C] transition-colors" title="Email">
              <Mail className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

