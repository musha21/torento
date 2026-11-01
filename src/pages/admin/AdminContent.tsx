import React, { useEffect, useState } from 'react';
import { tryGetSupabase } from '../../lib/supabase/client';
import { PageLoader } from '../../components/ui/Spinner';
import { useToast } from '../../contexts/ToastContext';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { OWNER_WHATSAPP_DIGITS } from '../../lib/whatsapp';

type SettingMap = Record<string, Record<string, unknown>>;

export default function AdminContent() {
  const { toast } = useToast();
  const { refreshSettings } = useSiteSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SettingMap>({
    hero: { heading: '', description: '', background_image: '' },
    contact: { whatsapp: '', email: '', phone: '', address: '' },
    social: { instagram: '', facebook: '', tiktok: '' },
    footer: { tagline: '', disclaimer: '' },
  });

  useEffect(() => {
    const supabase = tryGetSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.from('website_settings').select('*').then(({ data }) => {
      if (data) {
        const next = { ...settings };
        data.forEach((row: { setting_key: string; setting_value: Record<string, unknown> }) => {
          next[row.setting_key] = { ...(next[row.setting_key] || {}), ...row.setting_value };
        });
        setSettings(next);
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    const supabase = tryGetSupabase();
    if (!supabase) return;
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      const { error } = await supabase.from('website_settings').upsert(
        { setting_key: key, setting_value: value, updated_at: new Date().toISOString() },
        { onConflict: 'setting_key' }
      );
      if (error) {
        toast(error.message, 'error');
        setSaving(false);
        return;
      }
    }
    setSaving(false);
    await refreshSettings();
    toast('Website content saved', 'success');
  };

  if (loading) return <PageLoader />;

  const field = (
    section: string,
    key: string,
    label: string,
    multiline = false
  ) => (
    <div key={`${section}.${key}`}>
      <label className="text-xs uppercase tracking-wider text-[#43282A]/70">{label}</label>
      {multiline ? (
        <textarea
          value={String(settings[section]?.[key] ?? '')}
          onChange={(e) =>
            setSettings({
              ...settings,
              [section]: { ...settings[section], [key]: e.target.value },
            })
          }
          rows={3}
          className="mt-1 w-full border border-[#43282A]/20 px-3 py-2 rounded-lg text-sm"
        />
      ) : (
        <input
          value={String(settings[section]?.[key] ?? '')}
          onChange={(e) =>
            setSettings({
              ...settings,
              [section]: { ...settings[section], [key]: e.target.value },
            })
          }
          className="mt-1 w-full border border-[#43282A]/20 px-3 py-2 rounded-lg text-sm"
        />
      )}
    </div>
  );

  return (
    <div className="max-w-3xl">
      <h1 className="font-editorial-heading text-3xl mb-6">Website Content</h1>
      <div className="space-y-8">
        <section className="bg-white/70 border border-[#D8C9AD] rounded-xl p-5 space-y-3">
          <h2 className="font-semibold">Hero</h2>
          {field('hero', 'heading', 'Heading')}
          {field('hero', 'description', 'Description', true)}
          {field('hero', 'background_image', 'Background image URL')}
        </section>
        <section className="bg-white/70 border border-[#D8C9AD] rounded-xl p-5 space-y-3">
          <h2 className="font-semibold">Contact</h2>
          {field('contact', 'whatsapp', `WhatsApp (digits with country code, e.g. ${OWNER_WHATSAPP_DIGITS})`)}
          {field('contact', 'email', 'Business email')}
          {field('contact', 'phone', 'Phone')}
          {field('contact', 'address', 'Address')}
        </section>
        <section className="bg-white/70 border border-[#D8C9AD] rounded-xl p-5 space-y-3">
          <h2 className="font-semibold">Social</h2>
          {field('social', 'instagram', 'Instagram')}
          {field('social', 'facebook', 'Facebook')}
          {field('social', 'tiktok', 'TikTok')}
        </section>
        <section className="bg-white/70 border border-[#D8C9AD] rounded-xl p-5 space-y-3">
          <h2 className="font-semibold">Footer</h2>
          {field('footer', 'tagline', 'Tagline')}
          {field('footer', 'disclaimer', 'Disclaimer', true)}
        </section>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="px-5 py-2.5 bg-[#A86438] text-white rounded-lg text-sm font-semibold disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save content'}
        </button>
      </div>
    </div>
  );
}
