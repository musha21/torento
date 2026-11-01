import React, { useEffect, useState } from 'react';
import { tryGetSupabase } from '../../lib/supabase/client';
import { slugify } from '../../lib/vehicles';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/Spinner';
import { useToast } from '../../contexts/ToastContext';
import type { Destination } from '../../types/database';

export default function AdminDestinations() {
  const { toast } = useToast();
  const [items, setItems] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', tagline: '', description: '', image: '' });

  const load = async () => {
    const supabase = tryGetSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data } = await supabase.from('destinations').select('*').order('name');
    setItems((data as Destination[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = tryGetSupabase();
    if (!supabase) return;
    const { error } = await supabase.from('destinations').insert({
      name: form.name,
      slug: slugify(form.name),
      tagline: form.tagline,
      description: form.description,
      image: form.image || null,
      is_published: true,
      scenic_highlights: [],
    });
    if (error) toast(error.message, 'error');
    else {
      toast('Destination added', 'success');
      setForm({ name: '', tagline: '', description: '', image: '' });
      load();
    }
  };

  const togglePublish = async (d: Destination) => {
    const supabase = tryGetSupabase();
    if (!supabase) return;
    const { error } = await supabase
      .from('destinations')
      .update({ is_published: !d.is_published })
      .eq('id', d.id);
    if (error) toast(error.message, 'error');
    else load();
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <h1 className="font-editorial-heading text-3xl mb-6">Destinations</h1>
      <form onSubmit={create} className="bg-white/70 border border-[#D8C9AD] rounded-xl p-5 mb-6 grid sm:grid-cols-2 gap-3">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          required
          className="border border-[#43282A]/20 px-3 py-2 rounded-lg text-sm"
        />
        <input
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          placeholder="Tagline"
          className="border border-[#43282A]/20 px-3 py-2 rounded-lg text-sm"
        />
        <input
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          placeholder="Image URL"
          className="border border-[#43282A]/20 px-3 py-2 rounded-lg text-sm sm:col-span-2"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          rows={3}
          className="border border-[#43282A]/20 px-3 py-2 rounded-lg text-sm sm:col-span-2"
        />
        <button type="submit" className="w-fit px-4 py-2 bg-[#A86438] text-white rounded-lg text-sm">
          Add destination
        </button>
      </form>
      {items.length === 0 ? (
        <EmptyState title="No destinations" />
      ) : (
        <ul className="space-y-3">
          {items.map((d) => (
            <li key={d.id} className="bg-white/70 border border-[#D8C9AD] rounded-xl p-4 flex justify-between gap-3">
              <div>
                <p className="font-medium">{d.name}</p>
                <p className="text-sm text-[#43282A]/80">{d.tagline}</p>
                <p className="text-xs mt-1">{d.is_published ? 'Published' : 'Hidden'}</p>
              </div>
              <button type="button" onClick={() => togglePublish(d)} className="text-[#A86438] text-sm hover:underline">
                {d.is_published ? 'Unpublish' : 'Publish'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
