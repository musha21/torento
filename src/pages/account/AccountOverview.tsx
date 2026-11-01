import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tryGetSupabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { BOOKING_STATUS_LABELS } from '../../lib/booking';
import { formatLkrPrice, generateBookingInquiryUrl } from '../../lib/whatsapp';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/Spinner';
import type { Booking, BookingStatus } from '../../types/database';
import { WhatsAppIcon } from '../../components/icons/WhatsAppIcon';

function statusChipClass(status: BookingStatus): string {
  if (status === 'confirmed' || status === 'active') return 'bg-[#A86438]/15 text-[#A86438]';
  if (status === 'pending' || status === 'under_review') return 'bg-amber-100 text-amber-900';
  if (status === 'completed') return 'bg-[#43282A]/10 text-[#43282A]';
  return 'bg-[#43282A]/8 text-[#43282A]/80';
}

function formatDay(iso: string): string {
  return String(iso).slice(0, 10);
}

export default function AccountOverview() {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = tryGetSupabase();
    if (!supabase || !user) {
      setLoading(false);
      return;
    }
    supabase
      .from('bookings')
      .select('*, vehicles(name, slug, main_image)')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setBookings((data as Booking[]) || []);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <PageLoader />;

  const total = bookings.length;
  const pending = bookings.filter(
    (b) => b.booking_status === 'pending' || b.booking_status === 'under_review'
  ).length;
  const confirmed = bookings.filter(
    (b) => b.booking_status === 'confirmed' || b.booking_status === 'active'
  ).length;
  const recent = bookings.slice(0, 5);

  return (
    <div className="w-full">
      <header className="mb-5 sm:mb-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#A86438] mb-1.5">My account</p>
        <h1 className="font-editorial-heading text-2xl sm:text-4xl mb-1.5 leading-tight">
          Welcome{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-sm text-[#43282A]/80 max-w-xl">
          Track your TORENTO rental requests and confirmed bookings in one place.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 mb-7 sm:mb-10">
        {[
          { label: 'Total bookings', value: total, to: '/account/bookings' },
          { label: 'Pending requests', value: pending, to: '/account/pending' },
          { label: 'Confirmed / active', value: confirmed, to: '/account/confirmed' },
        ].map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="bg-white/80 border border-[#D8C9AD] rounded-2xl px-4 py-3.5 sm:p-5 hover:border-[#A86438]/40 transition-colors flex sm:block items-center justify-between gap-3"
          >
            <p className="text-[11px] uppercase tracking-wider text-[#43282A]/60">{s.label}</p>
            <p className="font-editorial-heading text-2xl sm:text-3xl sm:mt-1 tabular-nums">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="flex items-end justify-between gap-3 mb-3 sm:mb-4">
        <h2 className="font-editorial-heading text-xl sm:text-2xl">Recent activity</h2>
        <Link to="/account/bookings" className="text-xs text-[#A86438] hover:underline shrink-0">
          View all
        </Link>
      </div>

      {recent.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="Browse the fleet and submit a rental request for your travel dates."
          action={
            <Link
              to="/vehicles"
              className="inline-flex text-sm font-semibold text-white bg-[#A86438] px-4 py-2.5 rounded-lg min-h-[44px] items-center"
            >
              Browse vehicles
            </Link>
          }
        />
      ) : (
        <div className="space-y-2.5 sm:space-y-3">
          {recent.map((b) => (
            <div
              key={b.id}
              className="bg-white/80 border border-[#D8C9AD] rounded-2xl p-3.5 sm:p-5 flex flex-col gap-3"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-medium text-[#242320] truncate">{b.vehicles?.name || 'Vehicle'}</p>
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${statusChipClass(b.booking_status)}`}
                  >
                    {BOOKING_STATUS_LABELS[b.booking_status]}
                  </span>
                </div>
                <p className="text-xs text-[#43282A]/70 tabular-nums">
                  {b.booking_reference} · {formatDay(b.pickup_date)} → {formatDay(b.return_date)} ·{' '}
                  {formatLkrPrice(Number(b.estimated_total))}
                </p>
              </div>
              <a
                href={generateBookingInquiryUrl(b.booking_reference)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 text-xs text-[#25D366] border border-[#25D366]/40 px-3 py-2.5 rounded-full min-h-[40px] w-full sm:w-auto sm:self-start"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" /> WhatsApp update
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
