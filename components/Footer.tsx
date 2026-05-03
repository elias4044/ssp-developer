import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
    return (
        <>
      <footer>
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link className="flex items-center gap-2" href="https://ssp.elias4044.com">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">SchoolSoft+</span>
          </Link>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <Link href="https://ssp.elias4044.com/terms"       className="hover:text-foreground transition-colors">Terms &amp; Privacy</Link>
            <Link href="https://ssp.elias4044.com/login-help"  className="hover:text-foreground transition-colors">Login help</Link>
            <Link href="https://ssp.elias4044.com/stats"       className="hover:text-foreground transition-colors">Stats</Link>
            <Link href="https://ssp.elias4044.com/changelog"   className="hover:text-foreground transition-colors">Changelog</Link>
            <Link href="https://ssp.elias4044.com/open-source" className="hover:text-foreground transition-colors">Open source</Link>
            <a href="https://github.com/elias4044/schoolsoftplus" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
          <p className="text-xs text-muted-foreground opacity-60">Not affiliated with SchoolSoft AB.</p>
        </div>
      </footer>
    </>
  );
}