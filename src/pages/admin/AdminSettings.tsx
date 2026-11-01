import React, { useEffect, useState } from 'react';
import { tryGetSupabase } from '../../lib/supabase/client';
import { PageLoader } from '../../components/ui/Spinner';
import { useToast } from '../../contexts/ToastContext';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { OWNER_WHATSAPP_DIGITS } from '../../lib/whatsapp';

export default function AdminSettings() {
  const { toast } = useToast();
  const { refreshSettings } = useSiteSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    currency: 'LKR',
    min_rental_days: '1',
    default_deposit: '25000',
    whatsapp: OWNER_WHATSAPP_DIGITS,
  });

  useEffect(() => {
    const supabase = tryGetSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }
    Promise.all([
      supabase.from('website_settings').select('*').eq('setting_key', 'pricing_defaults').maybeSingle(),
      supabase.from('website_settings').select('*').eq('setting_key', 'contact').maybeSingle(),
    ]).then(([pricing, contact]) => {
      const p = (pricing.data?.setting_value || {}) as Record<string, unknown>;
      const c = (contact.data?.setting_value || {}) as Record<string, unknown>;
      setForm({
        currency: String(p.currency || 'LKR'),
        min_rental_days: String(p.min_rental_days || 1),
        default_deposit: String(p.default_deposit || 25000),
        whatsapp: String(c.whatsapp || OWNER_WHATSAPP_DIGITS),
      });
      setLoading(false);
    });
  }, []);

  const save = async () => {
    const supabase = tryGetSupabase();
    if (!supabase) return;
    setSaving(true);
    const pricing = await supabase.from('website_settings').upsert(
      {
        setting_key: 'pricing_defaults',
        setting_value: {
          currency: form.currency,
          min_rental_days: Number(form.min_rental_days),
          default_deposit: Number(form.default_deposit),
        },
      },
      { onConflict: 'setting_key' }
    );
    if (pricing.error) {
      toast(pricing.error.message, 'error');
      setSaving(false);
      return;
    }

    const { data: contactRow } = await supabase
      .from('website_settings')
      .select('setting_value')
      .eq('setting_key', 'contact')
      .maybeSingle();
    const existing = (contactRow?.setting_value || {}) as Record<string, unknown>;
    const contact = await supabase.from('website_settings').upsert(
      {
        setting_key: 'contact',
        setting_value: { ...existing, whatsapp: form.whatsapp, phone: form.whatsapp },
      },
      { onConflict: 'setting_key' }
    );
    setSaving(false);
    if (contact.error) {
      toast(contact.error.message, 'error');
      return;
    }
    await refreshSettings();
    toast('Settings saved', 'success');
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-lg">
      <h1 className="font-editorial-heading text-3xl mb-6">Pricing & Settings</h1>
      <div className="bg-white/70 border border-[#D8C9AD] rounded-xl p-6 space-y-4">
        {(
          [
            ['currency', 'Currency'],
            ['min_rental_days', 'Default minimum rental days'],
            ['default_deposit', 'Default deposit (LKR)'],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <label className="text-xs uppercase tracking-wider text-[#43282A]/70">{label}</label>
            <input
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="mt-1 w-full border border-[#43282A]/20 px-3 py-2 rounded-lg text-sm"
            />
          </div>
        ))}
        <div>
          <label className="text-xs uppercase tracking-wider text-[#43282A]/70">
            Business WhatsApp number
          </label>
          <input
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder={OWNER_WHATSAPP_DIGITS}
            className="mt-1 w-full border border-[#43282A]/20 px-3 py-2 rounded-lg text-sm"
          />
          <p className="mt-1.5 text-xs text-[#43282A]/60">
            Digits with country code, e.g. {OWNER_WHATSAPP_DIGITS} (+94 77 766 6171). Used site-wide
            for WhatsApp and call links.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="px-5 py-2.5 bg-[#A86438] text-white rounded-lg text-sm font-semibold disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </div>
  );
}
