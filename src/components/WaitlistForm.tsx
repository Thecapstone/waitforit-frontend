import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RoleType, WaitlistApiResponse, Theme } from '../types';
import { Check, Mail, User, Code2, AlertCircle, Loader2, Sparkles, Send } from 'lucide-react';

interface WaitlistFormProps {
  onSuccess?: (res: WaitlistApiResponse) => void;
  source?: string;
  compact?: boolean;
  theme?: Theme;
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({ onSuccess, source = 'waitlist_form', compact = false, theme = 'light' }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isDeveloper, setIsDeveloper] = useState<boolean>(true);
  const [role, setRole] = useState<RoleType>('Backend Engineer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<WaitlistApiResponse | null>(null);

  const isLight = theme === 'light';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please provide both your name and email address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          is_developer: isDeveloper,
          role,
          source
        })
      });

      const data: WaitlistApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit form.');
      }

      setResponse(data);

      if (!data.duplicate) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8C5E3C', '#6B7A3D', '#A08055', '#576431']
        });
      }

      if (onSuccess) onSuccess(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (response) {
    return (
      <div className={`border rounded-none p-6 sm:p-8 text-center space-y-4 shadow-sm ${
        isLight
          ? 'bg-[#FAF8F3] border-[#6B7A3D] text-[#2C2825]'
          : 'bg-[#1A1D1A] border-[#6B7A3D] text-[#F5F2EA]'
      }`}>
        <div className="w-14 h-14 rounded-none bg-[#6B7A3D]/20 text-[#6B7A3D] mx-auto flex items-center justify-center border border-[#6B7A3D]/40">
          <Check className="w-7 h-7" />
        </div>
        
        <div className="space-y-1">
          <h3 className="text-xl font-serif font-bold text-[#8C5E3C]">
            {response.duplicate ? "You're already registered!" : "You're on the list! Welcome to WaitForIt."}
          </h3>
          <p className="text-sm text-[#786E65]">
            {response.duplicate
              ? "We'll keep you updated as we get closer to launch."
              : "Check your inbox for a welcome email."}
          </p>
        </div>

        <div className={`p-4 rounded-none text-left border text-xs font-mono space-y-2 ${
          isLight ? 'bg-[#F2ECE1] border-[#DCD5C9]' : 'bg-[#111315] border-white/10'
        }`}>
          <div className="flex items-center space-x-2 text-[#6B7A3D]">
            <Send className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider font-serif">Welcome Email Pipeline Triggered</span>
          </div>
          <p className="text-[#605549] font-sans">
            Recipient: <span className="font-semibold text-[#8C5E3C]">{email}</span>
          </p>
          <p className="text-[#605549] font-sans">
            Subject: <span className="font-semibold text-[#2C2825]">Welcome to WaitForIt 🚀</span>
          </p>
        </div>

        <button
          onClick={() => {
            setResponse(null);
            setName('');
            setEmail('');
          }}
          className="text-xs text-[#6B7A3D] hover:underline font-serif font-semibold pt-2 block mx-auto"
        >
          Register another email →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3.5 rounded-none bg-red-950/20 border border-red-500/40 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Full Name Field */}
      <div className="space-y-1.5">
        <label className={`block text-xs font-serif font-bold ${isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'}`}>
          Full Name <span className="text-[#8C5E3C]">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#786E65]">
            <User className="w-4 h-4" />
          </div>
          <input
            type="text"
            required
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full border rounded-none pl-9 pr-3 py-2.5 text-sm transition-all focus:outline-none ${
              isLight
                ? 'bg-white border-[#DCD5C9] text-[#1C1917] placeholder-[#786E65]/60 focus:border-[#6B7A3D]'
                : 'bg-[#1A1D1A] border-[#2C3325] text-white placeholder-[#A0A8B0]/50 focus:border-[#6B7A3D]'
            }`}
          />
        </div>
      </div>

      {/* Email Address Field */}
      <div className="space-y-1.5">
        <label className={`block text-xs font-serif font-bold ${isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'}`}>
          Email Address <span className="text-[#8C5E3C]">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#786E65]">
            <Mail className="w-4 h-4" />
          </div>
          <input
            type="email"
            required
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border rounded-none pl-9 pr-3 py-2.5 text-sm transition-all focus:outline-none ${
              isLight
                ? 'bg-white border-[#DCD5C9] text-[#1C1917] placeholder-[#786E65]/60 focus:border-[#6B7A3D]'
                : 'bg-[#1A1D1A] border-[#2C3325] text-white placeholder-[#A0A8B0]/50 focus:border-[#6B7A3D]'
            }`}
          />
        </div>
      </div>

      {/* Are you a developer? (Yes / No) */}
      <div className="space-y-1.5 pt-1">
        <label className={`block text-xs font-serif font-bold ${isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'}`}>
          Are you a developer?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setIsDeveloper(true)}
            className={`py-2 px-3 rounded-none text-xs font-serif border flex items-center justify-center space-x-2 transition-all ${
              isDeveloper
                ? 'bg-[#6B7A3D] text-white border-[#576431] font-semibold'
                : isLight
                  ? 'bg-white border-[#DCD5C9] text-[#605549] hover:bg-[#F2ECE1]'
                  : 'bg-[#1A1D1A] border-[#2C3325] text-[#A0A8B0] hover:text-[#F5F2EA]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Yes</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDeveloper(false)}
            className={`py-2 px-3 rounded-none text-xs font-serif border flex items-center justify-center space-x-2 transition-all ${
              !isDeveloper
                ? 'bg-[#6B7A3D] text-white border-[#576431] font-semibold'
                : isLight
                  ? 'bg-white border-[#DCD5C9] text-[#605549] hover:bg-[#F2ECE1]'
                  : 'bg-[#1A1D1A] border-[#2C3325] text-[#A0A8B0] hover:text-[#F5F2EA]'
            }`}
          >
            <span>No</span>
          </button>
        </div>
      </div>

      {/* Role Dropdown */}
      <div className="space-y-1.5 pt-1">
        <label className={`block text-xs font-serif font-bold ${isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'}`}>
          Role <span className="font-sans text-[#786E65] font-normal">(optional)</span>
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as RoleType)}
          className={`w-full border rounded-none px-3 py-2.5 text-sm transition-all focus:outline-none ${
            isLight
              ? 'bg-white border-[#DCD5C9] text-[#1C1917] focus:border-[#6B7A3D]'
              : 'bg-[#1A1D1A] border-[#2C3325] text-white focus:border-[#6B7A3D]'
          }`}
        >
          <option value="Backend Engineer">Backend Engineer</option>
          <option value="Full Stack">Full Stack</option>
          <option value="Frontend">Frontend</option>
          <option value="DevOps">DevOps</option>
          <option value="Platform">Platform</option>
          <option value="Student">Student</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Olive CTA Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-3 py-3 rounded-none bg-[#6B7A3D] hover:bg-[#576431] text-[#FAF8F3] text-xs font-serif uppercase tracking-widest font-bold border border-[#576431] shadow-md flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Adding to waitlist...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Join the Waitlist</span>
          </>
        )}
      </button>

      <p className="text-[11px] text-[#786E65] text-center pt-1 font-mono">
        No IDE switching. No manual documentation. No interruptions.
      </p>
    </form>
  );
};

