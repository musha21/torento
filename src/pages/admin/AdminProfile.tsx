import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { tryGetSupabase } from '../../lib/supabase/client';
import { PageLoader } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import type { AuditLog } from '../../types/database';

export default function AdminProfile() {
  const { profile, user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = tryGetSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30)
      .then(({ data }) => {
        setLogs((data as AuditLog[]) || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div>
      <h1 className="font-editorial-heading text-3xl mb-6">Admin Profile</h1>
      <div className="bg-white/70 border border-[#D8C9AD] rounded-xl p-6 mb-8 max-w-lg">
        <p className="text-sm">Name: <strong>{profile?.full_name || '—'}</strong></p>
        <p className="text-sm mt-1">Email: <strong>{user?.email}</strong></p>
        <p className="text-sm mt-1">Role: <strong>{profile?.role}</strong></p>
        <p className="text-xs text-[#43282A]/70 mt-3">
          Admin roles are assigned only via secure SQL: <code>select assign_admin(&apos;you@email.com&apos;);</code>
        </p>
      </div>
      <h2 className="font-editorial-heading text-2xl mb-4">Recent admin activity</h2>
      {logs.length === 0 ? (
        <EmptyState title="No audit logs yet" description="Admin actions will be recorded here." />
      ) : (
        <ul className="space-y-2">
          {logs.map((l) => (
            <li key={l.id} className="bg-white/70 border border-[#D8C9AD] rounded-lg p-3 text-sm">
              <span className="font-medium">{l.action}</span> · {l.entity_type}{' '}
              {l.entity_id ? `(${l.entity_id})` : ''} · {new Date(l.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
