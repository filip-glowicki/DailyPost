"use client";

import { CategoryDTO, CategoriesResponseDTO } from "@/types/database-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface CategorySelectProps {
  categories: CategoryDTO[] | CategoriesResponseDTO;
  value: string;
  onChange: (value: string) => void;
}

export function CategorySelect({
  categories,
  value,
  onChange,
}: CategorySelectProps) {
  const router = useRouter();

  const handleAddNewCategory = () => {
    // Navigate to category management page
    router.push("/categories");
  };

  const categoryList = Array.isArray(categories) ? categories : categories.data;

  return (
    <div className="flex gap-2 items-start" data-test-id="category-select">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="w-full"
          aria-label="Wybierz kategorię"
          data-test-id="category-select-trigger"
        >
          <SelectValue placeholder="Wybierz kategorię" />
        </SelectTrigger>
        <SelectContent data-test-id="category-select-content">
          {categoryList.map((category) => (
            <SelectItem
              key={category.id}
              value={category.id}
              data-test-id={`category-option-${category.id}`}
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleAddNewCategory}
        title="Dodaj nową kategorię"
        data-test-id="add-category-button"
      >
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
  );
}
