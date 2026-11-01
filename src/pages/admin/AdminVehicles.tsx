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

export default function AdminVehicles() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);

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

  const onUpload = async (slot: number, file: File) => {
    const supabase = tryGetSupabase();
    if (!supabase) return;
    setUploadingSlot(slot);
    const folder = form.slug || slugify(form.name) || editing?.id || 'draft';
    const path = `${folder}/${slot}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error } = await supabase.storage.from('vehicle-images').upload(path, file, { upsert: true });
    if (error) {
      toast(error.message, 'error');
      setUploadingSlot(null);
      return;
    }
    const { data } = supabase.storage.from('vehicle-images').getPublicUrl(path);
    setImageSlot(slot, data.publicUrl);
    setUploadingSlot(null);
    toast(`Image ${slot + 1} uploaded`, 'success');
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

  const confirmDelete = async () => {
    const supabase = tryGetSupabase();
    if (!supabase || !deleteId) return;
    const { error } = await supabase
      .from('vehicles')
      .update({ is_published: false, availability_status: 'hidden' })
      .eq('id', deleteId);
    setDeleteId(null);
    if (error) toast(error.message, 'error');
    else {
      toast('Vehicle hidden from website', 'success');
      load();
    }
  };

  if (loading) return <PageLoader />;

  const showForm = editing !== null || form.name !== '' || form.category_id !== '';

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-editorial-heading text-3xl">Vehicle Management</h1>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-[#A86438] text-white rounded-lg text-sm font-semibold"
        >
          Add vehicle
        </button>
      </div>

      {(showForm || editing) && (
        <form onSubmit={save} className="bg-white/70 border border-[#D8C9AD] rounded-xl p-6 mb-8 grid sm:grid-cols-2 gap-4">
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
            <div key={key}>
              <label className="text-xs uppercase tracking-wider text-[#43282A]/70">{label}</label>
              <input
                value={form[key] as string}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="mt-1 w-full border border-[#43282A]/20 px-3 py-2 rounded-lg text-sm"
                required={key === 'name' || key === 'daily_price'}
              />
            </div>
          ))}

          <div>
            <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="mt-1 w-full border border-[#43282A]/20 px-3 py-2 rounded-lg text-sm"
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
          <div>
            <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Availability</label>
            <select
              value={form.availability_status}
              onChange={(e) =>
                setForm({ ...form, availability_status: e.target.value as AvailabilityStatus })
              }
              className="mt-1 w-full border border-[#43282A]/20 px-3 py-2 rounded-lg text-sm"
            >
              {['available', 'unavailable', 'maintenance', 'hidden'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Transmission</label>
            <select
              value={form.transmission}
              onChange={(e) => setForm({ ...form, transmission: e.target.value })}
              className="mt-1 w-full border border-[#43282A]/20 px-3 py-2 rounded-lg text-sm"
            >
              <option>Automatic</option>
              <option>Manual</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Fuel</label>
            <select
              value={form.fuel_type}
              onChange={(e) => setForm({ ...form, fuel_type: e.target.value })}
              className="mt-1 w-full border border-[#43282A]/20 px-3 py-2 rounded-lg text-sm"
            >
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Hybrid</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs uppercase tracking-wider text-[#43282A]/70">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="mt-1 w-full border border-[#43282A]/20 px-3 py-2 rounded-lg text-sm"
            />
          </div>
          <div className="sm:col-span-2 space-y-3">
            <div className="flex items-end justify-between gap-2">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#43282A]/70">
                  Photos (max {MAX_IMAGES})
                </label>
                <p className="text-xs text-[#43282A]/60 mt-0.5">
                  Slot 1 is the main image. Paste a URL or upload for each slot.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {form.images.map((url, index) => (
                <div
                  key={index}
                  className="border border-[#43282A]/15 rounded-xl p-3 bg-white/80 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#43282A]/70">
                      Image {index + 1}
                      {index === 0 ? ' · Main' : ''}
                    </p>
                    {url ? (
                      <button
                        type="button"
                        onClick={() => setImageSlot(index, '')}
                        className="text-[11px] text-red-800 hover:underline"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#E6DCC8]/50 border border-[#43282A]/10">
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
                    className="w-full border border-[#43282A]/20 px-3 py-2 rounded-lg text-sm"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void onUpload(index, file);
                      e.target.value = '';
                    }}
                    className="block w-full text-xs"
                  />
                  {uploadingSlot === index && (
                    <p className="text-xs text-[#A86438]">Uploading…</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.air_conditioning}
              onChange={(e) => setForm({ ...form, air_conditioning: e.target.checked })}
            />
            Air conditioning
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            />
            Published
          </label>
          <div className="sm:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-[#A86438] text-white rounded-lg text-sm font-semibold disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save vehicle'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({ ...emptyForm, images: ['', '', '', ''] });
              }}
              className="px-5 py-2.5 border border-[#43282A]/30 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {vehicles.length === 0 ? (
        <EmptyState title="No vehicles" description="Add your first fleet vehicle." />
      ) : (
        <div className="overflow-x-auto bg-white/70 border border-[#D8C9AD] rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-[#E6DCC8]/60 text-left">
              <tr>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Published</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="border-t border-[#D8C9AD]/60">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {v.main_image && (
                        <img src={v.main_image} alt="" className="w-12 h-12 object-cover rounded" />
                      )}
                      <div>
                        <p className="font-medium">{v.name}</p>
                        <p className="text-xs text-[#43282A]/60">{v.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{formatLkrPrice(Number(v.daily_price))}</td>
                  <td className="p-3 capitalize">{v.availability_status}</td>
                  <td className="p-3">{v.is_published ? 'Yes' : 'No'}</td>
                  <td className="p-3 space-x-2 whitespace-nowrap">
                    <button type="button" onClick={() => openEdit(v)} className="text-[#A86438] hover:underline">
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(v.id)}
                      className="text-red-800 hover:underline"
                    >
                      Hide
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Hide vehicle?"
        message="The vehicle will be unpublished and hidden from the public site. Existing bookings are preserved."
        confirmLabel="Hide vehicle"
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
