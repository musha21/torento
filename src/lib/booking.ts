import { differenceInCalendarDays, parseISO } from 'date-fns';
import { getSupabase } from './supabase/client';
import { estimateRentalTotal } from './vehicles';
import type { Booking, BookingStatus, PaymentStatus } from '../types/database';

export interface CreateBookingInput {
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  customerNotes?: string;
  contactPhone?: string;
  contactEmail?: string;
  dailyPrice: number;
  weeklyPrice?: number | null;
  monthlyPrice?: number | null;
  minRentalDays?: number;
}

export function calcRentalDays(pickupIso: string, returnIso: string): number {
  const days = differenceInCalendarDays(parseISO(returnIso), parseISO(pickupIso));
  return Math.max(days, 1);
}

export async function createBookingRequest(
  customerId: string,
  input: CreateBookingInput
): Promise<{ booking: Booking | null; error: string | null }> {
  try {
    const supabase = getSupabase();
    const rentalDays = calcRentalDays(input.pickupDate, input.returnDate);
    const minDays = input.minRentalDays ?? 1;

    if (rentalDays < minDays) {
      return { booking: null, error: `Minimum rental duration is ${minDays} day(s).` };
    }

    if (new Date(input.returnDate) <= new Date(input.pickupDate)) {
      return { booking: null, error: 'Return date must be after pickup date.' };
    }

    const { data: available, error: availError } = await supabase.rpc('check_vehicle_availability', {
      p_vehicle_id: input.vehicleId,
      p_pickup: input.pickupDate,
      p_return: input.returnDate,
    });

    if (availError) {
      // Soft check — still allow pending request if RPC missing during setup
      console.warn('Availability check:', availError.message);
    } else if (available === false) {
      return {
        booking: null,
        error: 'This vehicle already has a confirmed booking overlapping those dates. Please choose different dates.',
      };
    }

    const { data: refData } = await supabase.rpc('generate_booking_reference');
    const bookingReference =
      (refData as string) ||
      `TRN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const estimatedTotal = estimateRentalTotal(
      input.dailyPrice,
      rentalDays,
      input.weeklyPrice,
      input.monthlyPrice
    );

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        booking_reference: bookingReference,
        customer_id: customerId,
        vehicle_id: input.vehicleId,
        pickup_date: input.pickupDate,
        return_date: input.returnDate,
        pickup_location: input.pickupLocation,
        return_location: input.returnLocation,
        rental_days: rentalDays,
        estimated_total: estimatedTotal,
        booking_status: 'pending',
        payment_status: 'unpaid',
        customer_notes: input.customerNotes || null,
        contact_phone: input.contactPhone || null,
        contact_email: input.contactEmail || null,
      })
      .select('*, vehicles(*)')
      .single();

    if (error) {
      return { booking: null, error: error.message };
    }

    await supabase.from('notifications').insert({
      user_id: customerId,
      title: 'Booking request submitted',
      message: `Your rental request ${bookingReference} was submitted and is pending review.`,
    });

    return { booking: data as Booking, error: null };
  } catch (e) {
    return {
      booking: null,
      error: e instanceof Error ? e.message : 'Failed to create booking',
    };
  }
}

export async function cancelOwnBooking(bookingId: string): Promise<{ error: string | null }> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('bookings')
      .update({ booking_status: 'cancelled' })
      .eq('id', bookingId)
      .in('booking_status', ['pending', 'under_review']);

    if (error) return { error: error.message };
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Cancel failed' };
  }
}

export async function updateBookingAsAdmin(
  bookingId: string,
  updates: {
    booking_status?: BookingStatus;
    payment_status?: PaymentStatus;
    admin_notes?: string;
  }
): Promise<{ booking: Booking | null; error: string | null }> {
  try {
    const supabase = getSupabase();

    if (updates.booking_status === 'confirmed') {
      const { data, error } = await supabase.rpc('approve_booking', { p_booking_id: bookingId });
      if (error) return { booking: null, error: error.message };
      if (updates.payment_status || updates.admin_notes) {
        const { data: updated, error: upErr } = await supabase
          .from('bookings')
          .update({
            payment_status: updates.payment_status,
            admin_notes: updates.admin_notes,
          })
          .eq('id', bookingId)
          .select('*, vehicles(*), profiles(*)')
          .single();
        if (upErr) return { booking: data as Booking, error: null };
        return { booking: updated as Booking, error: null };
      }
      return { booking: data as Booking, error: null };
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId)
      .select('*, vehicles(*), profiles(*)')
      .single();

    if (error) return { booking: null, error: error.message };

    await supabase.from('audit_logs').insert({
      admin_id: (await supabase.auth.getUser()).data.user?.id,
      action: 'update_booking',
      entity_type: 'booking',
      entity_id: bookingId,
      details: updates,
    });

    return { booking: data as Booking, error: null };
  } catch (e) {
    return { booking: null, error: e instanceof Error ? e.message : 'Update failed' };
  }
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Pending',
  under_review: 'Under Review',
  confirmed: 'Confirmed',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: 'Unpaid',
  deposit_paid: 'Deposit Paid',
  partially_paid: 'Partially Paid',
  fully_paid: 'Fully Paid',
  refunded: 'Refunded',
};
