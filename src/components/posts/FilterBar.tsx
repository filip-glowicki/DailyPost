"use client";

import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CategoryDTO, GetPostsQuery } from "@/types/database-types";
import { getCategories } from "@/actions/categories";

interface FilterBarProps {
  filters: GetPostsQuery;
  onFilterChange: (filters: Partial<GetPostsQuery>) => void;
  isLoading?: boolean;
}

export function FilterBar({
  filters,
  onFilterChange,
  isLoading,
}: FilterBarProps) {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [searchValue, setSearchValue] = useState(filters.search || "");

  // Fetch categories on mount using server action
  useEffect(() => {
    async function loadCategories() {
      try {
        const result = await getCategories();
        if (!result?.data) {
          toast({
            title: "Błąd",
            description: "Nie udało się załadować kategorii: Brak danych",
            variant: "destructive",
          });
          return;
        }
        setCategories(result.data.data);
      } catch (error) {
        toast({
          title: "Błąd",
          description:
            error instanceof Error
              ? `Błąd podczas pobierania kategorii: ${error.message}`
              : "Wystąpił nieznany błąd podczas pobierania kategorii",
          variant: "destructive",
        });
      }
    }

    loadCategories();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFilterChange({ search: searchValue });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, filters.search, onFilterChange]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Szukaj postów..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9"
          disabled={isLoading}
        />
      </div>

      <Select
        value={filters.category_id || "all"}
        onValueChange={(value) =>
          onFilterChange({ category_id: value === "all" ? undefined : value })
        }
        disabled={isLoading}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Wszystkie kategorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Wszystkie kategorie</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.sortBy || "created_at"}
        onValueChange={(value) => onFilterChange({ sortBy: value })}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sortuj według" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created_at">Data utworzenia</SelectItem>
          <SelectItem value="updated_at">Data aktualizacji</SelectItem>
          <SelectItem value="title">Tytuł</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.order || "desc"}
        onValueChange={(value: "asc" | "desc") =>
          onFilterChange({ order: value })
        }
        disabled={isLoading}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Kolejność" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Malejąco</SelectItem>
          <SelectItem value="asc">Rosnąco</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={() => {
          setSearchValue("");
          onFilterChange({
            search: "",
            category_id: undefined,
            sortBy: "created_at",
            order: "desc",
          });
        }}
        disabled={isLoading}
      >
        Resetuj
      </Button>
    </div>
  );
}
