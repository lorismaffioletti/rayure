import { type NextRequest, NextResponse } from 'next/server';

// ⚠️ AUTHENTIFICATION TEMPORAIREMENT DÉSACTIVÉE
// Pour réactiver, décommenter le code ci-dessous et supprimer le return suivant

export async function middleware(request: NextRequest) {
  // Désactivation temporaire : laisser passer toutes les requêtes
  return NextResponse.next();

  /* CODE D'AUTHENTIFICATION DÉSACTIVÉ - À RÉACTIVER PLUS TARD
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
      // Si déjà connecté, vérifier la whitelist avant de rediriger
      if (user) {
        const { data: allowedUser } = await supabase
          .from('allowed_users')
          .select('email')
          .eq('email', user.email?.toLowerCase().trim())
          .maybeSingle();

        // Seulement rediriger vers / si whitelisté
        if (allowedUser) {
          return NextResponse.redirect(new URL('/', request.url));
        }
        // Sinon, laisser sur /auth/sign-in pour afficher le message d'erreur
        // (ne pas rediriger pour éviter la boucle)
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
  const { data: allowedUser, error: whitelistError } = await supabase
    .from('allowed_users')
    .select('email')
    .eq('email', user.email?.toLowerCase().trim())
    .maybeSingle();

  // Si erreur de requête ou utilisateur non trouvé
  if (whitelistError || !allowedUser) {
    // Utilisateur non whitelisté, rediriger vers sign-in avec message
    const redirectUrl = new URL('/auth/sign-in', request.url);
    redirectUrl.searchParams.set('error', 'not_allowed');
    return NextResponse.redirect(redirectUrl);
  }

  return response;
  */
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

