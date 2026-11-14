import { createClient } from '@supabase/supabase-js';

// Publishable key is safe to ship in a browser bundle; RLS is the access boundary.
// Environment variables can override these demo defaults in local or Vercel builds.
const url = (import.meta.env.VITE_SUPABASE_URL || 'https://ijuopccjyzewaxxyymus.supabase.co').trim();
const key = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  || import.meta.env.VITE_SUPABASE_ANON_KEY
  || 'sb_publishable_vRSQOfr8D7IYRSPYcepCxg_QzrG2LPe'
).trim();

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
