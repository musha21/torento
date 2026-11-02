import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { startOfMonth } from 'date-fns';
import { bookingRequestSchema, type BookingRequestForm as BookingFormValues } from '../../lib/validations';
import { createBookingRequest, calcRentalDays } from '../../lib/booking';
import { estimateRentalTotal } from '../../lib/vehicles';
import {
  dateOnlyToPickupIso,
  dateOnlyToReturnIso,
  fetchBlockedDaysForMonth,
  isRangeAvailable,
} from '../../lib/availability';
import {
  formatLkrPrice,
  generateVehicleInquiryUrl,
  vehicleTypeLabel,
} from '../../lib/whatsapp';
import { DEFAULT_PICKUP_LOCATION } from '../../lib/locations';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import type { Vehicle } from '../../types/database';
import { Spinner } from '../ui/Spinner';
import { MonthCalendar } from '../calendar/MonthCalendar';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';

interface Props {
  vehicle: Vehicle;
}

export const BookingRequestForm: React.FC<Props> = ({ vehicle }) => {
  const { user, configured } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  const [loadingCal, setLoadingCal] = useState(false);
  const [selectStep, setSelectStep] = useState<'pickup' | 'return'>('pickup');

  const vehicleBookable = vehicle.availability_status === 'available';

  const prefillPickup = searchParams.get('pickup') || '';
  const prefillReturn = searchParams.get('return') || '';
  const prefillLocation = searchParams.get('location') || DEFAULT_PICKUP_LOCATION;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingRequestSchema),
    defaultValues: {
      pickupLocation: prefillLocation,
      returnLocation: prefillLocation,
      contactEmail: user?.email || '',
      pickupDate: prefillPickup,
      returnDate: prefillReturn,
    },
  });

  useEffect(() => {
    if (prefillPickup) setValue('pickupDate', prefillPickup);
    if (prefillReturn) setValue('returnDate', prefillReturn);
    if (prefillLocation) {
      setValue('pickupLocation', prefillLocation);
      setValue('returnLocation', prefillLocation);
    }
    if (prefillPickup && prefillReturn) setSelectStep('pickup');
  }, [prefillPickup, prefillReturn, prefillLocation, setValue]);

  const pickupDate = watch('pickupDate');
  const returnDate = watch('returnDate');
  const pickupLocation = watch('pickupLocation');

  useEffect(() => {
    let cancelled = false;
    if (!vehicle.id || vehicle.id.startsWith('local-')) {
      setBlocked(new Set());
      return;
    }
    setLoadingCal(true);
    fetchBlockedDaysForMonth(vehicle.id, month).then(({ blocked: next, error }) => {
      if (cancelled) return;
      setBlocked(next);
      setLoadingCal(false);
      if (error) console.warn(error);
    });
    return () => {
      cancelled = true;
    };
  }, [vehicle.id, month]);

  const estimate = useMemo(() => {
    if (!pickupDate || !returnDate) return null;
    try {
      const days = calcRentalDays(pickupDate, returnDate);
      const total = estimateRentalTotal(
        Number(vehicle.daily_price),
        days,
        vehicle.weekly_price,
        vehicle.monthly_price
      );
      return { days, total };
    } catch {
      return null;
    }
  }, [pickupDate, returnDate, vehicle]);

  const rangeConflict =
    pickupDate && returnDate ? !isRangeAvailable(pickupDate, returnDate, blocked) : false;

  const onSelectDay = (dateKey: string) => {
    if (blocked.has(dateKey)) return;

    if (selectStep === 'pickup' || !pickupDate || (pickupDate && returnDate)) {
      setValue('pickupDate', dateKey, { shouldValidate: true });
      setValue('returnDate', '', { shouldValidate: true });
      setSelectStep('return');
      return;
    }

    if (dateKey <= pickupDate) {
      setValue('pickupDate', dateKey, { shouldValidate: true });
      setValue('returnDate', '', { shouldValidate: true });
      setSelectStep('return');
      return;
    }

    if (!isRangeAvailable(pickupDate, dateKey, blocked)) {
      toast('Those dates overlap a confirmed rental. Choose another range.', 'error');
      return;
    }

    setValue('returnDate', dateKey, { shouldValidate: true });
    setSelectStep('pickup');
  };

  const onSubmit = async (values: BookingFormValues) => {
    if (!configured) {
      toast('Supabase is not configured. See docs/SUPABASE_SETUP.md', 'error');
      return;
    }
    if (!user) {
      toast('Please sign in to submit a rental request', 'info');
      navigate('/login', { state: { from: `/vehicles/${vehicle.slug}` } });
      return;
    }
    if (!vehicleBookable) {
      toast('This vehicle is not currently available for booking requests.', 'error');
      return;
    }
    if (!isRangeAvailable(values.pickupDate, values.returnDate, blocked)) {
      toast('Selected dates are unavailable. Please pick another range.', 'error');
      return;
    }

    setSubmitting(true);
    const { booking, error } = await createBookingRequest(user.id, {
      vehicleId: vehicle.id,
      pickupDate: dateOnlyToPickupIso(values.pickupDate),
      returnDate: dateOnlyToReturnIso(values.returnDate),
      pickupLocation: values.pickupLocation,
      returnLocation: values.returnLocation,
      customerNotes: values.customerNotes,
      contactPhone: values.contactPhone,
      contactEmail: values.contactEmail || user.email,
      dailyPrice: Number(vehicle.daily_price),
      weeklyPrice: vehicle.weekly_price,
      monthlyPrice: vehicle.monthly_price,
      minRentalDays: vehicle.min_rental_days,
    });
    setSubmitting(false);

    if (error || !booking) {
      toast(error || 'Request failed', 'error');
      return;
    }

    setReference(booking.booking_reference);
    toast('Rental request submitted — pending admin review', 'success');
  };

  if (reference) {
    return (
      <div className="bg-white/70 border border-[#D8C9AD] p-6 rounded-xl space-y-4">
        <h3 className="font-editorial-heading text-2xl text-[#242320]">Request submitted</h3>
        <p className="text-sm text-[#43282A]/90">
          Your booking reference is{' '}
          <strong className="text-[#A86438]">{reference}</strong>. Status:{' '}
          <strong>Pending</strong>. An admin must approve before the rental is confirmed. WhatsApp
          messages do not confirm bookings.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/account/bookings')}
            className="px-4 py-2 bg-[#A86438] text-white text-sm rounded-lg"
          >
            View my bookings
          </button>
          <a
            href={generateVehicleInquiryUrl(vehicle.name, {
              vehicleType: vehicleTypeLabel(
                vehicle.categories?.slug || vehicle.category_label || undefined
              ),
              pricePerDay: Number(vehicle.daily_price) || undefined,
              startDate: pickupDate || undefined,
              endDate: returnDate || undefined,
              pickupLocation: pickupLocation || undefined,
              rentalDays: estimate?.days,
              customNotes: reference ? `Booking reference: ${reference}` : undefined,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#25D366] text-[#25D366] text-sm rounded-lg"
          >
            <WhatsAppIcon className="w-4 h-4" /> WhatsApp inquire
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white/70 border border-[#D8C9AD] p-6 rounded-xl space-y-4"
    >
      <h3 className="font-editorial-heading text-2xl">Request this rental</h3>
      <p className="text-xs text-[#43282A]/70">
        Submitting creates a pending request only. Confirmation requires admin approval. Grey days
        are already booked.
      </p>

      {!vehicleBookable && (
        <div className="text-sm bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-lg">
          This vehicle is marked <strong>{vehicle.availability_status}</strong> and cannot accept new
          rental requests right now.
        </div>
      )}

      <div className="relative">
        {loadingCal && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 rounded-lg">
            <Spinner className="h-5 w-5" />
          </div>
        )}
        <MonthCalendar
          month={month}
          onMonthChange={setMonth}
          unavailableDays={blocked}
          pickupDate={pickupDate || null}
          returnDate={returnDate || null}
          onSelectDay={vehicleBookable ? onSelectDay : undefined}
        />
        <p className="mt-2 text-xs text-[#43282A]/65">
          {selectStep === 'pickup' || !pickupDate
            ? 'Select a pickup day, then a return day.'
            : 'Select a return day after pickup.'}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Pickup date</label>
          <input
            type="date"
            {...register('pickupDate')}
            className="mt-1 w-full border border-[#43282A]/20 bg-white px-3 py-2 rounded-lg text-sm"
          />
          {errors.pickupDate && <p className="text-xs text-red-700 mt-1">{errors.pickupDate.message}</p>}
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Return date</label>
          <input
            type="date"
            {...register('returnDate')}
            className="mt-1 w-full border border-[#43282A]/20 bg-white px-3 py-2 rounded-lg text-sm"
          />
          {errors.returnDate && <p className="text-xs text-red-700 mt-1">{errors.returnDate.message}</p>}
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Pickup location</label>
          <input
            {...register('pickupLocation')}
            className="mt-1 w-full border border-[#43282A]/20 bg-white px-3 py-2 rounded-lg text-sm"
          />
          {errors.pickupLocation && (
            <p className="text-xs text-red-700 mt-1">{errors.pickupLocation.message}</p>
          )}
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Return location</label>
          <input
            {...register('returnLocation')}
            className="mt-1 w-full border border-[#43282A]/20 bg-white px-3 py-2 rounded-lg text-sm"
          />
          {errors.returnLocation && (
            <p className="text-xs text-red-700 mt-1">{errors.returnLocation.message}</p>
          )}
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Contact phone</label>
          <input
            {...register('contactPhone')}
            className="mt-1 w-full border border-[#43282A]/20 bg-white px-3 py-2 rounded-lg text-sm"
          />
          {errors.contactPhone && (
            <p className="text-xs text-red-700 mt-1">{errors.contactPhone.message}</p>
          )}
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Contact email</label>
          <input
            type="email"
            {...register('contactEmail')}
            className="mt-1 w-full border border-[#43282A]/20 bg-white px-3 py-2 rounded-lg text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Notes</label>
        <textarea
          rows={3}
          {...register('customerNotes')}
          className="mt-1 w-full border border-[#43282A]/20 bg-white px-3 py-2 rounded-lg text-sm"
        />
      </div>

      {rangeConflict && (
        <p className="text-sm text-red-700">
          Selected dates overlap a confirmed booking. Please choose different dates.
        </p>
      )}

      {estimate && !rangeConflict && (
        <div className="text-sm bg-[#E6DCC8]/50 border border-[#43282A]/10 px-4 py-3 rounded-lg">
          Estimated {estimate.days} day(s) · <strong>{formatLkrPrice(estimate.total)}</strong>
          {vehicle.deposit_amount ? ` · Deposit ${formatLkrPrice(Number(vehicle.deposit_amount))}` : ''}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !vehicleBookable || rangeConflict}
        className="w-full sm:w-auto px-6 py-3 bg-[#A86438] hover:bg-[#43282A] text-white text-sm font-semibold uppercase tracking-wider rounded-lg disabled:opacity-60 inline-flex items-center justify-center gap-2"
      >
        {submitting && <Spinner className="h-4 w-4 border-white/30 border-t-white" />}
        Submit rental request
      </button>
    </form>
  );
};
