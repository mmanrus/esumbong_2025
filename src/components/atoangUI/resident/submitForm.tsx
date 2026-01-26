"use client";
// submit Concern
import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import clsx from "clsx";
import { ConcernForm, ConcernFormSchema } from "@/defs/concern";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/defs/category";
import { uploadFiles } from "@/lib/uploadthing";
import { useDropzone } from "@uploadthing/react";

const getCategories = async () => {
  try {
    const res = await fetch("/api/category/getAll", {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return []; // fallback to empty array
  }
};

export default function SubmitConcernForm() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 20,
  });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ConcernForm>({
    title: "",
    categoryId: "",
    details: "",
    other: "",
    needsBarangayAssistance: null,
  });
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);

    const urls = acceptedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [], "video/*": [] },
    onDrop,
  });
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);
  const handleChange = (field: any, value: any) => {
    if (field === "files") {
      setForm((prev) => ({ ...prev, files: Array.from(value) }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const validation = ConcernFormSchema.safeParse(form);
    if (!validation.success) {
      toast.error("Validation failed", {
        description: Object.values(validation.error.flatten().fieldErrors)
          .flat()
          .join(", "),
      });
      return;
    }

    if (form.needsBarangayAssistance === null) {
      toast.error("Please specify if barangay assistance is needed.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      let uploadedFiles:
        | {
            ufsUrl: string;
            name: string;
            size: number;
            type: string;
          }[]
        | null = null;
      if (files.length > 0) {
        try {
          const uploaded = await uploadFiles("mediaUploader", {
            files,
            onUploadProgress({ progress }) {
              setProgress(progress);
            },
          });

          if (!uploaded?.length) throw new Error("Upload failed");

          const mediaData =
            uploaded?.map((file) => ({
              url: file.ufsUrl.toString(),
              name: file.name,
              size: file.size,
              type: file.type,
            })) ?? [];

          formData.append("metaData", JSON.stringify(mediaData));

          // reset UI
          setFiles([]);
          setPreviews([]);
          setProgress(0);
        } catch (err) {
          console.error(err);
          toast.error("Upload failed");
          return;
        }
      }
      console.log(formData.get("metaData"));
      formData.append("title", form.title);
      formData.append("details", form.details);
      formData.append(
        "needsBarangayAssistance",
        String(form.needsBarangayAssistance),
      );
      if (form.categoryId === "other") {
        formData.append("categoryId", "");
        formData.append("other", form.other);
      } else {
        formData.append("categoryId", form.categoryId);
      }
      const res = await fetch("/api/concern/create", {
        credentials: "include",
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Error submitting your concern.");
        return;
      }

      toast.success("Your concern has been successfully submitted!");

      setForm({
        title: "",
        categoryId: "",
        details: "",
        other: "",
        needsBarangayAssistance: null,
      });
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-y-auto md:ml-0 ml-0">
      <Card className="shadow-md rounded-2xl mt-1">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Submit a Concern
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 p-2">
            <div>
              <Label htmlFor="title" className="text-lg font-medium">
                Subject
              </Label>
              <Input
                id="title"
                placeholder="e.g., Broken Street Light"
                className="mt-2"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="categoryId" className="text-lg font-medium">
                Category
              </Label>
              <Select
                value={form.categoryId}
                onValueChange={(value) => handleChange("categoryId", value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.categories?.map((cat: Category) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                  <SelectItem key={"other"} value={"other"}>
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
              <AnimatePresence mode="wait">
                {form.categoryId === "other" && (
                  <motion.div
                    key="other-input"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="mt-3"
                  >
                    <Label htmlFor="other" className="text-lg font-medium">
                      Other
                    </Label>
                    <Input
                      id="other"
                      placeholder="Please specify"
                      value={form.other}
                      onChange={(e) => handleChange("other", e.target.value)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <Label htmlFor="details" className="text-lg font-medium">
                Description
              </Label>
              <Textarea
                id="details"
                placeholder="Describe your concern..."
                rows={4}
                className="mt-2"
                value={form.details}
                onChange={(e) => handleChange("details", e.target.value)}
              />
            </div>
            <div
              {...getRootProps()}
              className={`cursor-pointer border-2 border-dashed 
              rounded-lg p-12 text-center transition ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "boder-gray-300 bg-white"
              }`}
            >
              <input {...getInputProps()} />
              {previews.length === 0 ? (
                <p>Drop the files here ...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {previews.map((previewUrl, index) => {
                    const currentFile = files[index];

                    if (!currentFile) return null;

                    return currentFile.type.startsWith("image") ? (
                      <Image
                        key={previewUrl}
                        src={previewUrl}
                        alt="Concern file preview"
                        width={300}
                        height={150}
                        className="max-h-64 w-full object-contain rounded"
                      />
                    ) : (
                      <video
                        key={previewUrl}
                        src={previewUrl}
                        controls
                        className="max-h-64 w-full rounded"
                      />
                    );
                  })}
                </div>
              )}
            </div>
            {isLoading && (
              <div className="space-y-2">
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-1 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-sm">{progress}</p>
              </div>
            )}
            <div>
              <Label className="text-lg font-medium">
                Do you need barangay assistance?
              </Label>

              <div className="flex gap-6 mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="barangayAssistance"
                    checked={form.needsBarangayAssistance === true}
                    onChange={() =>
                      handleChange("needsBarangayAssistance", true)
                    }
                  />
                  <span>Yes</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="barangayAssistance"
                    checked={form.needsBarangayAssistance === false}
                    onChange={() =>
                      handleChange("needsBarangayAssistance", false)
                    }
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
            <div className="flex justify-center">
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
