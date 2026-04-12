"use client";

import { Leaf, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { NAV_ITEMS } from "@/lib/constants";
import { buttonClasses } from "@/components/ui/Button";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen]);

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-all duration-200",
        isScrolled || isOpen
          ? "border-b border-line bg-white/92 backdrop-blur"
          : "bg-white/80",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2 text-lg font-bold text-forest">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint-bg text-accent">
            <Leaf className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <span className="font-display text-[1.1rem]">schonebus.nl</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink transition-colors duration-200 hover:text-primary"
            >
              {item.label}
            </a>
          ))}
          <a href="#contact" className={buttonClasses({ variant: "primary", size: "md" })}>
            Start aanvraag
          </a>
        </nav>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobiel-menu"
          aria-label={isOpen ? "Sluit menu" : "Open menu"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-forest md:hidden"
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {isOpen ? (
        <div id="mobiel-menu" className="border-t border-line bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 sm:px-6">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-[14px] px-3 py-3 text-sm font-medium text-ink transition-colors duration-200 hover:bg-mint-bg"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              className={buttonClasses({ variant: "primary", size: "lg", fullWidth: true })}
              onClick={() => setIsOpen(false)}
            >
              Start aanvraag
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
