"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/procesos", label: "Exámenes" },
  { href: "/proximos-examenes", label: "Próximos exámenes" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        className="ml-2 flex h-9 w-9 items-center justify-center rounded-sm text-muted transition-colors hover:bg-border hover:text-foreground"
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <Menu
            size={20}
            className={`absolute transition-all duration-200 ease-out ${
              open ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"
            }`}
          />
          <X
            size={20}
            className={`absolute transition-all duration-200 ease-out ${
              open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"
            }`}
          />
        </span>
      </button>

      <div
        className={`absolute left-0 right-0 top-full border-b border-border bg-white shadow-(--shadow-lg) transition-all duration-200 ease-out ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <nav aria-label="Menú móvil" className="mx-auto max-w-6xl px-4 py-3">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-sm px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-border"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
