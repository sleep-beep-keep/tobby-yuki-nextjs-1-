import { Clock3, Mail, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[.3em] text-mocha">We&apos;re here to help</p>
        <h1 className="mt-3 font-display text-5xl text-cocoa md:text-6xl">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-gray-600">Questions about an order, a product, or your pet&apos;s perfect fit? We&apos;d love to hear from you.</p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_.7fr]">
        <form action="mailto:hello@tobbyandyuki.com" method="post" encType="text/plain" className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft md:p-8">
          <h2 className="font-display text-3xl text-cocoa">Send us a message</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium text-ink">Name<input required type="text" name="name" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-mocha" placeholder="Your name" /></label>
            <label className="text-sm font-medium text-ink">Email<input required type="email" name="email" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-mocha" placeholder="you@example.com" /></label>
          </div>
          <label className="mt-5 block text-sm font-medium text-ink">How can we help?<textarea required name="message" rows={5} className="mt-2 w-full resize-none rounded-xl border border-black/10 px-4 py-3 outline-none transition focus:border-mocha" placeholder="Tell us a little more..." /></label>
          <button type="submit" className="mt-6 rounded-full bg-cocoa px-6 py-3 text-sm font-semibold text-white transition hover:bg-mocha">Send message</button>
        </form>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-[#f5e9df] p-6"><Mail className="text-mocha" size={22} /><h2 className="mt-4 font-display text-2xl text-cocoa">Email us</h2><a className="mt-2 block text-sm text-cocoa/70 hover:text-cocoa" href="mailto:hello@tobbyandyuki.com">hello@tobbyandyuki.com</a></div>
          <div className="rounded-3xl bg-lilac p-6"><MessageCircle className="text-lavender" size={22} /><h2 className="mt-4 font-display text-2xl text-cocoa">Friendly support</h2><p className="mt-2 text-sm leading-relaxed text-cocoa/70">For the quickest help, include your order number and a few details about your question.</p></div>
          <div className="rounded-3xl bg-ivory p-6"><Clock3 className="text-mocha" size={22} /><h2 className="mt-4 font-display text-2xl text-cocoa">Response time</h2><p className="mt-2 text-sm leading-relaxed text-cocoa/70">We aim to reply within 1–2 business days.</p></div>
        </aside>
      </div>
    </main>
  );
}
