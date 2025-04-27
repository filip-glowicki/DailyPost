import { Suspense } from "react";
import { PostEditorView } from "@/components/post/PostEditorView";

export const metadata = {
  title: "Edytor Postów | DailyPost",
  description: "Twórz i edytuj posty z pomocą AI",
};

export default function PostEditorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostEditorView />
    </Suspense>
  );
}
