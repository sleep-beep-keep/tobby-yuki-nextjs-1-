"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ConfirmEmailCodeForm({ initialEmail = "" }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const { error } = await createClient().auth.verifyOtp({ email, token, type: "email" });
    if (error) {
      setMessage(error.message);
      setSubmitting(false);
      return;
    }

    router.replace("/account");
  }

  return <form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-left text-sm font-medium text-ink">Email address<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-mocha" /></label><label className="block text-left text-sm font-medium text-ink">Confirmation code<input required autoComplete="one-time-code" inputMode="numeric" value={token} onChange={(event) => setToken(event.target.value.replace(/\s/g, ""))} placeholder="Enter the code from your email" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-center tracking-[.3em] outline-none focus:border-mocha" /></label>{message && <p className="rounded-xl bg-rose/10 px-4 py-3 text-sm text-rose" role="alert">{message}</p>}<button disabled={submitting || !email || !token} className="w-full rounded-full bg-cocoa px-6 py-3.5 text-sm font-bold text-white transition hover:bg-mocha disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Confirming…" : "Confirm email address"}</button></form>;
}
