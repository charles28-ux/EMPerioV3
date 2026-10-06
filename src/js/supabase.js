/**
 * Supabase Client Initialization & Helper
 * Supports direct connection to your Supabase project URL & Anon Key.
 * Reads from Vite environment variables or localStorage configuration.
 */

import { createClient } from '@supabase/supabase-js';

// Retrieve config from Vite env or fallback to browser local storage for live configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('ems_supabase_url') || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('ems_supabase_anon_key') || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const isSupabaseConfigured = () => {
  return (
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key' &&
    supabaseUrl.trim().length > 0
  );
};
