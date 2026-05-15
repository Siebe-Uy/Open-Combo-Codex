"use client";

import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { LogOut, Menu, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInPanel } from "@/components/auth/sign-in-panel";
import { useNavRoles } from "@/components/nav/nav-roles-context";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const HEADER_OFFSET = "4rem";

export function MobileNavDrawer() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { signedIn, showModeratorNav, username, signOut } = useNavRoles();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
  }

  async function handleSignOut() {
    await signOut();
    close();
  }

  return (
    <div className="flex md:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="relative z-[210] min-h-10 min-w-10 text-slate-200"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {mounted && open
        ? createPortal(
            <MobileNavDrawerOverlay onClose={close} signedIn={signedIn} showModeratorNav={showModeratorNav} username={username} onSignOut={handleSignOut} />,
            document.body,
          )
        : null}
    </div>
  );
}

function MobileNavDrawerOverlay({
  onClose,
  signedIn,
  showModeratorNav,
  username,
  onSignOut,
}: {
  onClose: () => void;
  signedIn: boolean;
  showModeratorNav: boolean;
  username: string | null;
  onSignOut: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col md:hidden" style={{ height: "100dvh" }}>
      <button type="button" className="absolute inset-0 bg-black/75" aria-label="Close menu" onClick={onClose} />
      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className="relative z-10 flex min-h-0 flex-1 flex-col border-t border-white/10 bg-slate-950 shadow-2xl"
        style={{ marginTop: HEADER_OFFSET }}
      >
        <nav
          className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(2.5rem,env(safe-area-inset-bottom))]"
          aria-label="Mobile navigation"
        >
          {signedIn && username ? (
            <p className="mb-2 flex w-full shrink-0 items-center gap-2 px-4 py-2 text-sm text-slate-400">
              <UserRound className="h-4 w-4 shrink-0 text-striker-cyan" />
              Signed in as <span className="font-semibold text-slate-200">@{username}</span>
            </p>
          ) : null}

          <MobileNavAnchor href="#engines" onNavigate={onClose}>
            Engines
          </MobileNavAnchor>
          <MobileNavAnchor href="#combos" onNavigate={onClose}>
            Combos
          </MobileNavAnchor>
          <MobileNavAnchor href="#resources" onNavigate={onClose}>
            Resources
          </MobileNavAnchor>
          <MobileNavAnchor href="#contribute" onNavigate={onClose}>
            Contribute
          </MobileNavAnchor>

          {isSupabaseConfigured() && signedIn ? (
            <MobileNavLink href="/editor" onNavigate={onClose} className="text-striker-cyan">
              Visual editor
            </MobileNavLink>
          ) : null}

          {isSupabaseConfigured() && showModeratorNav ? (
            <MobileNavLink href="/admin/submissions" onNavigate={onClose} className="text-striker-magenta">
              Submissions
            </MobileNavLink>
          ) : null}

          {isSupabaseConfigured() && signedIn ? (
            <>
              <MobileNavDrawerDivider />
              <MobileNavButton onClick={onSignOut}>
                <LogOut className="h-4 w-4 shrink-0" />
                Sign out
              </MobileNavButton>
            </>
          ) : null}

          {isSupabaseConfigured() && !signedIn ? <MobileNavSignInSection onClose={onClose} /> : null}

          {!isSupabaseConfigured() ? (
            <p className="mt-2 w-full px-4 text-xs text-slate-500">
              Sign-in and editor require Supabase env on this deployment.
            </p>
          ) : null}
        </nav>
      </div>
    </div>
  );
}

function MobileNavDrawerDivider() {
  return <div className="my-2 w-full shrink-0 border-t border-white/10" role="separator" />;
}

function MobileNavLink({
  href,
  onNavigate,
  className,
  children,
}: {
  href: string;
  onNavigate: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`focus-ring block w-full shrink-0 rounded-xl px-4 py-3 text-left font-semibold hover:bg-white/10 ${className ?? "text-slate-200"}`}
    >
      {children}
    </Link>
  );
}

function MobileNavButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring flex w-full shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-left font-medium text-slate-200 hover:bg-white/10"
    >
      {children}
    </button>
  );
}

function MobileNavSignInSection({ onClose }: { onClose: () => void }) {
  return (
    <div className="mt-4 w-full shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="mb-3 text-sm font-bold text-white">Sign in</p>
      <SignInPanel emailInputId="auth-email-nav" onAfterAction={onClose} />
    </div>
  );
}

function MobileNavAnchor({
  href,
  onNavigate,
  children,
}: {
  href: string;
  onNavigate: () => void;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="focus-ring block w-full shrink-0 rounded-xl px-4 py-3 text-left font-medium text-slate-200 hover:bg-white/10 hover:text-white"
      onClick={onNavigate}
    >
      {children}
    </a>
  );
}
