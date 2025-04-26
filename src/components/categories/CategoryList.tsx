"use client";

import { CategoryDTO } from "@/types/database-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertDialog } from "@/components/categories/AlertDialog";

interface CategoryListProps {
  categories: CategoryDTO[];
  onDelete: (id: string) => void;
}

export function CategoryList({ categories, onDelete }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <Card className="bg-muted">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No categories found. Create your first category above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="truncate">{category.name}</span>
              <AlertDialog
                category={category}
                onConfirmDelete={() => onDelete(category.id)}
              />
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {category.description}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
