"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, LogIn, LogOut, UserRound, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SignInPanel } from "@/components/auth/sign-in-panel";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useNavRoles } from "@/components/nav/nav-roles-context";

export function AuthMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const configured = isSupabaseConfigured();
  const isMobile = useIsMobile();
  const { signOut: signOutFromNav } = useNavRoles();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [configured]);

  useEffect(() => {
    if (!menuOpen || !isMobile) {
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, isMobile]);

  useEffect(() => {
    if (!menuOpen || isMobile) {
      return;
    }

    function handleClick(event: MouseEvent) {
      if (panelRef.current?.contains(event.target as Node)) {
        return;
      }
      setMenuOpen(false);
    }

    const timeoutId = window.setTimeout(() => {
      document.addEventListener("click", handleClick);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("click", handleClick);
    };
  }, [menuOpen, isMobile]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  async function signOut() {
    await signOutFromNav();
    setUser(null);
    setMenuOpen(false);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  if (!configured) {
    return (
      <span className="hidden rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs text-amber-100 sm:inline-flex">
        Auth off
      </span>
    );
  }

  if (loading) {
    return <span className="text-xs text-slate-500">Loading...</span>;
  }

  if (user) {
    const username =
      user.user_metadata.user_name ??
      user.user_metadata.preferred_username ??
      user.user_metadata.full_name ??
      user.email?.split("@")[0] ??
      "duelist";

    return (
      <div className="hidden items-center gap-2 md:flex">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-200">
          <UserRound className="h-3.5 w-3.5 text-striker-cyan" />
          @{username}
        </span>
        <Button type="button" variant="ghost" size="sm" className="min-h-10" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          <span className="hidden lg:inline">Sign out</span>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="relative" ref={panelRef}>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="min-h-10 min-w-10"
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:inline">Sign in</span>
          <ChevronDown className={cn("hidden h-4 w-4 transition sm:block", menuOpen && "rotate-180")} />
        </Button>

        {menuOpen && !isMobile ? (
          <SignInDropdown onClose={closeMenu} />
        ) : null}
      </div>

      {mounted && menuOpen && isMobile
        ? createPortal(
            <div className="fixed inset-0 z-[200] flex flex-col justify-end">
              <button type="button" className="absolute inset-0 bg-black/70" aria-label="Close sign in" onClick={closeMenu} />
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Sign in"
                className="relative z-[201] max-h-[85vh] overflow-y-auto rounded-t-3xl border border-white/10 bg-slate-950 p-5 pb-8 shadow-2xl"
              >
                <MobileSignInHeader onClose={closeMenu} />
                <SignInPanel emailInputId="auth-email-mobile" onAfterAction={closeMenu} />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function SignInDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-label="Choose sign-in method"
      className="absolute right-0 z-[120] mt-2 w-[min(100vw-2rem,20rem)] rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-xl shadow-black/40 backdrop-blur-xl"
    >
      <SignInPanel onAfterAction={onClose} />
    </div>
  );
}

function MobileSignInHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <p className="text-sm font-bold text-white">Sign in</p>
      <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close">
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}
