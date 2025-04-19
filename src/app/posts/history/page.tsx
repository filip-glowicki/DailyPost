import { Metadata } from "next";
import { Suspense } from "react";
import { HistoryView } from "@/components/posts/HistoryView";

export const metadata: Metadata = {
  title: "Post History | DailyPost",
  description: "View and manage your published posts",
};

export default function PostHistoryPage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Post History</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <HistoryView />
      </Suspense>
    </main>
  );
}
