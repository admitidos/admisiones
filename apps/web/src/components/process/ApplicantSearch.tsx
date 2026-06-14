"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

interface ApplicantSearchProps {
  totalCount: number;
  filteredCount: number;
  query: string;
}

export function ApplicantSearch({ totalCount, filteredCount, query }: ApplicantSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(query);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync the input when the URL query changes externally (back/forward nav).
  useEffect(() => setValue(query), [query]);

  const pushQuery = useCallback(
    (q: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (q.trim()) params.set("q", q.trim());
      else params.delete("q");
      params.delete("page"); // reset to the first page on a new search
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setValue(v);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => pushQuery(v), 350);
    },
    [pushQuery],
  );

  const handleClear = useCallback(() => {
    setValue("");
    if (timer.current) clearTimeout(timer.current);
    pushQuery("");
  }, [pushQuery]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative">
        <Search
          className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          data-testid="applicant-search"
          type="search"
          value={value}
          onChange={handleChange}
          placeholder="Busca por apellidos o código…"
          className="h-11 w-full rounded-sm border border-border bg-white pl-10 pr-10 text-[13px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none sm:w-72"
          aria-label="Buscar postulante"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <span className="text-[12px] text-muted">
        {query.trim() === ""
          ? `${totalCount.toLocaleString("es-PE")} postulantes`
          : `${filteredCount.toLocaleString("es-PE")} de ${totalCount.toLocaleString("es-PE")} postulantes`}
      </span>
    </div>
  );
}
