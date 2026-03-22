"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FeedbackInput, FeedbackSchema } from "@/defs/feedback";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";
import { StarRatingInput } from "@/components/atoangUI/starRating";

type Category = {
  id: number;
  name: string;
};

const getCategories = async (): Promise<{ categories: Category[] }> => {
  const res = await fetch("/api/category/getAll?type=feedback", {
    credentials: "include",
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

export default function SubmitFeedbackPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 20,
  });

  const [categorySearch, setCategorySearch] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<FeedbackInput>({
    defaultValues: {
      title: "",
      feedback: "",
      other: "",
      categoryId: "",
      star: 0 as unknown as number, // will be validated — 0 means unset
    },
  });

  const watchedCategoryId = form.watch("categoryId");

  const filteredCategories = (data?.categories ?? []).filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Check post limit
    let isAllowed = false;
    let isSpam = false;
    try {
      const res = await fetch(`/api/checkPostCount`, { method: "GET" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }
      isAllowed = data.isAllowed;
      isSpam = data.isSpam;
    } catch {
      toast.error("Something went wrong");
      return;
    } finally {
      if (!isAllowed) setLoading(false);
    }

    if (!isAllowed) return;

    // 2. Validate
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fix the errors in the form before submitting.");
      setLoading(false);
      return;
    }

    // 3. Submit
    const values = form.getValues();
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("feedback", values.feedback);
    formData.append("isSpam", String(isSpam));
    formData.append("star", String(values.star));

    if (values.categoryId === "other") {
      formData.append("categoryId", "");
      formData.append("other", values.other ?? "");
    } else {
      formData.append("categoryId", values.categoryId ?? "");
    }

    try {
      const res = await fetch("/api/feedback/submit", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to submit feedback.");
        return;
      }
      toast.success("Feedback submitted successfully!");
      form.reset();
    } catch {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-7 w-7 text-primary" />
          Submit Feedback
        </h1>
        <p className="text-muted-foreground mt-1">
          Share your thoughts and suggestions with us
        </p>
      </div>

      <Card className="shadow-sm flex flex-col flex-1">
        <CardHeader>
          <CardTitle className="text-lg">Feedback Form</CardTitle>
          <CardAction />
        </CardHeader>

        <CardContent className="flex flex-1">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 flex-1 flex-col flex"
          >
            {/* Title */}
            <div className="space-y-2">
              <div className="flex flex-row flex-wrap gap-2 items-center">
                <Label
                  htmlFor="subject"
                  className={clsx(form.formState.errors.title && "text-destructive")}
                >
                  Subject
                </Label>
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
              <Input
                id="subject"
                className={clsx(form.formState.errors.title && "border-red-400")}
                {...form.register("title")}
                placeholder="e.g., Suggestion for better service"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select
                value={watchedCategoryId}
                onValueChange={(value) => {
                  form.setValue("categoryId", value, { shouldValidate: true });
                  form.setValue("other", "");
                  setCategorySearch("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-2 border-b">
                    <Input
                      placeholder="Search categories..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="h-8 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  {isLoading && (
                    <div className="px-2 py-2 text-xs text-muted-foreground">
                      Loading...
                    </div>
                  )}
                  {filteredCategories.length > 0
                    ? filteredCategories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))
                    : !isLoading && (
                        <div className="px-2 py-2 text-xs text-muted-foreground">
                          No categories found
                        </div>
                      )}
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              {form.formState.errors.categoryId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.categoryId.message}
                </p>
              )}

              {/* "Other" text input */}
              <AnimatePresence mode="wait">
                {watchedCategoryId === "other" && (
                  <motion.div
                    key="other-input"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="mt-3 space-y-2"
                  >
                    <Label htmlFor="other">Please specify</Label>
                    <Input
                      id="other"
                      placeholder="Describe your category"
                      {...form.register("other")}
                    />
                    {form.formState.errors.other && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.other.message}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Star Rating ── */}
            <div className="space-y-2">
              <div className="flex flex-row flex-wrap gap-2 items-center">
                <Label className={clsx(form.formState.errors.star && "text-destructive")}>
                  Rating
                </Label>
                {form.formState.errors.star && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.star.message}
                  </p>
                )}
              </div>

              <Controller
                control={form.control}
                name="star"
                render={({ field, fieldState }) => (
                  <StarRatingInput
                    value={field.value ?? 0}
                    onChange={(v) => field.onChange(v)}
                    error={fieldState.error?.message}
                    disabled={loading}
                  />
                )}
              />
            </div>

            {/* Feedback message */}
            <div className="space-y-2 flex flex-1 flex-col">
              <div className="flex flex-row flex-wrap gap-2 items-center">
                <Label
                  htmlFor="message"
                  className={clsx(form.formState.errors.feedback && "text-destructive")}
                >
                  Your Feedback
                </Label>
                {form.formState.errors.feedback && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.feedback.message}
                  </p>
                )}
              </div>
              <Textarea
                id="message"
                className={clsx(
                  form.formState.errors.feedback && "border-red-400",
                  "flex-1 min-h-[120px]"
                )}
                placeholder="Share your feedback, suggestions, or comments..."
                {...form.register("feedback")}
                rows={6}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}