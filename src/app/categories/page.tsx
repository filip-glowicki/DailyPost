import { CategoriesView } from "@/components/categories/CategoriesView";

export default function CategoriesPage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-8">Manage Categories</h1>
      <CategoriesView />
    </div>
  );
}
