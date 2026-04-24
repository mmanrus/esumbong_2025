"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload } from "lucide-react";
import dynamic from "next/dynamic";
import type ReactQuillType from "react-quill-new";
import ImageCarousel from "./ImageCarousel";

// Dynamic import without SSR — ref is handled via a cast below
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[500px] flex items-center justify-center text-stone-400 text-sm">
      Loading editor…
    </div>
  ),
}) as unknown as React.ForwardRefExoticComponent<
  React.ComponentProps<typeof ReactQuillType> & {
    ref?: React.Ref<ReactQuillType>;
  }
>;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImageBlock {
  id: string;
  url: string;
  file?: File;
  uploading?: boolean;
}

export interface ContentBlock {
  id: string;
  type: "text" | "images";
  content?: string;
  images?: ImageBlock[];
}

interface RichTextEditorProps {
  initialContent?: ContentBlock[];
  onChange?: (content: ContentBlock[]) => void;
  onUpload?: (files: File[]) => Promise<string[]>;
}

// ─── Quill config ─────────────────────────────────────────────────────────────

const FONT_LIST = [
  "lora",
  "playfair",
  "georgia",
  "merriweather",
  "opensans",
  "roboto",
  "montserrat",
  "courier",
];

// Register custom fonts with Quill
if (typeof window !== "undefined") {
  // Dynamically register fonts after Quill loads
  import("react-quill-new").then((mod) => {
    const Quill = (mod as any).default?.Quill || (mod as any).Quill;
    if (Quill) {
      const Font = Quill.import("formats/font");
      Font.whitelist = FONT_LIST;
      Quill.register(Font, true);
    }
  });
}

const QUILL_MODULES = {
  toolbar: {
    container: [
      [{ font: FONT_LIST }],
      ["bold", "italic"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "bullet" }, { list: "ordered" }],
      ["link"],
      ["image"],
    ],
  },
};

