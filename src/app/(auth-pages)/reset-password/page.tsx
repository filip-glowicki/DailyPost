import { resetPasswordAction } from "@/actions/auth";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zresetuj hasło | DailyPost",
  description: "Zresetuj hasło do swojego konta DailyPost",
};

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex items-center justify-center min-w-full min-h-[calc(100vh-150px)]">
      <form className="w-full max-w-md mx-auto px-4 py-8">
        <h1 className="text-2xl font-medium">Zresetuj hasło</h1>
        <p className="text-sm text-foreground/60">
          Wprowadź swoje nowe hasło poniżej.
        </p>
        <div className="flex flex-col gap-4 mt-8">
          <div>
            <Label htmlFor="password">Nowe hasło</Label>
            <Input
              type="password"
              name="password"
              placeholder="Nowe hasło"
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Potwierdź hasło"
              required
            />
          </div>
          <SubmitButton formAction={resetPasswordAction}>
            Zresetuj hasło
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
