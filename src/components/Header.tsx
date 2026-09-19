import React, { useState, useEffect } from 'react';
import { AuthUser, PageView, Theme } from '../types';
import { LogOut, Shield, Terminal, ArrowRight, Menu, X, Sun, Moon, UserCircle } from 'lucide-react';

interface HeaderProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  onOpenWaitlist: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  currentUser?: AuthUser | null;
  authLoading?: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  setCurrentPage,
  onOpenWaitlist,
  theme,
  onToggleTheme,
  currentUser,
  authLoading = false,
  onLogout,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; page: PageView }[] = [
    { label: 'Why WaitForIt', page: 'why-waitforit' },
    { label: 'How It Works', page: 'how-it-works' },
    { label: 'Features', page: 'features' },
    { label: 'Developers', page: 'developers' },
    { label: 'Roadmap', page: 'roadmap' },
    { label: 'Blog', page: 'blog' },
    { label: 'Guide', page: 'integration-guide' },
  ];

  const isLight = theme === 'light';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isLight
            ? 'bg-[#FAF8F3]/90 backdrop-blur-md border-b border-[#DCD5C9] py-3.5 shadow-sm'
            : 'bg-[#131513]/90 backdrop-blur-md border-b border-[#2C3325] py-3.5 shadow-lg'
          : isLight
            ? 'bg-[#FAF8F3]/70 backdrop-blur-sm border-b border-[#DCD5C9]/50 py-5'
            : 'bg-[#131513]/60 backdrop-blur-sm py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo - Warm Brown WaitForIt with Lora Font */}
        <div
          onClick={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className={`w-9 h-9 rounded-none border flex items-center justify-center transition-all duration-200 ${
            isLight
              ? 'bg-[#8C5E3C]/10 border-[#8C5E3C]/30 text-[#8C5E3C] group-hover:bg-[#8C5E3C] group-hover:text-white'
              : 'bg-[#8C5E3C]/20 border-[#8C5E3C]/40 text-[#C49A6C] group-hover:bg-[#C49A6C] group-hover:text-black'
          }`}>
            <Terminal className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-extrabold text-xl tracking-tight text-[#8C5E3C] hover:text-[#704829] transition-colors">
              WaitForIt
            </span>
            <span className={`text-[9px] uppercase tracking-widest font-mono ${isLight ? 'text-[#786E65]' : 'text-[#A0A8B0]'}`}>
              Developer Visibility
            </span>
          </div>
        </div>

        {/* Desktop Navigation - Sharp borders, Editorial spacing */}
        <nav className={`hidden lg:flex items-center space-x-1 px-3 py-1.5 rounded-none border ${
          isLight
            ? 'bg-[#F2ECE1]/80 border-[#DCD5C9]'
            : 'bg-[#1A1D1A]/80 border-[#2C3325]'
        }`}>
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => {
                  setCurrentPage(item.page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1 text-xs font-serif tracking-wide transition-all duration-200 rounded-none ${
                  isActive
                    ? isLight
                      ? 'bg-[#6B7A3D] text-white font-medium shadow-xs'
                      : 'bg-[#6B7A3D] text-white font-medium'
                    : isLight
                      ? 'text-[#4A423A] hover:text-[#1C1917] hover:bg-[#E8E0D2]'
                      : 'text-[#A0A8B0] hover:text-[#F5F2EA] hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle, Auth, Olive Join Waitlist CTA */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Dark/Light Mode Switch */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-none border text-xs flex items-center justify-center transition-all ${
              isLight
                ? 'bg-[#F2ECE1] text-[#4A423A] border-[#DCD5C9] hover:bg-[#E8E0D2]'
                : 'bg-[#1A1D1A] text-[#D8E0CC] border-[#2C3325] hover:bg-[#252A25]'
            }`}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle theme"
          >
            {isLight ? <Moon className="w-4 h-4 text-[#8C5E3C]" /> : <Sun className="w-4 h-4 text-[#D8E0CC]" />}
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                setCurrentPage('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`p-2 rounded-none border text-xs flex items-center justify-center transition-all ${
                isLight
                  ? 'bg-[#F2ECE1] text-[#6B7A3D] border-[#DCD5C9] hover:bg-[#E8E0D2]'
                  : 'bg-[#1A1D1A] text-[#8FAF9A] border-[#2C3325] hover:bg-[#252A25]'
              }`}
              title="Admin dashboard"
              aria-label="Admin dashboard"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}

          {currentUser && currentUser.role !== 'admin' && (
            <button
              onClick={() => { setCurrentPage('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`p-2 rounded-none border text-xs flex items-center justify-center transition-all ${
                isLight ? 'bg-[#F2ECE1] text-[#6B7A3D] border-[#DCD5C9] hover:bg-[#E8E0D2]' : 'bg-[#1A1D1A] text-[#8FAF9A] border-[#2C3325] hover:bg-[#252A25]'
              }`}
              title="Your workspace"
              aria-label="Your workspace"
            >
              <UserCircle className="w-4 h-4" />
            </button>
          )}

          {currentUser ? (
            <button
              onClick={onLogout}
              className={`px-3 py-2 rounded-none text-xs font-mono flex items-center space-x-1.5 border transition-all ${
                isLight
                  ? 'bg-[#F2ECE1] text-[#554D44] border-[#DCD5C9] hover:border-[#8C5E3C]'
                  : 'bg-[#1A1D1A] text-[#A0A8B0] border-[#2C3325] hover:border-[#8C5E3C]'
              }`}
              title={`Signed in as ${currentUser.email}`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              disabled={authLoading}
              onClick={() => {
                setCurrentPage('login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-2 rounded-none text-xs font-mono flex items-center space-x-1.5 border transition-all ${
                currentPage === 'login'
                  ? 'bg-[#6B7A3D]/20 text-[#6B7A3D] border-[#6B7A3D]'
                  : isLight
                    ? 'bg-[#F2ECE1] text-[#554D44] border-[#DCD5C9] hover:border-[#6B7A3D] hover:text-[#6B7A3D]'
                    : 'bg-[#1A1D1A] text-[#A0A8B0] border-[#2C3325] hover:border-[#6B7A3D] hover:text-[#8FAF9A]'
              }`}
            >
              <UserCircle className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Olive Button for Join Waitlist */}
          <button
            onClick={onOpenWaitlist}
            className="px-4 py-2 rounded-none bg-[#6B7A3D] hover:bg-[#576431] text-[#FAF8F3] text-xs font-serif uppercase tracking-wider font-semibold border border-[#576431] shadow-sm flex items-center space-x-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Join Waitlist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile controls */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-none border text-xs ${
              isLight ? 'bg-[#F2ECE1] border-[#DCD5C9] text-[#8C5E3C]' : 'bg-[#1A1D1A] border-[#2C3325] text-[#D8E0CC]'
            }`}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-none border ${
              isLight ? 'bg-[#F2ECE1] border-[#DCD5C9] text-[#2C2825]' : 'bg-[#1A1D1A] border-[#2C3325] text-[#F5F2EA]'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-b px-4 pt-4 pb-6 space-y-3 animate-fadeIn ${
          isLight ? 'bg-[#FAF8F3] border-[#DCD5C9] text-[#2C2825]' : 'bg-[#131513] border-[#2C3325] text-[#F5F2EA]'
        }`}>
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                setCurrentPage(item.page);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-none text-sm font-serif ${
                currentPage === item.page
                  ? 'bg-[#6B7A3D] text-white font-medium'
                  : isLight
                    ? 'text-[#4A423A] hover:bg-[#F2ECE1]'
                    : 'text-[#A0A8B0] hover:bg-[#1A1D1A]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className={`pt-3 border-t flex flex-col space-y-2 ${isLight ? 'border-[#DCD5C9]' : 'border-[#2C3325]'}`}>
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => {
                  setCurrentPage('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 rounded-none bg-[#6B7A3D]/15 text-[#6B7A3D] text-xs font-mono border border-[#6B7A3D]/40 flex items-center justify-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </button>
            )}

            {currentUser ? (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 rounded-none bg-[#8C5E3C]/15 text-[#8C5E3C] text-xs font-mono border border-[#8C5E3C]/40 flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentPage('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 rounded-none bg-[#6B7A3D]/15 text-[#6B7A3D] text-xs font-mono border border-[#6B7A3D]/40 flex items-center justify-center space-x-2"
              >
                <UserCircle className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenWaitlist();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 rounded-none bg-[#6B7A3D] hover:bg-[#576431] text-white text-xs font-serif uppercase tracking-wider font-semibold border border-[#576431]"
            >
              Join the Waitlist
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
