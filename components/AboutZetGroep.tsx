import { buttonClasses } from "@/components/ui/Button";
import {
  ZET_GROEP_CARD,
  ZET_GROEP_CONTACTS,
  ZET_GROEP_STATS,
  ZET_GROEP_URL,
} from "@/lib/constants";

export function AboutZetGroep() {
  return (
    <section className="bg-cloud px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <h2 className="font-display text-[32px] font-bold leading-tight tracking-[-0.02em] text-midnight sm:text-[38px]">
            Achter schonebus.nl staat ZET Groep
          </h2>

          <p className="mt-5 text-[17px] leading-8 text-mist">
            ZET Groep begeleidt sinds 2019 ondernemers bij de overstap naar
            elektrisch transport. Erik van der Eng en Mathijs Vrijbloed combineren
            technische kennis van elektrische voertuigen met financiële expertise op
            het gebied van subsidies en fiscale regelingen.
          </p>

          <p className="mt-5 text-[17px] leading-8 text-mist">
            Schonebus.nl is de ingang voor zzp&apos;ers en kleine bedrijven met één
            of enkele elektrische bestelbussen. Voor vrachtwagens, laadinfra en
            wagenparkvraagstukken werkt ZET Groep rechtstreeks met opdrachtgevers via
            zetgroep.nl.
          </p>

          <p className="mt-6 text-sm font-medium text-mist">Resultaat tot nu toe:</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {ZET_GROEP_STATS.map((item) => (
              <div key={item.value} className="rounded-2xl border border-line bg-paper p-4 shadow-soft">
                <p className="font-display text-2xl font-bold text-midnight">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-mist">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-paper p-8 shadow-soft">
          <h3 className="font-display text-2xl font-semibold text-midnight">
            {ZET_GROEP_CARD.company}
          </h3>

          <div className="mt-5 space-y-1 text-base text-ink">
            {ZET_GROEP_CARD.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <div className="mt-6 space-y-2 text-base text-ink">
            <p>
              <a className="transition-colors duration-200 hover:text-electric" href={`mailto:${ZET_GROEP_CARD.email}`}>
                {ZET_GROEP_CARD.email}
              </a>
            </p>
            <p>
              <a className="transition-colors duration-200 hover:text-electric" href={`tel:${ZET_GROEP_CARD.phone.replace(/\s+/g, "")}`}>
                {ZET_GROEP_CARD.phone}
              </a>
            </p>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium uppercase tracking-[0.08em] text-mist">
              Contactpersonen
            </p>
            <div className="mt-3 space-y-3">
              {ZET_GROEP_CONTACTS.map((person) => (
                <p key={person.name} className="text-base text-ink">
                  <span className="font-medium">{person.name}</span> — {person.role}
                </p>
              ))}
            </div>
          </div>

          <a
            className={`${buttonClasses({ variant: "outline", size: "lg" })} mt-8`}
            href={ZET_GROEP_URL}
            target="_blank"
            rel="noopener"
          >
            Bezoek zetgroep.nl →
          </a>
        </div>
      </div>
    </section>
  );
}
