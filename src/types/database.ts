export type UserRole = 'customer' | 'admin';
export type AccountStatus = 'active' | 'suspended' | 'restricted';
export type AvailabilityStatus = 'available' | 'unavailable' | 'maintenance' | 'hidden';
export type BookingStatus =
  | 'pending'
  | 'under_review'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'rejected';
export type PaymentStatus =
  | 'unpaid'
  | 'deposit_paid'
  | 'partially_paid'
  | 'fully_paid'
  | 'refunded';

export interface VehicleSpecifications {
  transmission?: string;
  fuel_type?: string;
  passenger_capacity?: string;
  engine_capacity?: string;
  air_conditioning?: boolean;
  doors?: number;
  luggage_capacity?: string;
  mileage_limit?: string;
  highlights?: string[];
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  profile_image: string | null;
  role: UserRole;
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  created_at: string;
}

export interface Vehicle {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  model: string | null;
  registration_number: string | null;
  category_id: string | null;
  year: number | null;
  description: string | null;
  specifications: VehicleSpecifications;
  daily_price: number;
  weekly_price: number | null;
  monthly_price: number | null;
  deposit_amount: number | null;
  min_rental_days: number;
  pickup_instructions: string | null;
  main_image: string | null;
  gallery: string[];
  thumbnail: string | null;
  availability_status: AvailabilityStatus;
  is_featured: boolean;
  is_published: boolean;
  badge: string | null;
  category_label: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category | null;
}

export interface Booking {
  id: string;
  booking_reference: string;
  customer_id: string;
  vehicle_id: string;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  return_location: string;
  rental_days: number;
  estimated_total: number;
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  customer_notes: string | null;
  admin_notes: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  created_at: string;
  updated_at: string;
  vehicles?: Vehicle | null;
  profiles?: Profile | null;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  region: string | null;
  tagline: string | null;
  elevation_or_vibe: string | null;
  recommended_ride: string | null;
  distance_from_colombo: string | null;
  scenic_highlights: string[];
  image: string | null;
  is_published: boolean;
  created_at: string;
}

export interface WebsiteSetting {
  id: string;
  setting_key: string;
  setting_value: Record<string, unknown>;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

/** Legacy marketing-site shape used by existing components */
export interface LegacyVehicle {
  id: string;
  /** Supabase UUID when loaded from DB (for availability RPCs) */
  dbId?: string;
  name: string;
  category: string;
  categoryLabel: string;
  dailyRateLkr: number;
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Hybrid' | 'Petrol' | 'Diesel';
  capacity: string;
  luggage: string;
  airConditioning: boolean;
  mileageLimit: string;
  availability: string;
  badge?: string;
  imageUrl: string;
  /** Extra photos (excluding main); combined with imageUrl for card carousels (max 3). */
  gallery?: string[];
  description: string;
  highlights: string[];
  slug?: string;
}
