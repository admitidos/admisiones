export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto flex max-w-170 flex-col items-center gap-3 px-4 py-5 sm:flex-row sm:justify-between sm:px-0">
        <span className="font-serif text-[15px] font-bold text-foreground">
          admitidos<em className="not-italic text-green-500">.pe</em>
        </span>
        <div className="flex items-center gap-1.5 text-xs text-muted">
          Hecho con
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-label="café"
            role="img"
          >
            <path d="M18 8h1a4 4 0 010 8h-1" />
            <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </svg>
          por <strong className="font-semibold text-muted">Daniel Guzmán</strong>
        </div>
        <div className="flex gap-5">
          <span className="cursor-pointer text-xs text-muted transition-colors hover:text-foreground">
            Fuentes oficiales
          </span>
          <span className="cursor-pointer text-xs text-muted transition-colors hover:text-foreground">
            Reportar error
          </span>
        </div>
      </div>
    </footer>
  );
}
