import React from "react";
import { BlogPost, Theme } from "../types";
import { X, Calendar, Clock, User, Terminal, Check } from "lucide-react";

interface ArticleModalProps {
  article: BlogPost | null;
  onClose: () => void;
  onJoinWaitlist: () => void;
  theme?: Theme;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  onJoinWaitlist,
  theme = "light",
}) => {
  if (!article) return null;

  const isLight = theme === "light";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] rounded-none border shadow-2xl flex flex-col overflow-hidden ${
          isLight
            ? "bg-[#FAF8F3] text-[#2C2825] border-[#DCD5C9]"
            : "bg-[#131513] text-[#F5F2EA] border-[#2C3325]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between border-b ${
            isLight
              ? "bg-[#F2ECE1] border-[#DCD5C9] text-[#2C2825]"
              : "bg-[#0D0F0D] border-[#2C3325] text-[#F5F2EA]"
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-none bg-[#8C5E3C]/20 flex items-center justify-center text-[#8C5E3C]">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-serif italic text-[#8C5E3C]">
              WaitForIt Generated Article Preview
            </span>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-none border text-xs transition-colors ${
              isLight
                ? "bg-white border-[#DCD5C9] text-[#605549] hover:bg-[#E8E0D2]"
                : "bg-[#1A1D1A] border-[#2C3325] text-[#A0A8B0] hover:text-white"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Article Body Content */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 max-w-3xl mx-auto w-full">
          {/* Article Header */}
          <div
            className={`space-y-4 pb-6 border-b ${isLight ? "border-[#DCD5C9]" : "border-[#2C3325]"}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-none bg-[#6B7A3D]/15 text-[#6B7A3D] text-xs font-serif font-bold uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#8C5E3C] tracking-tight font-serif leading-tight">
              {article.title}
            </h1>

            <p className="text-base text-[#6B7A3D] font-serif italic">
              {article.subtitle}
            </p>

            <div className="flex items-center space-x-4 text-xs text-[#786E65] pt-2 font-mono">
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-[#8C5E3C]" />
                <span>{article.author}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-[#8C5E3C]" />
                <span>{article.date}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-[#8C5E3C]" />
                <span>{article.readTime}</span>
              </span>
            </div>
          </div>

          {/* Formatted Article Content */}
          <div className="prose max-w-none space-y-4 text-sm sm:text-base leading-relaxed">
            {article.content.split("\n\n").map((paragraph, index) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2
                    key={index}
                    className="text-xl font-serif font-bold text-[#8C5E3C] pt-4 pb-1 border-b border-[#DCD5C9]"
                  >
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h3
                    key={index}
                    className="text-lg font-serif font-semibold text-[#2C2825] dark:text-[#8C5E3C] pt-3"
                  >
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("```")) {
                const codeText = paragraph.replace(/```[a-z]*/g, "").trim();
                return (
                  <div
                    key={index}
                    className={`my-4 p-4 rounded-none font-mono text-xs overflow-x-auto border ${
                      isLight
                        ? "bg-[#212521] text-[#A8C898] border-[#323832]"
                        : "bg-[#0B0C0B] text-[#A8C898] border-[#2C3325]"
                    }`}
                  >
                    <pre>{codeText}</pre>
                  </div>
                );
              }
              return (
                <p
                  key={index}
                  className={`leading-relaxed ${isLight ? "text-[#4A423A]" : "text-[#C5CCC0]"}`}
                >
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Bottom Callout */}
          <div
            className={`mt-8 p-6 rounded-none space-y-3 border ${
              isLight
                ? "bg-[#F2ECE1] border-[#DCD5C9] text-[#2C2825]"
                : "bg-[#1A1D1A] border-[#2C3325] text-[#F5F2EA]"
            }`}
          >
            <div className="flex items-center space-x-2 text-[#6B7A3D]">
              <Check className="w-5 h-5" />
              <h4 className="font-serif font-bold text-sm">
                Generated directly from terminal logs with zero manual editing.
              </h4>
            </div>
            <p className="text-xs text-[#786E65]">
              WaitForIt captured the debugging notes, terminal runs, and Redis
              stream experiments, then produced this article automatically.
            </p>
            <button
              onClick={() => {
                onClose();
                onJoinWaitlist();
              }}
              className="mt-2 px-5 py-2.5 rounded-none bg-[#6B7A3D] hover:bg-[#576431] text-[#FAF8F3] text-xs font-serif uppercase tracking-widest font-bold border border-[#576431] transition-colors"
            >
              Get WaitForIt for your projects →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
