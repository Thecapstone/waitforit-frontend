import React from "react";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  FolderKanban,
  Layers3,
  Settings2,
  UserRound,
} from "lucide-react";
import { PageView, Theme } from "../types";

/**
 * Class tokens for the signed-in collection pages. They mirror the marketing
 * pages (Blog, Home, Dashboard) so the whole app reads as one product.
 */
export function useCollectionStyles(theme: Theme) {
  const isLight = theme === "light";
  const line = isLight ? "border-[#DCD5C9]" : "border-[#2C3325]";
  const ink = isLight ? "text-[#2C2825]" : "text-[#F5F2EA]";
  const muted = isLight ? "text-[#786E65]" : "text-[#A0A8B0]";
  const body = isLight ? "text-[#605549]" : "text-[#A0A8B0]";
  return {
    isLight,
    line,
    ink,
    muted,
    body,
    /** Warm parchment card, used for primary content. */
    card: `rounded-3xl border shadow-soft ${
      isLight
        ? "bg-[#F2ECE1]/70 border-[#DCD5C9]"
        : "bg-[#1A1D1A]/70 border-[#2C3325]"
    }`,
    /** Plain surface, used for lists, forms and secondary panels. */
    panel: `rounded-2xl border shadow-soft ${
      isLight ? "bg-white border-[#DCD5C9]" : "bg-[#1A1D1A] border-[#2C3325]"
    }`,
    interactive:
      "group cursor-pointer text-left transition-all hover:shadow-lift hover:-translate-y-0.5 hover:border-[#8C5E3C]",
    cardTitle:
      "font-serif font-bold text-[#8C5E3C] group-hover:text-[#6B7A3D] transition-colors leading-snug",
    eyebrow:
      "text-xs font-serif font-bold uppercase tracking-widest text-[#8C5E3C]",
    pill: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8C5E3C]/10 border border-[#8C5E3C]/30 text-[#8C5E3C] text-[11px] font-serif font-bold uppercase tracking-wider",
    olivePill:
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#6B7A3D]/10 border border-[#6B7A3D]/30 text-[#6B7A3D] text-[11px] font-serif font-bold uppercase tracking-wider",
    primaryButton:
      "shadow-glow inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#6B7A3D] hover:bg-[#576431] text-[#FAF8F3] text-xs font-serif uppercase tracking-widest font-bold border border-[#576431] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
    secondaryButton: `inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border text-xs font-serif uppercase tracking-wider font-bold transition-colors ${
      isLight
        ? "bg-white border-[#DCD5C9] text-[#2C2825] hover:bg-[#FAF8F3]"
        : "bg-[#1A1D1A] border-[#2C3325] text-[#F5F2EA] hover:bg-[#252A25]"
    }`,
    dangerButton:
      "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-red-700/30 text-red-700 dark:text-red-400 text-xs font-serif uppercase tracking-wider font-bold hover:bg-red-700/10 transition-colors",
    label: `block text-xs font-serif font-bold uppercase tracking-wider ${muted}`,
    // Inputs sit inside uppercase serif labels, so reset the inherited type.
    input: `mt-2 w-full rounded-xl border bg-transparent p-3 text-sm font-sans font-normal normal-case tracking-normal focus:outline-none focus:border-[#6B7A3D] ${line} ${ink}`,
    meta: `font-mono text-xs ${muted}`,
  };
}

export type CollectionStyles = ReturnType<typeof useCollectionStyles>;

type TabKey =
  "profile" | "capsules" | "logs" | "articles" | "dashboard" | "settings";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "profile", label: "Profile", icon: <UserRound className="h-4 w-4" /> },
  {
    key: "capsules",
    label: "Capsules",
    icon: <FolderKanban className="h-4 w-4" />,
  },
  { key: "logs", label: "Logs", icon: <FileText className="h-4 w-4" /> },
  {
    key: "articles",
    label: "Articles",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    key: "dashboard",
    label: "Workspace",
    icon: <Layers3 className="h-4 w-4" />,
  },
  {
    key: "settings",
    label: "Settings",
    icon: <Settings2 className="h-4 w-4" />,
  },
];

/** Which tab a page belongs to (detail pages highlight their parent list). */
const TAB_FOR_PAGE: Partial<Record<PageView, TabKey>> = {
  profile: "profile",
  capsules: "capsules",
  "capsule-detail": "capsules",
  logs: "logs",
  "log-detail": "logs",
  articles: "articles",
  "article-detail": "articles",
  dashboard: "dashboard",
  settings: "settings",
};

interface CollectionHeaderProps {
  page: PageView;
  theme: Theme;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle?: string;
  counts?: Partial<Record<TabKey, number>>;
  onNavigate: (page: PageView) => void;
  back?: { label: string; page: PageView };
  actions?: React.ReactNode;
}

export const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  page,
  theme,
  icon,
  eyebrow,
  title,
  subtitle,
  counts = {},
  onNavigate,
  back,
  actions,
}) => {
  const styles = useCollectionStyles(theme);
  const activeTab = TAB_FOR_PAGE[page];

  return (
    <header className="space-y-6">
      {back && (
        <button
          onClick={() => onNavigate(back.page)}
          className={`inline-flex items-center gap-1.5 text-xs font-serif font-bold uppercase tracking-wider ${styles.muted} hover:text-[#6B7A3D] transition-colors`}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {back.label}
        </button>
      )}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#8C5E3C]/10 border border-[#8C5E3C]/30 text-[#8C5E3C] text-xs font-serif uppercase tracking-widest font-bold">
            {icon}
            <span>{eyebrow}</span>
          </div>
          <h1 className="break-words text-3xl sm:text-4xl font-serif font-extrabold tracking-tight text-[#8C5E3C] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p
              className={`text-sm sm:text-base leading-relaxed ${styles.body}`}
            >
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
        )}
      </div>

      <nav
        aria-label="Your collection"
        className={`-mx-4 flex gap-2 overflow-x-auto border-b px-4 pb-3 font-serif text-xs sm:mx-0 sm:px-0 ${styles.line}`}
      >
        {TABS.map((tab) => {
          const active = tab.key === activeTab;
          const count = counts[tab.key];
          return (
            <button
              key={tab.key}
              onClick={() => onNavigate(tab.key)}
              aria-current={active ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-bold uppercase tracking-wider transition-all ${
                active
                  ? "bg-[#6B7A3D] text-[#FAF8F3] border-[#576431] shadow-glow"
                  : styles.isLight
                    ? "bg-white text-[#2C2825] border-[#DCD5C9] hover:border-[#8C5E3C]"
                    : "bg-[#1A1D1A] text-[#A0A8B0] border-[#2C3325] hover:border-[#8C5E3C]"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {count !== undefined && (
                <span
                  className={`font-mono text-[10px] ${active ? "text-[#FAF8F3]/80" : styles.muted}`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};

interface EmptyStateProps {
  styles: CollectionStyles;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  styles,
  children,
  action,
}) => (
  <div
    className={`${styles.panel} flex flex-col items-start gap-4 p-6 text-sm sm:flex-row sm:items-center sm:justify-between ${styles.muted}`}
  >
    <p>{children}</p>
    {action}
  </div>
);
