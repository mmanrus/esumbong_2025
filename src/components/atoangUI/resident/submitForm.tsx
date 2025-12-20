"use client";
// submit Concern
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
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

const getCategories = async () => {
  try {
    const res = await fetch("/api/category/getAll", {
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
  const [form, setForm] = useState({
    title: "",
    categoryId: "",
    details: "",
    other: "",
    files: [],
  } as ConcernForm);

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
      const errors = validation.error.flatten().fieldErrors;

      toast.error("Validation failed", {
        description: Object.values(errors).flat().join(", "),
      });

      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("details", form.details);
      if (form.categoryId === "other") {
        if (!form.other || form.other.trim() === "") {
          toast.warning("Please specify the other category.");
          return;
        }
        formData.append("categoryId", "");
        formData.append("other", form.other);
      } else {
        // Normal category
        formData.append("categoryId", String(form.categoryId));
      }

      form.files?.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/resident/concern", {
        method: "POST",
        body: formData, // DO NOT set Content-Type manually
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log("Error submitting concern:", errorData);
        toast.error("Error submitting your concern.");
        return;
      }

      toast.success("Your concern has been successfully submitted!");

      setForm({ title: "", categoryId: "", details: "", files: [], other: "" });
      return;
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again later.");
      return;
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

            <div className="cursor-pointer">
              <Label htmlFor="files" className="text-lg font-medium">
                Attach Supporting Files
              </Label>

              <Input
                id="files"
                type="file"
                multiple
                className="mt-2 h-20 border"
                onChange={(e) => handleChange("files", e.target.files)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload images or documents to support your concern.
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                className={clsx(
                  `bg-green-600 text-white px-6 py-3 
                         rounded-md hover:bg-green-700 text-lg
                         font-semibold transition`,
                  loading && "bg-green-950"
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
