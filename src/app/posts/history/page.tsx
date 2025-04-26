import { Metadata } from "next";
import { Suspense } from "react";
import { getCategories } from "@/actions/categories";
import { getPosts } from "@/actions/posts";
import { SearchParamsType } from "@/types/params-types";
import { PostsLoading } from "@/components/posts/PostsLoading";
import { HistoryList } from "@/components/posts/HistoryList";

export const metadata: Metadata = {
  title: "Historia Postów | DailyPost",
  description: "Przeglądaj i zarządzaj opublikowanymi postami",
};

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsType>;
}) {
  const params = await searchParams;

  const query = {
    page: Math.max(1, Number(params.page) || 1),
    limit: Math.max(1, Math.min(50, Number(params.limit) || 6)),
    category_id: params.category_id || undefined,
    search: params.search || undefined,
    sortBy: ["created_at", "updated_at", "title"].includes(params.sortBy || "")
      ? params.sortBy
      : "created_at",
    order: ["asc", "desc"].includes(params.order || "")
      ? (params.order as "asc" | "desc")
      : "desc",
  };

  const [postsResult, categoriesResult] = await Promise.all([
    getPosts(query),
    getCategories(),
  ]);

  if (!postsResult.data || !categoriesResult.data) {
    console.log(postsResult, categoriesResult);
    throw new Error("Failed to fetch data");
  }

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Historia postów</h1>
      <Suspense fallback={<PostsLoading />}>
        <HistoryList
          initialPosts={postsResult.data.data}
          initialCategories={categoriesResult.data}
          initialPagination={postsResult.data.pagination}
          searchParams={params}
        />
      </Suspense>
    </main>
  );
}
