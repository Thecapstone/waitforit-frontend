import React, { useState } from "react";
import { PageView, Theme } from "../types";
import { FAQ_ITEMS } from "../data/initialData";
import {
  Mail,
  Send,
  ChevronDown,
  Check,
  MessageSquare,
  Github,
  Twitter,
} from "lucide-react";

interface ContactPageProps {
  setCurrentPage: (page: PageView) => void;
  theme?: Theme;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  theme = "light",
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const isLight = theme === "light";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSent(true);
  };

  return (
    <div
      className={`pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 space-y-16 transition-colors ${
        isLight ? "text-[#2C2825]" : "text-[#F5F2EA]"
      }`}
    >
      {/* Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#8C5E3C]">
          Get In Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-[#8C5E3C] tracking-tight">
          We'd love to hear from you.
        </h1>
        <p className="text-base text-[#786E65]">
          Whether you're interested in the private beta, partnerships, or simply
          want to share your thoughts, we'd love to connect.
        </p>
      </div>

      {/* Contact Form & Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div
          className={`lg:col-span-7 border rounded-none p-6 sm:p-8 space-y-4 shadow-sm ${
            isLight
              ? "bg-[#F2ECE1]/70 border-[#DCD5C9]"
              : "bg-[#1A1D1A]/70 border-[#2C3325]"
          }`}
        >
          <h2 className="text-xl font-serif font-bold text-[#8C5E3C] flex items-center space-x-2">
            <Mail className="w-5 h-5 text-[#8C5E3C]" />
            <span>Send Us a Message</span>
          </h2>

          {sent ? (
            <div className="p-6 bg-[#6B7A3D]/10 border border-[#6B7A3D]/30 rounded-none text-center space-y-3">
              <div className="w-12 h-12 rounded-none bg-[#6B7A3D]/20 text-[#6B7A3D] mx-auto flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#8C5E3C]">
                Message Sent!
              </h3>
              <p className="text-xs text-[#786E65]">
                Thank you, {name}. We'll get back to you at {email} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-serif font-bold text-[#8C5E3C]">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full border rounded-none px-3.5 py-2.5 focus:outline-none focus:border-[#6B7A3D] ${
                    isLight
                      ? "bg-white border-[#DCD5C9] text-[#2C2825]"
                      : "bg-[#131513] border-[#2C3325] text-[#F5F2EA]"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="block font-serif font-bold text-[#8C5E3C]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border rounded-none px-3.5 py-2.5 focus:outline-none focus:border-[#6B7A3D] ${
                    isLight
                      ? "bg-white border-[#DCD5C9] text-[#2C2825]"
                      : "bg-[#131513] border-[#2C3325] text-[#F5F2EA]"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="block font-serif font-bold text-[#8C5E3C]">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Private beta query / Partnership"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={`w-full border rounded-none px-3.5 py-2.5 focus:outline-none focus:border-[#6B7A3D] ${
                    isLight
                      ? "bg-white border-[#DCD5C9] text-[#2C2825]"
                      : "bg-[#131513] border-[#2C3325] text-[#F5F2EA]"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="block font-serif font-bold text-[#8C5E3C]">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about your team or project..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full border rounded-none px-3.5 py-2.5 focus:outline-none focus:border-[#6B7A3D] ${
                    isLight
                      ? "bg-white border-[#DCD5C9] text-[#2C2825]"
                      : "bg-[#131513] border-[#2C3325] text-[#F5F2EA]"
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-none bg-[#6B7A3D] hover:bg-[#576431] text-[#FAF8F3] font-serif font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 text-xs shadow-sm"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Community & Social Links */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className={`border rounded-none p-6 space-y-4 shadow-sm ${
              isLight
                ? "bg-[#F2ECE1]/70 border-[#DCD5C9]"
                : "bg-[#1A1D1A]/70 border-[#2C3325]"
            }`}
          >
            <h3 className="text-base font-serif font-bold text-[#8C5E3C]">
              Join the Community
            </h3>
            <p className="text-xs text-[#786E65]">
              Connect with other backend engineers building in public.
            </p>

            <div className="space-y-2 text-xs">
              <a
                href="https://www.linkedin.com/in/thecapstone-mogbolu-81a5bb201/"
                target="_blank"
                rel="noreferrer"
                className={`flex items-center space-x-3 p-3 rounded-none border transition-colors ${
                  isLight
                    ? "bg-white border-[#DCD5C9] text-[#2C2825] hover:bg-[#FAF8F3]"
                    : "bg-[#131513] border-[#2C3325] text-[#F5F2EA] hover:bg-[#1C201C]"
                }`}
              >
                <MessageSquare className="w-4 h-4 text-[#8C5E3C]" />
                <div>
                  <span className="font-serif font-bold block">LinkedIn</span>
                  <span className="text-[11px] text-[#786E65]">
                    Connect with me on LinkedIn
                  </span>
                </div>
              </a>

              <a
                href="https://github.com/Thecapstone"
                target="_blank"
                rel="noreferrer"
                className={`flex items-center space-x-3 p-3 rounded-none border transition-colors ${
                  isLight
                    ? "bg-white border-[#DCD5C9] text-[#2C2825] hover:bg-[#FAF8F3]"
                    : "bg-[#131513] border-[#2C3325] text-[#F5F2EA] hover:bg-[#1C201C]"
                }`}
              >
                <Github className="w-4 h-4 text-[#6B7A3D]" />
                <div>
                  <span className="font-serif font-bold block">
                    GitHub Discussions
                  </span>
                  <span className="text-[11px] text-[#786E65]">
                    Feature requests & feedback
                  </span>
                </div>
              </a>

              <a
                href="https://twitter.com/octahaven22"
                target="_blank"
                rel="noreferrer"
                className={`flex items-center space-x-3 p-3 rounded-none border transition-colors ${
                  isLight
                    ? "bg-white border-[#DCD5C9] text-[#2C2825] hover:bg-[#FAF8F3]"
                    : "bg-[#131513] border-[#2C3325] text-[#F5F2EA] hover:bg-[#1C201C]"
                }`}
              >
                <Twitter className="w-4 h-4 text-[#8C5E3C]" />
                <div>
                  <span className="font-serif font-bold block">
                    X (Twitter)
                  </span>
                  <span className="text-[11px] text-[#786E65]">
                    Follow daily updates
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="space-y-6 pt-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#8C5E3C]">
            Got Questions?
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#8C5E3C]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`border rounded-none overflow-hidden transition-all ${
                  isLight
                    ? "bg-white border-[#DCD5C9]"
                    : "bg-[#1A1D1A] border-[#2C3325]"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between text-sm font-serif font-bold text-[#8C5E3C] hover:text-[#6B7A3D]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180 text-[#6B7A3D]" : "text-[#786E65]"}`}
                  />
                </button>

                {isOpen && (
                  <div
                    className={`px-5 pb-5 text-xs leading-relaxed border-t pt-3 ${
                      isLight
                        ? "border-[#DCD5C9] text-[#4A423A]"
                        : "border-white/5 text-[#A0A8B0]"
                    }`}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
