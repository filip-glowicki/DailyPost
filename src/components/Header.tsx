import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { EnvVarWarning } from "./env-var-warning";
import HeaderAuth from "./header-auth";
import { ThemeSwitcher } from "./theme-switcher";
import NavLinks from "./nav-links";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "./ui/sheet";

export async function Header() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="w-full container mx-auto py-3 flex justify-between items-center text-sm">
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-xl hover:text-primary transition-colors"
        >
          DailyPost
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <NavLinks />
        </div>

        {/* Desktop Auth & Theme */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeSwitcher />
          {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6">
              <SheetTitle className="text-left text-2xl font-bold mb-6">
                Menu
              </SheetTitle>
              <div className="flex flex-col">
                {/* Navigation Items */}
                <div className="flex-1 flex flex-col divide-y divide-border">
                  <Link
                    href="/post/editor"
                    className="flex items-center text-base font-medium py-4 hover:text-primary transition-colors"
                  >
                    Generate Post
                  </Link>
                  <Link
                    href="/categories"
                    className="flex items-center text-base font-medium py-4 hover:text-primary transition-colors"
                  >
                    Categories
                  </Link>
                  <Link
                    href="/posts/history"
                    className="flex items-center text-base font-medium py-4 hover:text-primary transition-colors"
                  >
                    History
                  </Link>
                </div>
                {/* Bottom Controls */}
                <div className="border-t mt-4 pt-6 flex justify-between items-center">
                  <ThemeSwitcher />
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
