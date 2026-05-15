import Link from "next/link";
import { GitPullRequestArrow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthMenu } from "@/components/auth/auth-menu";
import { EditorNavLink } from "@/components/nav/editor-nav-link";
import { ModeratorNavLink } from "@/components/nav/moderator-nav-link";

const repositoryUrl = "https://github.com/Siebe-Uy/Open-Combo-Codex";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between" aria-label="Primary navigation">
        <Link href="/" className="focus-ring rounded-full text-sm font-black tracking-[0.25em] text-white">
          OCC
        </Link>
        <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a className="focus-ring rounded-full hover:text-white" href="#engines">
            Engines
          </a>
          <a className="focus-ring rounded-full hover:text-white" href="#combos">
            Combos
          </a>
          <a className="focus-ring rounded-full hover:text-white" href="#resources">
            Resources
          </a>
          <a className="focus-ring rounded-full hover:text-white" href="#contribute">
            Contribute
          </a>
          <EditorNavLink />
          <ModeratorNavLink />
        </div>
        <div className="flex items-center gap-2">
          <AuthMenu />
          <Button asChild variant="secondary" size="sm">
            <a href={repositoryUrl} target="_blank" rel="noreferrer" aria-label="Open the GitHub repository">
              <GitPullRequestArrow className="h-4 w-4" />
              <span className="hidden sm:inline">Open source</span>
            </a>
          </Button>
        </div>
      </nav>
    </header>
  );
}
