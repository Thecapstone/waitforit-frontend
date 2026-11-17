import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Archive,
  BookOpen,
  CalendarDays,
  Code2,
  CreditCard,
  ExternalLink,
  FileText,
  FolderKanban,
  Github,
  Globe,
  Layers3,
  Lock,
  MapPin,
  Pencil,
  Save,
  Settings2,
  Sparkles,
  Trash2,
  Unlock,
  UserRound,
  X,
} from "lucide-react";
import {
  cancelSubscription,
  createArticle,
  deleteArticle,
  getCurrentUser,
  getSubscription,
  initializeSubscriptionPayment,
  listCapsules,
  listArticles,
  updateArticle,
  updateCapsule,
  updateUserProfile,
} from "../lib/api";
import { articleText, excerpt, formatDate } from "../lib/articles";
import {
  CollectionHeader,
  EmptyState,
  useCollectionStyles,
} from "../components/CollectionChrome";
import { ArticleBody } from "../components/ArticleBody";
import {
  ArticleRecord,
  AuthUser,
  CapsuleSummary,
  LogRecord,
  PageView,
  Subscription,
  Theme,
} from "../types";

interface AccountPagesProps {
  page: PageView;
  currentUser: AuthUser;
  theme: Theme;
  setCurrentPage: (page: PageView) => void;
  selectedRecordId: string;
  setSelectedRecordId: (id: string) => void;
}

type LogEntry = LogRecord & { capsule: CapsuleSummary };
type ArticleEntry = Omit<ArticleRecord, "capsule"> & {
  capsule: CapsuleSummary;
};

type Activity = {
  id: string;
  recordId: string;
  title: string;
  detail: string;
  date: string;
  kind: "capsule" | "log" | "article";
};

const byNewest = (
  left: { created_at: string },
  right: { created_at: string },
) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime();

/**
 * /api/auth/me/ returns a numeric id while capsule, log and article payloads
 * carry string ids, so compare them as strings.
 */
const sameId = (left: unknown, right: unknown) =>
  left !== undefined &&
  left !== null &&
  right !== undefined &&
  right !== null &&
  String(left) === String(right);

