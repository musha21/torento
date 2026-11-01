import React, { useEffect, useMemo, useState } from 'react';
import { tryGetSupabase } from '../../lib/supabase/client';
import {
  BOOKING_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  updateBookingAsAdmin,
} from '../../lib/booking';
import { formatLkrPrice } from '../../lib/whatsapp';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/Spinner';
import { useToast } from '../../contexts/ToastContext';
import type { Booking, BookingStatus, PaymentStatus } from '../../types/database';

export default function AdminBookings() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  const load = async () => {
    const supabase = tryGetSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('bookings')
      .select('*, vehicles(name, slug), profiles(full_name, phone)')
      .order('created_at', { ascending: false });
    if (error) toast(error.message, 'error');
    setBookings((data as Booking[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const statusOk = statusFilter === 'all' || b.booking_status === statusFilter;
      const q = search.toLowerCase();
      const searchOk =
        !q ||
        b.booking_reference.toLowerCase().includes(q) ||
        (b.profiles?.full_name || '').toLowerCase().includes(q) ||
        (b.vehicles?.name || '').toLowerCase().includes(q);
      return statusOk && searchOk;
    });
  }, [bookings, statusFilter, search]);

  const applyUpdate = async (
    id: string,
    updates: { booking_status?: BookingStatus; payment_status?: PaymentStatus; admin_notes?: string }
  ) => {
    const { error } = await updateBookingAsAdmin(id, updates);
    if (error) toast(error, 'error');
    else {
      toast('Booking updated', 'success');
      load();
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <h1 className="font-editorial-heading text-3xl mb-6">Booking Management</h1>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reference, customer, vehicle"
          className="flex-1 min-w-0 border border-[#43282A]/20 bg-white/70 px-3 py-2 rounded-lg text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-[#43282A]/20 bg-white/70 px-3 py-2 rounded-lg text-sm w-full sm:w-auto"
        >
          <option value="all">All statuses</option>
          {Object.keys(BOOKING_STATUS_LABELS).map((s) => (
            <option key={s} value={s}>
              {BOOKING_STATUS_LABELS[s as BookingStatus]}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No bookings" description="Incoming rental requests will appear here." />
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div key={b.id} className="bg-white/70 border border-[#D8C9AD] rounded-xl p-5">
              <div className="flex flex-wrap justify-between gap-3 mb-3">
                <div>
                  <p className="font-editorial-heading text-xl">{b.vehicles?.name}</p>
                  <p className="text-xs text-[#43282A]/70">
                    {b.booking_reference} · {b.profiles?.full_name || 'Customer'} ·{' '}
                    {b.profiles?.phone || b.contact_phone || '—'}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p>{BOOKING_STATUS_LABELS[b.booking_status]}</p>
                  <p className="text-[#43282A]/70">{PAYMENT_STATUS_LABELS[b.payment_status]}</p>
                  <p className="font-semibold">{formatLkrPrice(Number(b.estimated_total))}</p>
                </div>
              </div>
              <p className="text-sm mb-3">
                {new Date(b.pickup_date).toLocaleString()} → {new Date(b.return_date).toLocaleString()} ·{' '}
                {b.pickup_location} / {b.return_location}
              </p>
              {b.customer_notes && (
                <p className="text-xs bg-[#E6DCC8]/50 p-2 rounded mb-3">Customer: {b.customer_notes}</p>
              )}
              <div className="flex flex-wrap gap-2 mb-3 -mx-1 px-1 overflow-x-auto">
                {(
                  [
                    ['under_review', 'Under review'],
                    ['confirmed', 'Approve / Confirm'],
                    ['active', 'Mark active'],
                    ['completed', 'Complete'],
                    ['rejected', 'Reject'],
                    ['cancelled', 'Cancel'],
                  ] as [BookingStatus, string][]
                ).map(([status, label]) => (
                  <button
                    key={status}
                    type="button"
                    disabled={b.booking_status === status}
                    onClick={() => applyUpdate(b.id, { booking_status: status })}
                    className="text-xs px-3 py-2 border border-[#43282A]/20 rounded-lg hover:bg-[#A86438]/10 disabled:opacity-40 shrink-0 min-h-[40px]"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={b.payment_status}
                  onChange={(e) =>
                    applyUpdate(b.id, { payment_status: e.target.value as PaymentStatus })
                  }
                  className="border border-[#43282A]/20 px-3 py-2 rounded-lg text-sm"
                >
                  {Object.keys(PAYMENT_STATUS_LABELS).map((p) => (
                    <option key={p} value={p}>
                      {PAYMENT_STATUS_LABELS[p as PaymentStatus]}
                    </option>
                  ))}
                </select>
                <input
                  value={notesDraft[b.id] ?? b.admin_notes ?? ''}
                  onChange={(e) => setNotesDraft({ ...notesDraft, [b.id]: e.target.value })}
                  placeholder="Internal admin notes"
                  className="flex-1 border border-[#43282A]/20 px-3 py-2 rounded-lg text-sm"
                />
                <button
                  type="button"
                  onClick={() => applyUpdate(b.id, { admin_notes: notesDraft[b.id] ?? '' })}
                  className="px-4 py-2 bg-[#43282A] text-white rounded-lg text-sm"
                >
                  Save notes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
