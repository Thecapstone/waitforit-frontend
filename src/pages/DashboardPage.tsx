import React, { useState, useEffect } from 'react';
import { 
  WaitlistSubmission, 
  EmailDeliveryLog, 
  EmailTemplateConfig, 
  AnalyticsSummary, 
  AnalyticsEvent,
  Theme
} from '../types';
import { 
  Users, 
  TrendingUp, 
  Mail, 
  Send, 
  Download, 
  Search, 
  Filter, 
  Trash2, 
  RefreshCw, 
  Check, 
  Edit, 
  Plus, 
  BarChart3, 
  Eye, 
  Zap, 
  Code2 
} from 'lucide-react';
import {
  deleteWaitlistSubscriber,
  exportWaitlistCsv,
  fetchDashboardData,
  joinWaitlist,
  resendWelcomeEmail,
  updateEmailTemplate,
  updateWaitlistSubscriber,
} from '../lib/api';

interface DashboardPageProps {
  theme?: Theme;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ theme = 'light' }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'subscribers' | 'pipeline' | 'analytics'>('overview');
  const [subscribers, setSubscribers] = useState<WaitlistSubmission[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailDeliveryLog[]>([]);
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplateConfig | null>(null);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  const isLight = theme === 'light';

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // New subscriber modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Backend Engineer');
  const [newIsDev, setNewIsDev] = useState(true);

  // Template Edit state
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [templateSaved, setTemplateSaved] = useState(false);

  // Action feedback
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setAccessDenied(false);
    try {
      const data = await fetchDashboardData();
      setSubscribers(data.subscribers);
      setEmailLogs(data.emailLogs);
      setEmailTemplate(data.emailTemplate);
      setEditSubject(data.emailTemplate.subject);
      setEditBody(data.emailTemplate.bodyTemplate);
      setSummary(data.summary);
      setEvents(data.events);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setAccessDenied(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateWaitlistSubscriber(id, { status: newStatus as WaitlistSubmission['status'] });
      setActionMessage(`Updated subscriber status to ${newStatus}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;
    try {
      await deleteWaitlistSubscriber(id);
      setActionMessage("Subscriber removed successfully.");
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResendWelcome = async (subscriberId: string) => {
    try {
      const data = await resendWelcomeEmail(subscriberId);
      setActionMessage(data.message || "Welcome email queued.");
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await exportWaitlistCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'waitforit_subscribers.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    try {
      const data = await joinWaitlist({
        name: newName,
        email: newEmail,
        is_developer: newIsDev,
        role: newRole,
        source: 'admin_dashboard'
      });
      if (data.success) {
        setActionMessage(data.duplicate ? "Subscriber already existed." : "New subscriber added & welcome email queued!");
        setShowAddModal(false);
        setNewName('');
        setNewEmail('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      await updateEmailTemplate({
        subject: editSubject,
        bodyTemplate: editBody
      });
      setTemplateSaved(true);
      setTimeout(() => setTemplateSaved(false), 3000);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sub.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || sub.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (accessDenied) {
    return (
      <div className={`pt-28 pb-20 max-w-3xl mx-auto px-4 transition-colors ${
        isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'
      }`}>
        <div className={`border rounded-none p-8 space-y-3 shadow-sm ${
          isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A]/70 border-[#2C3325]'
        }`}>
          <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#8C5E3C]">
            Admin Access Required
          </span>
          <h1 className="text-2xl font-serif font-extrabold text-[#8C5E3C]">
            Metrics are private.
          </h1>
          <p className="text-sm text-[#786E65]">
            Sign in with an administrator account to manage subscribers, email pipeline logs, and system metrics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 transition-colors ${
      isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'
    }`}>
      {/* Top Banner & Header */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6 ${
        isLight ? 'border-[#DCD5C9]' : 'border-[#2C3325]'
      }`}>
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-none bg-[#8C5E3C]/15 border border-[#8C5E3C]/30 text-[#8C5E3C] text-xs font-serif uppercase tracking-widest font-bold">
              ADMIN CONTROL PANEL
            </span>
            <span className="text-xs text-[#786E65] font-serif">• Live Pipeline & Metrics</span>
          </div>
          <h1 className="text-3xl font-serif font-extrabold text-[#8C5E3C] pt-1">
            Waitlist & Conversion Dashboard
          </h1>
          <p className="text-xs text-[#786E65]">
            Manage subscribers, inspect welcome email pipeline logs, and track conversion rates.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchData}
            className={`px-3.5 py-2 rounded-none border text-xs font-serif uppercase tracking-wider font-bold flex items-center space-x-1.5 transition-colors ${
              isLight ? 'bg-white border-[#DCD5C9] text-[#2C2825] hover:bg-[#FAF8F3]' : 'bg-[#1A1D1A] border-[#2C3325] text-[#F5F2EA] hover:bg-[#252A25]'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-none bg-[#8C5E3C] hover:bg-[#724A2D] text-[#FAF8F3] text-xs font-serif uppercase tracking-wider font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-none bg-[#6B7A3D] hover:bg-[#576431] text-[#FAF8F3] text-xs font-serif uppercase tracking-wider font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subscriber</span>
          </button>
        </div>
      </div>

      {/* Action Notification Message */}
      {actionMessage && (
        <div className="p-3.5 rounded-none bg-[#6B7A3D]/15 border border-[#6B7A3D]/30 text-[#6B7A3D] text-xs font-serif font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-[#8C5E3C] hover:underline">✕</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className={`flex items-center space-x-2 border-b pb-2 font-serif text-xs ${
        isLight ? 'border-[#DCD5C9]' : 'border-[#2C3325]'
      }`}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-none uppercase tracking-wider font-bold transition-all flex items-center space-x-2 border ${
            activeTab === 'overview'
              ? 'bg-[#6B7A3D] text-[#FAF8F3] border-[#576431]'
              : isLight ? 'bg-white text-[#2C2825] border-[#DCD5C9]' : 'bg-[#1A1D1A] text-[#A0A8B0] border-[#2C3325]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Conversion Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('subscribers')}
          className={`px-4 py-2 rounded-none uppercase tracking-wider font-bold transition-all flex items-center space-x-2 border ${
            activeTab === 'subscribers'
              ? 'bg-[#6B7A3D] text-[#FAF8F3] border-[#576431]'
              : isLight ? 'bg-white text-[#2C2825] border-[#DCD5C9]' : 'bg-[#1A1D1A] text-[#A0A8B0] border-[#2C3325]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Subscribers ({subscribers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2 rounded-none uppercase tracking-wider font-bold transition-all flex items-center space-x-2 border ${
            activeTab === 'pipeline'
              ? 'bg-[#6B7A3D] text-[#FAF8F3] border-[#576431]'
              : isLight ? 'bg-white text-[#2C2825] border-[#DCD5C9]' : 'bg-[#1A1D1A] text-[#A0A8B0] border-[#2C3325]'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Email Pipeline ({emailLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-none uppercase tracking-wider font-bold transition-all flex items-center space-x-2 border ${
            activeTab === 'analytics'
              ? 'bg-[#6B7A3D] text-[#FAF8F3] border-[#576431]'
              : isLight ? 'bg-white text-[#2C2825] border-[#DCD5C9]' : 'bg-[#1A1D1A] text-[#A0A8B0] border-[#2C3325]'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Event Stream</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && summary && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`p-6 rounded-none border space-y-2 shadow-sm ${
              isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A]/70 border-[#2C3325]'
            }`}>
              <div className="flex items-center justify-between text-[#786E65]">
                <span className="text-xs font-serif font-bold uppercase tracking-wider">TOTAL VISITORS</span>
                <Eye className="w-4 h-4 text-[#8C5E3C]" />
              </div>
              <div className="text-3xl font-serif font-bold text-[#8C5E3C]">{summary.total_visitors}</div>
              <p className="text-[11px] text-[#6B7A3D] font-serif">Unique Session Landings</p>
            </div>

            <div className={`p-6 rounded-none border space-y-2 shadow-sm ${
              isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A]/70 border-[#2C3325]'
            }`}>
              <div className="flex items-center justify-between text-[#786E65]">
                <span className="text-xs font-serif font-bold uppercase tracking-wider">WAITLIST SIGNUPS</span>
                <Users className="w-4 h-4 text-[#6B7A3D]" />
              </div>
              <div className="text-3xl font-serif font-bold text-[#8C5E3C]">{summary.total_signups}</div>
              <p className="text-[11px] text-[#6B7A3D] font-serif">100% Organic Submissions</p>
            </div>

            <div className={`p-6 rounded-none border space-y-2 shadow-sm ${
              isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A]/70 border-[#2C3325]'
            }`}>
              <div className="flex items-center justify-between text-[#786E65]">
                <span className="text-xs font-serif font-bold uppercase tracking-wider">CONVERSION RATE</span>
                <TrendingUp className="w-4 h-4 text-[#8C5E3C]" />
              </div>
              <div className="text-3xl font-serif font-bold text-[#8C5E3C]">{summary.conversion_rate}%</div>
              <p className="text-[11px] text-[#8C5E3C] font-serif">Visitor → Waitlist Completed</p>
            </div>

            <div className={`p-6 rounded-none border space-y-2 shadow-sm ${
              isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A]/70 border-[#2C3325]'
            }`}>
              <div className="flex items-center justify-between text-[#786E65]">
                <span className="text-xs font-serif font-bold uppercase tracking-wider">WELCOME EMAIL RATE</span>
                <Mail className="w-4 h-4 text-[#6B7A3D]" />
              </div>
              <div className="text-3xl font-serif font-bold text-[#8C5E3C]">100%</div>
              <p className="text-[11px] text-[#6B7A3D] font-serif">{summary.emails_sent} Delivered via Pipeline</p>
            </div>
          </div>

          {/* Conversion Funnel Bar */}
          <div className={`border rounded-none p-6 sm:p-8 space-y-4 shadow-sm ${
            isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A]/70 border-[#2C3325]'
          }`}>
            <h3 className="text-base font-serif font-bold text-[#8C5E3C] flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-[#8C5E3C]" />
              <span>Conversion Funnel Analysis</span>
            </h3>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <div className="flex justify-between font-serif mb-1 text-[#786E65]">
                  <span>1. Site Visitors</span>
                  <span className="text-[#8C5E3C] font-bold">{summary.total_visitors} (100%)</span>
                </div>
                <div className={`w-full h-3 rounded-none overflow-hidden ${isLight ? 'bg-[#DCD5C9]' : 'bg-[#111315]'}`}>
                  <div className="h-full bg-[#8C5E3C] w-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-serif mb-1 text-[#786E65]">
                  <span>2. Primary CTA Clicked</span>
                  <span className="text-[#8C5E3C] font-bold">{summary.cta_clicks} ({Math.round((summary.cta_clicks / summary.total_visitors) * 100)}%)</span>
                </div>
                <div className={`w-full h-3 rounded-none overflow-hidden ${isLight ? 'bg-[#DCD5C9]' : 'bg-[#111315]'}`}>
                  <div className="h-full bg-[#A88860]" style={{ width: `${Math.round((summary.cta_clicks / summary.total_visitors) * 100)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-serif mb-1 text-[#786E65]">
                  <span>3. Waitlist Form Submitted</span>
                  <span className="text-[#8C5E3C] font-bold">{summary.total_signups} ({summary.conversion_rate}%)</span>
                </div>
                <div className={`w-full h-3 rounded-none overflow-hidden ${isLight ? 'bg-[#DCD5C9]' : 'bg-[#111315]'}`}>
                  <div className="h-full bg-[#6B7A3D]" style={{ width: `${summary.conversion_rate}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-serif mb-1 text-[#786E65]">
                  <span>4. Welcome Email Delivered</span>
                  <span className="text-[#8C5E3C] font-bold">{summary.emails_sent} (100% of signups)</span>
                </div>
                <div className={`w-full h-3 rounded-none overflow-hidden ${isLight ? 'bg-[#DCD5C9]' : 'bg-[#111315]'}`}>
                  <div className="h-full bg-[#576431]" style={{ width: `${summary.conversion_rate}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Role Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`border rounded-none p-6 space-y-4 shadow-sm ${
              isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A]/70 border-[#2C3325]'
            }`}>
              <h3 className="text-base font-serif font-bold text-[#8C5E3C] flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-[#6B7A3D]" />
                <span>Audience Role Breakdown</span>
              </h3>

              <div className="space-y-2 font-mono text-xs">
                {Object.entries(summary.role_breakdown).map(([role, count]) => {
                  const numCount = Number(count);
                  const pct = summary.total_signups > 0 ? Math.round((numCount / summary.total_signups) * 100) : 0;
                  return (
                    <div key={role} className={`flex items-center justify-between p-3 rounded-none border ${
                      isLight ? 'bg-white border-[#DCD5C9] text-[#2C2825]' : 'bg-[#131513] border-[#2C3325] text-[#F5F2EA]'
                    }`}>
                      <span className="font-medium">{role}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-[#6B7A3D] font-bold">{numCount}</span>
                        <span className="text-[#786E65]">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`border rounded-none p-6 space-y-4 shadow-sm ${
              isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A]/70 border-[#2C3325]'
            }`}>
              <h3 className="text-base font-serif font-bold text-[#8C5E3C] flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-[#8C5E3C]" />
                <span>Daily Signup Activity</span>
              </h3>

              <div className="space-y-2 font-mono text-xs">
                {summary.daily_metrics.map((m) => (
                  <div key={m.date} className={`flex items-center justify-between p-3 rounded-none border ${
                    isLight ? 'bg-white border-[#DCD5C9] text-[#2C2825]' : 'bg-[#131513] border-[#2C3325] text-[#F5F2EA]'
                  }`}>
                    <span className="text-[#786E65]">{m.date}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-[#8C5E3C]">{m.visitors} visits</span>
                      <span className="text-[#8C5E3C]">{m.cta_clicks} clicks</span>
                      <span className="text-[#6B7A3D] font-bold">+{m.signups} signups</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBSCRIBERS TABLE */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 border rounded-none shadow-sm ${
            isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A]/70 border-[#2C3325]'
          }`}>
            <div className="relative flex-grow max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#786E65]" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full border rounded-none pl-9 pr-3 py-2 text-xs font-mono focus:outline-none focus:border-[#6B7A3D] ${
                  isLight ? 'bg-white border-[#DCD5C9] text-[#2C2825]' : 'bg-[#131513] border-[#2C3325] text-[#F5F2EA]'
                }`}
              />
            </div>

            <div className="flex items-center space-x-3 text-xs font-serif font-bold">
              <div className="flex items-center space-x-1">
                <Filter className="w-3.5 h-3.5 text-[#8C5E3C]" />
                <span className="text-[#8C5E3C]">Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className={`border rounded-none px-2.5 py-1.5 font-mono text-xs ${
                    isLight ? 'bg-white border-[#DCD5C9] text-[#2C2825]' : 'bg-[#131513] border-[#2C3325] text-[#F5F2EA]'
                  }`}
                >
                  <option value="all">All Roles</option>
                  <option value="Backend Engineer">Backend Engineer</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Platform">Platform</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="Student">Student</option>
                </select>
              </div>

              <div className="flex items-center space-x-1">
                <span className="text-[#8C5E3C]">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`border rounded-none px-2.5 py-1.5 font-mono text-xs ${
                    isLight ? 'bg-white border-[#DCD5C9] text-[#2C2825]' : 'bg-[#131513] border-[#2C3325] text-[#F5F2EA]'
                  }`}
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className={`border rounded-none overflow-hidden shadow-sm ${
            isLight ? 'bg-[#F2ECE1]/50 border-[#DCD5C9]' : 'bg-[#1A1D1A]/50 border-[#2C3325]'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`border-b font-serif uppercase font-bold text-xs ${
                  isLight ? 'bg-[#EAE2D3] border-[#DCD5C9] text-[#8C5E3C]' : 'bg-[#131513] border-[#2C3325] text-[#8C5E3C]'
                }`}>
                  <tr>
                    <th className="p-4">Subscriber</th>
                    <th className="p-4">Developer?</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Joined At</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Welcome Email</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? 'divide-[#DCD5C9]' : 'divide-[#2C3325]'}`}>
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-[#786E65] font-serif italic">
                        No subscribers matching filter parameters.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((sub) => (
                      <tr key={sub.id} className={isLight ? 'hover:bg-white/80' : 'hover:bg-white/5'}>
                        <td className="p-4">
                          <div className="font-serif font-bold text-[#8C5E3C]">{sub.name}</div>
                          <div className="text-[11px] text-[#786E65] font-mono">{sub.email}</div>
                        </td>
                        <td className="p-4 font-mono">
                          {sub.is_developer ? (
                            <span className="text-[#6B7A3D] font-bold">Yes</span>
                          ) : (
                            <span className="text-[#786E65]">No</span>
                          )}
                        </td>
                        <td className="p-4 font-mono">
                          <span className="px-2.5 py-1 rounded-none bg-[#8C5E3C]/10 border border-[#8C5E3C]/20 text-[#8C5E3C] font-serif font-bold">
                            {sub.role || 'Backend Engineer'}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-[#786E65]">
                          {new Date(sub.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <select
                            value={sub.status}
                            onChange={(e) => handleUpdateStatus(sub.id, e.target.value)}
                            className={`border rounded-none px-2 py-1 text-[11px] font-mono ${
                              isLight ? 'bg-white border-[#DCD5C9] text-[#6B7A3D]' : 'bg-[#131513] border-[#2C3325] text-[#6B7A3D]'
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="converted">Converted</option>
                            <option value="unsubscribed">Unsubscribed</option>
                          </select>
                        </td>
                        <td className="p-4 font-mono text-[11px]">
                          {sub.welcome_email_sent ? (
                            <span className="text-[#6B7A3D] font-bold flex items-center space-x-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Sent</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleResendWelcome(sub.id)}
                              className="text-[#8C5E3C] font-bold hover:underline"
                            >
                              Send Now
                            </button>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleResendWelcome(sub.id)}
                            title="Re-send Welcome Email"
                            className="p-1.5 rounded-none bg-[#6B7A3D] text-[#FAF8F3] hover:bg-[#576431]"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubscriber(sub.id)}
                            title="Delete Subscriber"
                            className="p-1.5 rounded-none bg-red-700 text-white hover:bg-red-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EMAIL PIPELINE & TEMPLATE MANAGER */}
      {activeTab === 'pipeline' && (
        <div className="space-y-8">
          {/* Template Editor & Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Template Editor */}
            <div className={`lg:col-span-7 border rounded-none p-6 sm:p-8 space-y-4 shadow-sm ${
              isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A]/70 border-[#2C3325]'
            }`}>
              <div className={`flex items-center justify-between border-b pb-3 ${
                isLight ? 'border-[#DCD5C9]' : 'border-[#2C3325]'
              }`}>
                <h3 className="text-base font-serif font-bold text-[#8C5E3C] flex items-center space-x-2">
                  <Edit className="w-4 h-4 text-[#8C5E3C]" />
                  <span>Welcome Email Pipeline Template</span>
                </h3>

                {templateSaved && (
                  <span className="text-xs text-[#6B7A3D] font-serif font-bold flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </span>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-serif font-bold text-[#8C5E3C] mb-1">Email Subject Line</label>
                  <input
                    type="text"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className={`w-full border rounded-none px-3.5 py-2.5 font-mono ${
                      isLight ? 'bg-white border-[#DCD5C9] text-[#2C2825]' : 'bg-[#131513] border-[#2C3325] text-[#F5F2EA]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-serif font-bold text-[#8C5E3C] mb-1">
                    Body Template <span className="text-[#786E65] font-normal">(supports mustache placeholder {"{{name}}"})</span>
                  </label>
                  <textarea
                    rows={10}
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    className={`w-full border rounded-none p-3.5 font-mono text-xs leading-relaxed ${
                      isLight ? 'bg-white border-[#DCD5C9] text-[#2C2825]' : 'bg-[#131513] border-[#2C3325] text-[#F5F2EA]'
                    }`}
                  />
                </div>

                <button
                  onClick={handleSaveTemplate}
                  className="px-5 py-2.5 rounded-none bg-[#6B7A3D] hover:bg-[#576431] text-[#FAF8F3] font-serif font-bold uppercase tracking-wider text-xs transition-colors shadow-sm"
                >
                  Save Pipeline Template
                </button>
              </div>
            </div>

            {/* Live Email Rendered Preview */}
            <div className="lg:col-span-5 bg-[#FAF8F3] text-[#2C2825] rounded-none p-6 border border-[#DCD5C9] shadow-md space-y-4">
              <div className="flex items-center space-x-2 text-xs font-serif font-bold text-[#8C5E3C] border-b border-[#DCD5C9] pb-3">
                <Mail className="w-4 h-4 text-[#8C5E3C]" />
                <span>LIVE INBOX PREVIEW (Recipient: Jane Doe)</span>
              </div>

              <div className="space-y-2 text-xs">
                <p><strong className="text-[#8C5E3C] font-serif">From:</strong> The WaitForIt Team &lt;welcome@waitforit.dev&gt;</p>
                <p><strong className="text-[#8C5E3C] font-serif">Subject:</strong> {editSubject}</p>
              </div>

              <div className="p-4 bg-white rounded-none border border-[#DCD5C9] text-xs text-[#2C2825] font-serif whitespace-pre-wrap leading-relaxed shadow-sm">
                {editBody.replace(/\{\{\s*name\s*\}\}/g, 'Jane Doe')}
              </div>
            </div>
          </div>

          {/* Delivery Logs Stream */}
          <div className={`border rounded-none p-6 sm:p-8 space-y-4 shadow-sm ${
            isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A]/70 border-[#2C3325]'
          }`}>
            <h3 className="text-base font-serif font-bold text-[#8C5E3C] flex items-center space-x-2">
              <Send className="w-4 h-4 text-[#6B7A3D]" />
              <span>Real-Time Email Delivery Log Stream</span>
            </h3>

            <div className={`divide-y font-mono text-xs ${isLight ? 'divide-[#DCD5C9]' : 'divide-[#2C3325]'}`}>
              {emailLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-[#8C5E3C] font-serif">{log.recipient_name}</span>{' '}
                    <span className="text-[#786E65]">({log.recipient_email})</span>
                  </div>

                  <div className="flex items-center space-x-3 text-[11px]">
                    <span className="px-2 py-0.5 rounded-none bg-[#6B7A3D]/20 text-[#6B7A3D] font-bold">
                      {log.status.toUpperCase()}
                    </span>
                    <span className="text-[#786E65]">
                      {new Date(log.sent_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REAL-TIME EVENTS */}
      {activeTab === 'analytics' && (
        <div className={`border rounded-none p-6 sm:p-8 space-y-4 shadow-sm ${
          isLight ? 'bg-[#F2ECE1]/70 border-[#DCD5C9]' : 'bg-[#1A1D1A]/70 border-[#2C3325]'
        }`}>
          <h3 className="text-base font-serif font-bold text-[#8C5E3C] flex items-center space-x-2">
            <Zap className="w-4 h-4 text-[#8C5E3C]" />
            <span>Client Interaction & Event Stream</span>
          </h3>

          <div className={`divide-y font-mono text-xs ${isLight ? 'divide-[#DCD5C9]' : 'divide-[#2C3325]'}`}>
            {events.map((evt) => (
              <div key={evt.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 rounded-none bg-[#8C5E3C]/15 border border-[#8C5E3C]/30 text-[#8C5E3C] font-bold">
                    {evt.event_name}
                  </span>
                  <span className="text-[#786E65]">Page: /{evt.page}</span>
                </div>

                <span className="text-[#786E65] text-[11px]">
                  {new Date(evt.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Subscriber Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`border rounded-none p-6 max-w-md w-full space-y-4 text-xs shadow-xl ${
            isLight ? 'bg-[#FAF8F3] border-[#DCD5C9] text-[#2C2825]' : 'bg-[#131513] border-[#2C3325] text-[#F5F2EA]'
          }`}>
            <h3 className="text-base font-serif font-bold text-[#8C5E3C]">Add Subscriber to Waitlist</h3>

            <form onSubmit={handleAddSubscriber} className="space-y-3">
              <div>
                <label className="block font-serif font-bold text-[#8C5E3C] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={`w-full border rounded-none p-2.5 text-xs font-mono ${
                    isLight ? 'bg-white border-[#DCD5C9] text-[#2C2825]' : 'bg-[#1A1D1A] border-[#2C3325] text-[#F5F2EA]'
                  }`}
                />
              </div>

              <div>
                <label className="block font-serif font-bold text-[#8C5E3C] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className={`w-full border rounded-none p-2.5 text-xs font-mono ${
                    isLight ? 'bg-white border-[#DCD5C9] text-[#2C2825]' : 'bg-[#1A1D1A] border-[#2C3325] text-[#F5F2EA]'
                  }`}
                />
              </div>

              <div>
                <label className="block font-serif font-bold text-[#8C5E3C] mb-1">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className={`w-full border rounded-none p-2.5 text-xs font-mono ${
                    isLight ? 'bg-white border-[#DCD5C9] text-[#2C2825]' : 'bg-[#1A1D1A] border-[#2C3325] text-[#F5F2EA]'
                  }`}
                >
                  <option value="Backend Engineer">Backend Engineer</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Platform">Platform</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="Student">Student</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-none border text-xs font-serif uppercase tracking-wider font-bold ${
                    isLight ? 'bg-[#EAE2D3] border-[#DCD5C9] text-[#2C2825]' : 'bg-[#1A1D1A] border-[#2C3325] text-[#A0A8B0]'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-none bg-[#6B7A3D] text-[#FAF8F3] font-serif uppercase tracking-wider font-bold text-xs shadow-sm"
                >
                  Add & Trigger Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
