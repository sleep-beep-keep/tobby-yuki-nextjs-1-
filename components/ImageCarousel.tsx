"use client";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  images: string[];
  alt?: string;
  captions?: string[];
  autoplay?: boolean;
  autoplayInterval?: number;
};

export default function ImageCarousel({
  images,
  alt,
  captions,
  autoplay = true,
  autoplayInterval = 4000,
}: Props) {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!autoplay || !images || images.length <= 1) return;
    const id = setInterval(() => {
      if (!paused.current && mounted.current) {
        setIndex((i) => (i + 1) % images.length);
      }
    }, autoplayInterval);
    return () => clearInterval(id);
  }, [autoplay, autoplayInterval, images]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [images.length]);

  if (!images || images.length === 0) return null;

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="group" onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)} onFocus={() => (paused.current = true)} onBlur={() => (paused.current = false)}>
      <div className="relative overflow-hidden rounded-3xl bg-ivory">
        <img src={images[index]} alt={alt ?? "product image"} className="aspect-square h-full w-full object-cover" />

        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 p-2 shadow opacity-90 group-hover:opacity-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cocoa">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 p-2 shadow opacity-90 group-hover:opacity-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cocoa">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {captions && captions[index] ? (
          <div className="absolute left-0 bottom-0 w-full bg-gradient-to-t from-black/50 to-transparent px-4 py-2 text-sm text-white">
            {captions[index]}
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            onClick={() => setIndex(i)}
            className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border ${i === index ? "ring-2 ring-cocoa" : ""}`}
            aria-label={`Show image ${i + 1}`}
          >
            <img src={src} alt={`thumb-${i}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
