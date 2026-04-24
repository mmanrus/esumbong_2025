"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import ImageCarousel from "./ImageCarousel";

interface ImageBlock {
  id: string;
  url: string;
}

interface ContentBlock {
  id: string;
  type: "text" | "images";
  content?: string;
  images?: ImageBlock[];
}

interface RichTextViewerProps {
  content: ContentBlock[];
}

export default function RichTextViewer({ content }: RichTextViewerProps) {
  const [carouselImages, setCarouselImages] = useState<ImageBlock[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);

  const openCarousel = (images: ImageBlock[], index: number) => {
    setCarouselImages(images);
    setCarouselIndex(index);
    setIsCarouselOpen(true);
  };

  // Guard against undefined or invalid content
  if (!content || !Array.isArray(content) || content.length === 0) {
    return (
      <article className="w-full max-w-4xl mx-auto px-4 py-8">
        <p className="text-stone-500">No content available.</p>
      </article>
    );
  }

  return (
    <>
      {/*
        These styles mirror what Quill's Snow theme renders so that the viewer
        looks identical to the editor output.  We scope them under .ql-viewer
        so they don't bleed into the rest of the app.
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@400;700&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Open+Sans:wght@400;700&family=Roboto:wght@400;700&family=Montserrat:wght@400;700&display=swap');

        /* Match Quill font classes */
        .ql-viewer .ql-font-lora         { font-family: 'Lora', serif; }
        .ql-viewer .ql-font-playfair     { font-family: 'Playfair Display', serif; }
        .ql-viewer .ql-font-georgia      { font-family: Georgia, serif; }
        .ql-viewer .ql-font-merriweather { font-family: 'Merriweather', serif; }
        .ql-viewer .ql-font-opensans     { font-family: 'Open Sans', sans-serif; }
        .ql-viewer .ql-font-roboto       { font-family: 'Roboto', sans-serif; }
        .ql-viewer .ql-font-montserrat   { font-family: 'Montserrat', sans-serif; }
        .ql-viewer .ql-font-courier      { font-family: 'Courier New', monospace; }

        /* Base prose */
        .ql-viewer { font-family: 'Lora', serif; color: #1c1917; line-height: 1.75; font-size: 1.125rem; }

        /* Quill heading tags */
        .ql-viewer h1 { font-size: 1.875rem; font-weight: 700; margin: 1.25rem 0 0.5rem; line-height: 1.2; font-family: 'Playfair Display', serif; }
        .ql-viewer h2 { font-size: 1.5rem;   font-weight: 700; margin: 1rem 0 0.5rem;   line-height: 1.3; font-family: 'Playfair Display', serif; }

        /* Paragraphs */
        .ql-viewer p  { margin-bottom: 1rem; }
        .ql-viewer p:last-child { margin-bottom: 0; }

        /* Lists */
        .ql-viewer ul { list-style: disc;    padding-left: 1.75rem; margin: 0.5rem 0; }
        .ql-viewer ol { list-style: decimal; padding-left: 1.75rem; margin: 0.5rem 0; }
        .ql-viewer li { margin-bottom: 0.25rem; }

        /* Inline */
        .ql-viewer strong { font-weight: 700; color: #0c0a09; }
        .ql-viewer em     { font-style: italic; }
        .ql-viewer a      { color: #4f46e5; text-decoration: underline; }
        .ql-viewer a:hover { color: #3730a3; }
      `}</style>

      <article className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {content.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              {block.type === "text" ? (
                <div
                  className="ql-viewer"
                  dangerouslySetInnerHTML={{ __html: block.content || "" }}
                />
              ) : (
                <ImageGrid
                  images={block.images || []}
                  onImageClick={openCarousel}
                />
              )}
            </motion.div>
          ))}
        </div>
      </article>

      <ImageCarousel
        images={carouselImages}
        initialIndex={carouselIndex}
        isOpen={isCarouselOpen}
        onClose={() => setIsCarouselOpen(false)}
      />
    </>
  );
}

// ─── ImageGrid (viewer) ───────────────────────────────────────────────────────

function ImageGrid({
  images,
  onImageClick,
}: {
  images: ImageBlock[];
  onImageClick: (images: ImageBlock[], index: number) => void;
}) {
  const count = images.length;

  const getGridCols = () => (count === 1 ? "grid-cols-1" : "grid-cols-2");

  const getImageClass = (i: number) => {
    if (count === 1) return "col-span-1 aspect-[14/6]";
    if (count === 2) return "col-span-1 aspect-[6/3]";
    if (count === 3)
      return i === 0 ? "col-span-1 row-span-2 aspect-[3/3.02]" : "col-span-1 aspect-[6/3]";
    if (count === 4) return "col-span-1 aspect-[6/3]";
    if (count >= 5) {
      if (i === 0) return "col-span-1 row-span-2 aspect-[3/3.02]";
      if (i === 1) return "col-span-1 aspect-[6/3]";
      if (i === 2) return "col-span-1 aspect-[6/3]";
      return "hidden";
    }
    return "";
  };

  const showOverlay = (i: number) => count >= 5 && i === 2;

  return (
    <div className={`grid ${getGridCols()} gap-1 rounded-xl overflow-hidden my-6`}>
      {images.map((image, i) => {
        const cls = getImageClass(i);
        if (cls === "hidden") return null;

        return (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`relative ${cls} bg-stone-100 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer`}
            onClick={() => onImageClick(images, i)}
          >
            <img
              src={image.url}
              alt={`Image ${i + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            {showOverlay(i) && (
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50 flex items-center justify-center backdrop-blur-sm">
                <span
                  className="text-white text-3xl font-bold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  +{count - 3} more
                </span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}