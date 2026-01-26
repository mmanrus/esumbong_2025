
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

const f = createUploadthing();

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  mediaUploader: f({
    image: {
      maxFileCount: 10,
      maxFileSize: "16MB", // ✅ string, uppercase MB
    },
    video: {
      maxFileCount: 1, // <--- this MUST be present
      maxFileSize: "128MB", // ✅ string, uppercase MB
    },
  }).onUploadComplete(async ({ file }) => {

    //console.log("Upload success:", file);
    // Optional: do something with DB
    // await prisma.media.create({ data: { url: file.ufsUrl, name: file.name, type: file.type } });
    return { url: file.ufsUrl, name: file.name, type: file.type, size: file.size };
  }),
  pdfOrDocxUploader: f({
    image: {
      maxFileCount: 10,
      maxFileSize: "16MB", // ✅ string, uppercase MB
    },
    pdf: {
      maxFileCount: 5,
      maxFileSize: "16MB",
    },
    blob: {
      maxFileCount: 5,
      maxFileSize: "16MB",
    },
  }).onUploadComplete(async ({ file }) => {

    return { url: file.ufsUrl, name: file.name, type: file.type, size: file.size };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
