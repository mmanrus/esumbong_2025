"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload } from "lucide-react";
import dynamic from "next/dynamic";
import type ReactQuillType from "react-quill-new";
import ImageCarousel from "./ImageCarousel";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[120px] flex items-center justify-center text-stone-400 text-sm">
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
const DEFAULT_FONT = "lora";

function getStoredFont(): string {
  if (typeof window === "undefined") return DEFAULT_FONT;
  return localStorage.getItem("editor-font") || DEFAULT_FONT;
}
function saveFont(font: string) {
  localStorage.setItem("editor-font", font);
}

if (typeof window !== "undefined") {
  import("react-quill-new").then((mod) => {
    const Quill = (mod as any).default?.Quill || (mod as any).Quill;
    if (Quill) {
      const Font = Quill.import("formats/font");
      Font.whitelist = FONT_LIST;
      Quill.register(Font, true);
    }
  });
}

// Mutable ref so the toolbar handler can always call the latest callback
// without needing to rebuild the modules object (which would remount Quill)
const imageHandlerRef = { current: () => {} };

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
    // Defined at config time — Quill never falls back to its built-in
    // image embed behavior
    handlers: {
      image: () => imageHandlerRef.current(),
    },
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
      : [{ id: "block-1", type: "text", content: "" }],
  );

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const [activeTextBlockId, setActiveTextBlockId] = useState<string>("block-1");
  const [carouselImages, setCarouselImages] = useState<ImageBlock[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);

  const blocksRef = useRef(blocks);
  const activeTextBlockIdRef = useRef(activeTextBlockId);

  // Separate file inputs: one for new image blocks, one per grid for add-more
  // Using a single input but resetting mode/target before each click
  const fileInputRef = useRef<HTMLInputElement>(null);
  // "add-more" target block id — null means "create new block"
  const uploadTargetRef = useRef<string | null>(null);

  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);
  useEffect(() => {
    activeTextBlockIdRef.current = activeTextBlockId;
  }, [activeTextBlockId]);

  // ── Text change ────────────────────────────────────────────────────────────

  const handleTextChange = useCallback((blockId: string, html: string) => {
    const updated = blocksRef.current.map((b) =>
      b.id === blockId ? { ...b, content: html } : b,
    );
    blocksRef.current = updated;
    setBlocks(updated);
    onChangeRef.current?.(updated);
  }, []);

  // ── Core: process selected files ───────────────────────────────────────────

  const processFiles = useCallback(
    (files: FileList | File[], targetBlockId: string | null) => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;

      const newImages: ImageBlock[] = fileArray.map((file, idx) => ({
        id: `img-${Date.now()}-${idx}`,
        url: URL.createObjectURL(file),
        file,
        uploading: false,
      }));

      if (targetBlockId) {
        // Add to existing image block
        const updated = blocksRef.current.map((b) => {
          if (b.id !== targetBlockId || !b.images) return b;
          return { ...b, images: [...b.images, ...newImages] };
        });
        blocksRef.current = updated;
        setBlocks(updated);
        onChangeRef.current?.(updated);
      } else {
        // Create new image block after the active text block
        const currentBlocks = blocksRef.current;
        const activeId = activeTextBlockIdRef.current;
        const currentIndex = currentBlocks.findIndex((b) => b.id === activeId);
        const insertAt =
          currentIndex === -1 ? currentBlocks.length : currentIndex + 1;

        const imageBlock: ContentBlock = {
          id: `imgblock-${Date.now()}`,
          type: "images",
          images: newImages,
        };
        const newTextBlock: ContentBlock = {
          id: `text-${Date.now()}`,
          type: "text",
          content: "",
        };

        const newBlocks: ContentBlock[] = [
          ...currentBlocks.slice(0, insertAt),
          imageBlock,
          newTextBlock,
          ...currentBlocks.slice(insertAt),
        ];

        blocksRef.current = newBlocks;
        setBlocks(newBlocks);
        setActiveTextBlockId(newTextBlock.id);
        onChangeRef.current?.(newBlocks);
      }
    },
    [],
  );

  // ── Trigger file picker ────────────────────────────────────────────────────
  // targetBlockId = null → new block, string → append to that block

  const openFilePicker = useCallback((targetBlockId: string | null) => {
    const input = fileInputRef.current;
    if (!input) return;

    // Set target before opening picker
    uploadTargetRef.current = targetBlockId;

    // Imperatively ensure multiple is set — some browsers reset it
    input.multiple = true;
    input.value = ""; // reset so same files can be re-selected
    input.click();
  }, []);

  // Quill toolbar image button → new block
  const triggerNewImageBlock = useCallback(() => {
    openFilePicker(null);
  }, [openFilePicker]);

  const removeImage = useCallback((blockId: string, imageId: string) => {
    const next = blocksRef.current
      .map((block) => {
        if (block.id !== blockId || !block.images) return block;
        const imgs = block.images.filter((i) => i.id !== imageId);
        return imgs.length === 0 ? null : { ...block, images: imgs };
      })
      .filter(Boolean) as ContentBlock[];
    blocksRef.current = next;
    setBlocks(next);
    onChangeRef.current?.(next);
  }, []);

  const openCarousel = useCallback((images: ImageBlock[], index: number) => {
    setCarouselImages(images);
    setCarouselIndex(index);
    setIsCarouselOpen(true);
  }, []);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@400;700&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Open+Sans:wght@400;700&family=Roboto:wght@400;700&family=Montserrat:wght@400;700&display=swap');

        .ql-font-lora         { font-family: 'Lora', serif; }
        .ql-font-playfair     { font-family: 'Playfair Display', serif; }
        .ql-font-georgia      { font-family: Georgia, serif; }
        .ql-font-merriweather { font-family: 'Merriweather', serif; }
        .ql-font-opensans     { font-family: 'Open Sans', sans-serif; }
        .ql-font-roboto       { font-family: 'Roboto', sans-serif; }
        .ql-font-montserrat   { font-family: 'Montserrat', sans-serif; }
        .ql-font-courier      { font-family: 'Courier New', monospace; }

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
        .ql-snow .ql-picker.ql-font .ql-picker-label:not([data-value])::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item:not([data-value])::before          { content: 'Lora'; font-family: 'Lora', serif; }

        .ql-toolbar.ql-snow {
          border: none; border-bottom: 1px solid #e7e5e4;
          padding: 10px 12px; border-radius: 0.75rem 0.75rem 0 0;
          background: white; position: sticky; top: 0; z-index: 10;
          font-family: inherit; flex-wrap: wrap;
        }
        .ql-container.ql-snow { border: none; font-size: 1.125rem; font-family: 'Lora', serif; }
        .ql-editor { padding: 1.5rem; min-height: 120px; color: #1c1917; line-height: 1.75; }
        .ql-editor.ql-blank::before {
          color: #a8a29e; font-style: normal; font-family: 'Lora', serif;
          font-size: 1.125rem; left: 1.5rem;
        }
        .ql-snow .ql-picker.ql-font { width: 120px; }
        .ql-toolbar .ql-bold.ql-active .ql-stroke,
        .ql-toolbar .ql-italic.ql-active .ql-stroke,
        .ql-toolbar .ql-link.ql-active .ql-stroke { stroke: #4f46e5; }
        .ql-toolbar .ql-bold.ql-active, .ql-toolbar .ql-italic.ql-active,
        .ql-toolbar .ql-header.ql-active, .ql-toolbar .ql-list.ql-active,
        .ql-toolbar .ql-link.ql-active { background: #ede9fe; border-radius: 0.375rem; color: #4f46e5; }
        .ql-toolbar button:hover { background: #f5f5f4 !important; border-radius: 0.375rem; color: #1c1917 !important; }
        .ql-toolbar button:hover .ql-stroke { stroke: #1c1917; }
        .ql-toolbar button { padding: 4px 6px; margin: 1px; }
        .ql-toolbar .ql-formats { margin-right: 8px; }
        .ql-snow .ql-picker.ql-header .ql-picker-label::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item::before { content: 'Normal'; }
        .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before { content: 'Heading 1'; }
        .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before { content: 'Heading 2'; }
        .ql-editor h1 { font-size: 1.875rem; font-weight: 700; margin: 1rem 0 0.5rem; line-height: 1.2; }
        .ql-editor h2 { font-size: 1.5rem; font-weight: 700; margin: 0.75rem 0 0.5rem; line-height: 1.3; }
        .ql-editor ul, .ql-editor ol { padding-left: 1.5rem; margin: 0.5rem 0; }
        .ql-editor a { color: #4f46e5; }
        .ql-container:focus-within { outline: none; }
      `}</style>

      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-stone-200">
        {blocks.map((block, index) =>
          block.type === "text" ? (
            <div key={block.id} onFocus={() => setActiveTextBlockId(block.id)}>
              <QuillBlock
                blockId={block.id}
                initialContent={block.content || ""}
                isFirst={index === 0}
                onChange={handleTextChange}
                onImageInsert={triggerNewImageBlock}
              />
            </div>
          ) : (
            <div key={block.id} className="px-6 pt-2 pb-4">
              <ImageGrid
                images={block.images || []}
                blockId={block.id}
                onRemove={removeImage}
                onImageClick={openCarousel}
                onAddMore={(blockId) => openFilePicker(blockId)}
              />
            </div>
          ),
        )}

        {/*
          ONE global hidden input.
          - multiple is set imperatively in openFilePicker() before every click
          - uploadTargetRef tells onChange which block to target (null = new block)
        */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (!e.target.files?.length) return;
            processFiles(e.target.files, uploadTargetRef.current);
            // Reset so the same file can be picked again next time
            e.target.value = "";
            uploadTargetRef.current = null;
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

const QuillBlock = React.memo(
  function QuillBlock({
    blockId,
    initialContent,
    isFirst,
    onChange,
    onImageInsert,
  }: QuillBlockProps) {
    const quillRef = useRef<ReactQuillType>(null);
    const onChangeRef = useRef(onChange);
    const onImageInsertRef = useRef(onImageInsert);
    const blockIdRef = useRef(blockId);
    const hasInitialized = useRef(false);

    useEffect(() => {
      onChangeRef.current = onChange;
    });
    useEffect(() => {
      onImageInsertRef.current = onImageInsert;
    });
    useEffect(() => {
      blockIdRef.current = blockId;
    });

    useEffect(() => {
      // Prevent double initialization
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      // Wire the module-level ref so QUILL_MODULES handlers.image always
      // calls the latest callback — no addHandler race condition
      if (isFirst) {
        imageHandlerRef.current = () => onImageInsertRef.current();
      }

      const editor = quillRef.current?.getEditor();
      if (!editor) return;

      if (isFirst) {
        // Apply font without triggering selection change (which can steal focus)
        const currentSelection = editor.getSelection();
        editor.format("font", getStoredFont());

        // Restore selection to prevent focus steal, or remove selection entirely
        if (currentSelection) {
          editor.setSelection(currentSelection);
        } else {
          editor.blur(); // Remove focus from editor
        }

        editor.on("selection-change", () => {
          const fmt = editor.getFormat();
          if (fmt.font && fmt.font !== getStoredFont())
            saveFont(fmt.font as string);
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = useCallback((html: string) => {
      onChangeRef.current(blockIdRef.current, html);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <ReactQuill
        ref={quillRef}
        theme="snow"
        defaultValue={initialContent}
        onChange={handleChange}
        modules={isFirst ? QUILL_MODULES : { toolbar: false }}
        formats={QUILL_FORMATS}
        placeholder={
          isFirst ? "Start writing your announcement…" : "Continue writing…"
        }
      />
    );
  },
  () => true,
);

// ─── ImageGrid ────────────────────────────────────────────────────────────────

function ImageGrid({
  images,
  blockId,
  onRemove,
  onImageClick,
  onAddMore,
}: {
  images: ImageBlock[];
  blockId: string;
  onRemove: (blockId: string, imageId: string) => void;
  onImageClick: (images: ImageBlock[], index: number) => void;
  onAddMore: (blockId: string) => void;
}) {
  const count = images.length;
  const gridCols = count === 1 ? "grid-cols-1" : "grid-cols-2";

  const imgClass = (i: number): string => {
    if (count === 1) return "col-span-1 aspect-[12/6]";
    if (count === 2) return "col-span-1 aspect-[6/3]";
    if (count === 3)
      return i === 0
        ? "col-span-1 row-span-2 aspect-[3/3.02]"
        : "col-span-1 aspect-[6/3]";
    if (count === 4) return "col-span-1 aspect-[6/3]";
    if (count >= 5) {
      if (i === 0) return "col-span-1 row-span-2 aspect-[3/3.02]";
      if (i === 1) return "col-span-1 aspect-[6/3]";
      if (i === 2) return "col-span-1 aspect-[6/3]";
      return "hidden";
    }
    return "";
  };

  return (
    <div className="space-y-2">
      <div className={`grid ${gridCols} gap-0.5 rounded-lg overflow-hidden`}>
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
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {image.uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Upload className="animate-pulse text-white" size={24} />
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(blockId, image.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <X size={14} />
                </button>
                {/* +N overlay on last visible when 5+ images */}
                {count >= 5 && i === 2 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px] pointer-events-none">
                    <span className="text-white text-3xl font-bold">
                      +{count - 3} more
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add more — calls parent's openFilePicker with this blockId */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onAddMore(blockId)}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors border border-dashed border-stone-300 hover:border-indigo-400"
        >
          <Upload size={14} />
          Add more photos
        </button>
        <span className="text-xs text-stone-400">
          {count} photo{count !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
