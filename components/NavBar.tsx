"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, GitFork, Menu, X } from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="frame flex min-h-20 items-center justify-between gap-5">
        <Link
          href="/"
          className="brand flex items-center gap-3"
          onClick={() => setOpen(false)}
          aria-label="SchoolSoft+ Developer home"
        >
          <Image src="/logo.png" alt="" width={30} height={30} />
          <span>
            SchoolSoft+ <span className="brand-context">Developer</span>
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 md:flex"
        >
          <Link
            href="/docs"
            aria-current={pathname.startsWith("/docs") ? "page" : undefined}
          >
            Documentation
          </Link>
          <a
            href="https://github.com/elias4044/schoolsoftplus"
            className="flex items-center gap-2"
          >
            <GitFork size={17} /> GitHub
          </a>
          <a
            href="https://ssp.elias4044.com"
            className="flex items-center gap-2"
          >
            Open SchoolSoft+ <ArrowUpRight size={16} />
          </a>
        </nav>
        <button
          className="icon-button md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="mobile-navigation frame flex flex-col pb-6 md:hidden"
        >
          <Link href="/docs" onClick={() => setOpen(false)}>
            Documentation
          </Link>
          <a href="https://github.com/elias4044/schoolsoftplus">GitHub</a>
          <a href="https://ssp.elias4044.com">Open SchoolSoft+</a>
        </nav>
      )}
    </header>
  );
}
