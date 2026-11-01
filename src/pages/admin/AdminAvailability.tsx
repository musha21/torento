import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  addDays,
  endOfMonth,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
  eachDayOfInterval,
  isBefore,
} from 'date-fns';
import { tryGetSupabase } from '../../lib/supabase/client';
import { toDateKey, expandUnavailableDays } from '../../lib/availability';
import { BOOKING_STATUS_LABELS } from '../../lib/booking';
import { MonthCalendar } from '../../components/calendar/MonthCalendar';
import { PageLoader } from '../../components/ui/Spinner';
import { useToast } from '../../contexts/ToastContext';
import type { Booking, Vehicle } from '../../types/database';

type BookingRow = Booking & {
  vehicles?: { name: string; slug?: string } | null;
  profiles?: { full_name: string | null; phone: string | null } | null;
};

export default function AdminAvailability() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [vehicleId, setVehicleId] = useState<string>('all');
  const [showPending, setShowPending] = useState(true);
  const [vehicles, setVehicles] = useState<Pick<Vehicle, 'id' | 'name'>[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const load = async () => {
    const supabase = tryGetSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const from = addDays(startOfMonth(month), -1).toISOString();
    const to = addDays(endOfMonth(month), 2).toISOString();

    const [vehRes, bookRes] = await Promise.all([
      supabase.from('vehicles').select('id, name').order('name'),
      supabase
        .from('bookings')
        .select('*, vehicles(name, slug), profiles(full_name, phone)')
        .lt('pickup_date', to)
        .gt('return_date', from)
        .order('pickup_date', { ascending: true }),
    ]);

    if (vehRes.error) toast(vehRes.error.message, 'error');
    if (bookRes.error) toast(bookRes.error.message, 'error');

    setVehicles((vehRes.data as Pick<Vehicle, 'id' | 'name'>[]) || []);
    setBookings((bookRes.data as BookingRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  const filtered = useMemo(() => {
    if (vehicleId === 'all') return bookings;
    return bookings.filter((b) => b.vehicle_id === vehicleId);
  }, [bookings, vehicleId]);

  const blocking = useMemo(
    () => filtered.filter((b) => b.booking_status === 'confirmed' || b.booking_status === 'active'),
    [filtered]
  );

  const pending = useMemo(
    () =>
      filtered.filter(
        (b) => b.booking_status === 'pending' || b.booking_status === 'under_review'
      ),
    [filtered]
  );

  const unavailableDays = useMemo(
    () =>
      expandUnavailableDays(
        blocking.map((b) => ({
          pickup_date: String(b.pickup_date).slice(0, 10),
          return_date: String(b.return_date).slice(0, 10),
        }))
      ),
    [blocking]
  );

  const softMarkedDays = useMemo(() => {
    if (!showPending) return new Set<string>();
    return expandUnavailableDays(
      pending.map((b) => ({
        pickup_date: String(b.pickup_date).slice(0, 10),
        return_date: String(b.return_date).slice(0, 10),
      }))
    );
  }, [pending, showPending]);

  const dayCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of [...blocking, ...(showPending ? pending : [])]) {
      const start = startOfDay(parseISO(String(b.pickup_date).slice(0, 10)));
      const endEx = startOfDay(parseISO(String(b.return_date).slice(0, 10)));
      if (isBefore(endEx, start) || endEx.getTime() === start.getTime()) {
        const k = toDateKey(start);
        map.set(k, (map.get(k) || 0) + 1);
        continue;
      }
      for (const d of eachDayOfInterval({ start, end: addDays(endEx, -1) })) {
        const k = toDateKey(d);
        map.set(k, (map.get(k) || 0) + 1);
      }
    }
    return map;
  }, [blocking, pending, showPending]);

  const dayBookings = useMemo(() => {
    if (!selectedDay) return [];
    const day = startOfDay(parseISO(selectedDay));
    return filtered.filter((b) => {
      const start = startOfDay(parseISO(String(b.pickup_date).slice(0, 10)));
      const endEx = startOfDay(parseISO(String(b.return_date).slice(0, 10)));
      return day >= start && day < endEx;
    });
  }, [filtered, selectedDay]);

  if (loading && vehicles.length === 0) return <PageLoader />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-editorial-heading text-3xl">Availability Calendar</h1>
          <p className="text-sm text-[#43282A]/70 mt-1">
            Confirmed and active rentals block vehicle days. Pending requests are optional markers
            only.
          </p>
        </div>
        <Link
          to="/admin/bookings"
          className="text-sm text-[#A86438] hover:underline whitespace-nowrap"
        >
          Open booking list →
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          className="flex-1 border border-[#43282A]/20 bg-white/70 px-3 py-2 rounded-lg text-sm"
        >
          <option value="all">All vehicles</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2 text-sm text-[#43282A]/80 px-2">
          <input
            type="checkbox"
            checked={showPending}
            onChange={(e) => setShowPending(e.target.checked)}
            className="rounded border-[#43282A]/30"
          />
          Show pending requests
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        <div className="lg:col-span-3 bg-white/70 border border-[#D8C9AD] rounded-xl p-3 sm:p-5 relative overflow-x-auto">
          {loading && (
            <div className="absolute inset-0 bg-white/40 rounded-xl z-10 pointer-events-none" />
          )}
          <MonthCalendar
            month={month}
            onMonthChange={setMonth}
            unavailableDays={unavailableDays}
            softMarkedDays={softMarkedDays}
            allowSelectUnavailable
            onSelectDay={(key) => setSelectedDay(key)}
            pickupDate={selectedDay}
            renderDayExtra={(key) => {
              const n = dayCounts.get(key) || 0;
              if (!n) return null;
              return (
                <span className="mt-0.5 text-[9px] font-semibold text-[#A86438] leading-none">
                  {n}
                </span>
              );
            }}
          />
        </div>

        <div className="lg:col-span-2 bg-white/70 border border-[#D8C9AD] rounded-xl p-4 sm:p-5">
          <h2 className="font-semibold text-[#242320] mb-3">
            {selectedDay
              ? format(parseISO(selectedDay), 'EEE, d MMM yyyy')
              : 'Select a day'}
          </h2>
          {!selectedDay && (
            <p className="text-sm text-[#43282A]/60">
              Click a calendar day to see overlapping bookings for the current filter.
            </p>
          )}
          {selectedDay && dayBookings.length === 0 && (
            <p className="text-sm text-[#43282A]/60">No bookings on this day for the filter.</p>
          )}
          <ul className="space-y-3">
            {dayBookings.map((b) => (
              <li
                key={b.id}
                className="border border-[#43282A]/10 rounded-lg p-3 text-sm space-y-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-[#242320]">
                    {b.vehicles?.name || 'Vehicle'}
                  </span>
                  <span
                    className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      b.booking_status === 'confirmed' || b.booking_status === 'active'
                        ? 'bg-[#43282A]/10 text-[#43282A]'
                        : 'bg-[#A86438]/15 text-[#A86438]'
                    }`}
                  >
                    {BOOKING_STATUS_LABELS[b.booking_status]}
                  </span>
                </div>
                <p className="text-xs text-[#43282A]/70 tabular-nums">
                  {String(b.pickup_date).slice(0, 10)} → {String(b.return_date).slice(0, 10)}
                </p>
                <p className="text-xs text-[#43282A]/70">
                  {b.profiles?.full_name || 'Customer'} ·{' '}
                  <Link
                    to="/admin/bookings"
                    className="text-[#A86438] hover:underline font-medium"
                  >
                    {b.booking_reference}
                  </Link>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
