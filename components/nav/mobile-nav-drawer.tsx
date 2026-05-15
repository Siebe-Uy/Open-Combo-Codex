"use client";

import { type ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavRoles } from "@/components/nav/nav-roles-context";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export function MobileNavDrawer() {
  const [open, setOpen] = useState(false);
  const { signedIn, showModeratorNav } = useNavRoles();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
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

  return (
    <div className="flex md:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-slate-200"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 top-16 z-[44] bg-black/65 backdrop-blur-[2px]"
            aria-label="Close menu"
            onClick={close}
          />
          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-x-0 bottom-0 top-16 z-[45] max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-white/10 bg-slate-950/98 px-4 pb-10 pt-4 shadow-2xl"
          >
            <nav className="flex flex-col gap-1 text-base" aria-label="Mobile navigation">
              <MobileNavAnchor href="#engines" onNavigate={close}>
                Engines
              </MobileNavAnchor>
              <MobileNavAnchor href="#combos" onNavigate={close}>
                Combos
              </MobileNavAnchor>
              <MobileNavAnchor href="#resources" onNavigate={close}>
                Resources
              </MobileNavAnchor>
              <MobileNavAnchor href="#contribute" onNavigate={close}>
                Contribute
              </MobileNavAnchor>

              {isSupabaseConfigured() && signedIn ? (
                <Link
                  href="/editor"
                  onClick={close}
                  className="focus-ring rounded-xl px-4 py-3 font-semibold text-striker-cyan hover:bg-white/10"
                >
                  Visual editor
                </Link>
              ) : null}

              {isSupabaseConfigured() && showModeratorNav ? (
                <Link
                  href="/admin/submissions"
                  onClick={close}
                  className="focus-ring rounded-xl px-4 py-3 font-semibold text-striker-magenta hover:bg-white/10"
                >
                  Submissions
                </Link>
              ) : null}

              {!isSupabaseConfigured() ? (
                <p className="mt-2 px-4 text-xs text-slate-500">Sign-in and editor require Supabase env on this deployment.</p>
              ) : !signedIn ? (
                <p className="mt-2 px-4 text-xs text-slate-400">
                  Sign in (top right) to open the visual editor and submit combos for review.
                </p>
              ) : null}
            </nav>
          </div>
        </>
      ) : null}
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
      className="focus-ring rounded-xl px-4 py-3 font-medium text-slate-200 hover:bg-white/10 hover:text-white"
      onClick={onNavigate}
    >
      {children}
    </a>
  );
}
