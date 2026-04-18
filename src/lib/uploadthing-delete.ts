import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

export const deleteUploadThingFile = async (url: string) => {
  try {
    // Extract the file key from the URL
    const key = url.split("/").pop();
    if (!key) return;
    await utapi.deleteFiles(key);
  } catch (error) {
    console.error("Failed to delete file from UploadThing:", error);
  }
};