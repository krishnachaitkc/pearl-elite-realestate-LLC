"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

interface Image {
  url: string;
  altText?: string | null;
}

interface PropertyGalleryProps {
  images: Image[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const allImages = images.length > 0
    ? images
    : [{ url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80", altText: title }];

  const prev = () => setActiveIndex((i) => (i === 0 ? allImages.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === allImages.length - 1 ? 0 : i + 1));

  return (
    <>
      <div className="bg-[var(--color-charcoal-800)] rounded-2xl overflow-hidden shadow-sm">
        {/* Main image */}
        <div className="relative aspect-[16/9] bg-[var(--color-charcoal-100)] group">
          <img
            src={allImages[activeIndex].url}
            alt={allImages[activeIndex].altText || title}
            className="w-full h-full object-cover"
          />

          {/* Navigation arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Counter & zoom */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            {allImages.length > 1 && (
              <span className="bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                {activeIndex + 1} / {allImages.length}
              </span>
            )}
            <button
              onClick={() => setLightboxOpen(true)}
              className="bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 transition-colors"
            >
              <ZoomIn size={14} />
            </button>
          </div>
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all ${
                  i === activeIndex
                    ? "ring-2 ring-[var(--color-brand-500)] opacity-100"
                    : "opacity-60 hover:opacity-80"
                }`}
              >
                <img src={img.url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={() => setLightboxOpen(false)}
          >
            <X size={28} />
          </button>

          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={allImages[activeIndex].url}
              alt={allImages[activeIndex].altText || title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--color-charcoal-800)]/20 text-white flex items-center justify-center hover:bg-[var(--color-charcoal-800)]/30"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--color-charcoal-800)]/20 text-white flex items-center justify-center hover:bg-[var(--color-charcoal-800)]/30"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="text-center text-white/60 text-sm mt-3">
                  {activeIndex + 1} of {allImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
