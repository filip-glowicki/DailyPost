"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Pagination } from "@/components/posts/Pagination";
import type {
  GetPostsQuery,
  PostDTO,
  CategoriesResponseDTO,
} from "@/types/database-types";
import { FilterBar } from "@/components/posts/FilterBar";
import { PostsList } from "@/components/posts/PostsList";
import { deletePost, getPosts } from "@/actions/posts";
import { getCategories } from "@/actions/categories";

export function HistoryView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [categories, setCategories] = useState<CategoriesResponseDTO>({
    data: [],
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
  });

  const currentFilters = useMemo((): GetPostsQuery => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 6,
      category_id: searchParams.get("category_id") || undefined,
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sortBy") || "created_at",
      order: (searchParams.get("order") as "asc" | "desc") || "desc",
    };
  }, [searchParams]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const result = await getCategories();
        if (!result?.data) {
          throw new Error("Failed to load categories");
        }
        setCategories(result.data);
      } catch {
        toast({
          title: "Błąd",
          description: "Nie udało się załadować kategorii",
          variant: "destructive",
        });
      }
    }

    loadCategories();
  }, []);

  const fetchPosts = useCallback(async (query: GetPostsQuery) => {
    try {
      setIsLoading(true);
      const cleanQuery = Object.fromEntries(
        Object.entries(query).filter(([_, value]) => {
          return value !== undefined;
        }),
      ) as GetPostsQuery;

      const result = await getPosts(cleanQuery);

      if (!result.data) {
        throw new Error("Failed to fetch posts");
      }

      setPosts(result.data.data);
      setPagination(result.data.pagination);
    } catch {
      toast({
        title: "Błąd",
        description: "Nie udało się załadować postów",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(currentFilters);
  }, [currentFilters, fetchPosts]);

  const updateUrl = useCallback(
    (newParams: Record<string, string | undefined>) => {
      const params = new URLSearchParams();

      // First, add all current params
      searchParams.forEach((value, key) => {
        params.set(key, value);
      });

      // Then update with new params
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      router.push(`/posts/history?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleFilterChange = useCallback(
    (newFilters: Partial<GetPostsQuery>) => {
      const updates: Record<string, string | undefined> = {};

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined) {
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
        const result = await deletePost({ id: postId });
        if (!result?.success) {
          throw new Error("Failed to delete post");
        }

        toast({
          title: "Sukces",
          description: "Post został usunięty",
        });
        fetchPosts(currentFilters);
      } catch {
        toast({
          title: "Błąd",
          description: "Nie udało się usunąć posta",
          variant: "destructive",
        });
      }
    },
    [currentFilters, fetchPosts],
  );

  return (
    <div className="space-y-6">
      <FilterBar
        filters={currentFilters}
        onFilterChange={handleFilterChange}
        isLoading={isLoading}
      />

      <PostsList
        posts={posts}
        onDelete={handleDeletePost}
        categories={categories}
        onPostUpdate={() => fetchPosts(currentFilters)}
      />

      <Pagination
        page={pagination.page}
        total={pagination.total}
        pageSize={pagination.limit}
        onChange={handlePageChange}
      />
    </div>
  );
}
