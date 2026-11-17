import React, { useEffect, useState } from 'react';
import { Archive, CalendarClock, CreditCard, FolderGit2, Layers3, Plus, ShieldCheck, X } from 'lucide-react';
import { cancelSubscription, createCapsule, getSubscription, initializeSubscriptionPayment, listCapsules } from '../lib/api';
import { formatDate } from '../lib/articles';
import { CollectionHeader, EmptyState, useCollectionStyles } from '../components/CollectionChrome';
import { AuthUser, CapsuleSummary, PageView, Subscription, Theme } from '../types';

interface UserDashboardPageProps {
  currentUser: AuthUser;
  theme: Theme;
  setCurrentPage: (page: PageView) => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ currentUser, theme, setCurrentPage }) => {
  const s = useCollectionStyles(theme);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [capsules, setCapsules] = useState<CapsuleSummary[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maturityDate, setMaturityDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const [nextSubscription, nextCapsules] = await Promise.all([getSubscription(), listCapsules()]);
      setSubscription(nextSubscription);
      setCapsules(nextCapsules);
    } catch (error: any) {
      setMessage(error.message || 'Unable to load your workspace.');
    } finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  const startPayment = async () => {
    try {
      const payment = await initializeSubscriptionPayment();
      window.location.assign(payment.payment_url);
    } catch (error: any) { setMessage(error.message || 'Unable to start payment.'); }
  };

  const submitCapsule = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createCapsule({ title, description, maturity_date: new Date(maturityDate).toISOString() });
      setTitle(''); setDescription(''); setMaturityDate(''); setMessage('Capsule created.'); refresh();
    } catch (error: any) { setMessage(error.message || 'Unable to create capsule.'); }
  };

  const navigate = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const trialEnd = subscription?.trial_ends_at ? formatDate(subscription.trial_ends_at) : null;

  return (
    <div className={`pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 transition-colors ${s.ink}`}>
      <CollectionHeader
        page="dashboard"
        theme={theme}
        onNavigate={navigate}
        icon={<Layers3 className="h-3.5 w-3.5" />}
        eyebrow="Your Workspace"
        title="Capsules, in progress."
        subtitle={`${currentUser.email} · Keep a durable record of what you are building.`}
        counts={loading ? undefined : { capsules: capsules.length }}
      />

      {message && (
        <div role="status" className="shadow-soft flex items-center justify-between gap-4 rounded-xl border border-[#6B7A3D]/30 bg-[#6B7A3D]/15 p-3.5 text-xs font-serif font-bold text-[#6B7A3D]">
          <span>{message}</span>
          <button aria-label="Dismiss message" onClick={() => setMessage('')}><X className="h-4 w-4" /></button>
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div className={`${s.card} space-y-5 p-6`}>
          <div className={`flex items-center justify-between ${s.muted}`}>
            <span className="text-xs font-serif font-bold uppercase tracking-wider">Access</span>
            <ShieldCheck className="h-4 w-4 text-[#6B7A3D]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#8C5E3C]">
            {subscription?.status === 'trialing' ? 'Free trial' : subscription?.status || 'Loading'}
          </p>
          <p className={`text-sm ${s.body}`}>{trialEnd ? `Your trial ends ${trialEnd}.` : 'NGN 1,000 monthly after the trial.'}</p>
          {subscription?.status !== 'active' ? (
            <button onClick={startPayment} className={`${s.primaryButton} w-full`}>
              <CreditCard className="h-4 w-4" /> Continue for NGN 1,000/month
            </button>
          ) : (
            <button
              onClick={async () => {
                try {
                  await cancelSubscription();
                  setMessage('Cancellation scheduled for the end of the current period.');
                  refresh();
                } catch (error: any) { setMessage(error.message || 'Unable to update subscription.'); }
              }}
              className={`${s.secondaryButton} w-full`}
            >
              <X className="h-4 w-4" /> Cancel renewal
            </button>
          )}
        </div>

        <div className={`${s.panel} p-6`}>
          <div className="mb-5 flex items-center gap-3">
            <FolderGit2 className="h-5 w-5 text-[#8C5E3C]" />
            <h2 className="text-lg font-serif font-bold text-[#8C5E3C]">Your capsules</h2>
            <span className={`ml-auto ${s.meta}`}>{capsules.length} capsules</span>
          </div>
          {loading ? (
            <p className={`text-sm font-serif ${s.muted}`}>Loading workspace...</p>
          ) : capsules.length === 0 ? (
            <p className={`text-sm ${s.muted}`}>No capsules yet. Start one below.</p>
          ) : (
            <div className="space-y-3">
              {capsules.map((capsule) => (
                <button
                  key={capsule.id}
                  onClick={() => navigate('capsules')}
                  className={`${s.panel} ${s.interactive} flex w-full items-center justify-between p-4`}
                >
                  <div className="min-w-0">
                    <p className={`truncate ${s.cardTitle}`}>{capsule.title}</p>
                    <p className={s.meta}>Updated {formatDate(capsule.updated_at)}</p>
                  </div>
                  <Archive className="h-4 w-4 shrink-0 text-[#6B7A3D]" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className={`${s.card} max-w-2xl p-6 sm:p-8`}>
        <div className="mb-5 flex items-center gap-3">
          <Plus className="h-5 w-5 text-[#6B7A3D]" />
          <h2 className="text-lg font-serif font-bold text-[#8C5E3C]">Create a capsule</h2>
        </div>
        <form onSubmit={submitCapsule} className="space-y-5">
          <label className={s.label}>
            Capsule name
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Capsule name" className={`${s.input}`} />
          </label>
          <label className={s.label}>
            What are you building?
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What are you building?" className={`${s.input} min-h-24`} />
          </label>
          <label className={s.label}>
            Maturity date
            <input required type="datetime-local" value={maturityDate} onChange={(e) => setMaturityDate(e.target.value)} className={`${s.input}`} />
          </label>
          <button className={s.primaryButton}>
            <CalendarClock className="h-4 w-4" /> Create capsule
          </button>
        </form>
      </section>

      {!loading && capsules.length > 0 && (
        <EmptyState
          styles={s}
          action={
            <button onClick={() => navigate('articles')} className={s.secondaryButton}>
              Generate an article
            </button>
          }
        >
          Turn a capsule's recorded logs into an article from the Articles tab.
        </EmptyState>
      )}
    </div>
  );
};
