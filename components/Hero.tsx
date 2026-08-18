"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  {
    eyebrow: "Walks, elevated",
    title: "Adventure-ready, beautifully made.",
    description: "Comfort-first essentials that bring a little more joy to every walk.",
    product: "Featured: Batman Edition Harness",
    href: "/product/dog-harness-batman-edition",
    cta: "Shop the harness",
    image: "/products/dog-harness-batman-edition/01.jpg",
    alt: "Dog wearing a harness outdoors",
    accent: "bg-cocoa hover:bg-mocha",
    wash: "from-[#f7eee7] via-[#f7eee7]/90",
  },
  {
    eyebrow: "For the curious ones",
    title: "Small details. Big personalities.",
    description: "Polished everyday pieces made for cats who do everything in their own style.",
    product: "Featured: Bow Collar",
    href: "/product/bow-collar-lavender",
    cta: "Discover cat style",
    image: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1800&q=85",
    alt: "Elegant cat relaxing at home",
    accent: "bg-lavender hover:bg-[#6c5087]",
    wash: "from-[#eee4f2] via-[#eee4f2]/90",
  },
  {
    eyebrow: "Made for everyday joy",
    title: "More comfort for their favourite days.",
    description: "Thoughtfully designed pet essentials that feel as good as they look.",
    product: "Featured: Reflective Leash",
    href: "/product/reflective-leash",
    cta: "Shop walk essentials",
    image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1800&q=85",
    alt: "Happy dog enjoying time outdoors",
    accent: "bg-cocoa hover:bg-mocha",
    wash: "from-[#f7eee7] via-[#f7eee7]/90",
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setActiveSlide((index + slides.length) % slides.length);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-6" aria-roledescription="carousel" aria-label="Featured pet collections">
      <div className="relative min-h-[540px] overflow-hidden rounded-[2rem] bg-[#f7eee7]">
        {slides.map((slide, index) => (
          <article
            key={slide.title}
            aria-hidden={index !== activeSlide}
            className={`absolute inset-0 transition-opacity duration-700 ${index === activeSlide ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <img src={slide.image} alt={slide.alt} className="absolute inset-0 h-full w-full object-cover object-right" />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.wash} to-transparent`} />
            <div className="relative flex min-h-[540px] max-w-xl flex-col justify-center px-8 py-16 md:max-w-2xl md:px-14">
              <p className="text-xs font-semibold uppercase tracking-[.25em] text-mocha">{slide.eyebrow}</p>
              <h1 className="mt-4 font-display text-5xl leading-[.98] text-cocoa md:text-6xl">{slide.title}</h1>
              <p className="mt-6 max-w-md text-lg leading-7 text-ink/75">{slide.description}</p>
              <p className="mt-6 text-sm font-semibold text-cocoa">{slide.product}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={slide.href} tabIndex={index === activeSlide ? 0 : -1} className={`rounded-full px-6 py-3.5 text-sm font-bold text-white transition ${slide.accent}`}>{slide.cta}</Link>
                <Link href={index === 1 ? "/cats" : "/dogs"} tabIndex={index === activeSlide ? 0 : -1} className="rounded-full border border-cocoa/20 bg-white/80 px-6 py-3.5 text-sm font-bold text-cocoa transition hover:bg-white">Explore collection</Link>
              </div>
            </div>
          </article>
        ))}

        <div className="absolute bottom-6 left-8 z-10 flex items-center gap-2 md:left-14">
          {slides.map((slide, index) => (
            <button key={slide.title} onClick={() => goToSlide(index)} aria-label={`Show slide ${index + 1}: ${slide.eyebrow}`} aria-current={index === activeSlide} className={`h-2.5 rounded-full transition-all ${index === activeSlide ? "w-8 bg-cocoa" : "w-2.5 bg-cocoa/30 hover:bg-cocoa/60"}`} />
          ))}
        </div>
        <div className="absolute bottom-5 right-6 z-10 flex gap-2 md:right-8">
          <button onClick={() => goToSlide(activeSlide - 1)} aria-label="Previous slide" className="rounded-full bg-white/85 p-2.5 text-cocoa shadow-sm transition hover:bg-white"><ChevronLeft size={20} /></button>
          <button onClick={() => goToSlide(activeSlide + 1)} aria-label="Next slide" className="rounded-full bg-white/85 p-2.5 text-cocoa shadow-sm transition hover:bg-white"><ChevronRight size={20} /></button>
        </div>
      </div>
    </section>
  );
}
