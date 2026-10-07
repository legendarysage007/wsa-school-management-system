import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here'
);

// Production Supabase client instance (when configured)
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Uploads student or guardian profile images to Supabase Storage (bucket: 'school-portraits')
 * or converts to base64 DataURL for local resilient preview.
 */
export async function uploadProfilePhoto(
  file: File | Blob,
  folder: 'students' | 'guardians'
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    if (isSupabaseConfigured && supabase) {
      const fileExt = file instanceof File ? file.name.split('.').pop() : 'jpg';
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('school-portraits')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('school-portraits')
        .getPublicUrl(data.path);

      return { success: true, url: publicUrlData.publicUrl };
    }

    // Local resilient DataURL conversion for immediate preview & offline demo
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ success: true, url: reader.result as string });
      };
      reader.onerror = () => {
        resolve({ success: false, error: 'Failed to process image file.' });
      };
      reader.readAsDataURL(file);
    });
  } catch (err: any) {
    console.error('Storage upload error:', err);
    return { success: false, error: err.message || 'Image upload failed.' };
  }
}
