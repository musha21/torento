import React, { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from 'recharts';
import { tryGetSupabase } from '../../lib/supabase/client';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/Spinner';
import { formatLkrPrice } from '../../lib/whatsapp';
import type { Booking, Vehicle } from '../../types/database';

const COLORS = ['#A86438', '#43282A', '#242320', '#89977D', '#D8C9AD'];

export default function AdminOverview() {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    const supabase = tryGetSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }
    Promise.all([
      supabase.from('vehicles').select('*'),
      supabase.from('bookings').select('*'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
    ]).then(([v, b, c]) => {
      setVehicles((v.data as Vehicle[]) || []);
      setBookings((b.data as Booking[]) || []);
      setCustomerCount(c.count || 0);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const available = vehicles.filter((x) => x.availability_status === 'available').length;
    const unavailable = vehicles.filter((x) => x.availability_status !== 'available').length;
    const pending = bookings.filter((x) => x.booking_status === 'pending' || x.booking_status === 'under_review').length;
    const confirmed = bookings.filter((x) => x.booking_status === 'confirmed').length;
    const active = bookings.filter((x) => x.booking_status === 'active').length;
    const completed = bookings.filter((x) => x.booking_status === 'completed').length;
    const revenue = bookings
      .filter((x) => ['confirmed', 'active', 'completed'].includes(x.booking_status))
      .reduce((sum, x) => sum + Number(x.estimated_total || 0), 0);
    return { available, unavailable, pending, confirmed, active, completed, revenue, totalVehicles: vehicles.length, totalBookings: bookings.length };
  }, [vehicles, bookings]);

  const monthly = useMemo(() => {
    const map = new Map<string, { bookings: number; revenue: number }>();
    bookings.forEach((b) => {
      const key = b.created_at?.slice(0, 7) || 'unknown';
      const cur = map.get(key) || { bookings: 0, revenue: 0 };
      cur.bookings += 1;
      if (['confirmed', 'active', 'completed'].includes(b.booking_status)) {
        cur.revenue += Number(b.estimated_total || 0);
      }
      map.set(key, cur);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, v]) => ({ month, ...v }));
  }, [bookings]);

  const topVehicles = useMemo(() => {
    const counts = new Map<string, number>();
    bookings.forEach((b) => {
      counts.set(b.vehicle_id, (counts.get(b.vehicle_id) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([id, count]) => ({
        name: vehicles.find((v) => v.id === id)?.name || id.slice(0, 8),
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [bookings, vehicles]);

  const categoryDist = useMemo(() => {
    const map = new Map<string, number>();
    vehicles.forEach((v) => {
      const key = v.categories?.slug || v.category_label || 'other';
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [vehicles]);

  if (loading) return <PageLoader />;

  const cards = [
    { label: 'Total vehicles', value: stats.totalVehicles },
    { label: 'Available', value: stats.available },
    { label: 'Unavailable / other', value: stats.unavailable },
    { label: 'Total bookings', value: stats.totalBookings },
    { label: 'Pending', value: stats.pending },
    { label: 'Confirmed', value: stats.confirmed },
    { label: 'Active rentals', value: stats.active },
    { label: 'Completed', value: stats.completed },
    { label: 'Customers', value: customerCount },
    { label: 'Est. revenue', value: formatLkrPrice(stats.revenue) },
  ];

  return (
    <div>
      <h1 className="font-editorial-heading text-3xl mb-6">Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="bg-white/70 border border-[#D8C9AD] rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-[#43282A]/60">{c.label}</p>
            <p className="font-editorial-heading text-2xl mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {bookings.length === 0 && vehicles.length === 0 ? (
        <EmptyState
          title="No operational data yet"
          description="Add vehicles and wait for booking requests. Charts populate from live Supabase records."
        />
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white/70 border border-[#D8C9AD] rounded-xl p-4 h-72">
            <h3 className="text-sm font-semibold mb-3">Monthly booking trends</h3>
            {monthly.length === 0 ? (
              <EmptyState title="No booking trends" />
            ) : (
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D8C9AD" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#A86438" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="bg-white/70 border border-[#D8C9AD] rounded-xl p-4 h-72">
            <h3 className="text-sm font-semibold mb-3">Revenue trends</h3>
            {monthly.length === 0 ? (
              <EmptyState title="No revenue data" />
            ) : (
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D8C9AD" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#43282A" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="bg-white/70 border border-[#D8C9AD] rounded-xl p-4 h-72">
            <h3 className="text-sm font-semibold mb-3">Most requested vehicles</h3>
            {topVehicles.length === 0 ? (
              <EmptyState title="No requests yet" />
            ) : (
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={topVehicles} layout="vertical">
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#A86438" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="bg-white/70 border border-[#D8C9AD] rounded-xl p-4 h-72">
            <h3 className="text-sm font-semibold mb-3">Category distribution</h3>
            {categoryDist.length === 0 ? (
              <EmptyState title="No vehicles" />
            ) : (
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie data={categoryDist} dataKey="value" nameKey="name" outerRadius={80} label>
                    {categoryDist.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
