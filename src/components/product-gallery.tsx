"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  video,
  name,
}: {
  images: string[];
  video: string | null;
  name: string;
}) {
  const slides: { type: "image" | "video"; src: string }[] = [
    ...images.map((src) => ({ type: "image" as const, src })),
    ...(video ? [{ type: "video" as const, src: video }] : []),
  ];
  const [active, setActive] = useState(0);
  const current = slides[active];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-muted">
        {!current ? (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/20 to-accent/20 text-6xl font-black text-primary/50">
            {name[0]}
          </div>
        ) : current.type === "video" ? (
          <video
            key={current.src}
            src={current.src}
            controls
            className="h-full w-full object-cover"
          />
        ) : (
          <motion.img
            key={current.src}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src={current.src}
            alt={name}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {slides.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                active === i
                  ? "border-primary"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              {s.type === "video" ? (
                <span className="grid h-full w-full place-items-center bg-black/70 text-white">
                  <Play className="h-6 w-6" />
                </span>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.src} alt="" className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
