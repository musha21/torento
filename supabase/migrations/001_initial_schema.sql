-- TORENTO Vehicle Rental Platform — Initial Schema
-- Run in Supabase SQL Editor or via supabase db push

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- HELPERS
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- PROFILES (table before is_admin / handle_new_user — SQL functions validate at create time)
-- ---------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  profile_image TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  account_status TEXT NOT NULL DEFAULT 'active'
    CHECK (account_status IN ('active', 'suspended', 'restricted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_account_status ON public.profiles(account_status);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND account_status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role, account_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    'customer',
    'active'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Prevent customers from changing their own role
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
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

CREATE TRIGGER protect_profile_role_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- ---------------------------------------------------------------------------
-- CATEGORIES
-- ---------------------------------------------------------------------------
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- VEHICLES
-- ---------------------------------------------------------------------------
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  brand TEXT,
  model TEXT,
  registration_number TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  year INTEGER,
  description TEXT,
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  daily_price NUMERIC(12,2) NOT NULL CHECK (daily_price >= 0),
  weekly_price NUMERIC(12,2) CHECK (weekly_price IS NULL OR weekly_price >= 0),
  monthly_price NUMERIC(12,2) CHECK (monthly_price IS NULL OR monthly_price >= 0),
  deposit_amount NUMERIC(12,2) CHECK (deposit_amount IS NULL OR deposit_amount >= 0),
  min_rental_days INTEGER NOT NULL DEFAULT 1 CHECK (min_rental_days >= 1),
  pickup_instructions TEXT,
  main_image TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  thumbnail TEXT,
  availability_status TEXT NOT NULL DEFAULT 'available'
    CHECK (availability_status IN ('available', 'unavailable', 'maintenance', 'hidden')),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  badge TEXT,
  category_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicles_category_id ON public.vehicles(category_id);
CREATE INDEX idx_vehicles_availability ON public.vehicles(availability_status);
CREATE INDEX idx_vehicles_published_featured ON public.vehicles(is_published, is_featured);
CREATE INDEX idx_vehicles_daily_price ON public.vehicles(daily_price);
CREATE INDEX idx_vehicles_slug ON public.vehicles(slug);

CREATE TRIGGER vehicles_set_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- BOOKINGS
-- ---------------------------------------------------------------------------
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE RESTRICT,
  pickup_date TIMESTAMPTZ NOT NULL,
  return_date TIMESTAMPTZ NOT NULL,
  pickup_location TEXT NOT NULL,
  return_location TEXT NOT NULL,
  rental_days INTEGER NOT NULL CHECK (rental_days >= 1),
  estimated_total NUMERIC(12,2) NOT NULL CHECK (estimated_total >= 0),
  booking_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (booking_status IN (
      'pending', 'under_review', 'confirmed', 'active',
      'completed', 'cancelled', 'rejected'
    )),
  payment_status TEXT NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status IN (
      'unpaid', 'deposit_paid', 'partially_paid', 'fully_paid', 'refunded'
    )),
  customer_notes TEXT,
  admin_notes TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT bookings_dates_valid CHECK (return_date > pickup_date)
);

CREATE INDEX idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX idx_bookings_vehicle ON public.bookings(vehicle_id);
CREATE INDEX idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX idx_bookings_reference ON public.bookings(booking_reference);
CREATE INDEX idx_bookings_dates ON public.bookings(pickup_date, return_date);
CREATE INDEX idx_bookings_vehicle_dates ON public.bookings(vehicle_id, pickup_date, return_date)
  WHERE booking_status IN ('confirmed', 'active');

CREATE TRIGGER bookings_set_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Customers may only cancel pending/under_review; cannot change payment/status otherwise
CREATE OR REPLACE FUNCTION public.protect_booking_customer_updates()
RETURNS TRIGGER
LANGUAGE plpgsql
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

CREATE TRIGGER protect_booking_customer_updates_trigger
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.protect_booking_customer_updates();

-- ---------------------------------------------------------------------------
-- AVAILABILITY / OVERLAP
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_vehicle_availability(
  p_vehicle_id UUID,
  p_pickup TIMESTAMPTZ,
  p_return TIMESTAMPTZ,
  p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conflict_count INTEGER;
BEGIN
  IF p_return <= p_pickup THEN
    RETURN FALSE;
  END IF;

  SELECT COUNT(*) INTO conflict_count
  FROM public.bookings b
  WHERE b.vehicle_id = p_vehicle_id
    AND b.booking_status IN ('confirmed', 'active')
    AND (p_exclude_booking_id IS NULL OR b.id <> p_exclude_booking_id)
    AND b.pickup_date < p_return
    AND b.return_date > p_pickup;

  RETURN conflict_count = 0;
END;
$$;

CREATE OR REPLACE FUNCTION public.approve_booking(p_booking_id UUID)
RETURNS public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  b public.bookings;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can approve bookings';
  END IF;

  SELECT * INTO b FROM public.bookings WHERE id = p_booking_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  IF NOT public.check_vehicle_availability(b.vehicle_id, b.pickup_date, b.return_date, b.id) THEN
    RAISE EXCEPTION 'Vehicle is not available for the selected dates';
  END IF;

  UPDATE public.bookings
  SET booking_status = 'confirmed', updated_at = NOW()
  WHERE id = p_booking_id
  RETURNING * INTO b;

  INSERT INTO public.audit_logs (admin_id, action, entity_type, entity_id, details)
  VALUES (auth.uid(), 'approve_booking', 'booking', p_booking_id, jsonb_build_object('reference', b.booking_reference));

  RETURN b;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS TEXT
LANGUAGE plpgsql
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
-- DESTINATIONS
-- ---------------------------------------------------------------------------
CREATE TABLE public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  region TEXT,
  tagline TEXT,
  elevation_or_vibe TEXT,
  recommended_ride TEXT,
  distance_from_colombo TEXT,
  scenic_highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  image TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_destinations_slug ON public.destinations(slug);
CREATE INDEX idx_destinations_published ON public.destinations(is_published);

-- ---------------------------------------------------------------------------
-- WEBSITE SETTINGS
-- ---------------------------------------------------------------------------
CREATE TABLE public.website_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER website_settings_set_updated_at
  BEFORE UPDATE ON public.website_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- NOTIFICATIONS
-- ---------------------------------------------------------------------------
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, is_read);

