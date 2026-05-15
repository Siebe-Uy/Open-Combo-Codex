"use client";

import { type FormEvent, useState } from "react";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getAuthCallbackUrl } from "@/lib/auth-callback-url";
import { Button } from "@/components/ui/button";

type SignInPanelProps = {
  emailInputId?: string;
  onAfterAction?: () => void;
};

export function SignInPanel({ emailInputId = "auth-email", onAfterAction }: SignInPanelProps) {
  const [email, setEmail] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function signInWithOAuth(provider: "github" | "discord") {
    const supabase = createClient();

    if (!supabase) {
      return;
    }

    setMessage(null);
    onAfterAction?.();
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
      setMessage("Enter your email address.");
      return;
    }

    setEmailSending(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: getAuthCallbackUrl(),
      },
    });

    setEmailSending(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Check your inbox for the sign-in link.");
    setEmail("");
    onAfterAction?.();
  }

  return (
    <>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Continue with</p>
      <div className="flex flex-col gap-2">
        <Button type="button" variant="secondary" size="sm" className="min-h-11 justify-start" onClick={() => signInWithOAuth("github")}>
          GitHub
        </Button>
        <Button type="button" variant="secondary" size="sm" className="min-h-11 justify-start" onClick={() => signInWithOAuth("discord")}>
          Discord
        </Button>
      </div>

      <div className="my-4 border-t border-white/10" />

      <form onSubmit={signInWithEmail} className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500" htmlFor={emailInputId}>
          Email magic link
        </label>
        <input
          id={emailInputId}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="focus-ring min-h-11 w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-base text-white placeholder:text-slate-500"
        />
        <Button type="submit" variant="primary" size="sm" className="min-h-11 w-full" disabled={emailSending}>
          <Mail className="h-4 w-4" />
          {emailSending ? "Sending…" : "Send link"}
        </Button>
      </form>

      {message ? <p className="mt-3 text-xs text-slate-400">{message}</p> : null}
    </>
  );
}
