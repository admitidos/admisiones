"use client";

import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";

interface ApplicantSearchProps {
  onSearch: (query: string) => void;
  totalCount: number;
  filteredCount: number;
}

export function ApplicantSearch({ onSearch, totalCount, filteredCount }: ApplicantSearchProps) {
  const [query, setQuery] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch(value);
    },
    [onSearch],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    onSearch("");
  }, [onSearch]);

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
          value={query}
          onChange={handleChange}
          placeholder="Busca por apellidos o código…"
          className="h-11 w-full rounded-sm border border-border bg-white pl-10 pr-10 text-[13px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none sm:w-72"
          aria-label="Buscar postulante"
        />
        {query && (
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
        {filteredCount === totalCount
          ? `${totalCount} postulantes`
          : `${filteredCount} de ${totalCount} postulantes`}
      </span>
    </div>
  );
}
