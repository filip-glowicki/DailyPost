"use client";

import { useCallback, useEffect, useState } from "react";
import { CategoryDTO } from "@/types/database-types";
import { getCategories, deleteCategory } from "@/actions/categories";
import { useToast } from "@/hooks/use-toast";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { CategoryList } from "@/components/categories/CategoryList";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoriesView() {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      if (response?.data) {
        setCategories(response.data.data);
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie udało się pobrać kategorii. Spróbuj ponownie.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = useCallback(
    async (id: string) => {
      // Optimistic update
      const previousCategories = [...categories];
      setCategories((prev) => prev.filter((category) => category.id !== id));

      try {
        await deleteCategory({ id });
        toast({
          title: "Sukces",
          description: "Kategoria została usunięta.",
        });
      } catch {
        // Rollback on error
        setCategories(previousCategories);
        toast({
          variant: "destructive",
          title: "Błąd",
          description: "Nie udało się usunąć kategorii. Spróbuj ponownie.",
        });
      }
    },
    [categories, toast],
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <CategoryForm onSuccess={fetchCategories} />
      <CategoryList categories={categories} onDelete={handleDelete} />
    </div>
  );
}
