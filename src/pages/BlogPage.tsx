import React from 'react';
import { PageView, BlogPost, Theme } from '../types';
import { FEATURED_ARTICLES } from '../data/initialData';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';

interface BlogPageProps {
  setCurrentPage: (page: PageView) => void;
  onOpenArticle: (art?: BlogPost) => void;
  theme?: Theme;
}

export const BlogPage: React.FC<BlogPageProps> = ({ setCurrentPage, onOpenArticle, theme = 'light' }) => {
  const isLight = theme === 'light';

  return (
    <div className={`pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-16 transition-colors ${
      isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'
    }`}>
      {/* Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-none bg-[#8C5E3C]/10 border border-[#8C5E3C]/30 text-[#8C5E3C] text-xs font-serif uppercase tracking-widest font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Engineering Journal</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-[#8C5E3C] tracking-tight">
          Engineering stories worth sharing.
        </h1>

        <p className="text-base text-[#786E65]">
          Thoughts on backend engineering, system design, developer tooling, and the future of technical documentation.
        </p>
      </div>

      {/* Featured Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {FEATURED_ARTICLES.map((article) => (
          <div 
            key={article.id}
            onClick={() => onOpenArticle(article)}
            className={`group border rounded-none p-6 sm:p-8 space-y-4 cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
              isLight
                ? 'bg-[#F2ECE1]/70 border-[#DCD5C9] hover:border-[#8C5E3C]'
                : 'bg-[#1A1D1A]/70 border-[#2C3325] hover:border-[#8C5E3C]'
            }`}
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-none bg-[#8C5E3C]/10 border border-[#8C5E3C]/30 text-[#8C5E3C] text-xs font-serif font-bold uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="text-xl font-bold font-serif text-[#8C5E3C] group-hover:text-[#6B7A3D] transition-colors leading-snug">
                {article.title}
              </h2>

              <p className={`text-xs leading-relaxed line-clamp-3 ${isLight ? 'text-[#605549]' : 'text-[#A0A8B0]'}`}>
                {article.excerpt}
              </p>
            </div>

            <div className={`pt-4 border-t flex items-center justify-between text-xs font-mono ${
              isLight ? 'border-[#DCD5C9] text-[#786E65]' : 'border-white/10 text-[#A0A8B0]'
            }`}>
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#8C5E3C]" />
                <span>{article.date}</span>
              </span>

              <span className="text-[#6B7A3D] font-serif font-bold group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                <span>Read Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

