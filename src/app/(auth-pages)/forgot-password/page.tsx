import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { forgotPasswordAction } from "@/actions/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zresetuj hasło | DailyPost",
  description: "Zresetuj hasło do swojego konta DailyPost",
};

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex items-center justify-center min-w-full min-h-[calc(100vh-150px)]">
      <form className="w-full max-w-md mx-auto px-4 py-8">
        <div>
          <h1 className="text-2xl font-medium">Zresetuj hasło</h1>
          <p className="text-sm text-secondary-foreground">
            Masz już konto?{" "}
            <Link className="text-primary underline" href="/sign-in">
              Zaloguj się
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="twoj@email.com" required />
          <SubmitButton formAction={forgotPasswordAction}>
            Zresetuj hasło
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
