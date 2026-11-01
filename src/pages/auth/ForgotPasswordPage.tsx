import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { forgotPasswordSchema } from '../../lib/validations';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Spinner } from '../../components/ui/Spinner';
import { SeoHead } from '../../components/seo/SeoHead';
import { AuthShell, authFieldClass, authLabelClass } from '../../components/auth/AuthShell';
import { privatePageMeta } from '../../lib/seo/meta';
import { z } from 'zod';

type Form = z.infer<typeof forgotPasswordSchema>;

const fieldMotion = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: Form) => {
    setSubmitting(true);
    const { error } = await resetPassword(values.email);
    setSubmitting(false);
    if (error) {
      toast(error, 'error');
      return;
    }
    setSent(true);
    toast('Password reset email sent if the account exists.', 'success');
  };

  return (
    <>
      <SeoHead {...privatePageMeta('Reset password', '/forgot-password')} />
      <AuthShell
        title="Reset password"
        subtitle="We will email you a secure link to set a new password."
        footer={
          <motion.p
            className="mt-8 text-center text-sm text-[#43282A]/80"
            {...fieldMotion(0.24)}
          >
            Remembered it?{' '}
            <Link to="/login" className="font-medium text-[#A86438] hover:underline">
              Back to sign in
            </Link>
          </motion.p>
        }
      >
        {sent ? (
          <motion.p className="text-sm text-[#43282A]" {...fieldMotion(0.08)}>
            Check your inbox, then{' '}
            <Link to="/login" className="text-[#A86438] underline">
              return to sign in
            </Link>
            .
          </motion.p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div {...fieldMotion(0.08)}>
              <label className={authLabelClass}>Email</label>
              <input
                type="email"
                autoComplete="email"
                {...register('email')}
                className={authFieldClass}
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-700">{errors.email.message}</p>}
            </motion.div>
            <motion.button
              type="submit"
              disabled={submitting}
              whileTap={{ scale: 0.98 }}
              {...fieldMotion(0.16)}
              className="flex w-full items-center justify-center gap-2 bg-[#A86438] py-3.5 text-sm font-semibold tracking-wider text-white uppercase transition-colors hover:bg-[#43282A] disabled:opacity-60"
            >
              {submitting && <Spinner className="h-4 w-4 border-white/30 border-t-white" />}
              Send reset link
            </motion.button>
          </form>
        )}
      </AuthShell>
    </>
  );
}
