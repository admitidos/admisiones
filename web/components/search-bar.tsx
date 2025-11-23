"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        type="text"
        placeholder="Universidad, examen o año"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="lg"
        radius="lg"
        variant="flat"
        classNames={{
          base: "flex-1",
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
        className="h-14 w-full px-8 font-semibold sm:w-auto"
        onPress={handleSearch}
        startContent={<Search className="h-5 w-5" />}
      >
        Buscar
      </Button>
    </div>
  );
}
