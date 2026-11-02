import React, { useEffect, useMemo, useState } from 'react';
import { tryGetSupabase } from '../../lib/supabase/client';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/Spinner';
import { useToast } from '../../contexts/ToastContext';
import type { AccountStatus, Booking, Profile } from '../../types/database';

const EXPORT_HEADERS = [
  'Full name',
  'Phone',
  'Account status',
  'Joined date',
  'Booking count',
  'Last booking reference',
  'Last booking status',
  'Customer ID',
] as const;

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadCsv(filename: string, rows: string[][]): void {
  const body = rows.map((row) => row.map((cell) => escapeCsvCell(cell)).join(',')).join('\r\n');
  const blob = new Blob(['\uFEFF' + body], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function buildCustomerExportRows(customers: Profile[], bookings: Booking[]): string[][] {
  const byCustomer = new Map<string, Booking[]>();
  for (const b of bookings) {
    const list = byCustomer.get(b.customer_id) || [];
    list.push(b);
    byCustomer.set(b.customer_id, list);
  }

  const rows: string[][] = [[...EXPORT_HEADERS]];

  for (const c of customers) {
    const list = (byCustomer.get(c.id) || []).slice().sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    const last = list[0];
    rows.push([
      c.full_name || '',
      c.phone || '',
      c.account_status || '',
      c.created_at ? new Date(c.created_at).toISOString().slice(0, 10) : '',
      String(list.length),
      last?.booking_reference || '',
      last?.booking_status || '',
      c.id,
    ]);
  }

  return rows;
}

export default function AdminCustomers() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Profile | null>(null);

  const load = async () => {
    const supabase = tryGetSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }
    const [c, b] = await Promise.all([
      supabase.from('profiles').select('*').eq('role', 'customer').order('created_at', { ascending: false }),
      supabase.from('bookings').select('*, vehicles(name)'),
    ]);
    setCustomers((c.data as Profile[]) || []);
    setBookings((b.data as Booking[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        !q ||
        (c.full_name || '').toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q)
    );
  }, [customers, search]);

  const setStatus = async (id: string, account_status: AccountStatus) => {
    const supabase = tryGetSupabase();
    if (!supabase) return;
    const { error } = await supabase.from('profiles').update({ account_status }).eq('id', id);
    if (error) toast(error.message, 'error');
    else {
      toast(`Account marked ${account_status}`, 'success');
      load();
    }
  };

  const exportExcel = () => {
    if (filtered.length === 0) {
      toast('No customers to export', 'error');
      return;
    }
    const rows = buildCustomerExportRows(filtered, bookings);
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(`torento-customers-${date}.csv`, rows);
    toast(`Exported ${filtered.length} customer${filtered.length === 1 ? '' : 's'}`, 'success');
  };

  if (loading) return <PageLoader />;

  const history = selected ? bookings.filter((b) => b.customer_id === selected.id) : [];

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-editorial-heading text-2xl sm:text-3xl">Customer Management</h1>
        <button
          type="button"
          onClick={exportExcel}
          className="min-h-[44px] px-4 py-2 bg-[#A86438] text-white rounded-lg text-sm font-semibold"
        >
          Export to Excel
        </button>
      </div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search customers"
        className="mb-4 w-full max-w-md border border-[#43282A]/20 bg-white/70 px-3 py-2.5 rounded-lg text-sm"
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/70 border border-[#D8C9AD] rounded-xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No customers" description="Registered customers appear here." />
            </div>
          ) : (
            <ul className="divide-y divide-[#D8C9AD]/60">
              {filtered.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(c)}
                    className={`w-full text-left p-4 min-h-[44px] hover:bg-[#E6DCC8]/40 ${
                      selected?.id === c.id ? 'bg-[#E6DCC8]/50' : ''
                    }`}
                  >
                    <p className="font-medium">{c.full_name || 'Unnamed customer'}</p>
                    <p className="text-xs text-[#43282A]/70">
                      {c.phone || 'No phone'} · {c.account_status} · Joined{' '}
                      {new Date(c.created_at).toLocaleDateString()}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white/70 border border-[#D8C9AD] rounded-xl p-5">
          {!selected ? (
            <EmptyState title="Select a customer" description="View profile and booking history." />
          ) : (
            <div>
              <h2 className="font-editorial-heading text-2xl mb-2">{selected.full_name || 'Customer'}</h2>
              <p className="text-sm text-[#43282A]/80 mb-1">Phone: {selected.phone || '—'}</p>
              <p className="text-sm text-[#43282A]/80 mb-4">
                Status: <strong>{selected.account_status}</strong>
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {(['active', 'restricted', 'suspended'] as AccountStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(selected.id, s)}
                    className="text-xs min-h-[44px] px-3 py-1.5 border border-[#43282A]/20 rounded-lg capitalize"
                  >
                    Mark {s}
                  </button>
                ))}
              </div>
              <h3 className="text-sm font-semibold mb-2">Booking history</h3>
              {history.length === 0 ? (
                <p className="text-sm text-[#43282A]/70">No bookings.</p>
              ) : (
                <ul className="space-y-2">
                  {history.map((b) => (
                    <li key={b.id} className="text-sm border border-[#D8C9AD]/60 rounded-lg p-3">
                      {b.booking_reference} · {b.vehicles?.name} · {b.booking_status}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
