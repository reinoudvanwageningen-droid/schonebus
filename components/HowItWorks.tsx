import Image from "next/image";

import { Card } from "@/components/ui/Card";
import { CABLE_IMAGE, HOW_IT_WORKS_ITEMS } from "@/lib/constants";

export function HowItWorks() {
  return (
    <section id="hoe-het-werkt" className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <h2 className="font-display text-[32px] font-bold leading-tight tracking-[-0.02em] text-forest sm:text-[38px]">
              Hoe het werkt
            </h2>
          </div>

          {/* Later vervangen door echte fotografie. */}
          <div className="relative overflow-hidden rounded-[24px] border border-line bg-white p-3 shadow-soft">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[18px]">
              <Image
                src={CABLE_IMAGE.src}
                alt={CABLE_IMAGE.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 360px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <ol className="mt-10 grid gap-5 lg:grid-cols-4">
          {HOW_IT_WORKS_ITEMS.map((item, index) => (
            <li key={item.title}>
              <Card className="h-full p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mint-bg font-display text-lg font-semibold text-primary">
                  {index + 1}
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-forest">
                  {item.title}
                </h3>
                <p className="mt-3 text-[17px] leading-8 text-sub">{item.body}</p>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
