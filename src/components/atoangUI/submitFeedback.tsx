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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";

export default function SubmitFeedbackPage() {
  const [loading, setLoading] = useState(false);
  const form = useForm<FeedbackInput>({
    defaultValues: {
      title: "",
      feedback: "",
    },
    resolver: zodResolver(FeedbackSchema),
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log({
      title: form.getValues("title"),
      feedback: form.getValues("feedback"),
    });
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fix the errors in the form before submitting.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("title", form.getValues("title"));
    formData.append("feedback", form.getValues("feedback"));
    try {
      const res = await fetch("/api/feedback/submit", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(
          errorData.message || "Failed to submit feedback. Please try again.",
        );
        return;
      }
      toast.success("Feedback submitted successfully!");
      return;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
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
          <CardAction></CardAction>
        </CardHeader>
        <CardContent className="flex flex-1 ">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 flex-1 flex-col flex"
          >
            <div className="space-y-2">
              <div className="flex flex-row gap-2 items-center">
                <Label
                  htmlFor="subject"
                  className={clsx(
                    form.formState.errors.title && "text-destructive",
                    "",
                  )}
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
                className={clsx(
                  form.formState.errors.title && "border-red-400",
                )}
                {...form.register("title")}
                placeholder="e.g., Suggestion for better service"
              />
            </div>

            <div className="space-y-2 flex flex-1 flex-col ">
              <div className="flex flex-row gap-2 items-center">
                <Label
                  htmlFor="message"
                  className={clsx(
                    form.formState.errors.feedback && "text-destructive",
                    "",
                  )}
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
                  "flex-1",
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