export const AccountPages: React.FC<AccountPagesProps> = ({
  page,
  currentUser,
  theme,
  setCurrentPage,
  selectedRecordId,
  setSelectedRecordId,
}) => {
  const s = useCollectionStyles(theme);
  const [profile, setProfile] = useState<AuthUser>(currentUser);
  const [capsules, setCapsules] = useState<CapsuleSummary[]>([]);
  const [articles, setArticles] = useState<ArticleRecord[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(() => {
    const paymentStatus = new URLSearchParams(window.location.search).get(
      "payment",
    );
    if (paymentStatus === "success")
      return "Payment confirmed. Your subscription is active.";
    if (paymentStatus === "pending")
      return "Payment received. Verification is still pending; check your subscription status shortly.";
    if (paymentStatus === "failed") return "Payment was not completed.";
    return "";
  });
  const [articleDraft, setArticleDraft] = useState({
    title: "",
    body: "",
    conclusion: "",
  });
  const [articleCapsuleId, setArticleCapsuleId] = useState("");
  const [articlePrompt, setArticlePrompt] = useState("");
  const [articleStyleSample, setArticleStyleSample] = useState("");
  const [generatingArticle, setGeneratingArticle] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [userResult, capsulesResult, articlesResult] =
      await Promise.allSettled([
        getCurrentUser(),
        listCapsules(),
        listArticles(),
      ]);
    if (userResult.status === "fulfilled" && userResult.value)
      setProfile(userResult.value);
    if (capsulesResult.status === "fulfilled")
      setCapsules(capsulesResult.value);
    else
      setMessage(
        capsulesResult.reason instanceof Error
          ? `Unable to load your collections: ${capsulesResult.reason.message}`
          : "Unable to load your collections. Please sign in again.",
      );
    if (articlesResult.status === "fulfilled")
      setArticles(articlesResult.value);
    if (page === "settings") {
      try {
        setSubscription(await getSubscription());
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to load subscription.",
        );
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setEditing(false);
    void loadData();
  }, [page]);

  // ---- Derived collections -------------------------------------------------

  const isMine = (id: unknown) => sameId(id, currentUser.id);
  const capsuleById = new Map<string, CapsuleSummary>(
    capsules.map((capsule) => [capsule.id, capsule]),
  );

  // Every log/article the user can see, for detail lookups.
  const logIndex = new Map<string, LogEntry>();
  capsules.forEach((capsule) =>
    (capsule.logs || []).forEach((log) =>
      logIndex.set(log.id, { ...log, capsule }),
    ),
  );
  const articleRecords = new Map<string, ArticleRecord>();
  capsules.forEach((capsule) =>
    (capsule.articles || []).forEach((article) =>
      articleRecords.set(article.id, article),
    ),
  );
  articles.forEach((article) => articleRecords.set(article.id, article));
  const articleIndex = new Map<string, ArticleEntry>();
  articleRecords.forEach((article) => {
    const capsule = capsuleById.get(article.capsule);
    if (capsule) articleIndex.set(article.id, { ...article, capsule });
  });

  // "Your" logs are the ones you wrote; "your" articles are ones from your
  // logs or generated in a capsule you own.
  const allLogs = [...logIndex.values()]
    .filter((log) => isMine(log.creator_id))
    .sort(byNewest);
  const allArticles = [...articleIndex.values()]
    .filter(
      (article) =>
        isMine(article.author_id) || isMine(article.capsule.creator_id),
    )
    .sort(byNewest);
  const ownedCapsules = capsules.filter((capsule) =>
    isMine(capsule.creator_id),
  );

  const activities: Activity[] = [
    ...capsules.map((capsule) => ({
      id: `capsule-${capsule.id}`,
      recordId: capsule.id,
      title: capsule.title,
      detail: "Capsule created",
      date: capsule.created_at,
      kind: "capsule" as const,
    })),
    ...allLogs.map((item) => ({
      id: `log-${item.id}`,
      recordId: item.id,
      title: item.title || "Untitled log",
      detail: `Log in ${item.capsule.title}`,
      date: item.created_at,
      kind: "log" as const,
    })),
    ...allArticles.map((item) => ({
      id: `article-${item.id}`,
      recordId: item.id,
      title: item.title,
      detail: `Article in ${item.capsule.title}`,
      date: item.created_at,
      kind: "article" as const,
    })),
  ]
    .sort(
      (left, right) =>
        new Date(right.date).getTime() - new Date(left.date).getTime(),
    )
    .slice(0, 6);

  const selectedCapsule = capsuleById.get(selectedRecordId);
  const selectedLogEntry = logIndex.get(selectedRecordId);
  const selectedArticleEntry = articleIndex.get(selectedRecordId);
  const canEditSelectedArticle = Boolean(
    selectedArticleEntry && isMine(selectedArticleEntry.capsule.creator_id),
  );

  const goTo = (nextPage: PageView, id = "") => {
    setSelectedRecordId(id);
    setCurrentPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---- Actions -------------------------------------------------------------

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      setProfile(
        await updateUserProfile({
          display_name: profile.display_name || "",
          bio: profile.bio || "",
          avatar_url: profile.avatar_url || "",
          location: profile.location || "",
          website_url: profile.website_url || "",
          github_url: profile.github_url || "",
        }),
      );
      setEditing(false);
      setMessage("Profile updated.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to update your profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  const beginArticleEdit = (
    article: Pick<ArticleRecord, "title" | "body" | "content" | "conclusion">,
  ) => {
    setArticleDraft({
      title: article.title,
      body: article.body || article.content || "",
      conclusion: article.conclusion || "",
    });
    setEditing(true);
  };

  const saveArticle = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedArticleEntry) return;
    setSaving(true);
    try {
      await updateArticle(selectedArticleEntry.id, articleDraft);
      setMessage("Article updated.");
      setEditing(false);
      await loadData();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to update article.",
      );
    } finally {
      setSaving(false);
    }
  };

  const generateArticle = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!articleCapsuleId) return;
    setGeneratingArticle(true);
    setMessage("");
    try {
      await createArticle(
        articleCapsuleId,
        articlePrompt.trim(),
        articleStyleSample.trim(),
      );
      setArticlePrompt("");
      setArticleStyleSample("");
      setMessage("Article generated from this capsule's recorded logs.");
      await loadData();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to generate article.",
      );
    } finally {
      setGeneratingArticle(false);
    }
  };

  const removeArticle = async () => {
    if (
      !selectedArticleEntry ||
      !window.confirm("Delete this article? This cannot be undone.")
    )
      return;
    try {
      await deleteArticle(selectedArticleEntry.id);
      goTo("articles");
      await loadData();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to delete article.",
      );
    }
  };

  const saveAggregation = async (
    capsule: CapsuleSummary,
    mode: "PER_USER" | "CAPSULE",
  ) => {
    try {
      await updateCapsule(capsule.id, { aggregation_mode: mode });
      setMessage(`Aggregation updated for ${capsule.title}.`);
      await loadData();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to update aggregation.",
      );
    }
  };

  const startPayment = async () => {
    try {
      const payment = await initializeSubscriptionPayment();
      window.location.assign(payment.payment_url);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to start payment.",
      );
    }
  };

  const manageSubscription = async () => {
    try {
      setSubscription(await cancelSubscription());
      setMessage("Subscription cancellation scheduled.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to update subscription.",
      );
    }
  };

  // ---- Shared pieces -------------------------------------------------------

  const isOpen = (capsule: CapsuleSummary) =>
    new Date(capsule.maturity_date).getTime() <= Date.now();
  const displayName = profile.display_name || profile.email.split("@")[0];

  const capsuleCard = (capsule: CapsuleSummary) => {
    const stack = [
      ...new Set(
        (capsule.logs || [])
          .flatMap((log) => [log.code_language, log.code_framework])
          .filter((value): value is string => Boolean(value)),
      ),
    ];
    const open = isOpen(capsule);
    return (
      <button
        key={capsule.id}
        onClick={() => goTo("capsule-detail", capsule.id)}
        className={`${s.card} ${s.interactive} flex flex-col justify-between gap-5 p-6`}
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={open ? s.olivePill : s.pill}>
              {open ? (
                <Unlock className="h-3 w-3" />
              ) : (
                <Lock className="h-3 w-3" />
              )}
              {open ? "Open" : "Sealed"}
            </span>
            <span className={s.pill}>
              {capsule.private ? "Private" : "Public"}
            </span>
          </div>
          <h2 className={`text-xl ${s.cardTitle}`}>{capsule.title}</h2>
          <p className={`line-clamp-2 text-xs leading-relaxed ${s.body}`}>
            {capsule.description || "No capsule description."}
          </p>
          {stack.length > 0 && (
            <p className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-[#6B7A3D]">
              <Code2 className="h-3.5 w-3.5" />
              {stack.join(" · ")}
            </p>
          )}
        </div>
        <div
          className={`flex items-center gap-4 border-t pt-4 font-mono text-xs ${s.line} ${s.muted}`}
        >
          <span>{capsule.logs?.length || 0} logs</span>
          <span>{capsule.articles?.length || 0} articles</span>
          <span className="ml-auto inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-[#8C5E3C]" />
            {formatDate(capsule.maturity_date)}
          </span>
        </div>
      </button>
    );
  };

  const logCard = (log: LogEntry, showCapsule = true) => (
    <button
      key={log.id}
      onClick={() => goTo("log-detail", log.id)}
      className={`${s.panel} ${s.interactive} flex w-full flex-col justify-between gap-4 p-5`}
    >
      <div className="space-y-2">
        {(log.code_language || log.code_framework) && (
          <div className="flex flex-wrap gap-2">
            {[log.code_language, log.code_framework]
              .filter(Boolean)
              .map((value) => (
                <span key={value} className={s.olivePill}>
                  {value}
                </span>
              ))}
          </div>
        )}
        <h3 className={`text-base ${s.cardTitle}`}>
          {log.title || "Untitled log"}
        </h3>
        <p className={`line-clamp-3 text-xs leading-relaxed ${s.body}`}>
          {excerpt(log.description || "", 220)}
        </p>
      </div>
      <div
        className={`flex items-center justify-between gap-3 border-t pt-3 ${s.line} ${s.meta}`}
      >
        <span className="truncate">
          {showCapsule ? `${log.capsule.title} · ` : ""}
          {formatDate(log.created_at)}
        </span>
        <span className="flex shrink-0 items-center gap-1 font-serif font-bold text-[#6B7A3D] transition-transform group-hover:translate-x-1">
          Open <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  );

  const articleCard = (article: ArticleEntry, showCapsule = true) => (
    <button
      key={article.id}
      onClick={() => goTo("article-detail", article.id)}
      className={`${s.card} ${s.interactive} flex w-full flex-col justify-between gap-4 p-6`}
    >
      <div className="space-y-3">
        {showCapsule && <span className={s.pill}>{article.capsule.title}</span>}
        <h3 className={`text-lg ${s.cardTitle}`}>{article.title}</h3>
        <p className={`line-clamp-3 text-xs leading-relaxed ${s.body}`}>
          {excerpt(articleText(article), 220)}
        </p>
      </div>
      <div
        className={`flex items-center justify-between border-t pt-4 ${s.line} ${s.meta}`}
      >
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 text-[#8C5E3C]" />
          {formatDate(article.created_at)}
        </span>
        <span className="flex items-center gap-1 font-serif font-bold text-[#6B7A3D] transition-transform group-hover:translate-x-1">
          Read Story <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  );

  const sectionHeading = (
    eyebrow: string,
    title: string,
    action?: { label: string; page: PageView },
  ) => (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="space-y-1">
        <span className={s.eyebrow}>{eyebrow}</span>
        <h2 className="text-2xl font-serif font-bold text-[#8C5E3C]">
          {title}
        </h2>
      </div>
      {action && (
        <button
          onClick={() => goTo(action.page)}
          className="inline-flex items-center gap-1 text-xs font-serif font-bold uppercase tracking-wider text-[#6B7A3D] hover:underline"
        >
          {action.label} <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );

  // ---- Header per page -----------------------------------------------------

  const header = (() => {
    switch (page) {
      case "profile":
        return {
          icon: <UserRound className="h-3.5 w-3.5" />,
          eyebrow: "Your Collection",
          title: `Welcome back, ${displayName}.`,
          subtitle:
            "Everything you've captured, from capsules and terminal logs to the stories they became.",
        };
      case "capsules":
        return {
          icon: <FolderKanban className="h-3.5 w-3.5" />,
          eyebrow: "Capsules",
          title: "Your capsules.",
          subtitle:
            "Every project you're recording. Sealed capsules open on their maturity date.",
        };
      case "logs":
        return {
          icon: <FileText className="h-3.5 w-3.5" />,
          eyebrow: "Engineering Logs",
          title: "Your logs.",
          subtitle:
            "The raw notes you've captured from the terminal, newest first.",
        };
      case "articles":
        return {
          icon: <BookOpen className="h-3.5 w-3.5" />,
          eyebrow: "Engineering Journal",
          title: "Your articles.",
          subtitle:
            "Stories generated from your recorded work. Articles from public capsules also appear on the Blog.",
        };
      case "settings":
        return {
          icon: <Settings2 className="h-3.5 w-3.5" />,
          eyebrow: "Account",
          title: "Account settings.",
          subtitle: "Timelines, plan and account details.",
        };
      case "capsule-detail":
        return {
          icon: <FolderKanban className="h-3.5 w-3.5" />,
          eyebrow: "Capsule",
          title: selectedCapsule?.title || "Capsule",
          subtitle: selectedCapsule?.description || undefined,
          back: { label: "All capsules", page: "capsules" as PageView },
        };
      case "log-detail":
        return {
          icon: <FileText className="h-3.5 w-3.5" />,
          eyebrow: selectedLogEntry
            ? `Log · ${selectedLogEntry.capsule.title}`
            : "Log",
          title: selectedLogEntry?.title || "Untitled log",
          back: { label: "All logs", page: "logs" as PageView },
        };
      default:
        return {
          icon: <BookOpen className="h-3.5 w-3.5" />,
          eyebrow: selectedArticleEntry
            ? `Article · ${selectedArticleEntry.capsule.title}`
            : "Article",
          title: selectedArticleEntry?.title || "Article",
          back: { label: "All articles", page: "articles" as PageView },
        };
    }
  })();

  return (
    <div
      className={`mx-auto max-w-6xl space-y-10 px-4 pb-20 pt-28 transition-colors sm:px-6 lg:px-8 ${s.ink}`}
    >
      <CollectionHeader
        page={page}
        theme={theme}
        onNavigate={(next) => goTo(next)}
        counts={
          loading
            ? undefined
            : {
                capsules: capsules.length,
                logs: allLogs.length,
                articles: allArticles.length,
              }
        }
        {...header}
      />

      {message && (
        <div
          role="status"
          className="shadow-soft flex items-center justify-between gap-4 rounded-xl border border-[#6B7A3D]/30 bg-[#6B7A3D]/15 p-3.5 text-xs font-serif font-bold text-[#6B7A3D]"
        >
          <span>{message}</span>
          <button aria-label="Dismiss message" onClick={() => setMessage("")}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {loading ? (
        <p className={`py-10 text-sm font-serif ${s.muted}`}>
          Loading your collection...
        </p>
      ) : (
        <>
          {/* ---------------------------------------------------- PROFILE */}
          {page === "profile" && (
            <div className="space-y-12">
              <section className={`${s.card} p-6 sm:p-8`}>
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
                  <div className="flex flex-col gap-5 sm:flex-row">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Profile avatar"
                        className={`h-24 w-24 shrink-0 rounded-2xl border object-cover shadow-soft ${s.line}`}
                      />
                    ) : (
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-[#6B7A3D]/30 bg-[#6B7A3D]/10 text-3xl font-serif font-bold text-[#6B7A3D]">
                        {displayName.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-serif font-bold text-[#8C5E3C]">
                          {displayName}
                        </h2>
                        <button
                          onClick={() => {
                            setEditing(!editing);
                            setMessage("");
                          }}
                          className={s.secondaryButton}
                          aria-label="Edit profile"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          {editing ? "Close" : "Edit"}
                        </button>
                      </div>
                      <p className={s.meta}>{profile.email}</p>
                      <p
                        className={`max-w-2xl whitespace-pre-wrap text-sm leading-relaxed ${s.body}`}
                      >
                        {profile.bio ||
                          "Add a short bio about what you build and what you care about."}
                      </p>
                      <div
                        className={`flex flex-wrap gap-x-5 gap-y-2 pt-1 text-xs ${s.muted}`}
                      >
                        {profile.location && (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-[#8C5E3C]" />
                            {profile.location}
                          </span>
                        )}
                        {profile.website_url && (
                          <a
                            className="inline-flex items-center gap-1.5 hover:text-[#6B7A3D]"
                            href={profile.website_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Globe className="h-3.5 w-3.5 text-[#8C5E3C]" />
                            Website
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {profile.github_url && (
                          <a
                            className="inline-flex items-center gap-1.5 hover:text-[#6B7A3D]"
                            href={profile.github_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Github className="h-3.5 w-3.5 text-[#8C5E3C]" />
                            GitHub
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {(
                      [
                        ["Capsules", capsules.length, "capsules"],
                        ["Logs", allLogs.length, "logs"],
                        ["Articles", allArticles.length, "articles"],
                      ] as const
                    ).map(([label, value, target]) => (
                      <button
                        key={label}
                        onClick={() => goTo(target)}
                        className={`${s.panel} ${s.interactive} p-4`}
                      >
                        <p className="text-2xl font-serif font-bold text-[#8C5E3C]">
                          {value}
                        </p>
                        <p
                          className={`mt-1 text-[10px] font-serif font-bold uppercase tracking-wider ${s.muted}`}
                        >
                          {label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {editing && (
                  <form
                    onSubmit={saveProfile}
                    className={`mt-8 grid gap-5 border-t pt-8 md:grid-cols-2 ${s.line}`}
                  >
                    <label className={s.label}>
                      Display name
                      <input
                        value={profile.display_name || ""}
                        onChange={(event) =>
                          setProfile({
                            ...profile,
                            display_name: event.target.value,
                          })
                        }
                        maxLength={80}
                        className={s.input}
                      />
                    </label>
                    <label className={s.label}>
                      Avatar image URL
                      <input
                        type="url"
                        value={profile.avatar_url || ""}
                        onChange={(event) =>
                          setProfile({
                            ...profile,
                            avatar_url: event.target.value,
                          })
                        }
                        placeholder="https://..."
                        className={s.input}
                      />
                    </label>
                    <label className={`${s.label} md:col-span-2`}>
                      Bio
                      <textarea
                        value={profile.bio || ""}
                        onChange={(event) =>
                          setProfile({ ...profile, bio: event.target.value })
                        }
                        maxLength={500}
                        rows={3}
                        className={s.input}
                      />
                    </label>
                    <label className={s.label}>
                      Location
                      <input
                        value={profile.location || ""}
                        onChange={(event) =>
                          setProfile({
                            ...profile,
                            location: event.target.value,
                          })
                        }
                        maxLength={100}
                        className={s.input}
                      />
                    </label>
                    <label className={s.label}>
                      Website
                      <input
                        type="url"
                        value={profile.website_url || ""}
                        onChange={(event) =>
                          setProfile({
                            ...profile,
                            website_url: event.target.value,
                          })
                        }
                        placeholder="https://..."
                        className={s.input}
                      />
                    </label>
                    <label className={s.label}>
                      GitHub profile
                      <input
                        type="url"
                        value={profile.github_url || ""}
                        onChange={(event) =>
                          setProfile({
                            ...profile,
                            github_url: event.target.value,
                          })
                        }
                        placeholder="https://github.com/..."
                        className={s.input}
                      />
                    </label>
                    <div className="flex items-end gap-2">
                      <button disabled={saving} className={s.primaryButton}>
                        <Save className="h-4 w-4" />
                        {saving ? "Saving..." : "Save profile"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className={s.secondaryButton}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </section>

              <section>
                {sectionHeading("Your Archive", "Recent activity")}
                {activities.length ? (
                  <div
                    className={`${s.panel} divide-y overflow-hidden ${s.line}`}
                  >
                    {activities.map((activity) => (
                      <button
                        key={activity.id}
                        onClick={() =>
                          goTo(
                            activity.kind === "capsule"
                              ? "capsule-detail"
                              : activity.kind === "log"
                                ? "log-detail"
                                : "article-detail",
                            activity.recordId,
                          )
                        }
                        className={`group grid w-full grid-cols-[36px_1fr_auto] items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[#8C5E3C]/5 ${s.line}`}
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                            activity.kind === "log"
                              ? "border-[#6B7A3D]/30 bg-[#6B7A3D]/10 text-[#6B7A3D]"
                              : "border-[#8C5E3C]/30 bg-[#8C5E3C]/10 text-[#8C5E3C]"
                          }`}
                        >
                          {activity.kind === "capsule" ? (
                            <FolderKanban className="h-4 w-4" />
                          ) : activity.kind === "log" ? (
                            <FileText className="h-4 w-4" />
                          ) : (
                            <BookOpen className="h-4 w-4" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-serif font-bold transition-colors group-hover:text-[#6B7A3D]">
                            {activity.title}
                          </span>
                          <span className={`mt-0.5 block text-xs ${s.muted}`}>
                            {activity.detail}
                          </span>
                        </span>
                        <span className={`whitespace-nowrap ${s.meta}`}>
                          {formatDate(activity.date)}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    styles={s}
                    action={
                      <button
                        onClick={() => goTo("dashboard")}
                        className={s.primaryButton}
                      >
                        <Layers3 className="h-4 w-4" /> Open workspace
                      </button>
                    }
                  >
                    Your capsules, logs and articles will appear here as you
                    build.
                  </EmptyState>
                )}
              </section>

              <section className="grid gap-10 lg:grid-cols-2">
                <div>
                  {sectionHeading("From the Terminal", "Latest logs", {
                    label: "All logs",
                    page: "logs",
                  })}
                  <div className="grid gap-4">
                    {allLogs.slice(0, 3).map((log) => logCard(log))}
                    {!allLogs.length && (
                      <EmptyState styles={s}>No logs recorded yet.</EmptyState>
                    )}
                  </div>
                </div>
                <div>
                  {sectionHeading("Engineering Journal", "Latest articles", {
                    label: "All articles",
                    page: "articles",
                  })}
                  <div className="grid gap-4">
                    {allArticles
                      .slice(0, 3)
                      .map((article) => articleCard(article))}
                    {!allArticles.length && (
                      <EmptyState styles={s}>
                        No articles generated yet.
                      </EmptyState>
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* --------------------------------------------------- CAPSULES */}
          {page === "capsules" &&
            (capsules.length ? (
              <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {capsules.map(capsuleCard)}
              </section>
            ) : (
              <EmptyState
                styles={s}
                action={
                  <button
                    onClick={() => goTo("dashboard")}
                    className={s.primaryButton}
                  >
                    <Archive className="h-4 w-4" /> Create a capsule
                  </button>
                }
              >
                No capsules yet. Start one from your workspace or the CLI.
              </EmptyState>
            ))}

          {/* ------------------------------------------------------- LOGS */}
          {page === "logs" &&
            (allLogs.length ? (
              <section className="grid gap-5 md:grid-cols-2">
                {allLogs.map((log) => logCard(log))}
              </section>
            ) : (
              <EmptyState styles={s}>
                No logs have been recorded yet. Run{" "}
                <code className="font-mono text-[#6B7A3D]">wfi log</code> from
                your terminal to capture one.
              </EmptyState>
            ))}

          {/* --------------------------------------------------- ARTICLES */}
          {page === "articles" && (
            <div className="space-y-10">
              <form
                onSubmit={generateArticle}
                className={`${s.card} grid gap-5 p-6 sm:p-8`}
              >
                <div className="space-y-2">
                  <span className={s.eyebrow}>From recorded work</span>
                  <h2 className="flex items-center gap-2 text-2xl font-serif font-bold text-[#8C5E3C]">
                    <Sparkles className="h-5 w-5 text-[#6B7A3D]" />
                    Generate an article
                  </h2>
                  <p className={`max-w-2xl text-sm leading-relaxed ${s.body}`}>
                    The article is generated from this capsule's saved logs. Add
                    optional style or focus guidance; factual content stays
                    grounded in those logs.
                  </p>
                </div>
                <label className={s.label}>
                  Capsule
                  <select
                    required
                    value={articleCapsuleId}
                    onChange={(event) =>
                      setArticleCapsuleId(event.target.value)
                    }
                    className={`${s.input} ${s.isLight ? "" : "[&>option]:bg-[#1A1D1A]"}`}
                  >
                    <option value="">Select one of your capsules</option>
                    {ownedCapsules.map((capsule) => (
                      <option key={capsule.id} value={capsule.id}>
                        {capsule.title}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid gap-5 lg:grid-cols-2">
                  <label className={s.label}>
                    Style or focus instructions
                    <textarea
                      rows={5}
                      maxLength={5000}
                      value={articlePrompt}
                      onChange={(event) => setArticlePrompt(event.target.value)}
                      placeholder="For example: use a concise engineering postmortem structure, explain trade-offs, and avoid promotional language."
                      className={`${s.input} leading-6`}
                    />
                  </label>
                  <label className={s.label}>
                    Optional sample article for style reference
                    <textarea
                      rows={5}
                      maxLength={12000}
                      value={articleStyleSample}
                      onChange={(event) =>
                        setArticleStyleSample(event.target.value)
                      }
                      placeholder="Paste a sample. Its tone and structure may guide the writing; its facts will not be used as evidence."
                      className={`${s.input} leading-6`}
                    />
                  </label>
                </div>
                <div>
                  <button
                    disabled={generatingArticle || ownedCapsules.length === 0}
                    className={s.primaryButton}
                  >
                    <Sparkles className="h-4 w-4" />
                    {generatingArticle ? "Generating..." : "Generate article"}
                  </button>
                </div>
              </form>

              {allArticles.length ? (
                <section className="grid gap-6 md:grid-cols-2">
                  {allArticles.map((article) => articleCard(article))}
                </section>
              ) : (
                <EmptyState styles={s}>
                  Generated articles will be collected here.
                </EmptyState>
              )}
            </div>
          )}

          {/* --------------------------------------------- CAPSULE DETAIL */}
          {page === "capsule-detail" && selectedCapsule && (
            <div className="space-y-10">
              <section className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    label: "Status",
                    value: isOpen(selectedCapsule)
                      ? "Open"
                      : `Sealed until ${formatDate(selectedCapsule.maturity_date)}`,
                    icon: isOpen(selectedCapsule) ? (
                      <Unlock className="h-4 w-4 text-[#6B7A3D]" />
                    ) : (
                      <Lock className="h-4 w-4 text-[#8C5E3C]" />
                    ),
                  },
                  {
                    label: "Timeline mode",
                    value:
                      selectedCapsule.aggregation_mode === "CAPSULE"
                        ? "Shared capsule"
                        : "Per contributor",
                    icon: <Layers3 className="h-4 w-4 text-[#8C5E3C]" />,
                  },
                  {
                    label: "Visibility",
                    value: selectedCapsule.private
                      ? "Private: members only"
                      : "Public: articles on the Blog",
                    icon: <Globe className="h-4 w-4 text-[#8C5E3C]" />,
                  },
                ].map((stat) => (
                  <div key={stat.label} className={`${s.card} space-y-2 p-6`}>
                    <div
                      className={`flex items-center justify-between ${s.muted}`}
                    >
                      <span className="text-xs font-serif font-bold uppercase tracking-wider">
                        {stat.label}
                      </span>
                      {stat.icon}
                    </div>
                    <p className="text-lg font-serif font-bold">{stat.value}</p>
                  </div>
                ))}
              </section>

              <div className="grid gap-10 lg:grid-cols-2">
                <section>
                  {sectionHeading(
                    "From the Terminal",
                    `Logs (${selectedCapsule.logs?.length || 0})`,
                  )}
                  <div className="grid gap-4">
                    {[...(selectedCapsule.logs || [])]
                      .sort(byNewest)
                      .map((log) =>
                        logCard({ ...log, capsule: selectedCapsule }, false),
                      )}
                    {!selectedCapsule.logs?.length && (
                      <EmptyState styles={s}>
                        {isOpen(selectedCapsule)
                          ? "No logs in this capsule yet."
                          : "No logs of yours yet. Other members' logs unlock when the capsule opens."}
                      </EmptyState>
                    )}
                  </div>
                </section>
                <section>
                  {sectionHeading(
                    "Engineering Journal",
                    `Articles (${selectedCapsule.articles?.length || 0})`,
                  )}
                  <div className="grid gap-4">
                    {[...(selectedCapsule.articles || [])]
                      .sort(byNewest)
                      .map((article) =>
                        articleCard(
                          { ...article, capsule: selectedCapsule },
                          false,
                        ),
                      )}
                    {!selectedCapsule.articles?.length && (
                      <EmptyState styles={s}>
                        No articles generated from this capsule yet.
                      </EmptyState>
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ------------------------------------------------- LOG DETAIL */}
          {page === "log-detail" && selectedLogEntry && (
            <article className={`${s.card} max-w-3xl space-y-6 p-6 sm:p-10`}>
              <div
                className={`flex flex-wrap items-center gap-2 border-b pb-5 ${s.line}`}
              >
                <button
                  onClick={() =>
                    goTo("capsule-detail", selectedLogEntry.capsule.id)
                  }
                  className={`${s.pill} hover:bg-[#8C5E3C]/20`}
                >
                  <FolderKanban className="h-3 w-3" />
                  {selectedLogEntry.capsule.title}
                </button>
                {[
                  selectedLogEntry.code_language,
                  selectedLogEntry.code_framework,
                ]
                  .filter(Boolean)
                  .map((value) => (
                    <span key={value} className={s.olivePill}>
                      {value}
                    </span>
                  ))}
                <span className={`ml-auto ${s.meta}`}>
                  {formatDate(selectedLogEntry.created_at)}
                </span>
              </div>
              <p
                className={`whitespace-pre-wrap text-sm leading-relaxed sm:text-base ${
                  s.isLight ? "text-[#4A423A]" : "text-[#C5CCC0]"
                }`}
              >
                {selectedLogEntry.description}
              </p>
            </article>
          )}

          {/* --------------------------------------------- ARTICLE DETAIL */}
          {page === "article-detail" && selectedArticleEntry && (
            <article className={`${s.card} max-w-3xl space-y-6 p-6 sm:p-10`}>
              <div
                className={`flex flex-wrap items-center gap-2 border-b pb-5 ${s.line}`}
              >
                <button
                  onClick={() =>
                    goTo("capsule-detail", selectedArticleEntry.capsule.id)
                  }
                  className={`${s.pill} hover:bg-[#8C5E3C]/20`}
                >
                  <FolderKanban className="h-3 w-3" />
                  {selectedArticleEntry.capsule.title}
                </button>
                <span className={s.meta}>
                  {formatDate(selectedArticleEntry.created_at)}
                </span>
                {canEditSelectedArticle && (
                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={() =>
                        editing
                          ? setEditing(false)
                          : beginArticleEdit(selectedArticleEntry)
                      }
                      className={s.secondaryButton}
                    >
                      {editing ? (
                        <X className="h-3.5 w-3.5" />
                      ) : (
                        <Pencil className="h-3.5 w-3.5" />
                      )}
                      {editing ? "Cancel" : "Edit"}
                    </button>
                    <button onClick={removeArticle} className={s.dangerButton}>
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
              {editing ? (
                <form onSubmit={saveArticle} className="space-y-5">
                  <label className={s.label}>
                    Title
                    <input
                      required
                      value={articleDraft.title}
                      onChange={(event) =>
                        setArticleDraft({
                          ...articleDraft,
                          title: event.target.value,
                        })
                      }
                      className={`${s.input} !font-serif text-base`}
                    />
                  </label>
                  <label className={s.label}>
                    Body
                    <textarea
                      required
                      rows={14}
                      value={articleDraft.body}
                      onChange={(event) =>
                        setArticleDraft({
                          ...articleDraft,
                          body: event.target.value,
                        })
                      }
                      className={`${s.input} leading-7`}
                    />
                  </label>
                  <label className={s.label}>
                    Conclusion
                    <textarea
                      rows={4}
                      value={articleDraft.conclusion}
                      onChange={(event) =>
                        setArticleDraft({
                          ...articleDraft,
                          conclusion: event.target.value,
                        })
                      }
                      className={`${s.input} leading-7`}
                    />
                  </label>
                  <button disabled={saving} className={s.primaryButton}>
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save article"}
                  </button>
                </form>
              ) : (
                <>
                  <ArticleBody
                    content={articleText(selectedArticleEntry)}
                    theme={theme}
                  />
                  {selectedArticleEntry.conclusion && (
                    <section
                      className={`shadow-soft space-y-2 rounded-2xl border p-6 ${s.line} ${
                        s.isLight ? "bg-[#F2ECE1]" : "bg-[#131513]"
                      }`}
                    >
                      <span className={s.eyebrow}>Conclusion</span>
                      <p
                        className={`whitespace-pre-wrap text-sm leading-relaxed ${
                          s.isLight ? "text-[#4A423A]" : "text-[#C5CCC0]"
                        }`}
                      >
                        {selectedArticleEntry.conclusion}
                      </p>
                    </section>
                  )}
                </>
              )}
            </article>
          )}

          {/* --------------------------------------------------- SETTINGS */}
          {page === "settings" && (
            <div className="space-y-12">
              <section>
                {sectionHeading("Timelines", "Log aggregation")}
                <p className={`-mt-2 mb-5 text-sm ${s.body}`}>
                  Choose how each capsule groups a day of logs into an article
                  timeline.
                </p>
                {capsules.length ? (
                  <div className={`${s.panel} divide-y ${s.line}`}>
                    {capsules.map((capsule) => (
                      <div
                        key={capsule.id}
                        className={`flex flex-wrap items-center justify-between gap-4 p-5 ${s.line}`}
                      >
                        <div>
                          <p className="font-serif font-bold">
                            {capsule.title}
                          </p>
                          <p className={`mt-1 ${s.meta}`}>Daily log windows</p>
                        </div>
                        <div
                          className={`inline-flex gap-1 rounded-full border p-1 ${s.line}`}
                        >
                          {(
                            [
                              ["PER_USER", "Per contributor"],
                              ["CAPSULE", "Shared capsule"],
                            ] as const
                          ).map(([mode, label]) => {
                            const active =
                              (capsule.aggregation_mode || "PER_USER") === mode;
                            return (
                              <button
                                key={mode}
                                onClick={() =>
                                  void saveAggregation(capsule, mode)
                                }
                                aria-pressed={active}
                                className={`rounded-full px-3.5 py-1.5 text-[11px] font-serif font-bold uppercase tracking-wider transition-colors ${
                                  active
                                    ? "bg-[#6B7A3D] text-[#FAF8F3]"
                                    : `${s.muted} hover:text-[#6B7A3D]`
                                }`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState styles={s}>
                    Create a capsule to configure its timeline.
                  </EmptyState>
                )}
              </section>

              <section>
                {sectionHeading("Billing", "Plan and subscription")}
                <div
                  className={`${s.card} grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center`}
                >
                  <div className="space-y-2">
                    <span className={s.eyebrow}>
                      {subscription?.plan_code || "Capsule monthly"}
                    </span>
                    <p className="text-2xl font-serif font-bold">
                      {subscription
                        ? `${subscription.currency} ${(subscription.amount / 100).toLocaleString()} / month`
                        : "Loading plan..."}
                    </p>
                    <p className={`text-sm ${s.body}`}>
                      Status: {subscription?.status || "Unavailable"}
                      {subscription?.current_period_end
                        ? ` · Renews ${formatDate(subscription.current_period_end)}`
                        : ""}
                    </p>
                  </div>
                  {subscription?.status === "active" ? (
                    <button
                      onClick={() => void manageSubscription()}
                      className={s.secondaryButton}
                    >
                      <X className="h-4 w-4" />
                      {subscription.cancel_at_period_end
                        ? "Cancellation scheduled"
                        : "Cancel renewal"}
                    </button>
                  ) : (
                    <button
                      onClick={() => void startPayment()}
                      className={s.primaryButton}
                    >
                      <CreditCard className="h-4 w-4" />
                      Choose monthly plan
                    </button>
                  )}
                </div>
              </section>

              <section>
                {sectionHeading("Account", profile.email)}
                <div
                  className={`${s.panel} flex flex-wrap items-center justify-between gap-4 p-5`}
                >
                  <p className={`text-sm ${s.body}`}>
                    {profile.is_verified
                      ? "Verified account"
                      : "Email verification pending"}
                  </p>
                  <button
                    onClick={() => goTo("profile")}
                    className={s.secondaryButton}
                  >
                    Edit public profile
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </section>
            </div>
          )}

          {!selectedCapsule && page === "capsule-detail" && (
            <EmptyState styles={s}>
              That capsule is not in your collection.
            </EmptyState>
          )}
          {!selectedLogEntry && page === "log-detail" && (
            <EmptyState styles={s}>
              That log is not in your collection.
            </EmptyState>
          )}
          {!selectedArticleEntry && page === "article-detail" && (
            <EmptyState styles={s}>
              That article is not in your collection.
            </EmptyState>
          )}
        </>
      )}
    </div>
  );
};
