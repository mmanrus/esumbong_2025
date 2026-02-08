"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Edit2,
  Mail,
  MessageSquare,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";
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
import { notFound, useParams } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { fetcher } from "@/lib/swrFetcher";
import useSWR from "swr";
import Loading from "@/app/(protected)/feedback/[id]/loading";
import { formatDate } from "@/lib/formatDate";

type Feedback = {
  id: string;
  title: string;
  feedback: string;
  issuedAt: string;
  user: {
    fullname: string;
    id: any;
    email: string;
    contactNumber: string;
  };
};
export default function FeedbackById() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  //const [editedFeedback, setEditedFeedback] = useState(feedback);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const { data, error, isLoading, mutate } = useSWR(
    `/api/feedback/${id}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );
  useEffect(() => {
    if (!data) return;
    setFeedback(data.data);
    form.reset({
      title: data.data.title,
      feedback: data.data.feedback,
    });
  }, [data]);

  const form = useForm<FeedbackInput>({
    defaultValues: {
      title: "",
      feedback: "",
    },
    resolver: zodResolver(FeedbackSchema),
  });
  const handleEdit = async (e: any) => {
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
      const res = await fetch(`/api/feedback/update/${id}`, {
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

  const handleCancel = () => {
    //setEditedFeedback(feedback);
    setIsEditing(false);
  };
  if (user?.type === "resident" && user?.id !== feedback?.user.id) {
    return notFound();
  }
  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-7 w-7 text-primary" />
          Feedback Details
        </h1>
        <p className="text-muted-foreground mt-1">
          View the full feedback submission and related information.
        </p>
      </div>

      <Card className="shadow-sm flex flex-col flex-1">
        <CardHeader>
          <CardTitle className="text-lg">Submitted Feedback</CardTitle>
          <CardAction>
            {user?.id === feedback?.user?.id &&
              (!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleCancel} variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleEdit} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              ))}
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-1 ">
          <form
            onSubmit={handleEdit}
            className="space-y-5 flex-1 flex-col flex"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Submitted By:</p>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-sm font-medium">
                      <User className="h-3 w-3 inline mr-1" />
                      {feedback?.user?.fullname}
                    </span>
                    <span className="text-sm font-medium">
                      <Mail className="h-3 w-3 inline mr-1" />
                      {feedback?.user?.email}
                    </span>
                    <span className="text-sm font-medium">
                      <Phone className="h-3 w-3 inline mr-1" />
                      {feedback?.user?.contactNumber}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Date Submitted
                  </p>
                  <p className="text-sm font-medium">
                    <Calendar className="h-4 w-4 inline mr-1 text-muted-foreground mt-0.5 shrink-0" />
                    {feedback?.issuedAt
                      ? formatDate(new Date(feedback?.issuedAt))
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex flex-row gap-2 items-center">
                <Label
                  htmlFor="subject"
                  className={clsx(
                    form.formState.errors.title && "text-destructive",
                    "",
                  )}
                >
                  Title
                </Label>
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
              {isEditing ? (
                <Input
                  id="subject"
                  className={clsx(
                    form.formState.errors.title && "border-red-400",
                  )}
                  {...form.register("title")}
                  placeholder="e.g., Suggestion for better service"
                />
              ) : (
                <p>{feedback?.title}</p>
              )}
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
                  {isEditing ? "Edit feedback content" : "Feedback Message"}
                </Label>
                {form.formState.errors.feedback && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.feedback.message}
                  </p>
                )}
              </div>
              {isEditing ? (
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
              ) : (
                <div className="flex flex-1">
                  <p className="overflow-y">{feedback?.feedback}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              {isEditing && (
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Feedback"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
