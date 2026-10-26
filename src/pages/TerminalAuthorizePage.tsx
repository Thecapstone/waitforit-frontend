import React, { useState } from 'react';
import { AlertCircle, Check, KeyRound, Loader2, Terminal } from 'lucide-react';
import { approveTerminalLogin } from '../lib/api';
import { AuthUser, PageView, Theme } from '../types';

interface TerminalAuthorizePageProps {
  code: string;
  currentUser: AuthUser | null;
  setCurrentPage: (page: PageView) => void;
  theme?: Theme;
}

export const TerminalAuthorizePage: React.FC<TerminalAuthorizePageProps> = ({
  code,
  currentUser,
  setCurrentPage,
  theme = 'light',
}) => {
  const [userCode, setUserCode] = useState(code);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isLight = theme === 'light';

  const approve = async () => {
    const normalizedCode = userCode.replace(/[^0-9a-f]/gi, '').toUpperCase();
    if (!/^[0-9A-F]{6}$/.test(normalizedCode)) {
      setError('Enter the six-character code shown by `wfi login`.');
      setMessage(null);
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await approveTerminalLogin(normalizedCode);
      window.sessionStorage.removeItem('wfi_pending_terminal_code');
      setMessage(response.message || 'Terminal login approved.');
    } catch (err: any) {
      setError(err.message || 'Unable to approve terminal login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`pt-28 pb-20 max-w-xl mx-auto px-4 transition-colors ${
      isLight ? 'text-[#2C2825]' : 'text-[#F5F2EA]'
    }`}>
      <div className={`border rounded-none p-8 space-y-6 shadow-sm ${
        isLight ? 'bg-[#F2ECE1]/80 border-[#DCD5C9]' : 'bg-[#1A1D1A]/80 border-[#2C3325]'
      }`}>
        <div className="space-y-2 text-center">
          <div className="w-16 h-16 rounded-none bg-[#8C5E3C]/10 text-[#8C5E3C] border border-[#8C5E3C]/30 mx-auto flex items-center justify-center">
            <Terminal className="w-8 h-8" />
          </div>
          <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#8C5E3C]">
            Terminal Authorization
          </span>
          <h1 className="text-2xl font-serif font-extrabold text-[#8C5E3C]">
            Connect this terminal
          </h1>
          <p className="text-xs text-[#786E65] leading-relaxed">
            {currentUser
              ? `Approving as ${currentUser.email}.`
              : 'Sign in first, then approve the code from your terminal.'}
          </p>
        </div>

        {!currentUser && (
          <button
            onClick={() => {
              window.sessionStorage.setItem('wfi_pending_terminal_code', userCode);
              setCurrentPage('login');
            }}
            className="w-full py-3 rounded-none bg-[#6B7A3D] text-[#FAF8F3] text-xs font-serif uppercase tracking-widest font-bold border border-[#576431]"
          >
            Sign In First
          </button>
        )}

        {currentUser && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-serif font-bold text-[#8C5E3C]">Terminal Code</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-3 text-[#786E65]" />
                <input
                  value={userCode}
                  onChange={(event) => {
                    const normalized = event.target.value
                      .replace(/[^0-9a-f]/gi, '')
                      .slice(0, 6)
                      .toUpperCase();
                    setUserCode(
                      normalized.length > 3
                        ? `${normalized.slice(0, 3)}-${normalized.slice(3)}`
                        : normalized,
                    );
                    setError(null);
                  }}
                  maxLength={7}
                  placeholder="ABC-DEF"
                  className={`w-full border rounded-none pl-9 pr-3 py-2.5 text-sm tracking-widest uppercase focus:outline-none focus:border-[#6B7A3D] ${
                    isLight ? 'bg-white border-[#DCD5C9] text-[#1C1917]' : 'bg-[#131513] border-[#2C3325] text-white'
                  }`}
                />
              </div>
            </div>

            <button
              onClick={approve}
              disabled={loading}
              className="w-full py-3 rounded-none bg-[#6B7A3D] text-[#FAF8F3] text-xs font-serif uppercase tracking-widest font-bold border border-[#576431] flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Terminal className="w-4 h-4" />}
              <span>Approve Terminal</span>
            </button>
          </div>
        )}

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
      </div>
    </div>
  );
};
