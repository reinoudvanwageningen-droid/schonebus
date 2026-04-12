import { ChevronDown } from "lucide-react";

import { FAQ_ITEMS } from "@/lib/constants";

export function Faq() {
  return (
    <section id="veelgestelde-vragen" className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display text-[32px] font-bold leading-tight tracking-[-0.02em] text-midnight sm:text-[38px]">
          Veelgestelde vragen
        </h2>

        <div className="mt-10 space-y-4">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group rounded-[18px] border border-line bg-paper px-5 py-4 shadow-soft"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-semibold text-midnight">
                <span>{item.question}</span>
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-electric transition-transform duration-200 group-open:rotate-180"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </summary>
              <p className="pt-4 text-[17px] leading-8 text-mist">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
