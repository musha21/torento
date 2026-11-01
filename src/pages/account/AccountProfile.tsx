import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../../lib/validations';
import { useAuth } from '../../contexts/AuthContext';
import { tryGetSupabase } from '../../lib/supabase/client';
import { useToast } from '../../contexts/ToastContext';
import { z } from 'zod';
import { Spinner } from '../../components/ui/Spinner';

type Form = z.infer<typeof profileSchema>;

export default function AccountProfile() {
  const { profile, user, refreshProfile, signOut } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(profileSchema),
    values: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
    },
  });

  const onSubmit = async (values: Form) => {
    const supabase = tryGetSupabase();
    if (!supabase || !user) return;
    setSubmitting(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: values.full_name, phone: values.phone || null })
      .eq('id', user.id);
    setSubmitting(false);
    if (error) toast(error.message, 'error');
    else {
      toast('Profile updated', 'success');
      await refreshProfile();
    }
  };

  return (
    <div className="w-full max-w-xl">
      <header className="mb-5 sm:mb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#A86438] mb-1.5">Account</p>
        <h1 className="font-editorial-heading text-2xl sm:text-4xl">My Profile</h1>
        <p className="mt-2 text-sm text-[#43282A]/75 truncate">{user?.email}</p>
      </header>

      <div className="flex gap-2 mb-5">
        <Link
          to="/account/profile"
          className="rounded-full px-3.5 py-2 text-xs uppercase tracking-wider bg-[#A86438] text-white"
        >
          Profile
        </Link>
        <Link
          to="/account/security"
          className="rounded-full px-3.5 py-2 text-xs uppercase tracking-wider bg-white/70 border border-[#D8C9AD] text-[#43282A]"
        >
          Security
        </Link>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-white/80 border border-[#D8C9AD] rounded-2xl p-4 sm:p-6"
      >
        <div>
          <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Email</label>
          <input
            value={user?.email || ''}
            disabled
            className="mt-1 w-full border border-[#43282A]/10 bg-[#E6DCC8]/40 px-3 py-2.5 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Full name</label>
          <input
            {...register('full_name')}
            className="mt-1 w-full border border-[#43282A]/20 bg-white px-3 py-2.5 rounded-lg text-sm"
          />
          {errors.full_name && <p className="text-xs text-red-700 mt-1">{errors.full_name.message}</p>}
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Phone</label>
          <input
            {...register('phone')}
            className="mt-1 w-full border border-[#43282A]/20 bg-white px-3 py-2.5 rounded-lg text-sm"
          />
        </div>
        <p className="text-xs text-[#43282A]/60">
          Role: <strong>{profile?.role}</strong> (cannot be changed by customers)
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#A86438] text-white rounded-lg text-sm font-semibold disabled:opacity-60 inline-flex items-center justify-center gap-2 min-h-[44px]"
        >
          {submitting && <Spinner className="h-4 w-4 border-white/30 border-t-white" />}
          Save profile
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
