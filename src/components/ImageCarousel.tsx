"use client";

import * as React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  appName: string;
}

export function ImageCarousel({ images, appName }: ImageCarouselProps): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance to trigger navigation (in pixels)
  const minSwipeDistance = 50;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Handle touch events for swipe
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  }, [touchStart, touchEnd, goToNext, goToPrevious]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("keydown", handleKeyDown);
      return () => container.removeEventListener("keydown", handleKeyDown);
    }
  }, [goToNext, goToPrevious]);

  if (images.length === 0) return <></>;

  return (
    <div
      ref={containerRef}
      className="relative group"
      tabIndex={0}
      role="region"
      aria-label={`${appName} screenshot gallery`}
      aria-roledescription="carousel"
    >
      {/* Main Image Container */}
      <div
        className="relative aspect-video overflow-hidden rounded-2xl bg-slate-800 shadow-lg"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Images */}
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((url, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 w-full h-full"
              role="group"
              aria-roledescription="slide"
              aria-label={`Screenshot ${index + 1} of ${images.length}`}
            >
              <Image
                src={url}
                alt={`${appName} screenshot ${index + 1}`}
                fill
                className="object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(max-width: 1024px) 100vw, 66vw"
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows - Only show if more than 1 image */}
        {images.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 text-white opacity-0 transition-all duration-200 hover:bg-slate-900 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 text-white opacity-0 transition-all duration-200 hover:bg-slate-900 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Next screenshot"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Image Counter Badge */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-white">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Dot Indicators - Only show if more than 1 image */}
      {images.length > 1 && (
        <div
          className="mt-4 flex justify-center gap-2"
          role="tablist"
          aria-label="Screenshot navigation"
        >
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`h-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                currentIndex === index
                  ? "w-6 bg-brand-500"
                  : "w-2 bg-slate-600 hover:bg-slate-500"
              }`}
              role="tab"
              aria-selected={currentIndex === index}
              aria-label={`Go to screenshot ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
