import {
  addDays,
  eachDayOfInterval,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { tryGetSupabase } from './supabase/client';

export interface DateRange {
  pickup_date: string;
  return_date: string;
}

/** Format a Date as YYYY-MM-DD in local calendar terms. */
export function toDateKey(d: Date): string {
  return format(d, 'yyyy-MM-dd');
}

/**
 * Expand booking ranges into blocked calendar days.
 * Semantics match DB overlap (pickup < return): days from pickup inclusive
 * through the day before return. Same-calendar-day edge cases with timestamptz
 * still mark the pickup day when return is the next calendar day.
 * For date-only rentals we treat the range as inclusive of both ends so a
 * 1-night stay (pickup D1, return D2) blocks D1; multi-day D1→D5 blocks D1–D4
 * if return is exclusive end-of-rental morning — but UX expects return day
 * unavailable until returned. Plan: block pickup through day before return
 * when return > pickup by calendar days; also block return day if same as
 * pickup is impossible. For date-only: block every day d where pickup <= d < return.
 */
export function expandUnavailableDays(ranges: DateRange[]): Set<string> {
  const blocked = new Set<string>();
  for (const range of ranges) {
    const start = startOfDay(parseISO(range.pickup_date.slice(0, 10)));
    const endExclusive = startOfDay(parseISO(range.return_date.slice(0, 10)));
    if (endExclusive <= start) {
      blocked.add(toDateKey(start));
      continue;
    }
    const days = eachDayOfInterval({ start, end: addDays(endExclusive, -1) });
    for (const day of days) {
      blocked.add(toDateKey(day));
    }
  }
  return blocked;
}

export function isRangeAvailable(
  pickupKey: string,
  returnKey: string,
  blocked: Set<string>
): boolean {
  if (!pickupKey || !returnKey) return false;
  const start = startOfDay(parseISO(pickupKey));
  const end = startOfDay(parseISO(returnKey));
  if (end <= start) return false;
  const days = eachDayOfInterval({ start, end: addDays(end, -1) });
  return days.every((d) => !blocked.has(toDateKey(d)));
}

/** Normalize date-only YYYY-MM-DD to ISO timestamptz at Asia/Colombo midnight. */
export function dateOnlyToPickupIso(dateKey: string): string {
  return `${dateKey}T00:00:00+05:30`;
}

export function dateOnlyToReturnIso(dateKey: string): string {
  return `${dateKey}T00:00:00+05:30`;
}

export async function fetchVehicleUnavailableRanges(
  vehicleId: string,
  from: Date,
  to: Date
): Promise<{ ranges: DateRange[]; error: string | null }> {
  const supabase = tryGetSupabase();
  if (!supabase) {
    return { ranges: [], error: null };
  }

  const { data, error } = await supabase.rpc('get_vehicle_unavailable_ranges', {
    p_vehicle_id: vehicleId,
    p_from: toDateKey(from),
    p_to: toDateKey(to),
  });

  if (error) {
    console.warn('Unavailable ranges:', error.message);
    return { ranges: [], error: error.message };
  }

  const ranges = ((data as DateRange[]) || []).map((r) => ({
    pickup_date: String(r.pickup_date).slice(0, 10),
    return_date: String(r.return_date).slice(0, 10),
  }));

  return { ranges, error: null };
}

export async function fetchBlockedDaysForMonth(
  vehicleId: string,
  month: Date
): Promise<{ blocked: Set<string>; error: string | null }> {
  // Pad one day outside month so ranges spanning months are complete
  const from = addDays(startOfMonth(month), -1);
  const to = addDays(endOfMonth(month), 2);
  const { ranges, error } = await fetchVehicleUnavailableRanges(vehicleId, from, to);
  return { blocked: expandUnavailableDays(ranges), error };
}
