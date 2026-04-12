import { Check } from "lucide-react";
import Image from "next/image";

import { buttonClasses } from "@/components/ui/Button";
import { HERO_IMAGE, TRUST_ITEMS } from "@/lib/constants";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <svg
          className="absolute -left-24 top-10 h-64 w-64 text-accent opacity-10"
          viewBox="0 0 200 200"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M40.2,-48C53.7,-36.2,67.5,-25.5,72.8,-11.8C78.1,1.9,74.8,18.6,66.1,31C57.4,43.4,43.4,51.4,28.4,58.2C13.4,65,-2.7,70.5,-18.5,68.3C-34.2,66,-49.5,56,-61.3,42.5C-73.1,29,-81.5,12,-79.2,-3.9C-76.9,-19.7,-63.9,-34.4,-49.3,-46C-34.8,-57.6,-17.4,-66.1,-2,-63.7C13.5,-61.3,27,-47.9,40.2,-48Z" />
        </svg>
        <svg
          className="absolute right-0 top-0 h-72 w-72 text-primary opacity-10"
          viewBox="0 0 200 200"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M54.8,-56.9C68.2,-41.4,74.6,-20.7,74.7,0.2C74.9,21.1,68.8,42.2,55.4,53.6C42,65,21,66.6,0.6,66C-19.8,65.5,-39.6,62.9,-52.8,51.5C-66,40.1,-72.5,20.1,-73,-0.5C-73.4,-21.1,-67.7,-42.2,-54.4,-57.7C-41.1,-73.2,-20.6,-83.2,0.1,-83.3C20.7,-83.4,41.4,-72.4,54.8,-56.9Z" />
        </svg>
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-2xl">
          <h1 className="font-display text-[36px] font-extrabold leading-[1.1] tracking-[-0.02em] text-forest sm:text-[44px] lg:text-[60px]">
            Elektrische bestelbus gekocht? Haal je fiscale voordeel terug.
          </h1>

          <p className="mt-6 max-w-xl text-[17px] leading-8 text-sub sm:text-lg">
            Met MIA, Vamil en KIA loopt het voordeel op je e-bus al snel op tot
            €5.000. Wij regelen de aanvraag van begin tot eind. Lukt het niet,
            dan betaal je niets.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#calculator" className={buttonClasses({ variant: "primary", size: "lg" })}>
              Bereken mijn voordeel
            </a>
            <a href="#hoe-het-werkt" className={buttonClasses({ variant: "secondary", size: "lg" })}>
              Hoe het werkt
            </a>
          </div>

          <ul className="mt-8 grid gap-3 text-sm text-ink sm:grid-cols-3">
            {TRUST_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-full border border-line bg-white/80 px-4 py-3"
              >
                <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={2} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          {/* Later vervangen door echte fotografie. */}
          <div className="relative overflow-hidden rounded-[28px] border border-line bg-white p-3 shadow-soft">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
              <Image
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="absolute -bottom-5 left-4 rounded-[20px] border border-line bg-white px-5 py-4 shadow-soft sm:left-8">
            <p className="text-sm font-medium text-sub">Geschat voordeel</p>
            <p className="mt-1 font-display text-3xl font-bold text-forest">€ 4.820</p>
            <p className="mt-1 text-sm text-sub">op een bus van € 38.500</p>
          </div>
        </div>
      </div>
    </section>
  );
}
