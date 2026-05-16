"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/modules/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/modules/ui/button";
import Logo from "@/modules/shared/components/Logo";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV = [
  { label: "Classes", id: "courses" },
  { label: "Contact", id: "contact" },
  { label: "About Us", id: "about" },
];

export default function HomeNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function go(id: string) {
    // If not on homepage, navigate to "/#id"
    if (pathname !== "/") {
      router.push(`/#${id}`);
      setOpen(false);
      return;
    }
    // On homepage: smooth scroll
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpen(false);
    }
  }

  return (
    <header className="w-full">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div>
          <Logo />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`/#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                go(item.id);
              }}
              className="hover:underline cursor-pointer"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="gray" asChild>
            <a href="/login">Login</a>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="p-1 text-slate-800" aria-label="Open menu">
                <Menu size={22} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="p-6 space-y-6">
              <SheetTitle className="sr-only">
                Mobile Navigation Menu
              </SheetTitle>

              <nav className="flex flex-col gap-4 text-sm font-medium">
                {NAV.map((item) => (
                  <a
                    key={item.id}
                    href={`/#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.id);
                    }}
                    className="active:text-yellow-500"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
                <Button variant="gray" asChild>
                  <a href="/login">Login</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
