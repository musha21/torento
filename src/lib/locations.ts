/** Preset pickup / return locations for quick booking */
export const PICKUP_LOCATIONS = [
  'Katunayake Airport (CMB)',
  'Colombo',
  'Kandy',
  'Galle',
  'Negombo',
] as const;

export type PickupLocationPreset = (typeof PICKUP_LOCATIONS)[number];

export const DEFAULT_PICKUP_LOCATION: PickupLocationPreset = 'Katunayake Airport (CMB)';
