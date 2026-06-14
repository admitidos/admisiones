import Link from "next/link";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-md">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-15 max-w-6xl items-center px-4 md:px-8"
      >
        <Link href="/" className="font-serif text-lg font-bold text-accent-dark">
          admisiones
        </Link>

        <div className="flex-1" />

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/procesos"
            className="text-sm font-semibold text-muted transition-colors hover:text-foreground"
          >
            Exámenes
          </Link>
          <Link
            href="/proximos-examenes"
            className="text-sm font-semibold text-muted transition-colors hover:text-foreground"
          >
            Próximos exámenes
          </Link>
        </div>

        <Link
          href="/unmsm/2026-1"
          className="ml-4 rounded-sm bg-accent px-3 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 md:ml-6 md:px-4 md:text-sm"
        >
          <span className="md:hidden">Resultados UNMSM</span>
          <span className="hidden md:inline">Ver resultados UNMSM 2026-I</span>
        </Link>

        <MobileMenu />
      </nav>
    </header>
  );
}
