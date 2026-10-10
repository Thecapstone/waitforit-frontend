import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  CreditCard,
  ExternalLink,
  FileText,
  FolderKanban,
  Github,
  Globe,
  Layers3,
  MapPin,
  Pencil,
  Save,
  Settings2,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import {
  cancelSubscription,
  deleteArticle,
  getCurrentUser,
  getSubscription,
  initializeSubscriptionPayment,
  listCapsules,
  updateArticle,
  updateCapsule,
  updateUserProfile,
} from '../lib/api';
import { ArticleRecord, AuthUser, CapsuleSummary, LogRecord, PageView, Subscription, Theme } from '../types';

interface AccountPagesProps {
  page: PageView;
  currentUser: AuthUser;
  theme: Theme;
  setCurrentPage: (page: PageView) => void;
  selectedRecordId: string;
  setSelectedRecordId: (id: string) => void;
}

type Activity = {
  id: string;
  title: string;
  detail: string;
  date: string;
  kind: 'capsule' | 'log' | 'article';
  capsuleId?: string;
};

const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, {
  year: 'numeric', month: 'short', day: 'numeric',
});

const excerpt = (value: string, limit: number) => {
  const text = value.trim();
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}...` : text;
};

export const AccountPages: React.FC<AccountPagesProps> = ({
  page,
  currentUser,
  theme,
  setCurrentPage,
  selectedRecordId,
  setSelectedRecordId,
}) => {
  const isLight = theme === 'light';
  const [profile, setProfile] = useState<AuthUser>(currentUser);
  const [capsules, setCapsules] = useState<CapsuleSummary[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [articleDraft, setArticleDraft] = useState({ title: '', body: '', conclusion: '' });

  const ink = isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]';
  const muted = isLight ? 'text-[#786E65]' : 'text-[#A0A8B0]';
  const line = isLight ? 'border-[#DCD5C9]' : 'border-[#343A32]';
  const surface = isLight ? 'bg-white' : 'bg-[#191C19]';
  const soft = isLight ? 'bg-[#F2ECE1]/70' : 'bg-[#20241F]';

  const loadData = async () => {
    setLoading(true);
    const [userResult, capsulesResult] = await Promise.allSettled([getCurrentUser(), listCapsules()]);
    if (userResult.status === 'fulfilled' && userResult.value) setProfile(userResult.value);
    if (capsulesResult.status === 'fulfilled') setCapsules(capsulesResult.value);
    if (page === 'settings') {
      try {
        setSubscription(await getSubscription());
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Unable to load subscription.');
      }
    }
    setLoading(false);
  };

  useEffect(() => { void loadData(); }, [page]);

  const allLogs = capsules.flatMap(capsule => (capsule.logs || [])
    .filter(log => !currentUser.id || log.creator_id === currentUser.id)
    .map(log => ({ ...log, capsule })));
  const allArticles = capsules.flatMap(capsule => (capsule.articles || [])
    .filter(article => !currentUser.id || article.author_id === currentUser.id)
    .map(article => ({ ...article, capsule })));
  const latestLogs = [...allLogs].sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime()).slice(0, 3);
  const latestArticles = [...allArticles].sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime()).slice(0, 3);
  const activities: Activity[] = [
    ...capsules.map(capsule => ({
      id: `capsule-${capsule.id}`, title: capsule.title, detail: 'Capsule created',
      date: capsule.created_at, kind: 'capsule' as const, capsuleId: capsule.id,
    })),
    ...allLogs.map(item => ({
      id: `log-${item.id}`, title: item.title || 'Untitled log', detail: `Log in ${item.capsule.title}`,
      date: item.created_at, kind: 'log' as const, capsuleId: item.capsule.id,
    })),
    ...allArticles.map(item => ({
      id: `article-${item.id}`, title: item.title, detail: `Article in ${item.capsule.title}`,
      date: item.created_at, kind: 'article' as const, capsuleId: item.capsule.id,
    })),
  ].sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime()).slice(0, 5);

  const goTo = (nextPage: PageView, id = '') => {
    setSelectedRecordId(id);
    setCurrentPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedCapsule = capsules.find(capsule => capsule.id === selectedRecordId);
  const selectedLogEntry = allLogs.find(item => item.id === selectedRecordId);
  const selectedArticleEntry = allArticles.find(item => item.id === selectedRecordId);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      setProfile(await updateUserProfile({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
        location: profile.location || '',
        website_url: profile.website_url || '',
        github_url: profile.github_url || '',
      }));
      setEditing(false);
      setMessage('Profile updated.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update your profile.');
    } finally {
      setSaving(false);
    }
  };

  const beginArticleEdit = (article: ArticleRecord) => {
    setArticleDraft({
      title: article.title,
      body: article.body || article.content || '',
      conclusion: article.conclusion || '',
    });
    setEditing(true);
  };

  const saveArticle = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedArticleEntry) return;
    setSaving(true);
    try {
      await updateArticle(selectedArticleEntry.id, articleDraft);
      setMessage('Article updated.');
      setEditing(false);
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update article.');
    } finally {
      setSaving(false);
    }
  };

  const removeArticle = async () => {
    if (!selectedArticleEntry || !window.confirm('Delete this article? This cannot be undone.')) return;
    try {
      await deleteArticle(selectedArticleEntry.id);
      goTo('articles');
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to delete article.');
    }
  };

  const saveAggregation = async (capsule: CapsuleSummary, mode: 'PER_USER' | 'CAPSULE') => {
    try {
      await updateCapsule(capsule.id, { aggregation_mode: mode });
      setMessage(`Aggregation updated for ${capsule.title}.`);
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update aggregation.');
    }
  };

  const startPayment = async () => {
    try {
      const payment = await initializeSubscriptionPayment();
      window.location.assign(payment.payment_url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to start payment.');
    }
  };

  const manageSubscription = async () => {
    try {
      setSubscription(await cancelSubscription());
      setMessage('Subscription cancellation scheduled.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update subscription.');
    }
  };

  const heading = page === 'profile' ? 'Developer profile'
    : page === 'capsules' ? 'Your capsules'
      : page === 'logs' ? 'Your logs'
        : page === 'articles' ? 'Your articles'
          : page === 'settings' ? 'Account settings'
            : page === 'capsule-detail' ? selectedCapsule?.title || 'Capsule'
              : page === 'log-detail' ? selectedLogEntry?.title || 'Log'
                : selectedArticleEntry?.title || 'Article';

  const navButton = (label: string, icon: React.ReactNode, nextPage: PageView) => (
    <button onClick={() => goTo(nextPage)} className={`inline-flex items-center gap-2 border px-4 py-3 text-sm font-semibold transition-colors ${line} ${surface} hover:border-[#6B7A3D]`}>
      {icon}{label}<ArrowRight className="h-4 w-4" />
    </button>
  );

  const pageTitle = (
    <header className={`mb-8 flex flex-wrap items-end justify-between gap-4 border-b pb-5 ${line}`}>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-[#8C5E3C]">Account / {page.replace('-', ' ')}</p>
        <h1 className={`mt-2 text-3xl font-serif font-bold ${ink}`}>{heading}</h1>
      </div>
      {page !== 'profile' && <button onClick={() => goTo('profile')} className={`inline-flex items-center gap-2 py-2 text-sm ${muted} hover:text-[#6B7A3D}`}><ArrowLeft className="h-4 w-4" /> Profile</button>}
    </header>
  );

  const openState = (capsule: CapsuleSummary) => new Date(capsule.maturity_date).getTime() <= Date.now();
  const avatar = profile.avatar_url;

  return (
    <div className={`mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 ${ink}`}>
      {pageTitle}
      {message && <div role="status" className={`mb-6 flex items-center justify-between border border-[#6B7A3D]/40 bg-[#6B7A3D]/10 px-4 py-3 text-sm ${ink}`}>
        {message}<button aria-label="Dismiss message" onClick={() => setMessage('')}><X className="h-4 w-4" /></button>
      </div>}
      {loading ? <p className={`py-10 text-sm ${muted}`}>Loading your account...</p> : <>
        {page === 'profile' && <>
          <section className={`grid gap-8 border-b pb-8 lg:grid-cols-[minmax(0,1fr)_280px] ${line}`}>
            <div className="flex gap-5">
              {avatar ? <img src={avatar} alt="Profile avatar" className={`h-24 w-24 shrink-0 border object-cover ${line}`} /> : <div className="flex h-24 w-24 shrink-0 items-center justify-center border bg-[#6B7A3D]/10 text-3xl font-serif font-bold text-[#6B7A3D]">{(profile.display_name || profile.email).slice(0, 1).toUpperCase()}</div>}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-serif font-bold">{profile.display_name || profile.email.split('@')[0]}</h2>
                  <button onClick={() => { setEditing(!editing); setMessage(''); }} className={`border p-2 ${line} ${surface}`} title="Edit profile" aria-label="Edit profile"><Pencil className="h-4 w-4" /></button>
                </div>
                <p className={`mt-1 text-sm ${muted}`}>{profile.email}</p>
                <p className={`mt-4 max-w-2xl whitespace-pre-wrap text-sm leading-7 ${muted}`}>{profile.bio || 'Add a short bio about what you build and what you care about.'}</p>
                <div className={`mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs ${muted}`}>
                  {profile.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{profile.location}</span>}
                  {profile.website_url && <a className="inline-flex items-center gap-1.5 hover:text-[#6B7A3D]" href={profile.website_url} target="_blank" rel="noreferrer"><Globe className="h-3.5 w-3.5" />Website<ExternalLink className="h-3 w-3" /></a>}
                  {profile.github_url && <a className="inline-flex items-center gap-1.5 hover:text-[#6B7A3D]" href={profile.github_url} target="_blank" rel="noreferrer"><Github className="h-3.5 w-3.5" />GitHub<ExternalLink className="h-3 w-3" /></a>}
                </div>
              </div>
            </div>
            <div className={`grid grid-cols-3 gap-3 self-start border p-4 ${line} ${soft}`}>
              <div><p className="text-2xl font-serif font-bold">{capsules.length}</p><p className={`mt-1 text-[10px] uppercase tracking-wider ${muted}`}>Capsules</p></div>
              <div><p className="text-2xl font-serif font-bold">{allLogs.length}</p><p className={`mt-1 text-[10px] uppercase tracking-wider ${muted}`}>Logs</p></div>
              <div><p className="text-2xl font-serif font-bold">{allArticles.length}</p><p className={`mt-1 text-[10px] uppercase tracking-wider ${muted}`}>Articles</p></div>
            </div>
          </section>

          {editing && <form onSubmit={saveProfile} className={`grid gap-4 border-b py-7 md:grid-cols-2 ${line}`}>
            <label className={`text-xs font-bold ${muted}`}>Display name<input value={profile.display_name || ''} onChange={event => setProfile({ ...profile, display_name: event.target.value })} maxLength={80} className={`mt-2 w-full border bg-transparent p-3 text-sm ${line} ${ink}`} /></label>
            <label className={`text-xs font-bold ${muted}`}>Avatar image URL<input type="url" value={profile.avatar_url || ''} onChange={event => setProfile({ ...profile, avatar_url: event.target.value })} placeholder="https://..." className={`mt-2 w-full border bg-transparent p-3 text-sm ${line} ${ink}`} /></label>
            <label className={`text-xs font-bold ${muted} md:col-span-2`}>Bio<textarea value={profile.bio || ''} onChange={event => setProfile({ ...profile, bio: event.target.value })} maxLength={500} rows={3} className={`mt-2 w-full border bg-transparent p-3 text-sm ${line} ${ink}`} /></label>
            <label className={`text-xs font-bold ${muted}`}>Location<input value={profile.location || ''} onChange={event => setProfile({ ...profile, location: event.target.value })} maxLength={100} className={`mt-2 w-full border bg-transparent p-3 text-sm ${line} ${ink}`} /></label>
            <label className={`text-xs font-bold ${muted}`}>Website<input type="url" value={profile.website_url || ''} onChange={event => setProfile({ ...profile, website_url: event.target.value })} placeholder="https://..." className={`mt-2 w-full border bg-transparent p-3 text-sm ${line} ${ink}`} /></label>
            <label className={`text-xs font-bold ${muted}`}>GitHub profile<input type="url" value={profile.github_url || ''} onChange={event => setProfile({ ...profile, github_url: event.target.value })} placeholder="https://github.com/..." className={`mt-2 w-full border bg-transparent p-3 text-sm ${line} ${ink}`} /></label>
            <div className="flex items-end gap-2"><button disabled={saving} className="inline-flex items-center gap-2 bg-[#6B7A3D] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"><Save className="h-4 w-4" />{saving ? 'Saving...' : 'Save profile'}</button><button type="button" onClick={() => setEditing(false)} className={`border px-4 py-3 text-sm ${line}`}>Cancel</button></div>
          </form>}

          <section className="py-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div><p className="font-mono text-[10px] uppercase tracking-widest text-[#8C5E3C]">Your archive</p><h2 className="mt-1 text-xl font-serif font-bold">Recent activity</h2></div>
              <button onClick={() => goTo('settings')} className={`inline-flex items-center gap-2 border px-3 py-2 text-xs ${line} ${surface}`}><Settings2 className="h-4 w-4" /> Settings</button>
            </div>
            {activities.length ? <div className={`divide-y border ${line}`}>
              {activities.map((activity, index) => <button key={activity.id} onClick={() => goTo(activity.kind === 'capsule' ? 'capsule-detail' : activity.kind === 'log' ? 'log-detail' : 'article-detail', activity.kind === 'capsule' ? activity.capsuleId : activity.id.slice(activity.kind.length + 1))} className={`grid w-full grid-cols-[32px_1fr_auto] items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-[#6B7A3D]/5 ${index === 0 ? soft : surface}`}>
                <span className="flex h-8 w-8 items-center justify-center bg-[#6B7A3D]/10 text-[#6B7A3D]">{activity.kind === 'capsule' ? <FolderKanban className="h-4 w-4" /> : activity.kind === 'log' ? <FileText className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}</span>
                <span className="min-w-0"><span className="block truncate text-sm font-semibold">{activity.title}</span><span className={`mt-1 block text-xs ${muted}`}>{activity.detail}</span></span>
                <span className={`whitespace-nowrap text-xs ${muted}`}>{formatDate(activity.date)}</span>
              </button>)}
            </div> : <p className={`border p-5 text-sm ${line} ${muted}`}>Your recent logs and articles will appear here as you build.</p>}
          </section>
          <section className="grid gap-8 border-b pb-8 md:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center justify-between"><h2 className="font-serif text-lg font-bold">Latest logs</h2><button onClick={() => goTo('logs')} className="text-xs font-semibold text-[#6B7A3D]">All logs</button></div>
              <div className={`divide-y border ${line}`}>
                {latestLogs.map(({ capsule, ...log }) => <button key={log.id} onClick={() => goTo('log-detail', log.id)} className={`block w-full p-4 text-left hover:bg-[#6B7A3D]/5 ${surface}`}><span className="block truncate text-sm font-semibold">{log.title || 'Untitled log'}</span><span className={`mt-1 block text-xs ${muted}`}>{excerpt(log.description, 110)}</span><span className="mt-2 block font-mono text-[10px] text-[#8C5E3C]">{capsule.title} · {formatDate(log.created_at)}</span></button>)}
                {!latestLogs.length && <p className={`p-4 text-sm ${muted}`}>No logs recorded yet.</p>}
              </div>
            </div>
            <div>
              <div className="mb-3 flex items-center justify-between"><h2 className="font-serif text-lg font-bold">Latest articles</h2><button onClick={() => goTo('articles')} className="text-xs font-semibold text-[#6B7A3D]">All articles</button></div>
              <div className={`divide-y border ${line}`}>
                {latestArticles.map(({ capsule, ...article }) => <button key={article.id} onClick={() => goTo('article-detail', article.id)} className={`block w-full p-4 text-left hover:bg-[#6B7A3D]/5 ${surface}`}><span className="block truncate text-sm font-semibold">{article.title}</span><span className={`mt-1 block text-xs ${muted}`}>{excerpt(article.body || article.content || '', 110)}</span><span className="mt-2 block font-mono text-[10px] text-[#8C5E3C]">{capsule.title} · {formatDate(article.created_at)}</span></button>)}
                {!latestArticles.length && <p className={`p-4 text-sm ${muted}`}>No articles generated yet.</p>}
              </div>
            </div>
          </section>
          <nav className="flex flex-wrap gap-3">
            {navButton('Capsules', <FolderKanban className="h-4 w-4 text-[#6B7A3D]" />, 'capsules')}
            {navButton('Logs', <FileText className="h-4 w-4 text-[#6B7A3D]" />, 'logs')}
            {navButton('Articles', <BookOpen className="h-4 w-4 text-[#6B7A3D]" />, 'articles')}
            {navButton('Workspace', <Layers3 className="h-4 w-4 text-[#6B7A3D]" />, 'dashboard')}
          </nav>
        </>}

        {page === 'capsules' && <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {capsules.map(capsule => {
            const languages = [...new Set((capsule.logs || []).map(log => log.code_language).filter(Boolean))];
            const frameworks = [...new Set((capsule.logs || []).map(log => log.code_framework).filter(Boolean))];
            const open = openState(capsule);
            return <button key={capsule.id} onClick={() => goTo('capsule-detail', capsule.id)} className={`border p-5 text-left transition-colors hover:border-[#6B7A3D] ${line} ${surface}`}>
              <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-widest text-[#8C5E3C]">{open ? 'Open' : 'Sealed'}</p><h2 className="mt-2 text-lg font-serif font-bold">{capsule.title}</h2></div><FolderKanban className="h-5 w-5 shrink-0 text-[#6B7A3D]" /></div>
              <p className={`mt-3 line-clamp-2 min-h-10 text-sm ${muted}`}>{capsule.description || 'No capsule description.'}</p>
              <div className={`mt-5 flex items-center gap-4 border-t pt-4 text-xs ${line} ${muted}`}><span>{capsule.logs?.length || 0} logs</span><span>{capsule.articles?.length || 0} articles</span><span className="ml-auto inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{formatDate(capsule.maturity_date)}</span></div>
              <p className={`mt-3 text-xs ${muted}`}>{[...languages, ...frameworks].filter(Boolean).join(' · ') || 'Language and framework appear with your first log.'}</p>
            </button>;
          })}
          {!capsules.length && <p className={`border p-5 text-sm ${line} ${muted}`}>No capsules yet. Start one from your workspace.</p>}
        </section>}

        {page === 'logs' && <section className={`divide-y border ${line}`}>
          {allLogs.map(({ capsule, ...log }) => <button key={log.id} onClick={() => goTo('log-detail', log.id)} className={`grid w-full gap-2 px-5 py-4 text-left transition-colors hover:bg-[#6B7A3D]/5 sm:grid-cols-[1fr_auto] ${surface}`}>
            <span className="min-w-0"><span className="block truncate font-serif font-bold">{log.title || 'Untitled log'}</span><span className={`mt-1 block text-sm ${muted}`}>{excerpt(log.description || '', 180)}</span><span className="mt-2 block font-mono text-[10px] uppercase tracking-wider text-[#8C5E3C]">{capsule.title}</span></span><span className={`whitespace-nowrap text-xs ${muted}`}>{formatDate(log.created_at)}</span>
          </button>)}
          {!allLogs.length && <p className={`p-5 text-sm ${muted}`}>No logs have been recorded yet.</p>}
        </section>}

        {page === 'articles' && <section className="grid gap-3 md:grid-cols-2">
          {allArticles.map(({ capsule, ...article }) => <button key={article.id} onClick={() => goTo('article-detail', article.id)} className={`border p-5 text-left transition-colors hover:border-[#6B7A3D] ${line} ${surface}`}>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8C5E3C]">{capsule.title} · {formatDate(article.created_at)}</span><h2 className="mt-3 font-serif text-lg font-bold">{article.title}</h2><p className={`mt-2 text-sm leading-6 ${muted}`}>{excerpt(article.body || article.content || '', 155)}</p>
          </button>)}
          {!allArticles.length && <p className={`border p-5 text-sm ${line} ${muted}`}>Generated articles will be collected here.</p>}
        </section>}

        {page === 'capsule-detail' && selectedCapsule && <>
          <section className={`grid gap-5 border-b pb-6 md:grid-cols-3 ${line}`}>
            <div><p className={`text-xs uppercase tracking-widest ${muted}`}>Status</p><p className="mt-2 font-serif text-lg font-bold">{openState(selectedCapsule) ? 'Open' : 'Sealed until'} {!openState(selectedCapsule) && formatDate(selectedCapsule.maturity_date)}</p></div>
            <div><p className={`text-xs uppercase tracking-widest ${muted}`}>Timeline mode</p><p className="mt-2 font-serif text-lg font-bold">{selectedCapsule.aggregation_mode === 'CAPSULE' ? 'Shared capsule' : 'Per contributor'}</p></div>
            <div><p className={`text-xs uppercase tracking-widest ${muted}`}>Archive</p><p className="mt-2 font-serif text-lg font-bold">{selectedCapsule.logs?.length || 0} logs · {selectedCapsule.articles?.length || 0} articles</p></div>
          </section>
          <p className={`py-5 text-sm leading-7 ${muted}`}>{selectedCapsule.description || 'No description provided.'}</p>
          <div className="grid gap-8 md:grid-cols-2">
            <section><h2 className="mb-3 font-serif text-lg font-bold">Logs</h2><div className={`divide-y border ${line}`}>{(selectedCapsule.logs || []).map(log => <button key={log.id} onClick={() => goTo('log-detail', log.id)} className={`block w-full p-4 text-left hover:bg-[#6B7A3D]/5 ${surface}`}><span className="font-semibold">{log.title || 'Untitled log'}</span><span className={`mt-1 block text-sm ${muted}`}>{excerpt(log.description, 100)}</span></button>)}</div></section>
            <section><h2 className="mb-3 font-serif text-lg font-bold">Articles</h2><div className={`divide-y border ${line}`}>{(selectedCapsule.articles || []).map(article => <button key={article.id} onClick={() => goTo('article-detail', article.id)} className={`block w-full p-4 text-left hover:bg-[#6B7A3D]/5 ${surface}`}><span className="font-semibold">{article.title}</span><span className={`mt-1 block text-sm ${muted}`}>{excerpt(article.body || article.content || '', 100)}</span></button>)}</div></section>
          </div>
        </>}

        {page === 'log-detail' && selectedLogEntry && <article className={`max-w-3xl border p-6 sm:p-8 ${line} ${surface}`}>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#8C5E3C]">{selectedLogEntry.capsule.title} · {formatDate(selectedLogEntry.created_at)}</p>
          <h2 className="mt-4 text-2xl font-serif font-bold">{selectedLogEntry.title || 'Untitled log'}</h2>
          <p className={`mt-6 whitespace-pre-wrap text-sm leading-7 ${muted}`}>{selectedLogEntry.description}</p>
          {(selectedLogEntry.code_language || selectedLogEntry.code_framework) && <p className="mt-8 border-t pt-4 font-mono text-xs text-[#6B7A3D]">{[selectedLogEntry.code_language, selectedLogEntry.code_framework].filter(Boolean).join(' · ')}</p>}
        </article>}

        {page === 'article-detail' && selectedArticleEntry && <article className={`max-w-3xl border p-6 sm:p-8 ${line} ${surface}`}>
          <div className="flex items-start justify-between gap-4"><p className="font-mono text-[10px] uppercase tracking-widest text-[#8C5E3C]">{selectedArticleEntry.capsule.title} · {formatDate(selectedArticleEntry.created_at)}</p><div className="flex shrink-0 gap-2"><button onClick={() => editing ? setEditing(false) : beginArticleEdit(selectedArticleEntry)} className={`border p-2 ${line}`} aria-label={editing ? 'Cancel article edit' : 'Edit article'} title={editing ? 'Cancel edit' : 'Edit article'}>{editing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}</button><button onClick={removeArticle} className="border border-red-700/30 p-2 text-red-700" aria-label="Delete article" title="Delete article"><Trash2 className="h-4 w-4" /></button></div></div>
          {editing ? <form onSubmit={saveArticle} className="mt-6 space-y-4">
            <label className={`block text-xs font-bold ${muted}`}>Title<input required value={articleDraft.title} onChange={event => setArticleDraft({ ...articleDraft, title: event.target.value })} className={`mt-2 w-full border bg-transparent p-3 text-base font-serif ${line} ${ink}`} /></label>
            <label className={`block text-xs font-bold ${muted}`}>Body<textarea required rows={12} value={articleDraft.body} onChange={event => setArticleDraft({ ...articleDraft, body: event.target.value })} className={`mt-2 w-full border bg-transparent p-3 text-sm leading-7 ${line} ${ink}`} /></label>
            <label className={`block text-xs font-bold ${muted}`}>Conclusion<textarea rows={4} value={articleDraft.conclusion} onChange={event => setArticleDraft({ ...articleDraft, conclusion: event.target.value })} className={`mt-2 w-full border bg-transparent p-3 text-sm leading-7 ${line} ${ink}`} /></label>
            <button disabled={saving} className="inline-flex items-center gap-2 bg-[#6B7A3D] px-4 py-3 text-sm font-bold text-white"><Save className="h-4 w-4" />{saving ? 'Saving...' : 'Save article'}</button>
          </form> : <>
            <h2 className="mt-5 text-3xl font-serif font-bold">{selectedArticleEntry.title}</h2>
            <section className="mt-8"><h3 className="font-mono text-[10px] uppercase tracking-widest text-[#8C5E3C]">Article</h3><div className={`mt-3 whitespace-pre-wrap text-sm leading-8 ${muted}`}>{selectedArticleEntry.body || selectedArticleEntry.content}</div></section>
            {selectedArticleEntry.conclusion && <section className={`mt-8 border-t pt-6 ${line}`}><h3 className="font-mono text-[10px] uppercase tracking-widest text-[#8C5E3C]">Conclusion</h3><p className={`mt-3 whitespace-pre-wrap text-sm leading-8 ${muted}`}>{selectedArticleEntry.conclusion}</p></section>}
          </>}
        </article>}

        {page === 'settings' && <div className="space-y-10">
          <section>
            <div className="mb-4 flex items-center gap-3"><Layers3 className="h-5 w-5 text-[#6B7A3D]" /><div><h2 className="font-serif text-xl font-bold">Log aggregation timelines</h2><p className={`mt-1 text-sm ${muted}`}>Choose how each capsule groups a day of logs into an article timeline.</p></div></div>
            <div className={`divide-y border ${line}`}>
              {capsules.map(capsule => <div key={capsule.id} className={`flex flex-wrap items-center justify-between gap-4 p-4 ${surface}`}>
                <div><p className="font-semibold">{capsule.title}</p><p className={`mt-1 text-xs ${muted}`}>Daily log windows</p></div>
                <div className={`inline-flex border p-1 ${line}`}>
                  <button onClick={() => void saveAggregation(capsule, 'PER_USER')} className={`px-3 py-2 text-xs ${capsule.aggregation_mode !== 'CAPSULE' ? 'bg-[#6B7A3D] text-white' : muted}`}>Per contributor</button>
                  <button onClick={() => void saveAggregation(capsule, 'CAPSULE')} className={`px-3 py-2 text-xs ${capsule.aggregation_mode === 'CAPSULE' ? 'bg-[#6B7A3D] text-white' : muted}`}>Shared capsule</button>
                </div>
              </div>)}
              {!capsules.length && <p className={`p-4 text-sm ${muted}`}>Create a capsule to configure its timeline.</p>}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-3"><CreditCard className="h-5 w-5 text-[#8C5E3C]" /><div><h2 className="font-serif text-xl font-bold">Plan and subscription</h2><p className={`mt-1 text-sm ${muted}`}>Current access and available subscription action.</p></div></div>
            <div className={`grid gap-6 border p-5 md:grid-cols-[1fr_auto] md:items-center ${line} ${surface}`}>
              <div><p className="font-mono text-xs uppercase tracking-widest text-[#8C5E3C]">{subscription?.plan_code || 'Capsule monthly'}</p><p className="mt-2 font-serif text-2xl font-bold">{subscription ? `${subscription.currency} ${(subscription.amount / 100).toLocaleString()} / month` : 'Loading plan...'}</p><p className={`mt-2 text-sm ${muted}`}>Status: {subscription?.status || 'Unavailable'}{subscription?.current_period_end ? ` · Renews ${formatDate(subscription.current_period_end)}` : ''}</p></div>
              {subscription?.status === 'active' ? <button onClick={() => void manageSubscription()} className={`inline-flex items-center justify-center gap-2 border px-4 py-3 text-sm ${line}`}><X className="h-4 w-4" />{subscription.cancel_at_period_end ? 'Cancellation scheduled' : 'Cancel renewal'}</button> : <button onClick={() => void startPayment()} className="inline-flex items-center justify-center gap-2 bg-[#6B7A3D] px-4 py-3 text-sm font-bold text-white"><CreditCard className="h-4 w-4" />Choose monthly plan</button>}
            </div>
          </section>

          <section className={`border-t pt-6 ${line}`}><h2 className="font-serif text-xl font-bold">Account</h2><p className={`mt-2 text-sm ${muted}`}>{profile.email} · {profile.is_verified ? 'Verified account' : 'Email verification pending'}</p><button onClick={() => goTo('profile')} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#6B7A3D]">Edit public profile<ArrowRight className="h-4 w-4" /></button></section>
        </div>}

        {!selectedCapsule && page === 'capsule-detail' && <p className={`text-sm ${muted}`}>That capsule is not in your collection.</p>}
        {!selectedLogEntry && page === 'log-detail' && <p className={`text-sm ${muted}`}>That log is not in your collection.</p>}
        {!selectedArticleEntry && page === 'article-detail' && <p className={`text-sm ${muted}`}>That article is not in your collection.</p>}
      </>}
    </div>
  );
};