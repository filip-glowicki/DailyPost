"use client";

import { PostDTO } from "@/types";
import { Button } from "@/components/ui/button";
import { Copy, PenSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PostDisplayProps {
  post: PostDTO;
  onEdit: () => void;
  onCopy: (content: string) => void;
}

export function PostDisplay({ post, onEdit, onCopy }: PostDisplayProps) {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{post.title}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onCopy(post.content)}
              title="Copy content"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onEdit}
              title="Edit post"
            >
              <PenSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <div className="flex gap-2">
          {post.prompt && (
            <>
              <span className="font-semibold">Prompt:</span>
              <span>{post.prompt}</span>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
