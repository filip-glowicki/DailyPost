import { CategoriesView } from "@/components/categories/CategoriesView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kategorie | DailyPost",
  description: "Zarządzaj kategoriami postów",
};

export default function CategoriesPage() {
  return (
    <div className="container py-10">
      <CategoriesView />
    </div>
  );
}
