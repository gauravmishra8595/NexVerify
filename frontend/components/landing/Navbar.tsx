"use client";

import { useState } from "react";
import { ShieldCheck, Menu, X } from "lucide-react";

const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#111827]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-amber-400" />
          <span className="font-[family-name:--font-geist-sans] text-sm font-semibold text-white">
            NexVerify
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href="/login" className="text-sm text-slate-300 transition hover:text-white">
            Sign in
          </a>
          <a
            href="/register"
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-[#111827] transition hover:bg-amber-400"
          >
            Get started
          </a>
        </div>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-slate-300"
              >
                {link.label}
              </a>
            ))}
            <a href="/login" className="text-sm text-slate-300">
              Sign in
            </a>
            <a
              href="/register"
              className="mt-1 rounded-lg bg-amber-500 px-4 py-2 text-center text-sm font-medium text-[#111827]"
            >
              Get started
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
