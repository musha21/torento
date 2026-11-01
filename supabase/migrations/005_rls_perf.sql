-- RLS performance: (select auth.uid()) / (select is_admin()) initplan
-- Split FOR ALL admin policies so SELECT is not double-evaluated

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS profiles_select_own_or_admin ON public.profiles;
CREATE POLICY profiles_select_own_or_admin ON public.profiles
  FOR SELECT USING (
    (select auth.uid()) = id OR (select public.is_admin())
  );

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (
    (select auth.uid()) = id OR (select public.is_admin())
  )
  WITH CHECK (
    (select auth.uid()) = id OR (select public.is_admin())
  );

DROP POLICY IF EXISTS profiles_admin_insert ON public.profiles;
CREATE POLICY profiles_admin_insert ON public.profiles
  FOR INSERT WITH CHECK (
    (select public.is_admin()) OR (select auth.uid()) = id
  );

-- ---------------------------------------------------------------------------
-- Bookings
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS bookings_customer_select ON public.bookings;
CREATE POLICY bookings_customer_select ON public.bookings
  FOR SELECT USING (
    (select auth.uid()) = customer_id OR (select public.is_admin())
  );

DROP POLICY IF EXISTS bookings_customer_insert ON public.bookings;
CREATE POLICY bookings_customer_insert ON public.bookings
  FOR INSERT WITH CHECK (
    (select auth.uid()) = customer_id
    AND booking_status = 'pending'
    AND payment_status = 'unpaid'
  );

DROP POLICY IF EXISTS bookings_customer_update ON public.bookings;
CREATE POLICY bookings_customer_update ON public.bookings
  FOR UPDATE USING (
    (select auth.uid()) = customer_id OR (select public.is_admin())
  )
  WITH CHECK (
    (select auth.uid()) = customer_id OR (select public.is_admin())
  );

DROP POLICY IF EXISTS bookings_admin_delete ON public.bookings;
CREATE POLICY bookings_admin_delete ON public.bookings
  FOR DELETE USING ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS notifications_own ON public.notifications;
CREATE POLICY notifications_own ON public.notifications
  FOR SELECT USING (
    (select auth.uid()) = user_id OR (select public.is_admin())
  );

DROP POLICY IF EXISTS notifications_own_update ON public.notifications;
CREATE POLICY notifications_own_update ON public.notifications
  FOR UPDATE USING (
    (select auth.uid()) = user_id OR (select public.is_admin())
  )
  WITH CHECK (
    (select auth.uid()) = user_id OR (select public.is_admin())
  );

DROP POLICY IF EXISTS notifications_admin_insert ON public.notifications;
CREATE POLICY notifications_admin_insert ON public.notifications
  FOR INSERT WITH CHECK (
    (select public.is_admin()) OR (select auth.uid()) = user_id
  );

-- ---------------------------------------------------------------------------
-- Categories: public SELECT only; admin write without FOR ALL SELECT
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS categories_admin_all ON public.categories;
CREATE POLICY categories_admin_insert ON public.categories
  FOR INSERT WITH CHECK ((select public.is_admin()));
CREATE POLICY categories_admin_update ON public.categories
  FOR UPDATE USING ((select public.is_admin())) WITH CHECK ((select public.is_admin()));
CREATE POLICY categories_admin_delete ON public.categories
  FOR DELETE USING ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Destinations
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS destinations_public_read ON public.destinations;
CREATE POLICY destinations_public_read ON public.destinations
  FOR SELECT USING (is_published = TRUE OR (select public.is_admin()));

DROP POLICY IF EXISTS destinations_admin_all ON public.destinations;
CREATE POLICY destinations_admin_insert ON public.destinations
  FOR INSERT WITH CHECK ((select public.is_admin()));
CREATE POLICY destinations_admin_update ON public.destinations
  FOR UPDATE USING ((select public.is_admin())) WITH CHECK ((select public.is_admin()));
CREATE POLICY destinations_admin_delete ON public.destinations
  FOR DELETE USING ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Website settings
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS settings_admin_all ON public.website_settings;
CREATE POLICY settings_admin_insert ON public.website_settings
  FOR INSERT WITH CHECK ((select public.is_admin()));
CREATE POLICY settings_admin_update ON public.website_settings
  FOR UPDATE USING ((select public.is_admin())) WITH CHECK ((select public.is_admin()));
CREATE POLICY settings_admin_delete ON public.website_settings
  FOR DELETE USING ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Vehicles / audit (initplan for is_admin)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS vehicles_public_read ON public.vehicles;
CREATE POLICY vehicles_public_read ON public.vehicles
  FOR SELECT USING (
    (is_published = TRUE AND availability_status <> 'hidden')
    OR (select public.is_admin())
  );

DROP POLICY IF EXISTS vehicles_admin_insert ON public.vehicles;
CREATE POLICY vehicles_admin_insert ON public.vehicles
  FOR INSERT WITH CHECK ((select public.is_admin()));

DROP POLICY IF EXISTS vehicles_admin_update ON public.vehicles;
CREATE POLICY vehicles_admin_update ON public.vehicles
  FOR UPDATE USING ((select public.is_admin())) WITH CHECK ((select public.is_admin()));

DROP POLICY IF EXISTS vehicles_admin_delete ON public.vehicles;
CREATE POLICY vehicles_admin_delete ON public.vehicles
  FOR DELETE USING ((select public.is_admin()));

DROP POLICY IF EXISTS audit_logs_admin_select ON public.audit_logs;
CREATE POLICY audit_logs_admin_select ON public.audit_logs
  FOR SELECT USING ((select public.is_admin()));

DROP POLICY IF EXISTS audit_logs_admin_insert ON public.audit_logs;
CREATE POLICY audit_logs_admin_insert ON public.audit_logs
  FOR INSERT WITH CHECK ((select public.is_admin()));
