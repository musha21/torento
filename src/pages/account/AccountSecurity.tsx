import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Spinner } from '../../components/ui/Spinner';

export default function AccountSecurity() {
  const { updatePassword, signOut } = useAuth();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast('Password must be at least 8 characters', 'error');
      return;
    }
    if (password !== confirm) {
      toast('Passwords do not match', 'error');
      return;
    }
    setSubmitting(true);
    const { error } = await updatePassword(password);
    setSubmitting(false);
    if (error) toast(error, 'error');
    else {
      toast('Password updated', 'success');
      setPassword('');
      setConfirm('');
    }
  };

  return (
    <div className="w-full max-w-xl">
      <header className="mb-5 sm:mb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#A86438] mb-1.5">Account</p>
        <h1 className="font-editorial-heading text-2xl sm:text-4xl">Security Settings</h1>
      </header>

      <div className="flex gap-2 mb-5">
        <Link
          to="/account/profile"
          className="rounded-full px-3.5 py-2 text-xs uppercase tracking-wider bg-white/70 border border-[#D8C9AD] text-[#43282A]"
        >
          Profile
        </Link>
        <Link
          to="/account/security"
          className="rounded-full px-3.5 py-2 text-xs uppercase tracking-wider bg-[#A86438] text-white"
        >
          Security
        </Link>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 bg-white/80 border border-[#D8C9AD] rounded-2xl p-4 sm:p-6"
      >
        <div>
          <label className="text-xs uppercase tracking-wider text-[#43282A]/70">New password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-[#43282A]/20 bg-white px-3 py-2.5 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Confirm password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1 w-full border border-[#43282A]/20 bg-white px-3 py-2.5 rounded-lg text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#A86438] text-white rounded-lg text-sm font-semibold disabled:opacity-60 inline-flex items-center justify-center gap-2 min-h-[44px]"
        >
          {submitting && <Spinner className="h-4 w-4 border-white/30 border-t-white" />}
          Update password
        </button>
      </form>

      <button
        type="button"
        onClick={() => signOut()}
        className="lg:hidden mt-6 w-full min-h-[44px] rounded-xl border border-[#43282A]/25 text-sm text-[#43282A] hover:bg-white/50"
      >
        Sign out
      </button>
    </div>
  );
}