-- ---------------------------------------------------------------------------
-- AUDIT LOGS
-- ---------------------------------------------------------------------------
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_admin ON public.audit_logs(admin_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- ADMIN BOOTSTRAP (service role / SQL editor only)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.assign_admin(p_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID;
BEGIN
  SELECT id INTO uid FROM auth.users WHERE email = lower(p_email);
  IF uid IS NULL THEN
    RAISE EXCEPTION 'User with email % not found. Register the account first.', p_email;
  END IF;

  -- Bypass protect_profile_role (blocks role changes when auth.uid() is null in SQL Editor)
  PERFORM set_config('session_replication_role', 'replica', true);

  UPDATE public.profiles
  SET role = 'admin', account_status = 'active', updated_at = NOW()
  WHERE id = uid;

  PERFORM set_config('session_replication_role', 'origin', true);

  INSERT INTO public.audit_logs (admin_id, action, entity_type, entity_id, details)
  VALUES (uid, 'assign_admin', 'profile', uid::TEXT, jsonb_build_object('email', p_email));
END;
$$;

REVOKE ALL ON FUNCTION public.assign_admin(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assign_admin(TEXT) TO service_role;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY profiles_select_own_or_admin ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY profiles_admin_insert ON public.profiles
  FOR INSERT WITH CHECK (public.is_admin() OR auth.uid() = id);

-- Categories: public read, admin write
CREATE POLICY categories_public_read ON public.categories
  FOR SELECT USING (TRUE);

CREATE POLICY categories_admin_all ON public.categories
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Vehicles: public read published (not hidden), admin all
CREATE POLICY vehicles_public_read ON public.vehicles
  FOR SELECT USING (
    (is_published = TRUE AND availability_status <> 'hidden')
    OR public.is_admin()
  );

CREATE POLICY vehicles_admin_insert ON public.vehicles
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY vehicles_admin_update ON public.vehicles
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY vehicles_admin_delete ON public.vehicles
  FOR DELETE USING (public.is_admin());

-- Bookings
CREATE POLICY bookings_customer_select ON public.bookings
  FOR SELECT USING (auth.uid() = customer_id OR public.is_admin());

CREATE POLICY bookings_customer_insert ON public.bookings
  FOR INSERT WITH CHECK (
    auth.uid() = customer_id
    AND booking_status = 'pending'
    AND payment_status = 'unpaid'
  );

CREATE POLICY bookings_customer_update ON public.bookings
  FOR UPDATE USING (auth.uid() = customer_id OR public.is_admin())
  WITH CHECK (auth.uid() = customer_id OR public.is_admin());

CREATE POLICY bookings_admin_delete ON public.bookings
  FOR DELETE USING (public.is_admin());

-- Destinations
CREATE POLICY destinations_public_read ON public.destinations
  FOR SELECT USING (is_published = TRUE OR public.is_admin());

CREATE POLICY destinations_admin_all ON public.destinations
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Website settings: public read, admin write
CREATE POLICY settings_public_read ON public.website_settings
  FOR SELECT USING (TRUE);

CREATE POLICY settings_admin_all ON public.website_settings
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Notifications
CREATE POLICY notifications_own ON public.notifications
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY notifications_own_update ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY notifications_admin_insert ON public.notifications
  FOR INSERT WITH CHECK (public.is_admin() OR auth.uid() = user_id);

-- Audit logs: admin only
CREATE POLICY audit_logs_admin_select ON public.audit_logs
  FOR SELECT USING (public.is_admin());

CREATE POLICY audit_logs_admin_insert ON public.audit_logs
  FOR INSERT WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- STORAGE BUCKETS (run after enabling Storage)
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('vehicle-images', 'vehicle-images', TRUE),
  ('profile-images', 'profile-images', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY vehicle_images_public_read ON storage.objects
  FOR SELECT USING (bucket_id = 'vehicle-images');

CREATE POLICY vehicle_images_admin_write ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'vehicle-images' AND public.is_admin());

CREATE POLICY vehicle_images_admin_update ON storage.objects
  FOR UPDATE USING (bucket_id = 'vehicle-images' AND public.is_admin());

CREATE POLICY vehicle_images_admin_delete ON storage.objects
  FOR DELETE USING (bucket_id = 'vehicle-images' AND public.is_admin());

CREATE POLICY profile_images_public_read ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY profile_images_own_write ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-images'
    AND (auth.uid()::TEXT = (storage.foldername(name))[1] OR public.is_admin())
  );

CREATE POLICY profile_images_own_update ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile-images'
    AND (auth.uid()::TEXT = (storage.foldername(name))[1] OR public.is_admin())
  );

CREATE POLICY profile_images_own_delete ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile-images'
    AND (auth.uid()::TEXT = (storage.foldername(name))[1] OR public.is_admin())
  );
