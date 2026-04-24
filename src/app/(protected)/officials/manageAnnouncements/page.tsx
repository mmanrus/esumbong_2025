"use client";

import RichTextEditor, { ContentBlock } from "./RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { AnnouncementForm, AnnouncementFormSchema } from "@/defs/announcements";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUploadThing } from "@/lib/uploadthing";
import { uploadEditorImages } from "@/lib/upload-editor-image";
import RichTextViewer from "./RichTextViewer";

export default function Page() {
  const [form, setForm] = useState<AnnouncementForm>({
    title: "",
    announcement: "",
    notifyResidents: false,
    notifyOfficials: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (field: any, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const [content, setContent] = useState<ContentBlock[]>([]);

  const handleContentChange = (blocks: ContentBlock[]) => {
    setContent(blocks);
    // Mark announcement as non-empty if any text block has content or any image block exists
    const hasContent = blocks.some(
      (b) =>
        (b.type === "text" && b.content && b.content !== "<p><br></p>") ||
        (b.type === "images" && (b.images?.length ?? 0) > 0),
    );
    handleChange("announcement", hasContent ? JSON.stringify(blocks) : "");
  };
  const [isPreview, setIsPreview] = useState(false);
  const { startUpload } = useUploadThing("imageUploader");

  const handleUpload = async (files: File[]): Promise<string[]> => {
    try {
      const uploadedFiles = await startUpload(files);

      if (!uploadedFiles) {
        throw new Error("Upload failed");
      }

      return uploadedFiles.map((file) => file.url);
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // 2. New handleSubmit — uploads File objects from content blocks at submit time

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const validation = AnnouncementFormSchema.safeParse(form);
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
      toast.info("Uploading images...");

      // Collect all File objects still pending in image blocks
      const imageBlockFiles: {
        blockId: string;
        imageId: string;
        file: File;
      }[] = [];
      for (const block of content) {
        if (block.type === "images" && block.images) {
          for (const img of block.images) {
            if (img.file) {
              imageBlockFiles.push({
                blockId: block.id,
                imageId: img.id,
                file: img.file,
              });
            }
          }
        }
      }

      // Upload all pending files in one batch
      let finalContent = content;
      // After building finalContent, sync it back to state
      if (imageBlockFiles.length > 0) {
        const uploadedFiles = await startUpload(
          imageBlockFiles.map((i) => i.file),
        );
        if (!uploadedFiles) throw new Error("Upload failed");

        finalContent = content.map((block) => {
          if (block.type !== "images" || !block.images) return block;
          const updatedImages = block.images.map((img) => {
            const match = imageBlockFiles.findIndex(
              (f) => f.blockId === block.id && f.imageId === img.id,
            );
            if (match === -1) return img;
            return { ...img, url: uploadedFiles[match].url, file: undefined };
          });
          return { ...block, images: updatedImages };
        });

        setContent(finalContent);
      }

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("announcement", JSON.stringify(finalContent));
      formData.append("notifyResidents", String(form.notifyResidents || false));
      formData.append("notifyOfficials", String(form.notifyOfficials || false));

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
      setForm({
        title: "",
        announcement: "",
        notifyResidents: false,
        notifyOfficials: false,
      });
      setContent([]);
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
        <form
          id="announcementForm"
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            placeholder="Title of Announcement"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          {/* Toggle */}
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
              onClick={() => setIsPreview(true)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                isPreview
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300"
              }`}
              type="button"
            >
              Preview
            </button>
          </div>

          {/* Editor / Viewer */}
          {!isPreview ? (
            <RichTextEditor
              initialContent={content}
              onChange={handleContentChange} // ← was setContent
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8">
              <RichTextViewer content={content} />
            </div>
          )}
          <div className="flex flex-row gap-3 justify-start">
            <Button
              type="submit"
              className="cursor-pointer bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700"
              disabled={!form.title || !form.announcement || isLoading}
            >
              Push Announcement
            </Button>
            <div className="flex items-center space-x-2">
              <Switch
                id="notify-officials"
                checked={form.notifyOfficials}
                onCheckedChange={(checked) =>
                  handleChange("notifyOfficials", checked)
                }
              />
              <Label htmlFor="notify-officials">Notify Officials</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="notify-residents"
                checked={form.notifyResidents}
                onCheckedChange={(checked) =>
                  handleChange("notifyResidents", checked)
                }
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
