import { Metadata } from "next";
import { Suspense } from "react";
import { HistoryView } from "@/components/posts/HistoryView";

export const metadata: Metadata = {
  title: "Historia Postów | DailyPost",
  description: "Przeglądaj i zarządzaj opublikowanymi postami",
};

export default function PostHistoryPage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Historia postów</h1>
      <Suspense fallback={<div>Ładowanie...</div>}>
        <HistoryView />
      </Suspense>
    </main>
  );
}
