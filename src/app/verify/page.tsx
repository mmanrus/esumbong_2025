"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { uploadFiles } from "@/lib/uploadthing";
import { useDropzone } from "@uploadthing/react";
import { Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { tr } from "zod/v4/locales";
import { toast } from "sonner";
import { useAuth } from "@/contexts/authContext";
import useSWR from "swr";
import { fetcher } from "@/lib/swrFetcher";
import { redirect, useRouter } from "next/navigation";
import PendingPage from "@/components/pending";

export default function Page() {
  const { user } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const [progress, setProgress] = useState(0);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]; // only take first file

    if (!selectedFile) return;

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
  }, []);
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);
  const [loading, setLoading] = useState(false);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [], "video/*": [] },
    onDrop,
    multiple: false,
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    if (!file) {
      toast.error("Please upload a photo.");
      setLoading(false);
      return;
    }
    fd.append("files", file);
    try {
      const validationRes = await fetch("/api/media/validate", {
        method: "POST",
        body: fd,
      });
      const validationData = await validationRes.json();

      const aiResults = validationData.files[0].isAI ?? false;
      let metaData = {};
      try {
        const uploaded = await uploadFiles("idUploader", {
          files: [file],
          onUploadProgress({ progress }) {
            setProgress(progress);
          },
        });

        if (!uploaded?.length) throw new Error("Upload failed");

        metaData = {
          url: uploaded[0].ufsUrl.toString(),
          name: uploaded[0].name,
          size: uploaded[0].size,
          type: uploaded[0].type,
          isAI: aiResults,
        };
        if (!user) {
          toast.error("User not found");
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error(err);
        toast.error("Upload failed");
        return;
      }
      const res = await fetch(`/api/auth/verify/`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metaData),
      });

      if (!res.ok) {
        toast.error("Error submitting your concern.");
        return;
      }

      router.push("/verify/pending");

      setFile(null);
      setPreview(null);
      setProgress(0);
      toast.success("You sent your verification Id.");
      return;
    } catch (error) {
      toast.error("Something went wrong.");
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <Card className="w-[90%] md:w-[50%]">
        <CardHeader>
          <CardTitle>Proof of Residency</CardTitle>
          <CardDescription>
            Any valid ID or documents that proves that you are a resident of
            Cogon Pardo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div
              {...getRootProps()}
              className={`flex flex-col justify-center items-center cursor-pointer border-2 border-dashed
  rounded-lg p-6 text-center transition ${
    isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
  }`}
            >
              <input {...getInputProps()} />
              {!preview ? (
                <Upload className="w-10 h-10 text-gray-400" />
              ) : (
                <Image
                  src={preview}
                  alt="Verification file preview"
                  width={400}
                  height={300}
                  className="max-h-[400px] max-w-full object-contain rounded"
                />
              )}
            </div>
            <div className="flex mt-4 justify-center">
              <Button
                type="submit"
                className={clsx(
                  `bg-green-600 text-white px-6 py-3 
                    rounded-md hover:bg-green-700 text-lg
                    font-semibold transition`,
                  loading && "bg-green-950",
                )}
                disabled={loading}
              >
                <span>{loading ? "Submitting..." : "Submit"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
