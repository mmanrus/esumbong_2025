
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
  profilePhotoUploader: f({
    image: {
      maxFileCount: 1,
      maxFileSize: "4MB",
    },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.ufsUrl, name: file.name, type: file.type, size: file.size };
  }),
  documentUploader: f({
    image: {
      maxFileCount: 5,
      maxFileSize: "16MB",
    },
    video: {
      maxFileCount: 1,
      maxFileSize: "128MB",
    },
    pdf: {
      maxFileCount: 5,
      maxFileSize: "32MB",
    },
  }).onUploadComplete(async ({ file }) => {
    // Optional: save in DB
    return {
      url: file.ufsUrl,
      name: file.name,
      type: file.type,
      size: file.size,
    };
  }),

  idUploader: f({
    image: {
      maxFileCount: 1,
      maxFileSize: "8MB"
    }
  }).onUploadComplete(async ({ file }) => {
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
