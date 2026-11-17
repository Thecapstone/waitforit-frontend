import React from 'react';
import { PageView, BlogPost, Theme, AuthUser } from '../types';
import { FEATURED_ARTICLES } from '../data/initialData';
import { usePublicArticles } from '../lib/articles';
import { BookOpen, Calendar, ArrowRight, Globe, LogIn, User } from 'lucide-react';

interface BlogPageProps {
  setCurrentPage: (page: PageView) => void;
  onOpenArticle: (art?: BlogPost) => void;
  theme?: Theme;
  currentUser?: AuthUser | null;
}

interface ArticleGridProps {
  articles: BlogPost[];
  onOpenArticle: (art?: BlogPost) => void;
  isLight: boolean;
}

const ArticleGrid: React.FC<ArticleGridProps> = ({ articles, onOpenArticle, isLight }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {articles.map((article) => (
      <div
        key={article.id}
        onClick={() => onOpenArticle(article)}
        className={`group border rounded-3xl p-6 sm:p-8 space-y-4 cursor-pointer transition-all shadow-soft hover:shadow-lift hover:-translate-y-0.5 flex flex-col justify-between ${
          isLight
            ? 'bg-[#F2ECE1]/70 border-[#DCD5C9] hover:border-[#8C5E3C]'
            : 'bg-[#1A1D1A]/70 border-[#2C3325] hover:border-[#8C5E3C]'
        }`}
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-[#8C5E3C]/10 border border-[#8C5E3C]/30 text-[#8C5E3C] text-xs font-serif font-bold uppercase tracking-wider">
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

        <div className={`pt-4 border-t flex items-center justify-between gap-3 text-xs font-mono ${
          isLight ? 'border-[#DCD5C9] text-[#786E65]' : 'border-white/10 text-[#A0A8B0]'
        }`}>
          <span className="flex items-center gap-3 min-w-0">
            {article.community && (
              <span className="flex items-center space-x-1.5 min-w-0">
                <User className="w-3.5 h-3.5 shrink-0 text-[#8C5E3C]" />
                <span className="truncate">{article.author}</span>
              </span>
            )}
            <span className="flex items-center space-x-1.5 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-[#8C5E3C]" />
              <span>{article.date}</span>
            </span>
          </span>

          <span className="text-[#6B7A3D] font-serif font-bold group-hover:translate-x-1 transition-transform flex items-center space-x-1 shrink-0">
            <span>Read Story</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    ))}
  </div>
);

export const BlogPage: React.FC<BlogPageProps> = ({ setCurrentPage, onOpenArticle, theme = 'light', currentUser = null }) => {
  const isLight = theme === 'light';
  const signedIn = Boolean(currentUser);
  const community = usePublicArticles(signedIn);
  const muted = isLight ? 'text-[#786E65]' : 'text-[#A0A8B0]';
  const panel = `shadow-soft border rounded-2xl p-6 text-sm ${
    isLight ? 'bg-white border-[#DCD5C9]' : 'bg-[#1A1D1A] border-[#2C3325]'
  } ${muted}`;

  return (
    <div className={`pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-16 transition-colors ${
      isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'
    }`}>
      {/* Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#8C5E3C]/10 border border-[#8C5E3C]/30 text-[#8C5E3C] text-xs font-serif uppercase tracking-widest font-bold">
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

      {/* Community articles from public capsules */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <span className="flex items-center gap-1.5 text-xs font-serif font-bold uppercase tracking-widest text-[#6B7A3D]">
              <Globe className="w-3.5 h-3.5" />
              From public capsules
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#8C5E3C]">
              Written by developers on WaitForIt
            </h2>
          </div>
          {signedIn && community.articles.length > 0 && (
            <span className={`text-xs font-mono ${muted}`}>
              {community.articles.length} {community.articles.length === 1 ? 'story' : 'stories'}
            </span>
          )}
        </div>

        {!signedIn ? (
          <div className={`${panel} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
            <p>Sign in to read articles generated from developers' public capsules.</p>
            <button
              onClick={() => setCurrentPage('login')}
              className="shadow-glow shrink-0 px-5 py-2.5 rounded-full bg-[#6B7A3D] hover:bg-[#576431] text-[#FAF8F3] text-xs font-serif uppercase tracking-widest font-bold border border-[#576431] flex items-center justify-center gap-2 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign in
            </button>
          </div>
        ) : community.loading ? (
          <p className={`text-sm font-serif ${muted}`}>Loading community stories...</p>
        ) : community.error ? (
          <p className={panel}>{community.error}</p>
        ) : community.articles.length === 0 ? (
          <p className={panel}>
            No public capsule has published an article yet. Make one of your capsules public and its articles will appear here.
          </p>
        ) : (
          <ArticleGrid articles={community.articles} onOpenArticle={onOpenArticle} isLight={isLight} />
        )}
      </section>

      {/* Featured (seeded) articles */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#8C5E3C]">
            Featured
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#8C5E3C]">
            From the WaitForIt team
          </h2>
        </div>
        <ArticleGrid articles={FEATURED_ARTICLES} onOpenArticle={onOpenArticle} isLight={isLight} />
      </section>
    </div>
  );
};
