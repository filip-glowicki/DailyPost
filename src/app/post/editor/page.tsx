import { Suspense } from "react";
import { PostEditorView } from "@/components/post/PostEditorView";

export const metadata = {
  title: "Post Editor - DailyPost",
  description: "Create and edit your posts with AI assistance",
};

export default function PostEditorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostEditorView />
    </Suspense>
  );
}
