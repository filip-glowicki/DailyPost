"use client";

import { useEffect, useState } from "react";
import {
  CategoriesResponseDTO,
  PostDTO,
  CreatePostCommand,
  UpdatePostCommand,
} from "@/types/database-types";
import { PostForm } from "@/components/post/PostForm";
import { PostDisplay } from "@/components/post/PostDisplay";
import { useToast } from "@/hooks/use-toast";
import { getCategories } from "@/actions/categories";
import { generatePost, updatePost } from "@/actions/posts";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

type EditorMode = "auto" | "manual" | "edit";

interface FormData {
  title: string;
  category_id: string;
  prompt?: string;
  size?: string;
  content?: string;
}

export function PostEditorView() {
  const { toast } = useToast();

  const [post, setPost] = useState<PostDTO | null>(null);
  const [categories, setCategories] = useState<CategoriesResponseDTO>({
    data: [],
  });
  const [mode, setMode] = useState<EditorMode>("auto");
  const [isLoading, setIsLoading] = useState(false);

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
          variant: "destructive",
          title: "Błąd",
          description:
            "Nie udało się załadować kategorii. Proszę spróbować ponownie.",
        });
      }
    }

    loadCategories();
  }, [toast]);

  const cleanFormData = (data: FormData) => {
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== ""),
    );
  };

  const handleGeneratePost = async (data: FormData) => {
    try {
      setIsLoading(true);
      const cleanData = cleanFormData(data);
      const result = await generatePost({
        ...cleanData,
        mode: mode === "edit" ? "manual" : mode,
      } as CreatePostCommand);

      if (!result?.data) {
        throw new Error("Failed to generate post");
      }

      setPost(result.data as PostDTO);
      toast({
        title: "Sukces",
        description: "Post został wygenerowany!",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Błąd",
        description:
          "Nie udało się wygenerować posta. Proszę spróbować ponownie.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePost = async (data: FormData) => {
    if (!post?.id) return;

    try {
      const cleanData = cleanFormData(data);
      const result = await updatePost({
        ...cleanData,
        id: post.id,
      } as UpdatePostCommand);
      if (!result?.data) {
        throw new Error("Failed to update post");
      }

      setPost(result.data as PostDTO);
      setMode("auto");
      toast({
        title: "Sukces",
        description: "Post został zaktualizowany!",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Błąd",
        description:
          "Nie udało się zaktualizować posta. Proszę spróbować ponownie.",
      });
    }
  };

  const handleSubmit = async (data: FormData) => {
    if (mode === "edit" && post) {
      await handleUpdatePost(data);
    } else {
      await handleGeneratePost(data);
    }
  };

  return (
    <div className="container mx-auto" data-test-id="post-editor-view">
      <div className="bg-card mx-auto max-w-3xl rounded-lg shadow-lg p-8 space-y-8 border h-full relative">
        {isLoading && <LoadingOverlay />}
        {post ? (
          <div className="space-y-6">
            <div className="flex items-center justify-end">
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setMode("edit")}
                  disabled={isLoading}
                  data-test-id="modify-post-button"
                >
                  Modyfikuj post
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setPost(null);
                    setMode("auto");
                  }}
                  disabled={isLoading}
                  data-test-id="create-new-post-button"
                >
                  Utwórz nowy post
                </Button>
              </div>
            </div>
            {mode === "edit" ? (
              <PostForm
                initialData={post}
                categories={categories}
                mode={mode}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onModeChange={setMode}
              />
            ) : (
              <PostDisplay
                post={post}
                onEdit={() => setMode("edit")}
                onCopy={(content: string) => {
                  navigator.clipboard.writeText(content);
                  toast({
                    title: "Sukces",
                    description: "Treść została skopiowana do schowka!",
                  });
                }}
              />
            )}
          </div>
        ) : (
          <PostForm
            initialData={post}
            categories={categories}
            mode={mode}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            onModeChange={setMode}
          />
        )}
      </div>
    </div>
  );
}