const QUILL_FORMATS = [
  "font",
  "bold",
  "italic",
  "header",
  "list",
  "link",
  "image",
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function RichTextEditor({
  initialContent = [],
  onChange,
}: RichTextEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(() =>
    initialContent.length > 0
      ? initialContent
      : [{ id: "1", type: "text", content: "" }],
  );

  const [activeTextBlockId, setActiveTextBlockId] = useState<string>("1");
  const [carouselImages, setCarouselImages] = useState<ImageBlock[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const blocksRef = useRef(blocks);

  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  const updateBlocks = useCallback(
    (newBlocks: ContentBlock[]) => {
      setBlocks(newBlocks);
      onChange?.(newBlocks);
    },
    [onChange],
  );

  const handleTextChange = useCallback(
    (blockId: string, html: string) => {
      const updated = blocksRef.current.map((b) =>
        b.id === blockId ? { ...b, content: html } : b,
      );
      blocksRef.current = updated;
      setBlocks(updated);
      onChange?.(updated);
    },
    [onChange],
  );

  // ── Image upload ──────────────────────────────────────────────────────────
  // FIX: Accept FileList properly and allow multiple files

  const handleImageUpload = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files); // works for both FileList and File[]
      if (fileArray.length === 0) return;

      const currentBlocks = blocksRef.current;
      const currentIndex = currentBlocks.findIndex(
        (b) => b.id === activeTextBlockId,
      );

      const tempImages: ImageBlock[] = fileArray.map((file, idx) => ({
        id: `temp-${Date.now()}-${idx}`,
        url: URL.createObjectURL(file),
        file,
        uploading: true,
      }));

      const imageBlock: ContentBlock = {
        id: `img-${Date.now()}`,
        type: "images",
        images: tempImages,
      };

      const newTextBlock: ContentBlock = {
        id: `text-${Date.now()}`,
        type: "text",
        content: "",
      };

      const newBlocks: ContentBlock[] = [
        ...currentBlocks.slice(0, currentIndex + 1),
        imageBlock,
        newTextBlock,
        ...currentBlocks.slice(currentIndex + 1),
      ];

      updateBlocks(newBlocks);
      setActiveTextBlockId(newTextBlock.id);

      // ← ADD THIS BACK — just mark uploading: false, no actual upload
      const finish = (imgs: ImageBlock[]) =>
        updateBlocks(
          blocksRef.current.map((b) =>
            b.id === imageBlock.id ? { ...b, images: imgs } : b,
          ),
        );

      finish(tempImages.map((i) => ({ ...i, uploading: false })));
    },
    [activeTextBlockId, updateBlocks],
  );

  const removeImage = useCallback(
    (blockId: string, imageId: string) => {
      updateBlocks(
        blocksRef.current
          .map((block) => {
            if (block.id !== blockId || !block.images) return block;
            const imgs = block.images.filter((i) => i.id !== imageId);
            return imgs.length === 0 ? null : { ...block, images: imgs };
          })
          .filter(Boolean) as ContentBlock[],
      );
    },
    [updateBlocks],
  );

  const openCarousel = (images: ImageBlock[], index: number) => {
    setCarouselImages(images);
    setCarouselIndex(index);
    setIsCarouselOpen(true);
  };

  return (
    <>
      <style>{`
        /* ── Google Fonts ── */
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@400;700&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Open+Sans:wght@400;700&family=Roboto:wght@400;700&family=Montserrat:wght@400;700&display=swap');

        /* ── Quill font classes ── */
        .ql-font-lora         { font-family: 'Lora', serif; }
        .ql-font-playfair     { font-family: 'Playfair Display', serif; }
        .ql-font-georgia      { font-family: Georgia, serif; }
        .ql-font-merriweather { font-family: 'Merriweather', serif; }
        .ql-font-opensans     { font-family: 'Open Sans', sans-serif; }
        .ql-font-roboto       { font-family: 'Roboto', sans-serif; }
        .ql-font-montserrat   { font-family: 'Montserrat', sans-serif; }
        .ql-font-courier      { font-family: 'Courier New', monospace; }

        /* ── Quill font picker labels ── */
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="lora"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="lora"]::before         { content: 'Lora'; font-family: 'Lora', serif; }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="playfair"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="playfair"]::before     { content: 'Playfair'; font-family: 'Playfair Display', serif; }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="georgia"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before      { content: 'Georgia'; font-family: Georgia, serif; }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="merriweather"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="merriweather"]::before { content: 'Merriweather'; font-family: 'Merriweather', serif; }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="opensans"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="opensans"]::before     { content: 'Open Sans'; font-family: 'Open Sans', sans-serif; }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="roboto"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="roboto"]::before       { content: 'Roboto'; font-family: 'Roboto', sans-serif; }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="montserrat"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="montserrat"]::before   { content: 'Montserrat'; font-family: 'Montserrat', sans-serif; }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="courier"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="courier"]::before      { content: 'Courier'; font-family: 'Courier New', monospace; }

        /* Default (no value = inherit) */
        .ql-snow .ql-picker.ql-font .ql-picker-label:not([data-value])::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item:not([data-value])::before          { content: 'Default'; }

        /* ── Toolbar ── */
        .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #e7e5e4;
          padding: 10px 12px;
          border-radius: 0.75rem 0.75rem 0 0;
          background: white;
          position: sticky;
          top: 0;
          z-index: 10;
          font-family: inherit;
          flex-wrap: wrap;
        }
        .ql-container.ql-snow {
          border: none;
          font-size: 1.125rem;
          font-family: 'Lora', serif;
        }
        .ql-editor {
          padding: 1.5rem;
          min-height: 120px;
          color: #1c1917;
          line-height: 1.75;
        }
        /* Subsequent blocks (after images) should be compact */
        .ql-editor-compact .ql-editor {
          min-height: 60px !important;
        }
        .ql-editor.ql-blank::before {
          color: #a8a29e;
          font-style: normal;
          font-family: 'Lora', serif;
          font-size: 1.125rem;
          left: 1.5rem;
        }

        /* Font picker width */
        .ql-snow .ql-picker.ql-font { width: 120px; }

        /* Toolbar active states */
        .ql-toolbar .ql-bold.ql-active .ql-stroke,
        .ql-toolbar .ql-italic.ql-active .ql-stroke,
        .ql-toolbar .ql-link.ql-active .ql-stroke { stroke: #4f46e5; }
        .ql-toolbar .ql-bold.ql-active,
        .ql-toolbar .ql-italic.ql-active,
        .ql-toolbar .ql-header.ql-active,
        .ql-toolbar .ql-list.ql-active,
        .ql-toolbar .ql-link.ql-active {
          background: #ede9fe;
          border-radius: 0.375rem;
          color: #4f46e5;
        }
        .ql-toolbar button:hover {
          background: #f5f5f4 !important;
          border-radius: 0.375rem;
          color: #1c1917 !important;
        }
        .ql-toolbar button:hover .ql-stroke { stroke: #1c1917; }
        .ql-toolbar button { padding: 4px 6px; margin: 1px; }
        .ql-toolbar .ql-formats { margin-right: 8px; }

        /* Header picker */
        .ql-snow .ql-picker.ql-header .ql-picker-label::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item::before { content: 'Normal'; }
        .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before { content: 'Heading 1'; }
        .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before { content: 'Heading 2'; }

        /* Content typography */
        .ql-editor h1 { font-size: 1.875rem; font-weight: 700; margin: 1rem 0 0.5rem; line-height: 1.2; }
        .ql-editor h2 { font-size: 1.5rem;   font-weight: 700; margin: 0.75rem 0 0.5rem; line-height: 1.3; }
        .ql-editor ul, .ql-editor ol { padding-left: 1.5rem; margin: 0.5rem 0; }
        .ql-editor a  { color: #4f46e5; }
        .ql-container:focus-within { outline: none; }
      `}</style>

      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {blocks.map((block, index) =>
          block.type === "text" ? (
            <div key={block.id} onFocus={() => setActiveTextBlockId(block.id)}>
              <QuillBlock
                blockId={block.id}
                initialContent={block.content || ""}
                isFirst={index === 0}
                onChange={handleTextChange}
                onImageInsert={() => fileInputRef.current?.click()}
              />
            </div>
          ) : (
            <div key={block.id} className="px-6 py-2">
              <ImageGrid
                images={block.images || []}
                blockId={block.id}
                onRemove={removeImage}
                onImageClick={openCarousel}
              />
            </div>
          ),
        )}

        {/* FIX: multiple attribute ensures OS picker allows multi-select */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleImageUpload(e.target.files);
              e.target.value = ""; // reset so same files can be re-selected
            }
          }}
        />
      </div>

      <ImageCarousel
        images={carouselImages}
        initialIndex={carouselIndex}
        isOpen={isCarouselOpen}
        onClose={() => setIsCarouselOpen(false)}
      />
    </>
  );
}

