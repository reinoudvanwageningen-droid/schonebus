import { PRICING_ITEMS } from "@/lib/constants";
import { Card } from "@/components/ui/Card";

export function Pricing() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-[32px] font-bold leading-tight tracking-[-0.02em] text-forest sm:text-[38px]">
          Tarieven
        </h2>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {PRICING_ITEMS.map((item) => (
            <Card
              key={item.name}
              className={[
                "p-7 sm:p-8",
                item.featured ? "border-primary bg-mint-bg/50" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {item.featured ? (
                <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold tracking-[0.08em] text-forest">
                  Meest gekozen
                </span>
              ) : null}
              <h3 className="mt-4 font-display text-2xl font-semibold text-forest">
                {item.name}
              </h3>
              <p className="mt-3 text-[17px] leading-8 text-sub">{item.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
