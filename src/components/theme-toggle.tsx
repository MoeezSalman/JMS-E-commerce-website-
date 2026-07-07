"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative grid h-10 w-10 place-items-center rounded-full border border-border bg-card/60 text-foreground transition-all hover:scale-105 hover:border-primary/60",
        className
      )}
    >
      {mounted ? (
        <span className="relative block h-5 w-5">
          <Sun
            className={cn(
              "absolute inset-0 h-5 w-5 transition-all duration-300",
              isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
            )}
          />
          <Moon
            className={cn(
              "absolute inset-0 h-5 w-5 transition-all duration-300",
              isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
            )}
          />
        </span>
      ) : (
        <span className="h-5 w-5" />
      )}
    </button>
  );
}
