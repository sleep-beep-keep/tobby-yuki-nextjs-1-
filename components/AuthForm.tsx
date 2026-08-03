"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/account` } });
      setMessage(error ? error.message : "Check your email to confirm your account, then sign in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else {
        router.replace("/account");
        router.refresh();
      }
    }

    setSubmitting(false);
  }

  return <section className="mx-auto max-w-md rounded-3xl border border-black/5 bg-white p-6 shadow-soft md:p-8">
    <div className="flex rounded-full bg-ivory p-1 text-sm font-semibold"><button type="button" onClick={() => setMode("signin")} className={`flex-1 rounded-full px-4 py-2 ${mode === "signin" ? "bg-white text-cocoa shadow-sm" : "text-gray-500"}`}>Sign in</button><button type="button" onClick={() => setMode("signup")} className={`flex-1 rounded-full px-4 py-2 ${mode === "signup" ? "bg-white text-cocoa shadow-sm" : "text-gray-500"}`}>Create account</button></div>
    <h1 className="mt-7 font-display text-4xl text-cocoa">{mode === "signin" ? "Welcome back" : "Create your account"}</h1><p className="mt-2 text-sm leading-6 text-gray-600">{mode === "signin" ? "Sign in to view your orders and saved addresses." : "Save your details for a smoother checkout."}</p>
    <form onSubmit={submit} className="mt-7 space-y-4">
      {mode === "signup" && <label className="block text-sm font-medium text-ink">Full name<input required value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-mocha" /></label>}
      <label className="block text-sm font-medium text-ink">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-mocha" /></label>
      <label className="block text-sm font-medium text-ink">Password<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-mocha" /></label>
      {message && <p className="rounded-xl bg-ivory px-4 py-3 text-sm text-cocoa" role="status">{message}</p>}
      <button disabled={submitting} className="w-full rounded-full bg-cocoa py-3.5 text-sm font-bold text-white transition hover:bg-mocha disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</button>
    </form>
  </section>;
}
