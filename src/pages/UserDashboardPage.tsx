import React, { useEffect, useState } from 'react';
import { Archive, CalendarClock, CreditCard, FolderGit2, Plus, ShieldCheck, X } from 'lucide-react';
import { cancelSubscription, createCapsule, getSubscription, initializeSubscriptionPayment, listCapsules } from '../lib/api';
import { AuthUser, CapsuleSummary, Subscription, Theme } from '../types';

interface UserDashboardPageProps { currentUser: AuthUser; theme: Theme; }

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ currentUser, theme }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [capsules, setCapsules] = useState<CapsuleSummary[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maturityDate, setMaturityDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const isLight = theme === 'light';

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
    const payment = await initializeSubscriptionPayment();
    window.location.assign(payment.payment_url);
  };

  const submitCapsule = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createCapsule({ title, description, maturity_date: new Date(maturityDate).toISOString() });
      setTitle(''); setDescription(''); setMaturityDate(''); setMessage('Capsule created.'); refresh();
    } catch (error: any) { setMessage(error.message || 'Unable to create capsule.'); }
  };

  const trialEnd = subscription?.trial_ends_at ? new Date(subscription.trial_ends_at).toLocaleDateString() : null;
  return <div className={`pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 ${isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'}`}>
    <header className="border-b border-[#DCD5C9] pb-6">
      <span className="text-xs font-mono uppercase tracking-widest text-[#8C5E3C]">Your workspace</span>
      <h1 className="text-3xl font-serif font-extrabold text-[#8C5E3C] mt-2">Capsules, in progress.</h1>
      <p className="text-sm text-[#786E65] mt-2">{currentUser.email} · Keep a durable record of what you are building.</p>
    </header>
    {message && <div className="border border-[#6B7A3D]/40 bg-[#6B7A3D]/10 p-3 text-sm">{message}</div>}
    <section className="grid lg:grid-cols-[1fr_2fr] gap-6">
      <div className={`border p-6 space-y-5 ${isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A] border-[#2C3325]'}`}>
        <div className="flex items-center gap-3"><ShieldCheck className="text-[#6B7A3D]" /><h2 className="font-serif font-bold text-lg">Access</h2></div>
        <p className="text-2xl font-serif font-bold">{subscription?.status === 'trialing' ? 'Free trial' : subscription?.status || 'Loading'}</p>
        <p className="text-sm text-[#786E65]">{trialEnd ? `Your trial ends ${trialEnd}.` : 'NGN 1,000 monthly after the trial.'}</p>
        {subscription?.status !== 'active' ? <button onClick={startPayment} className="w-full py-3 bg-[#6B7A3D] text-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2"><CreditCard className="w-4 h-4" /> Continue for NGN 1,000/month</button> : <button onClick={async () => { await cancelSubscription(); setMessage('Cancellation scheduled for the end of the current period.'); refresh(); }} className="w-full py-3 border border-[#8C5E3C] text-[#8C5E3C] text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2"><X className="w-4 h-4" /> Cancel renewal</button>}
      </div>
      <div className={`border p-6 ${isLight ? 'bg-white border-[#DCD5C9]' : 'bg-[#131513] border-[#2C3325]'}`}>
        <div className="flex items-center gap-3 mb-5"><FolderGit2 className="text-[#8C5E3C]" /><h2 className="font-serif font-bold text-lg">Your capsules</h2><span className="ml-auto text-xs font-mono text-[#786E65]">{capsules.length} repositories</span></div>
        {loading ? <p className="text-sm text-[#786E65]">Loading workspace...</p> : capsules.length === 0 ? <p className="text-sm text-[#786E65]">No capsules yet. Start one below.</p> : <div className="space-y-2">{capsules.map(capsule => <div key={capsule.id} className="border border-[#DCD5C9] p-4 flex items-center justify-between"><div><p className="font-serif font-bold">{capsule.title}</p><p className="text-xs text-[#786E65]">Updated {new Date(capsule.updated_at).toLocaleDateString()}</p></div><Archive className="w-4 h-4 text-[#6B7A3D]" /></div>)}</div>}
      </div>
    </section>
    <section className={`border p-6 max-w-2xl ${isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A] border-[#2C3325]'}`}>
      <div className="flex items-center gap-3 mb-5"><Plus className="text-[#6B7A3D]" /><h2 className="font-serif font-bold text-lg">Create a capsule</h2></div>
      <form onSubmit={submitCapsule} className="space-y-4"><input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Capsule name" className="w-full border border-[#DCD5C9] p-3 bg-transparent" /><textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="What are you building?" className="w-full border border-[#DCD5C9] p-3 bg-transparent min-h-24" /><label className="block text-xs font-bold text-[#786E65]">Maturity date<input required type="datetime-local" value={maturityDate} onChange={e => setMaturityDate(e.target.value)} className="block w-full border border-[#DCD5C9] p-3 mt-1 bg-transparent" /></label><button className="py-3 px-5 bg-[#8C5E3C] text-white text-xs uppercase tracking-widest font-bold flex items-center gap-2"><CalendarClock className="w-4 h-4" /> Create capsule</button></form>
    </section>
  </div>;
};