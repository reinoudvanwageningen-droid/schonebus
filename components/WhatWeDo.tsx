import { CircleCheckBig, FileCheck2, TimerReset } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { WHAT_WE_DO_ITEMS } from "@/lib/constants";

const icons = [FileCheck2, CircleCheckBig, TimerReset];

export function WhatWeDo() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl font-display text-[32px] font-bold leading-tight tracking-[-0.02em] text-forest sm:text-[38px]">
          Wij regelen de papieren. Jij rijdt schoon.
        </h2>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {WHAT_WE_DO_ITEMS.map((item, index) => {
            const Icon = icons[index];

            return (
              <Card key={item.title} className="p-6 sm:p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint-bg text-primary">
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-forest">
                  {item.title}
                </h3>
                <p className="mt-3 text-[17px] leading-8 text-sub">{item.body}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
