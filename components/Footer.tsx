import { Leaf } from "lucide-react";

import { NAV_ITEMS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-forest px-4 pb-6 pt-14 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-accent">
                <Leaf className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="font-display text-xl font-bold">schonebus.nl</span>
            </div>
            <p className="mt-4 text-sm text-white/80">Onderdeel van Valinta Shipping VOF</p>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold">Links</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a className="transition-colors duration-200 hover:text-white" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold">Juridisch</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li>KvK 90025644</li>
              <li>BTW NL865186479B01</li>
              <li>Privacy</li>
              <li>Algemene voorwaarden</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6 text-sm text-white/70">
          © 2026 schonebus.nl
        </div>
      </div>
    </footer>
  );
}
