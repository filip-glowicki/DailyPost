import { signInAction } from "@/actions/auth";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex-1 flex flex-col min-w-64" data-test-id="login-form">
      <h1 className="text-2xl font-medium">Logowanie</h1>
      <p className="text-sm text-foreground">
        Nie masz konta?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Zarejestruj się
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          placeholder="ty@example.com"
          required
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
          type="password"
          name="password"
          placeholder="Twoje hasło"
          required
          data-test-id="login-password-input"
        />
        <SubmitButton
          pendingText="Logowanie..."
          formAction={signInAction}
          data-test-id="login-submit-button"
        >
          Zaloguj się
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
