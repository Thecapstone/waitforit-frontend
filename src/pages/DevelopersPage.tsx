import React, { useState } from 'react';
import { PageView, Theme } from '../types';
import { WaitlistForm } from '../components/WaitlistForm';
import { Server, Terminal, Cpu, GraduationCap, Layers, CheckCircle2 } from 'lucide-react';

interface DevelopersPageProps {
  setCurrentPage: (page: PageView) => void;
  onOpenWaitlist: () => void;
  theme?: Theme;
}

export const DevelopersPage: React.FC<DevelopersPageProps> = ({ setCurrentPage, onOpenWaitlist, theme = 'light' }) => {
  const [activeRole, setActiveRole] = useState<string>('backend');
  const isLight = theme === 'light';

  const roles = [
    {
      id: 'backend',
      title: 'Backend Engineers',
      icon: Server,
      badge: 'Database & Architecture',
      tagline: 'Backend systems are full of decisions that never appear in the user interface.',
      points: [
        'Database indexing & partitioning strategies',
        'Concurrency & mutex lock optimizations',
        'Authentication & authorization middleware trade-offs',
        'Cache invalidation and streaming architecture'
      ],
      terminalSnippet: `$ wfi log\nReplaced polling loop with Redis Streams. Eliminates duplicate lock contention on checkout DB.`
    },
    {
      id: 'devops',
      title: 'DevOps & SRE',
      icon: Terminal,
      badge: 'Infrastructure & Reliability',
      tagline: 'Infrastructure decisions are often invisible once the deployment succeeds.',
      points: [
        'Zero-downtime deployment strategies',
        'Autoscaling threshold tuning & load balancer rules',
        'Production incident post-mortems & root causes',
        'Kubernetes pod resource allocation reasoning'
      ],
      terminalSnippet: `$ wfi log\nAdjusted HPA target to 70% CPU after observing memory spikes during canary release.`
    },
    {
      id: 'platform',
      title: 'Platform Engineers',
      icon: Layers,
      badge: 'Internal Developer Portals',
      tagline: 'Document how internal developer platforms evolve.',
      points: [
        'Internal API SDK abstractions',
        'CI/CD pipeline speed improvements',
        'Microservice blueprint decisions',
        'Telemetry & distributed tracing setups'
      ],
      terminalSnippet: `$ wfi log\nStandardized gRPC service template. Reduced microservice boilerplate by 60%.`
    },
    {
      id: 'ai',
      title: 'AI & ML Engineers',
      icon: Cpu,
      badge: 'Model & Evaluation',
      tagline: 'Prompt iterations, evaluation strategies, and model selection.',
      points: [
        'Prompt engineering evolution & few-shot tuning',
        'Vector embedding index benchmarks (HNSW vs IVF)',
        'Model quantization vs latency trade-offs',
        'Dataset curation & guardrail rules'
      ],
      terminalSnippet: `$ wfi log\nSwitched default embedding model to text-embedding-004. Search recall improved +14%.`
    },
    {
      id: 'student',
      title: 'Engineering Students',
      icon: GraduationCap,
      badge: 'Proof of Thinking',
      tagline: 'Build a portfolio that demonstrates how you think—not just what you built.',
      points: [
        'Show employers your system design reasoning',
        'Document debugging breakthroughs for university projects',
        'Stand out to senior engineering recruiters',
        'Build a permanent personal engineering journal'
      ],
      terminalSnippet: `$ wfi log\nFixed thread deadlock in OS homework project by implementing Banker's algorithm.`
    }
  ];

  const current = roles.find(r => r.id === activeRole) || roles[0];
  const Icon = current.icon;

  return (
    <div className={`pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-16 transition-colors ${
      isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'
    }`}>
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#8C5E3C]">
          Built For Engineers
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-[#8C5E3C] tracking-tight">
          Built for developers who solve invisible problems.
        </h1>
        <p className="text-base text-[#786E65]">
          Every engineering discipline leaves behind valuable knowledge. WaitForIt helps preserve it.
        </p>
      </div>

      {/* Role Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {roles.map((r) => {
          const RIcon = r.icon;
          const isActive = activeRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setActiveRole(r.id)}
              className={`px-4 py-2.5 rounded-none text-xs font-serif uppercase tracking-wider font-semibold border flex items-center space-x-2 transition-all ${
                isActive
                  ? 'bg-[#6B7A3D] text-[#FAF8F3] border-[#576431] shadow-sm'
                  : isLight
                  ? 'bg-white text-[#2C2825] border-[#DCD5C9] hover:bg-[#F2ECE1]'
                  : 'bg-[#1A1D1A] text-[#A0A8B0] border-[#2C3325] hover:text-white'
              }`}
            >
              <RIcon className="w-4 h-4" />
              <span>{r.title}</span>
            </button>
          );
        })}
      </div>

      {/* Role Detail View */}
      <div className={`border rounded-none p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-sm ${
        isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A]/70 border-[#2C3325]'
      }`}>
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-none bg-[#8C5E3C]/10 border border-[#8C5E3C]/30 text-[#8C5E3C] text-xs font-serif font-bold uppercase tracking-wider">
            <Icon className="w-3.5 h-3.5" />
            <span>{current.badge}</span>
          </div>

          <h2 className="text-2xl font-serif font-bold text-[#8C5E3C]">{current.title}</h2>
          <p className="text-sm text-[#8C5E3C] font-serif font-semibold italic border-l-2 border-[#6B7A3D] pl-3 py-0.5">
            "{current.tagline}"
          </p>

          <div className="space-y-2 pt-2">
            <span className="text-xs uppercase tracking-wider text-[#8C5E3C] font-serif font-bold">
              What gets preserved:
            </span>
            <ul className="space-y-2 text-xs text-[#786E65]">
              {current.points.map((pt, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#6B7A3D] flex-shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`lg:col-span-5 p-6 rounded-none border space-y-3 font-mono text-xs ${
          isLight ? 'bg-[#212521] text-[#E0E5DF] border-[#323832]' : 'bg-[#0B0C0B] text-[#E0E5DF] border-[#2C3325]'
        }`}>
          <span className="text-xs text-[#A8C898] font-bold uppercase">Terminal Snapshot:</span>
          <pre className="whitespace-pre-wrap text-[#FAF8F3] bg-[#141714] p-4 rounded-none border border-white/10 leading-relaxed font-mono">
            {current.terminalSnippet}
          </pre>
          <div className="text-[11px] text-[#C49A6C] font-mono flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-none bg-[#A8C898]"></span>
            <span>Captured live from terminal CLI</span>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className={`border rounded-none p-8 text-center space-y-6 ${
        isLight ? 'bg-[#F2ECE1] border-[#DCD5C9]' : 'bg-[#111315] border-[#2C3325]'
      }`}>
        <h3 className="text-2xl font-serif font-bold text-[#8C5E3C]">Join the waitlist for your engineering team.</h3>
        <div className="max-w-md mx-auto text-left">
          <WaitlistForm source="developers_page_cta" theme={theme} />
        </div>
      </div>
    </div>
  );
};

