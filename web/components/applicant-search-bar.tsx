"use client";

import { Input } from "@heroui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface ApplicantSearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export function ApplicantSearchBar({
  onSearch,
  placeholder = "Busca por código o nombre",
}: ApplicantSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (value: string) => {
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={searchQuery}
      onChange={(e) => handleChange(e.target.value)}
      size="lg"
      radius="lg"
      variant="flat"
      startContent={<Search className="h-5 w-5 text-default-400" />}
      classNames={{
        input: "text-base",
        inputWrapper: "h-14 bg-default-100",
      }}
    />
  );
}
