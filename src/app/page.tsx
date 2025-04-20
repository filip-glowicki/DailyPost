import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Next.js + Supabase starter</h1>
      <Button>
        <Link href="/sign-in">Sign in</Link>
      </Button>
    </main>
  );
}
