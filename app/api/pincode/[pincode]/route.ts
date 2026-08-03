import { NextResponse } from "next/server";

type IndiaPostResponse = Array<{
  Status?: string;
  PostOffice?: Array<{ District?: string; State?: string; Name?: string }> | null;
}>;

export async function GET(_request: Request, { params }: { params: Promise<{ pincode: string }> }) {
  const { pincode } = await params;
  if (!/^\d{6}$/.test(pincode)) return NextResponse.json({ error: "Enter a valid 6-digit PIN code." }, { status: 400 });

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error("PIN lookup unavailable");
    const data = await response.json() as IndiaPostResponse;
    const office = data[0]?.PostOffice?.[0];
    if (!office?.District || !office.State) return NextResponse.json({ error: "We could not find this PIN code." }, { status: 404 });
    return NextResponse.json({ city: office.District, state: office.State, postOffice: office.Name ?? "" });
  } catch {
    return NextResponse.json({ error: "PIN lookup is temporarily unavailable. Enter your city and state manually." }, { status: 503 });
  }
}
