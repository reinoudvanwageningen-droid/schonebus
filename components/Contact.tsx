"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, fieldClassName } from "@/components/ui/Input";
import { CLIPBOARD_IMAGE, CONTACT_DETAILS } from "@/lib/constants";

interface ContactProps {
  prefilledPrice?: number;
}

interface FormValues {
  naam: string;
  bedrijfsnaam: string;
  email: string;
  telefoon: string;
  aanschafprijsBus: string;
  bericht: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

function formatPrice(value?: number) {
  if (!value) {
    return "";
  }

  return new Intl.NumberFormat("nl-NL").format(value);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function Contact({ prefilledPrice }: ContactProps) {
  const [form, setForm] = useState<FormValues>({
    naam: "",
    bedrijfsnaam: "",
    email: "",
    telefoon: "",
    aanschafprijsBus: formatPrice(prefilledPrice),
    bericht: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  

  useEffect(() => {
    setForm((current) => ({
      ...current,
      aanschafprijsBus: formatPrice(prefilledPrice),
    }));
  }, [prefilledPrice]);

  function updateField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    
  }

  function validate() {
    const nextErrors: FormErrors = {};

    if (!form.naam.trim()) {
      nextErrors.naam = "Vul je naam in.";
    }
    if (!form.bedrijfsnaam.trim()) {
      nextErrors.bedrijfsnaam = "Vul je bedrijfsnaam in.";
    }
    if (!form.email.trim()) {
      nextErrors.email = "Vul je e-mailadres in.";
    } else if (!isValidEmail(form.email.trim())) {
      nextErrors.email = "Vul een geldig e-mailadres in.";
    }

    return nextErrors;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const lines = [
      `Naam: ${form.naam}`,
      `Bedrijfsnaam: ${form.bedrijfsnaam}`,
      form.telefoon ? `Telefoon: ${form.telefoon}` : "",
      form.aanschafprijsBus ? `Aanschafprijs bus: €${form.aanschafprijsBus}` : "",
      "",
      form.bericht || "",
    ].filter(Boolean);

    const subject = encodeURIComponent(`Aanvraag schonebus.nl – ${form.bedrijfsnaam}`);
    const body = encodeURIComponent(lines.join("\n"));

    window.location.href = `mailto:${CONTACT_DETAILS.email}?subject=${subject}&body=${body}`;
  }

  return (
    <section id="contact" className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:pr-8">
          <h2 className="font-display text-[32px] font-bold leading-tight tracking-[-0.02em] text-midnight sm:text-[38px]">
            Contact
          </h2>
          <p className="mt-5 max-w-md text-[17px] leading-8 text-mist">
            Stuur je opdrachtbevestiging, of stel eerst een vraag. We reageren binnen
            één werkdag.
          </p>

          <div className="mt-8 space-y-3 text-base text-ink">
            <p>
              <a className="transition-colors duration-200 hover:text-electric" href={`mailto:${CONTACT_DETAILS.email}`}>
                {CONTACT_DETAILS.email}
              </a>
            </p>
            <p>
              <a className="transition-colors duration-200 hover:text-electric" href={`tel:${CONTACT_DETAILS.phone.replace(/\s+/g, "")}`}>
                {CONTACT_DETAILS.phone}
              </a>
            </p>
          </div>

          {/* Later vervangen door echte fotografie. */}
          <div className="relative mt-8 overflow-hidden rounded-[24px] border border-line bg-paper p-3 shadow-soft">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
              <Image
                src={CLIPBOARD_IMAGE.src}
                alt={CLIPBOARD_IMAGE.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <Card className="p-6 sm:p-8">
          <form className="space-y-5" onSubmit={onSubmit} noValidate>
            <Input
              id="naam"
              label="Naam"
              value={form.naam}
              onChange={(event) => updateField("naam", event.target.value)}
              error={errors.naam}
              autoComplete="name"
            />

            <Input
              id="bedrijfsnaam"
              label="Bedrijfsnaam"
              value={form.bedrijfsnaam}
              onChange={(event) => updateField("bedrijfsnaam", event.target.value)}
              error={errors.bedrijfsnaam}
              autoComplete="organization"
            />

            <Input
              id="email"
              label="E-mail"
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              id="telefoon"
              label="Telefoon (optioneel)"
              type="tel"
              value={form.telefoon}
              onChange={(event) => updateField("telefoon", event.target.value)}
              autoComplete="tel"
            />

            <Input
              id="aanschafprijs-bus"
              label="Aanschafprijs bus"
              value={form.aanschafprijsBus}
              onChange={(event) => updateField("aanschafprijsBus", event.target.value)}
            />

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink">Bericht</span>
              <textarea
                id="bericht"
                value={form.bericht}
                onChange={(event) => updateField("bericht", event.target.value)}
                className={[fieldClassName, "min-h-32 py-3"].join(" ")}
              />
            </label>

            <Button type="submit" size="lg">
              Aanvraag verzenden
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
