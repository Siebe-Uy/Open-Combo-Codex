/**
 * Used client-side for Supabase OAuth and magic-link `redirectTo` / `emailRedirectTo`.
 *
 * If `NEXT_PUBLIC_SITE_URL` is still localhost but the app runs on a deployed origin,
 * we use the browser origin so production login does not redirect to localhost.
 * Always ensure Supabase Dashboard → Authentication → URL Configuration lists each
 * production `/auth/callback` URL under Redirect URLs, and set Site URL to production.
 */
export function getAuthCallbackUrl(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const windowOrigin = window.location.origin;
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!raw) {
    return `${windowOrigin}/auth/callback`;
  }

  try {
    const envOrigin = new URL(raw.startsWith("http") ? raw : `https://${raw}`).origin;
    const envIsLoopback = /localhost|127\.0\.0\.1/i.test(envOrigin);
    const windowIsLoopback = /localhost|127\.0\.0\.1/i.test(windowOrigin);

    if (envIsLoopback && !windowIsLoopback) {
      return `${windowOrigin}/auth/callback`;
    }

    return `${envOrigin}/auth/callback`;
  } catch {
    return `${windowOrigin}/auth/callback`;
  }
}
