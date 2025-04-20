import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import NavLinks from "@/components/nav-links";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "DailyPost - AI-Powered Content Creation",
  description: "Create, edit and manage your posts with AI technology",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
                <div className="w-full container mx-auto py-3 flex justify-between items-center text-sm">
                  <div className="flex flex-1 items-center gap-6">
                    <Link
                      href="/"
                      className="font-bold text-xl hover:text-primary transition-colors"
                    >
                      DailyPost
                    </Link>
                  </div>
                  <NavLinks />
                  <div className="flex flex-1 justify-end items-center gap-4">
                    {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                    <ThemeSwitcher />
                  </div>
                </div>
              </nav>
              {children}
            </div>
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
