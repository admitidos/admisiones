"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { CareerSearchBar } from "@/components/career-search-bar";
import { CareerListItem } from "@/components/career-list-item";
import type { Career } from "@/types/exam";

interface CareerListClientProps {
  careers: Career[];
  examId: string;
}

export function CareerListClient({ careers, examId }: CareerListClientProps) {
  const [filteredCareers, setFilteredCareers] = useState<Career[]>(careers);
  const [showAll, setShowAll] = useState(false);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredCareers(careers);
      return;
    }

    const filtered = careers.filter(
      (career) =>
        career.name.toLowerCase().includes(query.toLowerCase()) ||
        career.code.includes(query)
    );
    setFilteredCareers(filtered);
  };

  const displayedCareers = showAll
    ? filteredCareers
    : filteredCareers.slice(0, 5);
  const hasMoreCareers = filteredCareers.length > 5;

  return (
    <div className="flex flex-col gap-4">
      <CareerSearchBar onSearch={handleSearch} />

      <div className="flex flex-col gap-2">
        {displayedCareers.length > 0 ? (
          <>
            {displayedCareers.map((career) => (
              <CareerListItem key={career.id} career={career} examId={examId} />
            ))}

            {hasMoreCareers && !showAll && (
              <Button
                variant="light"
                color="primary"
                className="mt-2"
                onPress={() => setShowAll(true)}
              >
                ver más
              </Button>
            )}

            {showAll && hasMoreCareers && (
              <Button
                variant="light"
                color="primary"
                className="mt-2"
                onPress={() => setShowAll(false)}
              >
                ver menos
              </Button>
            )}
          </>
        ) : (
          <div className="py-8 text-center text-default-500">
            No se encontraron carreras
          </div>
        )}
      </div>
    </div>
  );
}
