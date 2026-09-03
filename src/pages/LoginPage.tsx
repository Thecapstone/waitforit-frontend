import React, { useState } from 'react';
import { AlertCircle, Check, KeyRound, Loader2, Lock, Mail, UserPlus } from 'lucide-react';
import { loginUser, registerUser, requestPasswordReset } from '../lib/api';
import { AuthUser, PageView, Theme } from '../types';

interface LoginPageProps {
  setCurrentPage: (page: PageView) => void;
  theme?: Theme;
  currentUser?: AuthUser | null;
  onAuthenticated: (user: AuthUser) => void;
  adminRequired?: boolean;
}

type AuthMode = 'login' | 'register' | 'reset';

export const LoginPage: React.FC<LoginPageProps> = ({
  setCurrentPage,
  theme = 'light',
  currentUser,
  onAuthenticated,
  adminRequired = false,
}) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isLight = theme === 'light';

  const resetFeedback = () => {
    setMessage(null);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    resetFeedback();
    setLoading(true);

    try {
      if (mode === 'login') {
        const user = await loginUser({ email, password });
        onAuthenticated(user);
        setMessage('Signed in successfully.');
        if (window.sessionStorage.getItem('wfi_pending_terminal_code')) {
          setCurrentPage('terminal-authorize');
          return;
        }
        setCurrentPage(user.role === 'admin' ? 'dashboard' : 'integration-guide');
        return;
      }

      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        const response = await registerUser({ email, password });
        setMessage(response.message || 'Registration successful. Check your email to verify your account.');
        setMode('login');
        setPassword('');
        setConfirmPassword('');
        return;
      }

      const response = await requestPasswordReset(email);
      setMessage(response.message || 'If an account exists for that email, a reset link has been sent.');
    } catch (err: any) {
      setError(err.message || 'Unable to complete this request.');
    } finally {
      setLoading(false);
    }
  };

  if (currentUser && !adminRequired) {
    return (
      <div className={`pt-28 pb-20 max-w-xl mx-auto px-4 transition-colors ${
        isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'
      }`}>
        <div className={`border rounded-none p-8 text-center space-y-5 shadow-sm ${
          isLight ? 'bg-[#F2ECE1]/80 border-[#DCD5C9]' : 'bg-[#1A1D1A]/80 border-[#2C3325]'
        }`}>
          <div className="w-14 h-14 rounded-none bg-[#6B7A3D]/15 text-[#6B7A3D] border border-[#6B7A3D]/30 mx-auto flex items-center justify-center">
            <Check className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-serif font-extrabold text-[#8C5E3C]">
              You are signed in.
            </h1>
            <p className="text-sm text-[#786E65]">{currentUser.email}</p>
          </div>
          <button
            onClick={() => setCurrentPage('integration-guide')}
            className="px-5 py-2.5 rounded-none bg-[#6B7A3D] text-[#FAF8F3] text-xs font-serif uppercase tracking-wider font-bold border border-[#576431]"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`pt-28 pb-20 max-w-xl mx-auto px-4 space-y-8 transition-colors ${
      isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'
    }`}>
      <div className={`border rounded-none p-8 space-y-6 shadow-sm ${
        isLight ? 'bg-[#F2ECE1]/80 border-[#DCD5C9]' : 'bg-[#1A1D1A]/80 border-[#2C3325]'
      }`}>
        <div className="space-y-2 text-center">
          <div className="w-16 h-16 rounded-none bg-[#8C5E3C]/10 text-[#8C5E3C] border border-[#8C5E3C]/30 mx-auto flex items-center justify-center">
            {mode === 'register' ? <UserPlus className="w-8 h-8" /> : <KeyRound className="w-8 h-8" />}
          </div>
          <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#8C5E3C]">
            {adminRequired ? 'Admin Authorization' : 'Developer Account'}
          </span>
          <h1 className="text-2xl font-serif font-extrabold text-[#8C5E3C]">
            {mode === 'login' && 'Sign in to WaitForIt'}
            {mode === 'register' && 'Create your account'}
            {mode === 'reset' && 'Reset your password'}
          </h1>
          <p className="text-xs text-[#786E65] leading-relaxed">
            {adminRequired
              ? 'This area contains subscriber, pipeline, and metrics controls.'
              : 'Use the same account for the website and terminal workflow.'}
          </p>
        </div>

        <div className={`grid ${mode === 'reset' ? 'grid-cols-2' : 'grid-cols-3'} gap-2 text-xs font-serif font-bold`}>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              resetFeedback();
            }}
            className={`py-2 border rounded-none ${mode === 'login' ? 'bg-[#6B7A3D] text-white border-[#576431]' : isLight ? 'bg-white border-[#DCD5C9]' : 'bg-[#131513] border-[#2C3325]'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              resetFeedback();
            }}
            className={`py-2 border rounded-none ${mode === 'register' ? 'bg-[#6B7A3D] text-white border-[#576431]' : isLight ? 'bg-white border-[#DCD5C9]' : 'bg-[#131513] border-[#2C3325]'}`}
          >
            Register
          </button>
          {mode !== 'reset' && (
            <button
              type="button"
              onClick={() => {
                setMode('reset');
                resetFeedback();
              }}
              className="py-2 border rounded-none bg-transparent border-[#DCD5C9] text-[#8C5E3C]"
            >
              Reset
            </button>
          )}
        </div>

        {message && (
          <div className="p-3.5 rounded-none bg-[#6B7A3D]/15 border border-[#6B7A3D]/30 text-[#6B7A3D] text-xs flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-none bg-red-950/20 border border-red-500/40 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-serif font-bold text-[#8C5E3C]">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-[#786E65]" />
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={`w-full border rounded-none pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#6B7A3D] ${
                  isLight ? 'bg-white border-[#DCD5C9] text-[#1C1917]' : 'bg-[#131513] border-[#2C3325] text-white'
                }`}
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-serif font-bold text-[#8C5E3C]">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-[#786E65]" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={`w-full border rounded-none pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#6B7A3D] ${
                    isLight ? 'bg-white border-[#DCD5C9] text-[#1C1917]' : 'bg-[#131513] border-[#2C3325] text-white'
                  }`}
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-serif font-bold text-[#8C5E3C]">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-[#786E65]" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className={`w-full border rounded-none pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#6B7A3D] ${
                    isLight ? 'bg-white border-[#DCD5C9] text-[#1C1917]' : 'bg-[#131513] border-[#2C3325] text-white'
                  }`}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-none bg-[#6B7A3D] hover:bg-[#576431] text-[#FAF8F3] text-xs font-serif uppercase tracking-widest font-bold border border-[#576431] shadow-md flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {!loading && mode === 'register' && <UserPlus className="w-4 h-4" />}
            {!loading && mode !== 'register' && <KeyRound className="w-4 h-4" />}
            <span>
              {mode === 'login' && 'Sign In'}
              {mode === 'register' && 'Create Account'}
              {mode === 'reset' && 'Send Reset Link'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
