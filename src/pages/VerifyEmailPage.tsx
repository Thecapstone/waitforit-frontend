import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Check, Loader2, MailCheck } from 'lucide-react';
import { verifyEmail } from '../lib/api';
import { PageView, Theme } from '../types';

interface VerifyEmailPageProps {
  setCurrentPage: (page: PageView) => void;
  theme?: Theme;
}

type Status = 'verifying' | 'success' | 'error';

/**
 * Landing page for the emailed verification link (/verify-email?token=...).
 *
 * The token is consumed by a POST from here rather than by the link itself:
 * mail scanners prefetch links with GET but don't run this script, so they
 * can't burn the single-use token before the user clicks.
 */
export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({
  setCurrentPage,
  theme = 'light',
}) => {
  const [token] = useState(
    () => new URLSearchParams(window.location.search).get('token') || '',
  );
  const [status, setStatus] = useState<Status>(token ? 'verifying' : 'error');
  const [message, setMessage] = useState(
    token ? '' : 'This verification link is missing its token.',
  );
  // StrictMode runs effects twice in dev; a second POST would report the
  // single-use token as "already used" right after it succeeded.
  const requested = useRef(false);
  const isLight = theme === 'light';

  useEffect(() => {
    // Keep the token out of browser history and later Referer headers.
    window.history.replaceState(null, '', '/');

    if (!token || requested.current) return;
    requested.current = true;

    verifyEmail(token)
      .then((response) => {
        setStatus('success');
        setMessage(response.message || 'Email verified successfully.');
      })
      .catch((err: Error) => {
        setStatus('error');
        setMessage(err.message || 'Unable to verify this link.');
      });
  }, [token]);

  return (
    <div className={`pt-28 pb-20 max-w-xl mx-auto px-4 transition-colors ${
      isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'
    }`}>
      <div className={`border rounded-3xl p-8 space-y-6 shadow-soft ${
        isLight ? 'bg-[#F2ECE1]/80 border-[#DCD5C9]' : 'bg-[#1A1D1A]/80 border-[#2C3325]'
      }`}>
        <div className="space-y-2 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#8C5E3C]/10 text-[#8C5E3C] border border-[#8C5E3C]/30 mx-auto flex items-center justify-center">
            <MailCheck className="w-8 h-8" />
          </div>
          <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#8C5E3C]">
            Email Verification
          </span>
          <h1 className="text-2xl font-serif font-extrabold text-[#8C5E3C]">
            {status === 'verifying'
              ? 'Verifying your email'
              : status === 'success'
                ? 'You are verified'
                : 'Verification failed'}
          </h1>
        </div>

        {status === 'verifying' && (
          <div className="flex items-center justify-center space-x-2 text-xs text-[#786E65]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Checking your link…</span>
          </div>
        )}

        {status === 'success' && (
          <div className="shadow-soft p-3.5 rounded-xl bg-[#6B7A3D]/15 border border-[#6B7A3D]/30 text-[#6B7A3D] text-xs flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="shadow-soft p-3.5 rounded-xl bg-red-950/20 border border-red-500/40 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        {status !== 'verifying' && (
          <button
            onClick={() => setCurrentPage('login')}
            className="w-full py-3 rounded-full bg-[#6B7A3D] text-[#FAF8F3] text-xs font-serif uppercase tracking-widest font-bold border border-[#576431]"
          >
            {status === 'success' ? 'Sign In' : 'Back to Sign In'}
          </button>
        )}
      </div>
    </div>
  );
};
