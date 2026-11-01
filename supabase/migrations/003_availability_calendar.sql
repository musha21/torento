-- Public date-only unavailable ranges for vehicle calendars (no PII).
-- Confirmed/active bookings block overlapping calendar days.

CREATE OR REPLACE FUNCTION public.get_vehicle_unavailable_ranges(
  p_vehicle_id UUID,
  p_from DATE,
  p_to DATE
)
RETURNS TABLE (
  pickup_date DATE,
  return_date DATE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (b.pickup_date AT TIME ZONE 'Asia/Colombo')::date AS pickup_date,
    (b.return_date AT TIME ZONE 'Asia/Colombo')::date AS return_date
  FROM public.bookings b
  WHERE b.vehicle_id = p_vehicle_id
    AND b.booking_status IN ('confirmed', 'active')
    AND (b.pickup_date AT TIME ZONE 'Asia/Colombo')::date < p_to
    AND (b.return_date AT TIME ZONE 'Asia/Colombo')::date > p_from
  ORDER BY 1;
$$;

REVOKE ALL ON FUNCTION public.get_vehicle_unavailable_ranges(UUID, DATE, DATE) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_vehicle_unavailable_ranges(UUID, DATE, DATE) TO anon, authenticated;
