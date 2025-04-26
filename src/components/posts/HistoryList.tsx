"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { FilterBar } from "@/components/posts/FilterBar";
import { PostsList } from "@/components/posts/PostsList";
import { Pagination } from "@/components/posts/Pagination";
import { deletePost } from "@/actions/posts";
import type { PostDTO, CategoriesResponseDTO } from "@/types/database-types";
import type { SearchParamsType } from "@/types/params-types";

interface HistoryListProps {
  initialPosts: PostDTO[];
  initialCategories: CategoriesResponseDTO;
  initialPagination: {
    page: number;
    limit: number;
    total: number;
  };
  searchParams: SearchParamsType;
}

export function HistoryList({
  initialPosts,
  initialCategories,
  initialPagination,
  searchParams,
}: HistoryListProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const currentFilters = {
    page: Number(searchParams.page) || 1,
    limit: Number(searchParams.limit) || 6,
    category_id: searchParams.category_id,
    search: searchParams.search,
    sortBy: searchParams.sortBy || "created_at",
    order: (searchParams.order as "asc" | "desc") || "desc",
  };

  const updateUrl = useCallback(
    (newParams: Record<string, string | undefined>) => {
      const params = new URLSearchParams();
      const currentParams = { ...currentFilters };

      // Convert current filters to strings and remove undefined values
      Object.entries(currentParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });

      // Update with new params
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Only push if the URL actually changed
      const newUrl = `/posts/history?${params.toString()}`;
      const currentUrl = window.location.pathname + window.location.search;
      if (newUrl !== currentUrl) {
        router.push(newUrl, { scroll: false });
      }
    },
    [router, currentFilters],
  );

  const handleFilterChange = useCallback(
    (newFilters: Partial<typeof currentFilters>) => {
      const updates: Record<string, string | undefined> = {};

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined) {
          updates[key] = undefined;
        } else {
          updates[key] = String(value);
        }
      });

      updateUrl(updates);
    },
    [updateUrl],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateUrl({ page: String(page) });
    },
    [updateUrl],
  );

  const handleDeletePost = useCallback(
    async (postId: string) => {
      try {
        setIsLoading(true);
        const result = await deletePost({ id: postId });
        if (!result?.success) {
          throw new Error("Failed to delete post");
        }

        toast({
          title: "Sukces",
          description: "Post został usunięty",
        });
        router.refresh();
      } catch {
        toast({
          title: "Błąd",
          description: "Nie udało się usunąć posta",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  return (
    <div className="space-y-6">
      <FilterBar
        filters={currentFilters}
        onFilterChange={handleFilterChange}
        isLoading={isLoading}
        categories={initialCategories.data}
      />

      <PostsList
        posts={initialPosts}
        onDelete={handleDeletePost}
        categories={initialCategories}
        onPostUpdate={() => router.refresh()}
      />

      <Pagination
        page={initialPagination.page}
        total={initialPagination.total}
        pageSize={initialPagination.limit}
        onChange={handlePageChange}
      />
    </div>
  );
}
