"use client";

export default function ConfirmEmailButton({ confirmationUrl }: { confirmationUrl: string }) {
  return <button type="button" onClick={() => window.location.assign(confirmationUrl)} className="w-full rounded-full bg-cocoa px-6 py-3.5 text-sm font-bold text-white transition hover:bg-mocha">Confirm email address</button>;
}
