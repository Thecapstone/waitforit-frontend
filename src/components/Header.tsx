import React, { useState, useEffect } from "react";
import { AuthUser, PageView, Theme } from "../types";
import {
  LogOut,
  Shield,
  Terminal,
  ArrowRight,
  Menu,
  X,
  Sun,
  Moon,
  UserCircle,
  Settings,
  Sparkles,
} from "lucide-react";

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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: { label: string; page: PageView }[] = [
    { label: "Home", page: "home" },
    { label: "Why WaitForIt", page: "why-waitforit" },
    { label: "How It Works", page: "how-it-works" },
    { label: "Features", page: "features" },
    { label: "Developers", page: "developers" },
    { label: "Roadmap", page: "roadmap" },
    { label: "Blog", page: "blog" },
    { label: "Guide", page: "integration-guide" },
  ];

  const isLight = theme === "light";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 transition-all duration-300 ${
        scrolled ? "pt-2" : "pt-4"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-3 sm:px-5 py-2.5 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? isLight
              ? "bg-[#FAF8F3]/85 backdrop-blur-md border-[#DCD5C9]/80 shadow-soft"
              : "bg-[#171A17]/85 backdrop-blur-md border-[#2C3325] shadow-soft"
            : "bg-transparent border-transparent"
        }`}
      >
        {/* Brand Logo - Warm Brown WaitForIt with Lora Font */}
        <div
          onClick={() => {
            setCurrentPage("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 ${
              isLight
                ? "bg-[#8C5E3C]/10 border-[#8C5E3C]/30 text-[#8C5E3C] group-hover:bg-[#8C5E3C] group-hover:text-white"
                : "bg-[#8C5E3C]/20 border-[#8C5E3C]/40 text-[#C49A6C] group-hover:bg-[#C49A6C] group-hover:text-black"
            }`}
          >
            <Terminal className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-extrabold text-xl tracking-tight text-[#8C5E3C] hover:text-[#704829] transition-colors">
              WaitForIt
            </span>
            <span
              className={`text-[9px] uppercase tracking-widest font-mono ${isLight ? "text-[#786E65]" : "text-[#A0A8B0]"}`}
            >
              Developer Visibility
            </span>
          </div>
        </div>

        {/* Desktop Navigation - pill rail */}
        <nav
          className={`hidden lg:flex items-center gap-0.5 p-1 rounded-full border shadow-soft ${
            isLight
              ? "bg-[#F2ECE1]/80 border-[#DCD5C9]/80"
              : "bg-[#1A1D1A]/80 border-[#2C3325]"
          }`}
        >
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => {
                  setCurrentPage(item.page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-3.5 py-1.5 text-xs font-serif tracking-wide transition-all duration-200 rounded-full ${
                  isActive
                    ? isLight
                      ? "bg-[#6B7A3D] text-white font-medium shadow-glow"
                      : "bg-[#6B7A3D] text-white font-medium shadow-glow"
                    : isLight
                      ? "text-[#4A423A] hover:text-[#1C1917] hover:bg-[#E8E0D2]"
                      : "text-[#A0A8B0] hover:text-[#F5F2EA] hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Auth and Olive Join Waitlist CTA */}
        <div className="hidden md:flex items-center space-x-2.5">
          <button
            onClick={onToggleTheme}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:-translate-y-0.5 ${
              isLight
                ? "bg-[#F2ECE1] border-[#DCD5C9] text-[#8C5E3C] hover:bg-[#E8E0D2]"
                : "bg-[#1A1D1A] border-[#2C3325] text-[#D8E0CC] hover:bg-[#252A25]"
            }`}
            title={isLight ? "Switch to dark theme" : "Switch to light theme"}
            aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {currentUser?.role === "admin" && (
            <button
              onClick={() => {
                setCurrentPage("dashboard");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`p-2 rounded-full border text-xs flex items-center justify-center transition-all ${
                isLight
                  ? "bg-[#F2ECE1] text-[#6B7A3D] border-[#DCD5C9] hover:bg-[#E8E0D2]"
                  : "bg-[#1A1D1A] text-[#8FAF9A] border-[#2C3325] hover:bg-[#252A25]"
              }`}
              title="Admin dashboard"
              aria-label="Admin dashboard"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}

          {currentUser && <>
            <button
              onClick={() => {
                setCurrentPage("profile");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-2 rounded-full border text-xs flex items-center gap-2 transition-all ${
                isLight
                  ? "bg-[#F2ECE1] text-[#6B7A3D] border-[#DCD5C9] hover:bg-[#E8E0D2]"
                  : "bg-[#1A1D1A] text-[#8FAF9A] border-[#2C3325] hover:bg-[#252A25]"
              }`}
              title="Your profile"
              aria-label="Your profile"
            >
              <UserCircle className="w-4 h-4" /> <span>Profile</span>
            </button>
          </>}

          {currentUser && <>
            <button
              onClick={() => {
                setCurrentPage("capsules");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-2 rounded-full border text-xs transition-all ${isLight ? "bg-[#F2ECE1] text-[#6B7A3D] border-[#DCD5C9] hover:bg-[#E8E0D2]" : "bg-[#1A1D1A] text-[#8FAF9A] border-[#2C3325] hover:bg-[#252A25]"}`}
            >
              Collections
            </button>
          </>}

          {currentUser && currentUser.role !== "admin" && (
            <button
              onClick={() => {
                setCurrentPage("settings");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`p-2 rounded-full border text-xs flex items-center justify-center transition-all ${
                isLight
                  ? "bg-[#F2ECE1] text-[#6B7A3D] border-[#DCD5C9] hover:bg-[#E8E0D2]"
                  : "bg-[#1A1D1A] text-[#8FAF9A] border-[#2C3325] hover:bg-[#252A25]"
              }`}
              title="Account settings"
              aria-label="Account settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {currentUser ? (
            <button
              onClick={onLogout}
              className={`px-3 py-2 rounded-full text-xs font-mono flex items-center space-x-1.5 border transition-all ${
                isLight
                  ? "bg-[#F2ECE1] text-[#554D44] border-[#DCD5C9] hover:border-[#8C5E3C]"
                  : "bg-[#1A1D1A] text-[#A0A8B0] border-[#2C3325] hover:border-[#8C5E3C]"
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
                setCurrentPage("login");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-2 rounded-full text-xs font-mono flex items-center space-x-1.5 border transition-all ${
                currentPage === "login"
                  ? "bg-[#6B7A3D]/20 text-[#6B7A3D] border-[#6B7A3D]"
                  : isLight
                    ? "bg-[#F2ECE1] text-[#554D44] border-[#DCD5C9] hover:border-[#6B7A3D] hover:text-[#6B7A3D]"
                    : "bg-[#1A1D1A] text-[#A0A8B0] border-[#2C3325] hover:border-[#6B7A3D] hover:text-[#8FAF9A]"
              }`}
            >
              <UserCircle className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* We're Live: shimmer + twinkling sparkles, routes to How It Works */}
          <button
            onClick={() => {
              setCurrentPage("how-it-works");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="live-shimmer shadow-glow px-4 py-2 rounded-full bg-gradient-to-r from-[#8C5E3C] to-[#C49A6C] text-[#FAF8F3] text-xs font-serif uppercase tracking-wider font-semibold border border-[#8C5E3C] flex items-center space-x-2 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <Sparkles className="sparkle-twinkle w-3.5 h-3.5" />
            <span>We're Live</span>
          </button>

          {/* Olive Button for Join Waitlist */}
          <button
            onClick={onOpenWaitlist}
            className="shadow-glow px-4 py-2 rounded-full bg-[#6B7A3D] hover:bg-[#576431] text-[#FAF8F3] text-xs font-serif uppercase tracking-wider font-semibold border border-[#576431] flex items-center space-x-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Join Waitlist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile controls */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            onClick={onToggleTheme}
            aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
            className={`md:hidden p-2 rounded-full border text-xs ${
              isLight
                ? "bg-[#F2ECE1] border-[#DCD5C9] text-[#8C5E3C]"
                : "bg-[#1A1D1A] border-[#2C3325] text-[#D8E0CC]"
            }`}
          >
            {isLight ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-full border ${
              isLight
                ? "bg-[#F2ECE1] border-[#DCD5C9] text-[#2C2825]"
                : "bg-[#1A1D1A] border-[#2C3325] text-[#F5F2EA]"
            }`}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden max-w-7xl mx-auto mt-2 rounded-2xl border shadow-lift px-4 pt-4 pb-5 space-y-2 animate-fadeIn ${
            isLight
              ? "bg-[#FAF8F3]/95 backdrop-blur-md border-[#DCD5C9] text-[#2C2825]"
              : "bg-[#171A17]/95 backdrop-blur-md border-[#2C3325] text-[#F5F2EA]"
          }`}
        >
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                setCurrentPage(item.page);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-serif ${
                currentPage === item.page
                  ? "bg-[#6B7A3D] text-white font-medium"
                  : isLight
                    ? "text-[#4A423A] hover:bg-[#F2ECE1]"
                    : "text-[#A0A8B0] hover:bg-[#1A1D1A]"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div
            className={`pt-3 border-t flex flex-col space-y-2 ${isLight ? "border-[#DCD5C9]" : "border-[#2C3325]"}`}
          >
            {currentUser?.role === "admin" && (
              <button
                onClick={() => {
                  setCurrentPage("dashboard");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 rounded-xl bg-[#6B7A3D]/15 text-[#6B7A3D] text-xs font-mono border border-[#6B7A3D]/40 flex items-center justify-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </button>
            )}

            {currentUser && <>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setCurrentPage("profile");
                    setMobileMenuOpen(false);
                  }}
                  className={`rounded-full py-2.5 border text-xs font-mono flex items-center justify-center gap-2 ${isLight ? "border-[#DCD5C9] bg-[#F2ECE1] text-[#6B7A3D]" : "border-[#2C3325] bg-[#1A1D1A] text-[#8FAF9A]"}`}
                >
                  <UserCircle className="h-4 w-4" /> Profile
                </button>
                <button
                  onClick={() => {
                    setCurrentPage("capsules");
                    setMobileMenuOpen(false);
                  }}
                  className={`rounded-full py-2.5 border text-xs font-mono flex items-center justify-center gap-2 ${isLight ? "border-[#DCD5C9] bg-[#F2ECE1] text-[#6B7A3D]" : "border-[#2C3325] bg-[#1A1D1A] text-[#8FAF9A]"}`}
                >
                  Collections
                </button>
                <button
                  onClick={() => {
                    setCurrentPage("settings");
                    setMobileMenuOpen(false);
                  }}
                  className={`rounded-full py-2.5 border text-xs font-mono flex items-center justify-center gap-2 ${isLight ? "border-[#DCD5C9] bg-[#F2ECE1] text-[#6B7A3D]" : "border-[#2C3325] bg-[#1A1D1A] text-[#8FAF9A]"}`}
                >
                  <Settings className="h-4 w-4" /> Settings
                </button>
              </div>
            </>}

            {currentUser ? (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 rounded-xl bg-[#8C5E3C]/15 text-[#8C5E3C] text-xs font-mono border border-[#8C5E3C]/40 flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentPage("login");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 rounded-xl bg-[#6B7A3D]/15 text-[#6B7A3D] text-xs font-mono border border-[#6B7A3D]/40 flex items-center justify-center space-x-2"
              >
                <UserCircle className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            <button
              onClick={() => {
                setCurrentPage("how-it-works");
                setMobileMenuOpen(false);
              }}
              className="live-shimmer w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#8C5E3C] to-[#C49A6C] text-white text-xs font-serif uppercase tracking-wider font-semibold border border-[#8C5E3C] flex items-center justify-center space-x-2"
            >
              <Sparkles className="sparkle-twinkle w-4 h-4" />
              <span>We're Live</span>
            </button>

            <button
              onClick={() => {
                onOpenWaitlist();
                setMobileMenuOpen(false);
              }}
              className="shadow-glow w-full text-center py-2.5 rounded-xl bg-[#6B7A3D] hover:bg-[#576431] text-white text-xs font-serif uppercase tracking-wider font-semibold border border-[#576431]"
            >
              Join the Waitlist
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
