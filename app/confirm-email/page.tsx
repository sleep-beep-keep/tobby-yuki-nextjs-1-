import Link from "next/link";
import ConfirmEmailButton from "@/components/ConfirmEmailButton";

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getConfirmationUrl(searchParams: SearchParams) {
  const confirmationUrl = firstValue(searchParams.confirmation_url);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!confirmationUrl || !supabaseUrl) return null;

  try {
    const url = new URL(confirmationUrl);
    const expectedOrigin = new URL(supabaseUrl).origin;

    if (url.origin !== expectedOrigin || url.pathname !== "/auth/v1/verify") return null;

    // Support email clients that parse the nested query string into outer parameters.
    const type = firstValue(searchParams.type);
    const redirectTo = firstValue(searchParams.redirect_to);
    if (!url.searchParams.get("type") && type) url.searchParams.set("type", type);
    if (!url.searchParams.get("redirect_to") && redirectTo) url.searchParams.set("redirect_to", redirectTo);

    return url.toString();
  } catch {
    return null;
  }
}

export default async function ConfirmEmailPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const confirmationUrl = getConfirmationUrl(await searchParams);

  return <main className="mx-auto flex min-h-[65vh] max-w-md items-center px-4 py-12"><section className="w-full rounded-3xl border border-black/5 bg-white p-7 text-center shadow-soft md:p-9"><p className="text-xs font-semibold uppercase tracking-[.25em] text-mocha">Tobby &amp; Yuki</p><h1 className="mt-3 font-display text-4xl text-cocoa">Confirm your email</h1>{confirmationUrl ? <><p className="mt-4 leading-7 text-gray-600">Click the button below to verify your email address and finish setting up your account.</p><div className="mt-7"><ConfirmEmailButton confirmationUrl={confirmationUrl} /></div></> : <><p className="mt-4 leading-7 text-gray-600">This confirmation link is incomplete or invalid. Please request a new confirmation email.</p><Link href="/account" className="mt-7 inline-block rounded-full bg-cocoa px-6 py-3.5 text-sm font-bold text-white transition hover:bg-mocha">Go to sign in</Link></>}</section></main>;
}
