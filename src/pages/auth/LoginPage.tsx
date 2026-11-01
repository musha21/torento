import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { loginSchema, type LoginForm } from '../../lib/validations';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Spinner } from '../../components/ui/Spinner';
import { SeoHead } from '../../components/seo/SeoHead';
import { AuthShell, authFieldClass, authLabelClass } from '../../components/auth/AuthShell';
import { privatePageMeta } from '../../lib/seo/meta';

type LoginLocationState = {
  from?: string;
  registered?: boolean;
  email?: string;
} | null;

/** Same-origin app paths only — blocks //evil.com and external URLs. */
function isSafeInternalPath(path: string): boolean {
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) return false;
  if (path.includes('://')) return false;
  const pathname = path.split(/[?#]/)[0] || '/';
  const allowed =
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/contact' ||
    pathname === '/cars' ||
    pathname === '/bikes' ||
    pathname === '/vehicles' ||
    pathname.startsWith('/vehicles/') ||
    pathname === '/destinations' ||
    pathname.startsWith('/destinations/') ||
    pathname === '/account' ||
    pathname.startsWith('/account/') ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/');
  return allowed;
}

function postLoginPath(from: string, isAdmin: boolean): string {
  const safe = isSafeInternalPath(from) ? from.split(/[?#]/)[0] || from : null;
  if (isAdmin) {
    if (safe?.startsWith('/admin')) return safe;
    return '/admin';
  }
  if (safe && !safe.startsWith('/admin')) return safe;
  return '/account';
}

const fieldMotion = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export default function LoginPage() {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LoginLocationState;
  const from = state?.from || '/account';
  const justRegistered = Boolean(state?.registered);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: state?.email || '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginForm) => {
    setSubmitting(true);
    const { error, profile } = await signIn(values.email, values.password);
    if (error) {
      setSubmitting(false);
      toast(error, 'error');
      return;
    }
    const isAdmin = profile?.role === 'admin' && profile?.account_status === 'active';
    setSubmitting(false);
    toast(
      isAdmin ? 'Welcome back — opening admin dashboard' : 'Welcome back',
      'success'
    );
    navigate(postLoginPath(from, isAdmin), { replace: true });
  };

  return (
    <>
      <SeoHead {...privatePageMeta('Sign in', '/login')} />
      <AuthShell
        title="Sign in"
        subtitle="One sign-in for customers and administrators"
        banner={
          justRegistered ? (
            <motion.div
              className="mb-6 border-b border-[#A86438]/35 pb-3 text-sm text-[#43282A]"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              Account created successfully. Sign in to continue.
            </motion.div>
          ) : null
        }
        footer={
          <motion.p
            className="mt-8 text-center text-sm text-[#43282A]/80"
            {...fieldMotion(0.32)}
          >
            New to TORENTO?{' '}
            <Link to="/register" className="font-medium text-[#A86438] hover:underline">
              Create an account
            </Link>
          </motion.p>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div {...fieldMotion(0.08)}>
            <label className={authLabelClass}>Email</label>
            <input type="email" autoComplete="email" {...register('email')} className={authFieldClass} />
            {errors.email && <p className="mt-1.5 text-xs text-red-700">{errors.email.message}</p>}
          </motion.div>
          <motion.div {...fieldMotion(0.14)}>
            <label className={authLabelClass}>Password</label>
            <input
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className={authFieldClass}
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-700">{errors.password.message}</p>
            )}
          </motion.div>
          <motion.div className="flex justify-end" {...fieldMotion(0.2)}>
            <Link to="/forgot-password" className="text-xs text-[#A86438] hover:underline">
              Forgot password?
            </Link>
          </motion.div>
          <motion.button
            type="submit"
            disabled={submitting}
            whileTap={{ scale: 0.98 }}
            {...fieldMotion(0.26)}
            className="flex w-full items-center justify-center gap-2 bg-[#A86438] py-3.5 text-sm font-semibold tracking-wider text-white uppercase transition-colors hover:bg-[#43282A] disabled:opacity-60"
          >
            {submitting && <Spinner className="h-4 w-4 border-white/30 border-t-white" />}
            Sign in
          </motion.button>
        </form>
      </AuthShell>
    </>
  );
}
