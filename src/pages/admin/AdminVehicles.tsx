import React, { useEffect, useState } from 'react';
import { tryGetSupabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { slugify } from '../../lib/vehicles';
import { formatLkrPrice } from '../../lib/whatsapp';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/Spinner';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import type { Category, Vehicle, AvailabilityStatus } from '../../types/database';

const MAX_IMAGES = 4;

const emptyForm = {
  name: '',
  slug: '',
  brand: '',
  model: '',
  registration_number: '',
  category_id: '',
  year: '',
  description: '',
  daily_price: '',
  weekly_price: '',
  monthly_price: '',
  deposit_amount: '',
  min_rental_days: '1',
  pickup_instructions: '',
  images: ['', '', '', ''] as string[],
  availability_status: 'available' as AvailabilityStatus,
  is_featured: false,
  is_published: true,
  badge: '',
  category_label: '',
  transmission: 'Automatic',
  fuel_type: 'Petrol',
  passenger_capacity: '',
  luggage_capacity: '',
  air_conditioning: true,
  mileage_limit: '',
};

function vehicleImagesFromRecord(v: Vehicle): string[] {
  const list = [v.main_image || '', ...(v.gallery || [])]
    .map((u) => String(u || '').trim())
    .filter(Boolean)
    .slice(0, MAX_IMAGES);
  while (list.length < MAX_IMAGES) list.push('');
  return list;
}

function splitImagesForSave(images: string[]): { main_image: string | null; gallery: string[] } {
  const cleaned = images.map((u) => u.trim()).filter(Boolean).slice(0, MAX_IMAGES);
  return {
    main_image: cleaned[0] || null,
    gallery: cleaned.slice(1),
  };
}

function isVehicleHidden(v: Vehicle): boolean {
  return v.availability_status === 'hidden' || !v.is_published;
}

export default function AdminVehicles() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [hideId, setHideId] = useState<string | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [batchUploading, setBatchUploading] = useState(false);

  const load = async () => {
    const supabase = tryGetSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }
    const [v, c] = await Promise.all([
      supabase.from('vehicles').select('*, categories(*)').order('name'),
      supabase.from('categories').select('*').order('name'),
    ]);
    setVehicles((v.data as Vehicle[]) || []);
    setCategories((c.data as Category[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      images: ['', '', '', ''],
      category_id: categories[0]?.id || '',
    });
  };

  const openEdit = (v: Vehicle) => {
    setEditing(v);
    const specs = v.specifications || {};
    setForm({
      name: v.name,
      slug: v.slug,
      brand: v.brand || '',
      model: v.model || '',
      registration_number: v.registration_number || '',
      category_id: v.category_id || '',
      year: v.year?.toString() || '',
      description: v.description || '',
      daily_price: String(v.daily_price),
      weekly_price: v.weekly_price?.toString() || '',
      monthly_price: v.monthly_price?.toString() || '',
      deposit_amount: v.deposit_amount?.toString() || '',
      min_rental_days: String(v.min_rental_days || 1),
      pickup_instructions: v.pickup_instructions || '',
      images: vehicleImagesFromRecord(v),
      availability_status: v.availability_status,
      is_featured: v.is_featured,
      is_published: v.is_published,
      badge: v.badge || '',
      category_label: v.category_label || '',
      transmission: specs.transmission || 'Automatic',
      fuel_type: specs.fuel_type || 'Petrol',
      passenger_capacity: specs.passenger_capacity || '',
      luggage_capacity: specs.luggage_capacity || '',
      air_conditioning: Boolean(specs.air_conditioning),
      mileage_limit: specs.mileage_limit || '',
    });
  };

  const setImageSlot = (index: number, url: string) => {
    setForm((f) => {
      const images = [...f.images];
      images[index] = url;
      return { ...f, images };
    });
  };

  const setPublished = (checked: boolean) => {
    setForm((f) => ({
      ...f,
      is_published: checked,
      availability_status: checked
        ? f.availability_status === 'hidden'
          ? 'available'
          : f.availability_status
        : 'hidden',
    }));
  };

  const setAvailability = (status: AvailabilityStatus) => {
    setForm((f) => ({
      ...f,
      availability_status: status,
      is_published: status === 'hidden' ? false : f.is_published,
    }));
  };

  const uploadToSlot = async (slot: number, file: File, silent = false): Promise<boolean> => {
    const supabase = tryGetSupabase();
    if (!supabase) return false;
    setUploadingSlot(slot);
    const folder = form.slug || slugify(form.name) || editing?.id || 'draft';
    const path = `${folder}/${slot}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error } = await supabase.storage.from('vehicle-images').upload(path, file, { upsert: true });
    if (error) {
      toast(error.message, 'error');
      setUploadingSlot(null);
      return false;
    }
    const { data } = supabase.storage.from('vehicle-images').getPublicUrl(path);
    setImageSlot(slot, data.publicUrl);
    setUploadingSlot(null);
    if (!silent) toast(`Image ${slot + 1} uploaded`, 'success');
    return true;
  };

  const onUpload = async (slot: number, file: File) => {
    await uploadToSlot(slot, file, false);
  };

  const onMultiUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    const selected = Array.from(files).slice(0, MAX_IMAGES);
    const emptySlots = form.images
      .map((url, index) => ({ url, index }))
      .filter((s) => !s.url.trim())
      .map((s) => s.index);

    const slots =
      emptySlots.length > 0
        ? emptySlots.slice(0, selected.length)
        : Array.from({ length: Math.min(selected.length, MAX_IMAGES) }, (_, i) => i);

    setBatchUploading(true);
    let ok = 0;
    for (let i = 0; i < slots.length; i++) {
      const file = selected[i];
      if (!file) break;
      const success = await uploadToSlot(slots[i], file, true);
      if (success) ok += 1;
    }
    setBatchUploading(false);
    if (ok > 0) toast(`${ok} image${ok === 1 ? '' : 's'} uploaded`, 'success');
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = tryGetSupabase();
    if (!supabase) return;
    setSaving(true);

    const { main_image, gallery } = splitImagesForSave(form.images);

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      brand: form.brand || null,
      model: form.model || null,
      registration_number: form.registration_number || null,
      category_id: form.category_id || null,
      year: form.year ? Number(form.year) : null,
      description: form.description || null,
      daily_price: Number(form.daily_price),
      weekly_price: form.weekly_price ? Number(form.weekly_price) : null,
      monthly_price: form.monthly_price ? Number(form.monthly_price) : null,
      deposit_amount: form.deposit_amount ? Number(form.deposit_amount) : null,
      min_rental_days: Number(form.min_rental_days) || 1,
      pickup_instructions: form.pickup_instructions || null,
      main_image,
      gallery,
      availability_status: form.availability_status,
      is_featured: form.is_featured,
      is_published: form.is_published,
      badge: form.badge || null,
      category_label: form.category_label || null,
      specifications: {
        transmission: form.transmission,
        fuel_type: form.fuel_type,
        passenger_capacity: form.passenger_capacity,
        luggage_capacity: form.luggage_capacity,
        air_conditioning: form.air_conditioning,
        mileage_limit: form.mileage_limit,
      },
    };

    const result = editing
      ? await supabase.from('vehicles').update(payload).eq('id', editing.id)
      : await supabase.from('vehicles').insert(payload);

    if (result.error) {
      toast(result.error.message, 'error');
      setSaving(false);
      return;
    }

    await supabase.from('audit_logs').insert({
      admin_id: user?.id,
      action: editing ? 'update_vehicle' : 'create_vehicle',
      entity_type: 'vehicle',
      entity_id: editing?.id || payload.slug,
      details: { name: payload.name },
    });

    toast(editing ? 'Vehicle updated' : 'Vehicle created', 'success');
    setSaving(false);
    setEditing(null);
    setForm({ ...emptyForm, images: ['', '', '', ''] });
    load();
  };

  const confirmHide = async () => {
    const supabase = tryGetSupabase();
    if (!supabase || !hideId) return;
    const { error } = await supabase
      .from('vehicles')
      .update({ is_published: false, availability_status: 'hidden' })
      .eq('id', hideId);
    setHideId(null);
    if (error) toast(error.message, 'error');
    else {
      toast('Vehicle hidden from website', 'success');
      load();
    }
  };

  const showVehicle = async (v: Vehicle) => {
    const supabase = tryGetSupabase();
    if (!supabase) return;
    const { error } = await supabase
      .from('vehicles')
      .update({ is_published: true, availability_status: 'available' })
      .eq('id', v.id);
    if (error) toast(error.message, 'error');
    else {
      toast('Vehicle visible on website', 'success');
      load();
    }
  };

  if (loading) return <PageLoader />;

  const showForm = editing !== null || form.name !== '' || form.category_id !== '';

  const actionButtons = (v: Vehicle) => {
    const hidden = isVehicleHidden(v);
    return (
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => openEdit(v)}
          className="min-h-[44px] px-3 py-2 text-sm text-[#A86438] font-medium hover:underline"
        >
          Edit
        </button>
        {hidden ? (
          <button
            type="button"
            onClick={() => void showVehicle(v)}
            className="min-h-[44px] px-3 py-2 text-sm text-emerald-800 font-medium hover:underline"
          >
            Show
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setHideId(v.id)}
            className="min-h-[44px] px-3 py-2 text-sm text-red-800 font-medium hover:underline"
          >
            Hide
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-editorial-heading text-2xl sm:text-3xl">Vehicle Management</h1>
        <button
          type="button"
          onClick={openCreate}
          className="min-h-[44px] px-4 py-2 bg-[#A86438] text-white rounded-lg text-sm font-semibold"
        >
          Add vehicle
        </button>
      </div>

      {(showForm || editing) && (
        <form
          onSubmit={save}
          className="bg-white/70 border border-[#D8C9AD] rounded-xl p-4 sm:p-6 mb-8 grid sm:grid-cols-2 gap-4 min-w-0"
        >
          <h2 className="sm:col-span-2 font-editorial-heading text-xl">
            {editing ? 'Edit vehicle' : 'New vehicle'}
          </h2>
          {(
            [
              ['name', 'Name'],
              ['slug', 'Slug'],
              ['brand', 'Brand'],
              ['model', 'Model'],
              ['registration_number', 'Registration'],
              ['category_label', 'Category label'],
              ['badge', 'Badge'],
              ['year', 'Year'],
              ['daily_price', 'Daily price (LKR)'],
              ['weekly_price', 'Weekly price'],
              ['monthly_price', 'Monthly price'],
              ['deposit_amount', 'Deposit'],
              ['min_rental_days', 'Min rental days'],
              ['passenger_capacity', 'Passenger capacity'],
              ['luggage_capacity', 'Luggage'],
              ['mileage_limit', 'Mileage limit'],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="min-w-0">
              <label className="text-xs uppercase tracking-wider text-[#43282A]/70">{label}</label>
              <input
                value={form[key] as string}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="mt-1 w-full min-w-0 border border-[#43282A]/20 px-3 py-2.5 rounded-lg text-sm"
                required={key === 'name' || key === 'daily_price'}
              />
            </div>
          ))}

          <div className="min-w-0">
            <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="mt-1 w-full border border-[#43282A]/20 px-3 py-2.5 rounded-lg text-sm"
              required
            >
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0">
            <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Availability</label>
            <select
              value={form.availability_status}
              onChange={(e) => setAvailability(e.target.value as AvailabilityStatus)}
              className="mt-1 w-full border border-[#43282A]/20 px-3 py-2.5 rounded-lg text-sm"
            >
              {['available', 'unavailable', 'maintenance', 'hidden'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0">
            <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Transmission</label>
            <select
              value={form.transmission}
              onChange={(e) => setForm({ ...form, transmission: e.target.value })}
              className="mt-1 w-full border border-[#43282A]/20 px-3 py-2.5 rounded-lg text-sm"
            >
              <option>Automatic</option>
              <option>Manual</option>
            </select>
          </div>
          <div className="min-w-0">
            <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Fuel</label>
            <select
              value={form.fuel_type}
              onChange={(e) => setForm({ ...form, fuel_type: e.target.value })}
              className="mt-1 w-full border border-[#43282A]/20 px-3 py-2.5 rounded-lg text-sm"
            >
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Hybrid</option>
            </select>
          </div>
          <div className="sm:col-span-2 min-w-0">
            <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="mt-1 w-full border border-[#43282A]/20 px-3 py-2.5 rounded-lg text-sm"
            />
          </div>
          <div className="sm:col-span-2 space-y-3 min-w-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <label className="text-xs uppercase tracking-wider text-[#43282A]/70">
                  Photos (max {MAX_IMAGES})
                </label>
                <p className="text-xs text-[#43282A]/60 mt-0.5">
                  Select up to 4 images at once, or fill each slot. Slot 1 is the main image.
                </p>
              </div>
              <label className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-lg border border-[#A86438]/40 bg-[#A86438]/10 text-sm font-medium text-[#A86438] cursor-pointer shrink-0">
                {batchUploading ? 'Uploading…' : 'Add up to 4 photos'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={batchUploading}
                  onChange={(e) => {
                    void onMultiUpload(e.target.files);
                    e.target.value = '';
                  }}
                  className="sr-only"
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {form.images.map((url, index) => (
                <div
                  key={index}
                  className="border border-[#43282A]/15 rounded-xl p-2.5 sm:p-3 bg-white/80 space-y-2 min-w-0"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#43282A]/70 truncate">
                      Image {index + 1}
                      {index === 0 ? ' · Main' : ''}
                    </p>
                    {url ? (
                      <button
                        type="button"
                        onClick={() => setImageSlot(index, '')}
                        className="text-[11px] text-red-800 hover:underline shrink-0 min-h-[32px]"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>
                  <div className="aspect-[4/3] max-h-28 sm:max-h-none rounded-lg overflow-hidden bg-[#E6DCC8]/50 border border-[#43282A]/10">
                    {url ? (
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-[#43282A]/45">
                        No image
                      </div>
                    )}
                  </div>
                  <input
                    value={url}
                    onChange={(e) => setImageSlot(index, e.target.value)}
                    placeholder="https://… image URL"
                    className="w-full min-w-0 border border-[#43282A]/20 px-2.5 py-2 rounded-lg text-xs sm:text-sm"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void onUpload(index, file);
                      e.target.value = '';
                    }}
                    className="block w-full text-[10px] sm:text-xs min-w-0"
                  />
                  {uploadingSlot === index && (
                    <p className="text-xs text-[#A86438]">Uploading…</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm min-h-[44px]">
            <input
              type="checkbox"
              checked={form.air_conditioning}
              onChange={(e) => setForm({ ...form, air_conditioning: e.target.checked })}
            />
            Air conditioning
          </label>
          <label className="flex items-center gap-2 text-sm min-h-[44px]">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm min-h-[44px] sm:col-span-2">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Published (visible on website)
          </label>
          <div className="sm:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="min-h-[44px] px-5 py-2.5 bg-[#A86438] text-white rounded-lg text-sm font-semibold disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save vehicle'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({ ...emptyForm, images: ['', '', '', ''] });
              }}
              className="min-h-[44px] px-5 py-2.5 border border-[#43282A]/30 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {vehicles.length === 0 ? (
        <EmptyState title="No vehicles" description="Add your first fleet vehicle." />
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {vehicles.map((v) => {
              const hidden = isVehicleHidden(v);
              return (
                <article
                  key={v.id}
                  className={`bg-white/70 border rounded-xl p-4 space-y-3 ${
                    hidden ? 'border-[#43282A]/15 opacity-80' : 'border-[#D8C9AD]'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {v.main_image ? (
                      <img
                        src={v.main_image}
                        alt=""
                        className="w-14 h-14 object-cover rounded-lg shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-[#E6DCC8]/60 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{v.name}</p>
                      <p className="text-xs text-[#43282A]/60 truncate">{v.slug}</p>
                      <p className="text-sm mt-1">{formatLkrPrice(Number(v.daily_price))}/day</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded-md bg-[#E6DCC8]/70 capitalize">
                      {v.availability_status}
                    </span>
                    <span className="px-2 py-1 rounded-md bg-[#E6DCC8]/70">
                      {v.is_published ? 'Published' : 'Unpublished'}
                    </span>
                    {hidden && (
                      <span className="px-2 py-1 rounded-md bg-red-100 text-red-900">Hidden</span>
                    )}
                  </div>
                  {actionButtons(v)}
                </article>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto bg-white/70 border border-[#D8C9AD] rounded-xl">
            <table className="w-full text-sm table-fixed">
              <thead className="bg-[#E6DCC8]/60 text-left">
                <tr>
                  <th className="p-3 w-[36%]">Vehicle</th>
                  <th className="p-3 w-[16%]">Price</th>
                  <th className="p-3 w-[16%]">Status</th>
                  <th className="p-3 w-[12%]">Published</th>
                  <th className="p-3 w-[20%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => {
                  const hidden = isVehicleHidden(v);
                  return (
                    <tr
                      key={v.id}
                      className={`border-t border-[#D8C9AD]/60 ${hidden ? 'opacity-75' : ''}`}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {v.main_image && (
                            <img
                              src={v.main_image}
                              alt=""
                              className="w-12 h-12 object-cover rounded shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-medium truncate">{v.name}</p>
                            <p className="text-xs text-[#43282A]/60 truncate">{v.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">{formatLkrPrice(Number(v.daily_price))}</td>
                      <td className="p-3 capitalize">{v.availability_status}</td>
                      <td className="p-3">{v.is_published ? 'Yes' : 'No'}</td>
                      <td className="p-3">{actionButtons(v)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ConfirmDialog
        open={Boolean(hideId)}
        title="Hide vehicle?"
        message="The vehicle will be unpublished and hidden from the public site. Existing bookings are preserved. You can Show it again anytime."
        confirmLabel="Hide vehicle"
        danger
        onCancel={() => setHideId(null)}
        onConfirm={confirmHide}
      />
    </div>
  );
}
