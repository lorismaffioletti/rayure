import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * Crée un client Supabase pour les Server Components.
 * Note: Les cookies ne peuvent être modifiés que dans Server Actions ou Route Handlers.
 * Dans les Server Components, on peut seulement les lire.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Dans les Server Components, on ne peut pas modifier les cookies
          // Cette fonction est appelée mais ne fait rien
          // Les cookies seront gérés côté client ou dans Server Actions/Route Handlers
        },
        remove(name: string, options: CookieOptions) {
          // Même chose pour remove
        },
      },
    },
  );
  return supabase;
}

