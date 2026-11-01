import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  phone: z.string().optional(),
});

const dateOnly = z
  .string()
  .min(1, 'Date is required')
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a valid calendar date');

export const bookingRequestSchema = z
  .object({
    pickupDate: dateOnly,
    returnDate: dateOnly,
    pickupLocation: z.string().min(2, 'Pickup location is required'),
    returnLocation: z.string().min(2, 'Return location is required'),
    contactPhone: z.string().min(7, 'Phone number is required'),
    contactEmail: z.string().email('Valid email is required').optional().or(z.literal('')),
    customerNotes: z.string().optional(),
  })
  .refine((d) => d.returnDate > d.pickupDate, {
    message: 'Return must be after pickup',
    path: ['returnDate'],
  });

export const vehicleFormSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  registration_number: z.string().optional(),
  category_id: z.string().uuid('Select a category'),
  year: z.coerce.number().int().min(1990).max(2100).optional().or(z.literal('')),
  description: z.string().optional(),
  daily_price: z.coerce.number().min(0),
  weekly_price: z.coerce.number().min(0).optional().or(z.literal('')),
  monthly_price: z.coerce.number().min(0).optional().or(z.literal('')),
  deposit_amount: z.coerce.number().min(0).optional().or(z.literal('')),
  min_rental_days: z.coerce.number().int().min(1).default(1),
  pickup_instructions: z.string().optional(),
  main_image: z.string().optional(),
  availability_status: z.enum(['available', 'unavailable', 'maintenance', 'hidden']),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(true),
  badge: z.string().optional(),
  category_label: z.string().optional(),
  transmission: z.string().optional(),
  fuel_type: z.string().optional(),
  passenger_capacity: z.string().optional(),
  luggage_capacity: z.string().optional(),
  air_conditioning: z.boolean().default(false),
  mileage_limit: z.string().optional(),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type BookingRequestForm = z.infer<typeof bookingRequestSchema>;
export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;
