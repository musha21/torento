import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { tryGetSupabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { BOOKING_STATUS_LABELS, PAYMENT_STATUS_LABELS, cancelOwnBooking } from '../../lib/booking';
import { formatLkrPrice, generateBookingInquiryUrl } from '../../lib/whatsapp';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/Spinner';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../contexts/ToastContext';
import type { Booking, BookingStatus } from '../../types/database';
import { WhatsAppIcon } from '../../components/icons/WhatsAppIcon';

function filterForPath(pathname: string, bookings: Booking[]): Booking[] {
  if (pathname.includes('/pending')) {
    return bookings.filter((b) => b.booking_status === 'pending' || b.booking_status === 'under_review');
  }
  if (pathname.includes('/confirmed')) {
    return bookings.filter((b) => b.booking_status === 'confirmed' || b.booking_status === 'active');
  }
  if (pathname.includes('/completed')) {
    return bookings.filter((b) => b.booking_status === 'completed');
  }
  return bookings;
}

const titles: Record<string, string> = {
  '/account/bookings': 'My Bookings',
  '/account/pending': 'Pending Requests',
  '/account/confirmed': 'Confirmed Rentals',
  '/account/completed': 'Completed Rentals',
};

function statusChipClass(status: BookingStatus): string {
  if (status === 'confirmed' || status === 'active') return 'bg-[#A86438]/15 text-[#A86438]';
  if (status === 'pending' || status === 'under_review') return 'bg-amber-100 text-amber-900';
  if (status === 'completed') return 'bg-[#43282A]/10 text-[#43282A]';
  if (status === 'cancelled' || status === 'rejected') return 'bg-red-50 text-red-800';
  return 'bg-[#43282A]/8 text-[#43282A]/80';
}

function formatDay(iso: string): string {
  return String(iso).slice(0, 10);
}

export default function AccountBookings() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState<string | null>(null);

  const load = async () => {
    const supabase = tryGetSupabase();
    if (!supabase || !user) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('bookings')
      .select('*, vehicles(name, slug, main_image)')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });
    setBookings((data as Booking[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user]);

  const list = filterForPath(pathname, bookings);
  const title = titles[pathname] || 'My Bookings';

  const filters = [
    { to: '/account/bookings', label: 'All', active: pathname === '/account/bookings' },
    { to: '/account/pending', label: 'Pending', active: pathname.includes('/pending') },
    { to: '/account/confirmed', label: 'Confirmed', active: pathname.includes('/confirmed') },
    { to: '/account/completed', label: 'Completed', active: pathname.includes('/completed') },
  ];

  const handleCancel = async () => {
    if (!cancelId) return;
    const { error } = await cancelOwnBooking(cancelId);
    setCancelId(null);
    if (error) toast(error, 'error');
    else {
      toast('Booking cancelled', 'success');
      load();
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <header className="mb-4 sm:mb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#A86438] mb-1.5">Rentals</p>
        <h1 className="font-editorial-heading text-2xl sm:text-4xl">{title}</h1>
      </header>

      <div
        className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 mb-5 -mx-1 px-1"
        role="tablist"
        aria-label="Booking filters"
      >
        {filters.map((f) => (
          <Link
            key={f.to}
            to={f.to}
            role="tab"
            aria-selected={f.active}
            className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium uppercase tracking-wider min-h-[40px] inline-flex items-center transition-colors ${
              f.active
                ? 'bg-[#A86438] text-white'
                : 'bg-white/70 border border-[#D8C9AD] text-[#43282A] hover:border-[#A86438]/40'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          description="Your rental requests for this section will appear here."
          action={
            <Link to="/vehicles" className="text-sm text-[#A86438] underline">
              Find a vehicle
            </Link>
          }
        />
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {list.map((b) => {
            const canCancel = (['pending', 'under_review'] as BookingStatus[]).includes(b.booking_status);
            return (
              <article
                key={b.id}
                className="bg-white/80 border border-[#D8C9AD] rounded-2xl p-3.5 sm:p-5 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex gap-4 min-w-0">
                    {b.vehicles?.main_image && (
                      <img
                        src={b.vehicles.main_image}
                        alt=""
                        className="w-20 h-20 object-cover rounded-lg hidden sm:block shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="font-editorial-heading text-xl">{b.vehicles?.name}</h2>
                        <span
                          className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${statusChipClass(b.booking_status)}`}
                        >
                          {BOOKING_STATUS_LABELS[b.booking_status]}
                        </span>
                      </div>
                      <p className="text-xs text-[#43282A]/70">
                        Ref {b.booking_reference} · {PAYMENT_STATUS_LABELS[b.payment_status]}
                      </p>
                      <p className="text-sm mt-2 tabular-nums text-[#242320]">
                        {formatDay(b.pickup_date)} → {formatDay(b.return_date)}
                      </p>
                      <p className="text-sm text-[#43282A]/80 mt-0.5">
                        {b.pickup_location} · {b.rental_days} day(s) ·{' '}
                        <span className="font-semibold text-[#242320]">
                          {formatLkrPrice(Number(b.estimated_total))}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <a
                      href={generateBookingInquiryUrl(b.booking_reference)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs border border-[#25D366] text-[#25D366] px-3 py-2 rounded-lg min-h-[40px]"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => setCancelId(b.id)}
                        className="text-xs border border-red-700/40 text-red-800 px-3 py-2 rounded-lg min-h-[40px]"
                      >
                        Cancel request
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <ConfirmDialog
        open={Boolean(cancelId)}
        title="Cancel rental request?"
        message="This cannot be undone. You may submit a new request afterwards."
        confirmLabel="Cancel booking"
        danger
        onCancel={() => setCancelId(null)}
        onConfirm={handleCancel}
      />
    </div>
  );
}
