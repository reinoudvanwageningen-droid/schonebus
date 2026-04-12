import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body?.naam || !body?.bedrijfsnaam || !body?.email) {
    return NextResponse.json(
      { ok: false, message: "Verplichte velden ontbreken." },
      { status: 400 },
    );
  }

  console.log("Contactaanvraag ontvangen", body);

  return NextResponse.json({ ok: true });
}
