"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import {
  Package,
  Wrench,
  HelpCircle,
  PhoneCall,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Layers,
  Sparkles,
  ArrowRight,
  Sliders,
} from "lucide-react";
import { UserSession } from "@/types";
import { logoutAction } from "@/lib/actions/auth";

interface NavbarProps {
  session: UserSession | null;
}

export function Navbar({ session }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="container max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-7">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Logo Graphic: Modern 3-bar emerald blocks */}
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-2 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect x="6" y="34" width="14" height="24" rx="4" fill="white" fillOpacity="0.8" />
                <rect x="25" y="20" width="14" height="38" rx="4" fill="white" />
                <rect x="44" y="8" width="14" height="50" rx="4" fill="white" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-foreground flex items-center gap-1.5">
                ToolsBuy
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Pro
                </span>
              </span>
              <span className="text-[11px] text-muted-foreground hidden sm:inline -mt-0.5 font-medium">
                All Tools · One Subscription
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive("/") && pathname === "/"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Home
            </Link>
            <Link
              href="/plans"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive("/plans")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Package className="w-4 h-4" />
              Packages
            </Link>
            <Link
              href="/plans#custom-builder"
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5"
            >
              <Sliders className="w-4 h-4" />
              Custom Bundle
            </Link>
            <Link
              href="/tools"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive("/tools")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Wrench className="w-4 h-4" />
              Tools Directory
            </Link>
            <Link
              href="/#faq"
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive("/contact")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Right Section / Auth */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* WhatsApp Direct Action */}
          <a
            href="https://wa.me/923127462475"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>WhatsApp Support</span>
          </a>

          {session ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-sm hover:opacity-90 transition-opacity"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              {session.role === "admin" && (
                <Link
                  href="/admin"
                  className="hidden md:inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors"
                  title="Admin Control Panel"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md shadow-primary/25 hover:opacity-95 transition-all"
              >
                <span>Sign Up</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl p-5 space-y-4 animate-in slide-in-from-top-3">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
            >
              Home
            </Link>
            <Link
              href="/plans"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between hover:bg-muted transition-colors"
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Packages
              </span>
              <span className="text-xs font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">3 Bundles</span>
            </Link>
            <Link
              href="/plans#custom-builder"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-muted transition-colors"
            >
              <Sliders className="w-4 h-4 text-primary" />
              Custom Package Builder
            </Link>
            <Link
              href="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-muted transition-colors"
            >
              <Wrench className="w-4 h-4 text-primary" />
              All Tools Directory
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <a
              href="https://wa.me/923127462475"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-emerald-500 text-white shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp: +92 312 7462475</span>
            </a>

            {!session && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-bold text-center border border-border hover:bg-muted transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-bold text-center bg-primary text-primary-foreground shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
