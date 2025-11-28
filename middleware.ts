import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    },
  );

  // Vérifier l'authentification
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Routes publiques (auth)
  if (request.nextUrl.pathname.startsWith('/auth')) {
    // Si déjà connecté, rediriger vers le dashboard
    if (user) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return response;
  }

  // Routes protégées : rediriger vers sign-in si non connecté
  if (!user) {
    const redirectUrl = new URL('/auth/sign-in', request.url);
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Vérifier si l'utilisateur est whitelisté
  const { data: allowedUser } = await supabase
    .from('allowed_users')
    .select('email')
    .eq('email', user.email)
    .single();

  if (!allowedUser) {
    // Utilisateur non whitelisté, rediriger vers sign-in avec message
    const redirectUrl = new URL('/auth/sign-in', request.url);
    redirectUrl.searchParams.set('error', 'not_allowed');
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

