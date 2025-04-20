import Link from "next/link";
import { PenLine, FolderTree, History } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function NavLinks() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return (
    <div className="flex gap-6">
      <Link
        href="/post/editor"
        className="flex items-center gap-2 hover:text-primary transition-colors"
      >
        <PenLine className="w-4 h-4" />
        <span>Generate Post</span>
      </Link>
      <Link
        href="/categories"
        className="flex items-center gap-2 hover:text-primary transition-colors"
      >
        <FolderTree className="w-4 h-4" />
        <span>Categories</span>
      </Link>
      <Link
        href="/posts/history"
        className="flex items-center gap-2 hover:text-primary transition-colors"
      >
        <History className="w-4 h-4" />
        <span>History</span>
      </Link>
    </div>
  );
}
