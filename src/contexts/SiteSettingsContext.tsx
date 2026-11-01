import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { tryGetSupabase } from '../lib/supabase/client';
import {
  formatWhatsAppDisplay,
  getEnvWhatsAppDigits,
  getWhatsAppDigits,
  normalizeWhatsAppDigits,
  setRuntimeWhatsAppNumber,
} from '../lib/whatsapp';

interface SiteSettingsContextValue {
  whatsappDigits: string;
  whatsappDisplay: string;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [whatsappDigits, setWhatsappDigits] = useState(() => getWhatsAppDigits());
  const [loading, setLoading] = useState(true);

  const applyWhatsapp = useCallback((raw?: string | null) => {
    const digits = raw ? normalizeWhatsAppDigits(raw) : getEnvWhatsAppDigits();
    setRuntimeWhatsAppNumber(digits);
    setWhatsappDigits(digits);
  }, []);

  const refreshSettings = useCallback(async () => {
    const supabase = tryGetSupabase();
    if (!supabase) {
      applyWhatsapp(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('website_settings')
      .select('setting_value')
      .eq('setting_key', 'contact')
      .maybeSingle();

    if (error) {
      console.warn('Site settings load failed:', error.message);
      applyWhatsapp(null);
      setLoading(false);
      return;
    }

    const contact = (data?.setting_value || {}) as Record<string, unknown>;
    const wa = contact.whatsapp != null ? String(contact.whatsapp) : null;
    applyWhatsapp(wa);
    setLoading(false);
  }, [applyWhatsapp]);

  useEffect(() => {
    void refreshSettings();
  }, [refreshSettings]);

  const value = useMemo<SiteSettingsContextValue>(
    () => ({
      whatsappDigits,
      whatsappDisplay: formatWhatsAppDisplay(whatsappDigits),
      loading,
      refreshSettings,
    }),
    [whatsappDigits, loading, refreshSettings]
  );

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
};

export function useSiteSettings(): SiteSettingsContextValue {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  }
  return ctx;
}
