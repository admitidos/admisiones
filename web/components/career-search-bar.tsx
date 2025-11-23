"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface CareerSearchBarProps {
  onSearch?: (query: string) => void;
}

export function CareerSearchBar({ onSearch }: CareerSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <Input
        type="text"
        placeholder="Busca la carrera o especialidad"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="lg"
        radius="lg"
        variant="flat"
        classNames={{
          input: "text-base",
          inputWrapper: "h-14 bg-default-100",
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <Button
        color="primary"
        size="lg"
        radius="lg"
        className="h-14 w-full px-8 font-semibold"
        onPress={handleSearch}
        startContent={<Search className="h-5 w-5" />}
      >
        Buscar
      </Button>
    </div>
  );
}
