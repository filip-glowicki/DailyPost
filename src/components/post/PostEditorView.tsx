"use client";

import { useEffect, useState } from "react";
import {
  CategoriesResponseDTO,
  PostDTO,
  CreatePostCommand,
  UpdatePostCommand,
} from "@/types";
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
          title: "Error",
          description: "Failed to load categories. Please try again.",
        });
      }
    }

    loadCategories();
  }, [toast]);

  const handleGeneratePost = async (data: FormData) => {
    try {
      setIsLoading(true);
      const result = await generatePost(data as CreatePostCommand);
      if (!result?.data) {
        throw new Error("Failed to generate post");
      }

      setPost(result.data as PostDTO);
      toast({
        title: "Success",
        description: "Post generated successfully!",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate post. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePost = async (data: FormData) => {
    if (!post?.id) return;

    try {
      const result = await updatePost({
        ...data,
        id: post.id,
      } as UpdatePostCommand);
      if (!result?.data) {
        throw new Error("Failed to update post");
      }

      setPost(result.data as PostDTO);
      toast({
        title: "Success",
        description: "Post updated successfully!",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update post. Please try again.",
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
    <div className="container mx-auto">
      <div className="bg-card mx-auto max-w-3xl rounded-lg shadow-lg p-8 space-y-8 border h-full relative">
        {isLoading && <LoadingOverlay />}
        {post ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{post.title}</h2>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setMode("edit")}
                  disabled={isLoading}
                >
                  Modify Post
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setPost(null);
                    setMode("auto");
                  }}
                  disabled={isLoading}
                >
                  Create New Post
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
                    title: "Success",
                    description: "Content copied to clipboard!",
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
