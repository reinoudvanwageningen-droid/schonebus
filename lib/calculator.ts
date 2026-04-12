export type Rechtsvorm = "ib" | "vpb";

export interface Input {
  prijs: number;
  rechtsvorm: Rechtsvorm;
  ibSchijf?: "laag" | "midden" | "hoog";
  vpbSchijf?: "laag" | "hoog";
  andereInvesteringen: boolean;
}

// MIA: code E 3101 voor elektrisch aangedreven bestelauto
// Aftrekpercentage 2026 voor categorie III = 27%
const MIA_PERCENTAGE = 0.27;

// Vamil: 75% van de investering mag willekeurig afgeschreven worden.
// Het cashflow-voordeel daarvan modelleren we niet als directe euro.

// KIA tabel 2026. Controleer dit bij een nieuw belastingjaar opnieuw.
function kia(investering: number): number {
  if (investering < 2901) return 0;
  if (investering <= 70602) return investering * 0.28;
  if (investering <= 130744) return 19769;
  if (investering <= 392230) return 19769 - 0.0758 * (investering - 130744);
  return 0;
}

const TARIEF = {
  ib_laag: 0.3697,
  ib_midden: 0.3697,
  ib_hoog: 0.495,
  vpb_laag: 0.19,
  vpb_hoog: 0.258,
} as const;

export function bereken(input: Input) {
  const miaAftrek = input.prijs * MIA_PERCENTAGE;
  const kiaAftrek = input.andereInvesteringen ? 0 : kia(input.prijs);

  let tarief: number = TARIEF.ib_midden;
  if (input.rechtsvorm === "ib") {
    tarief = TARIEF[`ib_${input.ibSchijf ?? "midden"}`];
  } else {
    tarief = TARIEF[`vpb_${input.vpbSchijf ?? "laag"}`];
  }

  const miaVoordeel = miaAftrek * tarief;
  const kiaVoordeel = kiaAftrek * tarief;
  const totaal = miaVoordeel + kiaVoordeel;

  return {
    miaAftrek,
    kiaAftrek,
    miaVoordeel: Math.round(miaVoordeel),
    kiaVoordeel: Math.round(kiaVoordeel),
    totaal: Math.round(totaal),
    tariefGebruikt: tarief,
  };
}

export function formatEuro(value: number) {
  return `€ ${new Intl.NumberFormat("nl-NL").format(Math.round(value))}`;
}
