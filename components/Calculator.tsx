"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, fieldClassName } from "@/components/ui/Input";
import { bereken, formatEuro, type Input as CalculatorInput, type Rechtsvorm } from "@/lib/calculator";

interface CalculatorProps {
  onPriceChange?: (prijs: number) => void;
}

const ibOptions = [
  { value: "laag", label: "tot €38.441" },
  { value: "midden", label: "€38.441 – €76.817" },
  { value: "hoog", label: "boven €76.817" },
] as const;

const vpbOptions = [
  { value: "laag", label: "tot €200.000" },
  { value: "hoog", label: "boven €200.000" },
] as const;

function clampPrice(value: number) {
  if (!Number.isFinite(value)) {
    return 38500;
  }

  return Math.min(150000, Math.max(10000, value));
}

export function Calculator({ onPriceChange }: CalculatorProps) {
  const [prijs, setPrijs] = useState(38500);
  const [rechtsvorm, setRechtsvorm] = useState<Rechtsvorm>("ib");
  const [ibSchijf, setIbSchijf] = useState<CalculatorInput["ibSchijf"]>("midden");
  const [vpbSchijf, setVpbSchijf] = useState<CalculatorInput["vpbSchijf"]>("laag");
  const [andereInvesteringen, setAndereInvesteringen] = useState(false);

  useEffect(() => {
    onPriceChange?.(prijs);
  }, [onPriceChange, prijs]);

  const resultaat = useMemo(
    () =>
      bereken({
        prijs,
        rechtsvorm,
        ibSchijf,
        vpbSchijf,
        andereInvesteringen,
      }),
    [andereInvesteringen, ibSchijf, prijs, rechtsvorm, vpbSchijf],
  );

  const incomeOptions = rechtsvorm === "ib" ? ibOptions : vpbOptions;

  return (
    <section id="calculator" className="bg-cloud px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h2 className="font-display text-[32px] font-bold leading-tight tracking-[-0.02em] text-midnight sm:text-[38px]">
            Bereken je fiscale voordeel
          </h2>
          <p className="mt-4 text-[17px] leading-8 text-mist sm:text-lg">
            Vul de aanschafprijs van je elektrische bestelbus in. Je krijgt direct een
            indicatie van het bedrag dat je via MIA, Vamil en KIA terug kunt halen.
          </p>
        </div>

        <Card className="mt-10 p-6 sm:p-8">
          <div className="space-y-6">
            <Input
              id="aanschafprijs"
              label="Aanschafprijs e-bestelbus (excl. btw)"
              prefix="€"
              type="number"
              min={10000}
              max={150000}
              step={500}
              value={prijs}
              onChange={(event) => setPrijs(clampPrice(Number(event.target.value)))}
            />

            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-ink">Rechtsvorm</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { value: "ib", label: "Eenmanszaak / VOF (IB)" },
                  { value: "vpb", label: "BV (vpb)" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={[
                      "flex cursor-pointer items-center gap-3 rounded-[14px] border px-4 py-4 transition-colors duration-200",
                      rechtsvorm === option.value
                        ? "border-electric bg-cloud"
                        : "border-line bg-paper",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <input
                      type="radio"
                      name="rechtsvorm"
                      value={option.value}
                      checked={rechtsvorm === option.value}
                      onChange={() => setRechtsvorm(option.value as Rechtsvorm)}
                      className="h-4 w-4 border-line text-electric focus:ring-electric"
                    />
                    <span className="text-sm font-medium text-ink">{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink">
                Belastbaar inkomen / winst per jaar
              </span>
              <select
                value={rechtsvorm === "ib" ? ibSchijf : vpbSchijf}
                onChange={(event) => {
                  if (rechtsvorm === "ib") {
                    setIbSchijf(event.target.value as typeof ibSchijf);
                  } else {
                    setVpbSchijf(event.target.value as typeof vpbSchijf);
                  }
                }}
                className={[fieldClassName, "h-12"].join(" ")}
              >
                {incomeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <span className="mb-2 block text-sm font-medium text-ink">
                Heb je dit jaar al andere investeringen gedaan?
              </span>
              <div className="inline-flex rounded-full border border-line bg-paper p-1">
                {[
                  { value: false, label: "Nee" },
                  { value: true, label: "Ja" },
                ].map((option) => (
                  <button
                    key={String(option.value)}
                    type="button"
                    aria-pressed={andereInvesteringen === option.value}
                    className={[
                      "rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200",
                      andereInvesteringen === option.value
                        ? "bg-electric text-paper"
                        : "text-ink",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => setAndereInvesteringen(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {andereInvesteringen ? (
                <p className="mt-3 text-sm leading-6 text-mist">
                  KIA-uitkomst is indicatief als je dit jaar al andere investeringen hebt
                  gedaan.
                </p>
              ) : null}
            </div>
          </div>

          <div
            className="mt-8 rounded-[24px] border border-line bg-cloud p-5 sm:p-6"
            aria-live="polite"
          >
            <p className="text-sm font-medium text-mist">Geschat fiscaal voordeel</p>
            <div className="mt-2 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <p className="font-display text-4xl font-bold text-midnight">
                {formatEuro(resultaat.totaal)}
              </p>
              <span className="inline-flex rounded-full bg-spark px-3 py-1 text-sm font-semibold text-midnight">
                Totaal {formatEuro(resultaat.totaal)}
              </span>
            </div>

            <div className="mt-6 space-y-3 text-sm text-ink">
              <p className="font-medium text-mist">Opbouw:</p>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1">
                <span>MIA-aftrek (27%)</span>
                <span>{formatEuro(resultaat.miaAftrek)}</span>
                <span className="text-mist">voordeel</span>
                <span>{formatEuro(resultaat.miaVoordeel)}</span>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1">
                <span>KIA-aftrek</span>
                <span>{formatEuro(resultaat.kiaAftrek)}</span>
                <span className="text-mist">voordeel</span>
                <span>{formatEuro(resultaat.kiaVoordeel)}</span>
              </div>

              <div className="border-t border-line pt-3">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 font-semibold">
                  <span>Totaal voordeel</span>
                  <span>{formatEuro(resultaat.totaal)}</span>
                </div>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-mist">
              + Vamil: je mag 75% van de investering willekeurig afschrijven. Dat
              geeft een cashflowvoordeel in het jaar van aanschaf.
            </p>

            <Button
              className="mt-6"
              size="lg"
              onClick={() => {
                onPriceChange?.(prijs);
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Aanvraag starten
            </Button>
          </div>
        </Card>

        <p className="mt-4 text-sm leading-6 text-mist">
          Dit is een indicatie op basis van de actuele MIA- en KIA-percentages. Het
          werkelijke voordeel hangt af van je belastbaar inkomen, eerdere investeringen
          en de definitieve beschikking van RVO. We rekenen exact voor je door in de
          offerte.
        </p>
      </div>
    </section>
  );
}
