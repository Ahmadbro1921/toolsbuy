"use client";

import Link from "next/link";
import { ShieldCheck, PhoneCall, CheckCircle, Package, Wrench, HelpCircle } from "lucide-react";

export function Footer() {
  return (
    <>
      <footer className="border-t border-border bg-slate-950 text-slate-300">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-2 flex items-center justify-center text-white shrink-0">
                  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <rect x="6" y="34" width="14" height="24" rx="4" fill="white" fillOpacity="0.8" />
                    <rect x="25" y="20" width="14" height="38" rx="4" fill="white" />
                    <rect x="44" y="8" width="14" height="50" rx="4" fill="white" />
                  </svg>
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-white">ToolsBuy</span>
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Affordable and secure access to expensive Amazon product-hunting tools, AI models, and digital suites with 1-click cloud access and 24/7 dedicated support.
              </p>
              
              <div className="pt-2">
                <a
                  href="https://wa.me/923127462475"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-colors shadow-sm"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>+92 312 7462475</span>
                </a>
              </div>
            </div>

            {/* Packages */}
            <div>
              <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Packages</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <Link href="/plans" className="hover:text-emerald-400 transition-colors">
                    Basic Bundle V2
                  </Link>
                </li>
                <li>
                  <Link href="/plans" className="hover:text-emerald-400 transition-colors">
                    Standard Bundle V2 (Popular)
                  </Link>
                </li>
                <li>
                  <Link href="/plans" className="hover:text-emerald-400 transition-colors">
                    Premium Bundle V2
                  </Link>
                </li>
                <li>
                  <Link href="/plans#custom-builder" className="hover:text-emerald-400 transition-colors">
                    Custom Package Builder
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <Link href="/tools" className="hover:text-emerald-400 transition-colors">
                    All Tools Directory
                  </Link>
                </li>
                <li>
                  <Link href="/#how-it-works" className="hover:text-emerald-400 transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="hover:text-emerald-400 transition-colors">
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-emerald-400 transition-colors">
                    Customer Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-emerald-400 transition-colors">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Support & Trust</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-emerald-400 transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/affiliate-disclosure" className="hover:text-emerald-400 transition-colors">
                    Refund & Fair Use Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} ToolsBuy. All rights reserved. Direct 1-Click Access Platform.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> 100% Virus & Malware Free
              </span>
              <span>24/7 Activation Support</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
      <a
        href="https://wa.me/923127462475"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 sm:bottom-6 left-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-xl shadow-emerald-950/40 hover:scale-105 transition-all text-xs sm:text-sm"
        title="Chat with ToolsBuy on WhatsApp"
      >
        <PhoneCall className="w-4 h-4" />
        <span className="hidden sm:inline">WhatsApp Support</span>
      </a>
    </>
  );
}
