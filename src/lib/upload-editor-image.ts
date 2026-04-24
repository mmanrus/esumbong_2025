// lib/upload-editor-images.ts
import { uploadFiles } from "@/lib/uploadthing";

export async function uploadEditorImages(html: string): Promise<string> {
  // Find all base64 image srcs
  const base64Regex = /src="(data:image\/[^;]+;base64,[^"]+)"/g;
  const matches = [...html.matchAll(base64Regex)];

  if (matches.length === 0) return html; // nothing to upload

  let result = html;

  for (const match of matches) {
    const dataUrl = match[1];

    // Convert base64 data URL → File object
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const ext = blob.type.split("/")[1] ?? "jpg";
    const file = new File([blob], `image-${Date.now()}.${ext}`, {
      type: blob.type,
    });

    // Upload to UploadThing
    const uploaded = await uploadFiles("mediaUploader", { files: [file] });
    if (!uploaded?.[0]) throw new Error("Image upload failed");

    // Replace base64 src with real URL
    result = result.replace(dataUrl, uploaded[0].ufsUrl);
  }

  return result;
}