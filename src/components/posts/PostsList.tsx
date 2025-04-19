"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PostDTO } from "@/types";
import { PostForm } from "@/components/post/PostForm";
import { toast } from "@/hooks/use-toast";
import { updatePost } from "@/actions/posts";
import type { UpdatePostCommand, CategoriesResponseDTO } from "@/types";

interface PostsListProps {
  posts: PostDTO[];
  onDelete: (postId: string) => Promise<void>;
  categories: CategoriesResponseDTO;
  onPostUpdate: () => void;
}

export function PostsList({
  posts,
  onDelete,
  categories,
  onPostUpdate,
}: PostsListProps) {
  const [editingPost, setEditingPost] = useState<PostDTO | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePost = async (data: {
    title: string;
    category_id: string;
    prompt?: string;
    size?: string;
    content?: string;
  }) => {
    if (!editingPost?.id) return;

    try {
      setIsUpdating(true);
      const result = await updatePost({
        ...data,
        id: editingPost.id,
      } as UpdatePostCommand);

      if (!result?.data) {
        throw new Error("Failed to update post");
      }

      toast({
        title: "Success",
        description: "Post updated successfully!",
      });
      setEditingPost(null);
      onPostUpdate();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No posts found. Try adjusting your filters.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>
                Created {format(new Date(post.created_at), "PPP")}
                {post.updated_at !== post.created_at &&
                  ` • Updated ${format(new Date(post.updated_at), "PPP")}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="line-clamp-3 text-sm text-muted-foreground">
                {post.content}
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingPost(post)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Post</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this post? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(post.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog
        open={!!editingPost}
        onOpenChange={(open) => !open && setEditingPost(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Make changes to your post below.
            </DialogDescription>
          </DialogHeader>
          {editingPost && (
            <div className="mt-4">
              <PostForm
                initialData={editingPost}
                categories={categories}
                mode="edit"
                isLoading={isUpdating}
                onSubmit={handleUpdatePost}
                onModeChange={() => {}}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
