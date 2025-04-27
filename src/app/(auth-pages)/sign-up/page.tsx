import { signUpAction } from "@/actions/auth";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rejestracja | DailyPost",
  description: "Rejestracja do swojego konta DailyPost",
};

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex items-center justify-center min-w-full min-h-[calc(100vh-150px)]">
        <div className="w-full max-w-md px-4">
          <FormMessage message={searchParams} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-w-full min-h-[calc(100vh-150px)]">
      <form className="w-full max-w-md mx-auto px-4 py-8">
        <h1 className="text-2xl font-medium">Rejestracja</h1>
        <p className="text-sm text text-foreground">
          Masz już konto?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Zaloguj się
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="ty@example.com" required />
          <Label htmlFor="password">Hasło</Label>
          <Input
            type="password"
            name="password"
            placeholder="Twoje hasło"
            minLength={6}
            required
          />
          <SubmitButton
            formAction={signUpAction}
            pendingText="Rejestrowanie..."
          >
            Zarejestruj się
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
