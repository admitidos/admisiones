import Link from "next/link";

export default function ApplicantNotFound() {
  return (
    <main
      data-testid="not-found"
      className="flex min-h-[60vh] flex-col items-center justify-center px-5 py-16 text-center"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-white">
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          className="text-muted"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>
      <h1 className="mb-2 font-serif text-[24px] font-bold text-foreground">
        Código no encontrado
      </h1>
      <p className="mb-8 max-w-xs text-[14px] leading-relaxed text-muted">
        El código de postulación no aparece en este examen. Verifica que sea correcto y que
        corresponda al proceso indicado.
      </p>
      <Link
        href="/"
        className="rounded-sm bg-accent px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent-dark"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
