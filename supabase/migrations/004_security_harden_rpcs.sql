-- Harden SECURITY DEFINER RPC grants + search_path
-- Critical: assign_admin must not be callable by anon/authenticated

-- ---------------------------------------------------------------------------
-- search_path on mutable helper functions
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Customers cannot change their role';
    END IF;
    IF NEW.account_status IS DISTINCT FROM OLD.account_status THEN
      RAISE EXCEPTION 'Customers cannot change account status';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.protect_booking_customer_updates()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  IF NEW.customer_id IS DISTINCT FROM OLD.customer_id
     OR NEW.vehicle_id IS DISTINCT FROM OLD.vehicle_id
     OR NEW.payment_status IS DISTINCT FROM OLD.payment_status
     OR NEW.admin_notes IS DISTINCT FROM OLD.admin_notes
     OR NEW.estimated_total IS DISTINCT FROM OLD.estimated_total
     OR NEW.booking_reference IS DISTINCT FROM OLD.booking_reference THEN
    RAISE EXCEPTION 'Customers cannot modify protected booking fields';
  END IF;

  IF NEW.booking_status IS DISTINCT FROM OLD.booking_status THEN
    IF NOT (
      OLD.booking_status IN ('pending', 'under_review')
      AND NEW.booking_status = 'cancelled'
    ) THEN
      RAISE EXCEPTION 'Customers can only cancel pending or under-review bookings';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  ref TEXT;
  exists_already BOOLEAN;
BEGIN
  LOOP
    ref := 'TRN-' || TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYYMMDD') || '-' ||
           UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', '') FROM 1 FOR 4));
    SELECT EXISTS(SELECT 1 FROM public.bookings WHERE booking_reference = ref) INTO exists_already;
    EXIT WHEN NOT exists_already;
  END LOOP;
  RETURN ref;
END;
$$;

-- ---------------------------------------------------------------------------
-- Privilege lockdown
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.assign_admin(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.assign_admin(TEXT) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.assign_admin(TEXT) TO service_role;

REVOKE ALL ON FUNCTION public.approve_booking(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.approve_booking(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.approve_booking(UUID) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;

REVOKE ALL ON FUNCTION public.check_vehicle_availability(UUID, TIMESTAMPTZ, TIMESTAMPTZ, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_vehicle_availability(UUID, TIMESTAMPTZ, TIMESTAMPTZ, UUID)
  TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.get_vehicle_unavailable_ranges(UUID, DATE, DATE) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_vehicle_unavailable_ranges(UUID, DATE, DATE)
  TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.generate_booking_reference() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.generate_booking_reference() TO authenticated, service_role;
