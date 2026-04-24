"use client";

import RichTextEditor, { ContentBlock } from "./RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { AnnouncementForm, AnnouncementFormSchema } from "@/defs/announcements";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUploadThing } from "@/lib/uploadthing";
import RichTextViewer from "./RichTextViewer";

// ── Stable empty array — never recreated, so RichTextEditor never sees
//    a new `initialContent` reference between renders
const EMPTY_CONTENT: ContentBlock[] = [];

export default function Page() {
  // ── Title & notification flags only — announcement is tracked separately
  const [title, setTitle] = useState("");
  const [notifyResidents, setNotifyResidents] = useState(false);
  const [notifyOfficials, setNotifyOfficials] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // ── Content lives in refs — does NOT drive re-renders of the page
  const contentRef = useRef<ContentBlock[]>([]);
  // Only used for the Preview panel and the submit-button disabled check
  const [contentSnapshot, setContentSnapshot] = useState<ContentBlock[]>([]);
  const [hasContent, setHasContent] = useState(false);

  const { startUpload } = useUploadThing("imageUploader");

  // ── Stable onChange — never recreated, so RichTextEditor/QuillBlock
  //    never see a prop change that triggers a re-render
  const handleContentChange = useCallback((blocks: ContentBlock[]) => {
    contentRef.current = blocks;

    const filled = blocks.some(
      (b) =>
        (b.type === "text" && b.content && b.content !== "<p><br></p>") ||
        (b.type === "images" && (b.images?.length ?? 0) > 0),
    );

    setHasContent(filled);

    // Only update snapshot when the user explicitly opens Preview
    // (avoids unnecessary renders while typing)
  }, []);

  // ── Sync snapshot when switching to preview
  const handlePreviewClick = useCallback(() => {
    setContentSnapshot([...contentRef.current]);
    setIsPreview(true);
  }, []);

  // ── Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formValues: AnnouncementForm = {
      title,
      announcement: hasContent ? JSON.stringify(contentRef.current) : "",
      notifyResidents,
      notifyOfficials,
    };

    const validation = AnnouncementFormSchema.safeParse(formValues);
    if (!validation.success) {
      toast.error("Validation failed", {
        description: Object.values(validation.error.flatten().fieldErrors)
          .flat()
          .join(", "),
      });
      setIsLoading(false);
      return;
    }

    try {
      toast.info("Uploading images…");

      // Collect pending File objects from image blocks
      const pending: { blockId: string; imageId: string; file: File }[] = [];
      for (const block of contentRef.current) {
        if (block.type === "images" && block.images) {
          for (const img of block.images) {
            if (img.file) pending.push({ blockId: block.id, imageId: img.id, file: img.file });
          }
        }
      }

      let finalContent = contentRef.current;

      if (pending.length > 0) {
        const uploaded = await startUpload(pending.map((p) => p.file));
        if (!uploaded) throw new Error("Upload failed");

        finalContent = contentRef.current.map((block) => {
          if (block.type !== "images" || !block.images) return block;
          return {
            ...block,
            images: block.images.map((img) => {
              const idx = pending.findIndex(
                (p) => p.blockId === block.id && p.imageId === img.id,
              );
              if (idx === -1) return img;
              return { ...img, url: uploaded[idx].url, file: undefined };
            }),
          };
        });
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("announcement", JSON.stringify(finalContent));
      formData.append("notifyResidents", String(notifyResidents));
      formData.append("notifyOfficials", String(notifyOfficials));

      const res = await fetch("/api/announcement", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to add announcement");
        return;
      }

      toast.success("Announcement added successfully");

      // Reset
      setTitle("");
      setNotifyResidents(false);
      setNotifyOfficials(false);
      setHasContent(false);
      setContentSnapshot([]);
      contentRef.current = [];
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the announcement.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-6 text-[#1F4251] flex items-center space-x-3">
        <i data-lucide="megaphone" className="w-7 h-7"></i>
        <span>Manage Announcements</span>
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <form id="announcementForm" className="space-y-4" onSubmit={handleSubmit}>

          {/* Title — updating this no longer re-renders RichTextEditor */}
          <Input
            type="text"
            placeholder="Title of Announcement"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Edit / Preview toggle */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => setIsPreview(false)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                !isPreview
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300"
              }`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handlePreviewClick}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                isPreview
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300"
              }`}
            >
              Preview
            </button>
          </div>

          {/* Editor / Viewer */}
          {!isPreview ? (
            <RichTextEditor
              initialContent={EMPTY_CONTENT}
              onChange={handleContentChange}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
              <RichTextViewer content={contentSnapshot} />
            </div>
          )}

          <div className="flex flex-row gap-3 justify-start">
            <Button
              type="submit"
              className="cursor-pointer bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700"
              disabled={!title || !hasContent || isLoading}
            >
              Push Announcement
            </Button>

            <div className="flex items-center space-x-2">
              <Switch
                id="notify-officials"
                checked={notifyOfficials}
                onCheckedChange={setNotifyOfficials}
              />
              <Label htmlFor="notify-officials">Notify Officials</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="notify-residents"
                checked={notifyResidents}
                onCheckedChange={setNotifyResidents}
              />
              <Label htmlFor="notify-residents">Notify Residents</Label>
            </div>
          </div>
        </form>
        <hr className="my-6" />
      </div>
    </>
  );
}