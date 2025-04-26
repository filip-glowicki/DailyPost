"use client";

import { Button } from "@/components/ui/button";
import { Copy, PenSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShareButton } from "@/components/post/ShareButton";
import { PostDTO } from "@/types/database-types";

interface PostDisplayProps {
  post: PostDTO;
  onEdit: () => void;
  onCopy: (content: string) => void;
}

export function PostDisplay({ post, onEdit, onCopy }: PostDisplayProps) {
  return (
    <Card className="w-full" data-test-id="post-display">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{post.title}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onCopy(post.content)}
              title="Kopiuj treść"
              data-test-id="copy-content-button"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onEdit}
              title="Edytuj post"
              data-test-id="edit-post-button"
            >
              <PenSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div
          className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-4 [&>p]:mt-0 [&>p:last-child]:mb-0"
          data-test-id="post-content"
        >
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div className="flex gap-2">
          {post.prompt && (
            <>
              <span className="font-semibold">Polecenie:</span>
              <span data-test-id="post-prompt-display">{post.prompt}</span>
            </>
          )}
        </div>
        <ShareButton title={post.title} content={post.content} />
      </CardFooter>
    </Card>
  );
}
