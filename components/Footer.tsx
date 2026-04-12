import { Zap } from "lucide-react";

import { NAV_ITEMS, ZET_GROEP_TEXT, ZET_GROEP_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-midnight px-4 pb-6 pt-14 text-paper sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-paper/10 text-electric">
                <Zap className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="font-display text-xl font-bold">schonebus.nl</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-paper/80">
              {ZET_GROEP_TEXT.footerBody}
            </p>
            <a
              className="mt-4 inline-flex text-sm font-medium text-paper transition-colors duration-200 hover:text-sky"
              href={ZET_GROEP_URL}
              target="_blank"
              rel="noopener"
            >
              Bezoek zetgroep.nl
            </a>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold">Links</h3>
            <ul className="mt-4 space-y-3 text-sm text-paper/80">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a className="transition-colors duration-200 hover:text-sky" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold">Juridisch</h3>
            <ul className="mt-4 space-y-3 text-sm text-paper/80">
              <li>ZET Groep — Haarlem</li>
              <li>KvK op aanvraag</li>
              <li>Privacy</li>
              <li>Algemene voorwaarden</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-paper/15 pt-6 text-sm text-paper/70">
          © 2026 schonebus.nl
        </div>
      </div>
    </footer>
  );
}
