import React, { useEffect, useState } from 'react';
import { tryGetSupabase } from '../../lib/supabase/client';
import { slugify } from '../../lib/vehicles';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/Spinner';
import { useToast } from '../../contexts/ToastContext';
import type { Category } from '../../types/database';

export default function AdminCategories() {
  const { toast } = useToast();
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const load = async () => {
    const supabase = tryGetSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data } = await supabase.from('categories').select('*').order('name');
    setItems((data as Category[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = tryGetSupabase();
    if (!supabase) return;
    const { error } = await supabase.from('categories').insert({
      name,
      slug: slugify(name),
      description,
    });
    if (error) toast(error.message, 'error');
    else {
      toast('Category created', 'success');
      setName('');
      setDescription('');
      load();
    }
  };

  const remove = async (id: string) => {
    const supabase = tryGetSupabase();
    if (!supabase) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) toast(error.message, 'error');
    else {
      toast('Category deleted', 'success');
      load();
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <h1 className="font-editorial-heading text-3xl mb-6">Categories</h1>
      <form onSubmit={create} className="bg-white/70 border border-[#D8C9AD] rounded-xl p-5 mb-6 grid sm:grid-cols-2 gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          required
          className="border border-[#43282A]/20 px-3 py-2 rounded-lg text-sm"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border border-[#43282A]/20 px-3 py-2 rounded-lg text-sm"
        />
        <button type="submit" className="sm:col-span-2 w-fit px-4 py-2 bg-[#A86438] text-white rounded-lg text-sm">
          Add category
        </button>
      </form>
      {items.length === 0 ? (
        <EmptyState title="No categories" />
      ) : (
        <ul className="space-y-2">
          {items.map((c) => (
            <li key={c.id} className="bg-white/70 border border-[#D8C9AD] rounded-xl p-4 flex justify-between gap-3">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-[#43282A]/70">{c.slug}</p>
                <p className="text-sm mt-1">{c.description}</p>
              </div>
              <button type="button" onClick={() => remove(c.id)} className="text-red-800 text-sm hover:underline">
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
