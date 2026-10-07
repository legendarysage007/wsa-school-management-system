import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from environment variables (standard Vercel / Vite client env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Returns true if real Supabase credentials are provided in the environment.
 */
export function isSupabaseConfigured(): boolean {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseUrl.includes('your-supabase')
  );
}

// Graceful fallback to avoid build/runtime errors when env vars are pending
const safeUrl = isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co';
const safeKey = isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key';

export const supabase: SupabaseClient = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

/**
 * Production Supabase Health & Connection Check
 */
export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      message: 'Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    };
  }

  try {
    const { error } = await supabase.from('schools').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      return { connected: false, message: error.message };
    }
    return { connected: true, message: 'Successfully connected to Supabase database.' };
  } catch (err: any) {
    return { connected: false, message: err?.message || 'Connection failed.' };
  }
}
