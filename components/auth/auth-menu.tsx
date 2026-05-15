"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { ChevronDown, LogIn, LogOut, Mail, UserRound } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAuthCallbackUrl } from "@/lib/auth-callback-url";

export function AuthMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const configured = isSupabaseConfigured();
  const panelRef = useRef<HTMLDivElement>(null);

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
    if (!menuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [menuOpen]);

  async function signInWithOAuth(provider: "github" | "discord") {
    const supabase = createClient();

    if (!supabase) {
      return;
    }

    setEmailMessage(null);
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getAuthCallbackUrl(),
      },
    });
  }

  async function signInWithEmail(event: FormEvent) {
    event.preventDefault();
    const supabase = createClient();

    if (!supabase) {
      return;
    }

    const trimmed = email.trim();

    if (!trimmed) {
      setEmailMessage("Enter your email address.");
      return;
    }

    setEmailSending(true);
    setEmailMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: getAuthCallbackUrl(),
      },
    });

    setEmailSending(false);

    if (error) {
      setEmailMessage(error.message);
      return;
    }

    setEmailMessage("Check your inbox for the sign-in link.");
    setEmail("");
  }

  async function signOut() {
    const supabase = createClient();
    await supabase?.auth.signOut();
    setUser(null);
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
      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-200 md:inline-flex">
          <UserRound className="h-3.5 w-3.5 text-striker-cyan" />
          @{username}
        </span>
        <Button type="button" variant="ghost" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          <span className="hidden lg:inline">Sign out</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" ref={panelRef}>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        aria-expanded={menuOpen}
        aria-haspopup="dialog"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">Sign in</span>
        <ChevronDown className={cn("h-4 w-4 transition", menuOpen && "rotate-180")} />
      </Button>

      {menuOpen ? (
        <div
          role="dialog"
          aria-label="Choose sign-in method"
          className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,20rem)] rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-xl shadow-black/40 backdrop-blur-xl"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Continue with</p>
          <div className="flex flex-col gap-2">
            <Button type="button" variant="secondary" size="sm" className="justify-start" onClick={() => signInWithOAuth("github")}>
              GitHub
            </Button>
            <Button type="button" variant="secondary" size="sm" className="justify-start" onClick={() => signInWithOAuth("discord")}>
              Discord
            </Button>
          </div>

          <div className="my-4 border-t border-white/10" />

          <form onSubmit={signInWithEmail} className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500" htmlFor="auth-email">
              Email magic link
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="focus-ring w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder:text-slate-500"
            />
            <Button type="submit" variant="primary" size="sm" className="w-full" disabled={emailSending}>
              <Mail className="h-4 w-4" />
              {emailSending ? "Sending…" : "Send link"}
            </Button>
          </form>

          {emailMessage ? <p className="mt-3 text-xs text-slate-400">{emailMessage}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
