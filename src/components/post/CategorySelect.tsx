"use client";

import { CategoryDTO, CategoriesResponseDTO } from "@/types";
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
    <div className="flex gap-2 items-start">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categoryList.map((category) => (
            <SelectItem key={category.id} value={category.id}>
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
        title="Add new category"
      >
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
  );
}