// ─── QuillBlock ───────────────────────────────────────────────────────────────

interface QuillBlockProps {
  blockId: string;
  initialContent: string;
  isFirst: boolean;
  onChange: (blockId: string, html: string) => void;
  onImageInsert: () => void;
}

function QuillBlock({
  blockId,
  initialContent,
  isFirst,
  onChange,
  onImageInsert,
}: QuillBlockProps) {
  const quillRef = useRef<ReactQuillType>(null);

  useEffect(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;
    const toolbar = editor.getModule("toolbar");
    if (toolbar) {
      (toolbar as any).addHandler("image", onImageInsert);
    }
  }, [onImageInsert]);

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      defaultValue={initialContent}
      onChange={(html) => onChange(blockId, html)}
      modules={isFirst ? QUILL_MODULES : { toolbar: false }}
      formats={QUILL_FORMATS}
      placeholder={
        isFirst ? "Start writing your announcement…" : "Continue writing…"
      }
    />
  );
}

// ─── ImageGrid ────────────────────────────────────────────────────────────────
// FIX: corrected overlay logic — overlay goes on index 2 (3rd image), not index 1

function ImageGrid({
  images,
  blockId,
  onRemove,
  onImageClick,
}: {
  images: ImageBlock[];
  blockId: string;
  onRemove: (blockId: string, imageId: string) => void;
  onImageClick: (images: ImageBlock[], index: number) => void;
}) {
  const count = images.length;
  const gridCols = count === 1 ? "grid-cols-1" : "grid-cols-2";

  const imgClass = (i: number): string => {
    if (count === 1) return "col-span-1 aspect-[14/6]";
    if (count === 2) return "col-span-1 aspect-[6/3]";
    if (count === 3)
      return i === 0
        ? "col-span-1 row-span-2 aspect-[3/3.02]"
        : "col-span-1 aspect-[6/3]";
    if (count === 4) return "col-span-1 aspect-[6/3]";
    // 5+: left col = first image (tall), right col = images 1,2 (+ overlay on 2)
    if (count >= 5) {
      if (i === 0) return "col-span-1 row-span-2 aspect-[3/3.02]";

      if (i === 1) return "col-span-1 aspect-[6/3]";

      if (i === 2) return "col-span-1 aspect-[6/3]";
      return "hidden"; // 3+ hidden, shown in carousel
    }
    return "";
  };

  // For 5+ images, show overlay on the 3rd visible image (index 2)
  const showOverlay = (i: number) => count >= 5 && i === 2;
  const extraCount = count - 3; // how many are hidden

  return (
    <div className={`grid ${gridCols} gap-0.5 rounded-lg overflow-hidden my-2`}>
      <AnimatePresence>
        {images.map((image, i) => {
          const cls = imgClass(i);
          if (cls === "hidden") return null;
          return (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`relative group ${cls} bg-stone-100 overflow-hidden cursor-pointer`}
              onClick={() => !image.uploading && onImageClick(images, i)}
            >
              <img
                src={image.url}
                alt={`Image ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {image.uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Upload className="animate-pulse text-white" size={24} />
                </div>
              )}
              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(blockId, image.id);
                }}
                className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X size={16} />
              </button>
              {/* "+N more" overlay on the 3rd image when 5+ total */}
              {showOverlay(i) && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px] pointer-events-none">
                  <span className="text-white text-3xl font-bold">
                    +{extraCount} more
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
