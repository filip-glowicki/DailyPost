import { signInAction } from "@/actions/auth";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logowanie | DailyPost",
  description: "Logowanie do swojego konta DailyPost",
};

interface SearchParams {
  error?: string;
  message?: string;
}

const getErrorMessage = (error: string) => {
  if (error === "Invalid login credentials") {
    return "Nieprawidłowy email lub hasło";
  }
  return error;
};

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const message: Message = params.error
    ? { error: getErrorMessage(decodeURIComponent(params.error)) }
    : params.message
      ? { message: decodeURIComponent(params.message) }
      : { message: "" };

  return (
    <div className="flex items-center justify-center min-w-full min-h-[calc(100vh-150px)]">
      <form
        className="w-full max-w-md mx-auto px-4 py-8"
        data-test-id="login-form"
      >
        <h1 className="text-2xl font-medium">Logowanie</h1>
        <p className="text-sm text-foreground">
          Nie masz konta?{" "}
          <Link
            className="text-foreground font-medium underline"
            href="/sign-up"
          >
            Zarejestruj się
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="ty@example.com"
            required
            aria-label="Adres email"
            data-test-id="login-email-input"
          />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Hasło</Label>
            <Link
              className="text-xs text-foreground underline"
              href="/forgot-password"
            >
              Zapomniałeś hasła?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Twoje hasło"
            required
            aria-label="Hasło"
            data-test-id="login-password-input"
          />
          <SubmitButton
            pendingText="Logowanie..."
            formAction={signInAction}
            data-test-id="login-submit-button"
          >
            Zaloguj się
          </SubmitButton>
          <FormMessage message={message} />
        </div>
      </form>
    </div>
  );
}
