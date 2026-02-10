"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DeleteIcon,
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
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { fetcher } from "@/lib/swrFetcher";
import useSWR from "swr";
import { formatDate } from "@/lib/formatDate";
import DialogAlert from "../alertDialog";

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

  const [originalValues, setOriginalValues] = useState<{
    title: string;
    feedback: string;
  } | null>(null);

  useEffect(() => {
    if (!data) return;

    setOriginalValues({
      title: data.data.title,
      feedback: data.data.feedback,
    });

    form.reset({
      title: data.data.title,
      feedback: data.data.feedback,
    });
  }, [data]);

  const { watch, formState, register, trigger, getValues, reset } = form;

  const watchedTitle = watch("title");
  const watchedFeedback = watch("feedback");

  const hasChanges =
    originalValues &&
    (watchedTitle !== originalValues.title ||
      watchedFeedback !== originalValues.feedback);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentValues = form.getValues();

    if (
      originalValues &&
      currentValues.title === originalValues.title &&
      currentValues.feedback === originalValues.feedback
    ) {
      toast.info("No changes detected.");
      return;
    }

    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    // Build payload dynamically
    const payload: Partial<{ title: string; feedback: string }> = {};
    if (currentValues.title !== originalValues?.title) {
      payload.title = currentValues.title;
    }
    if (currentValues.feedback !== originalValues?.feedback) {
      payload.feedback = currentValues.feedback;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/feedback/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update feedback");
        return;
      }

      toast.success("Feedback updated!");
      setIsEditing(false);
      mutate(); // refresh SWR data
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };
  const router = useRouter();
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/feedback/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(
          data.error ? data.error : "Error upon deleting the feedback",
        );
        return;
      }

      toast.success("Successfully deleted the feedback.");
      router.push("/feedback");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
          <CardAction className="flex flex-col gap-1 md:flex-row">
            {user?.id === feedback?.user?.id &&
              (!isEditing ? (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Feedback
                  </Button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleCancel} variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleEdit}
                    disabled={loading}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                  <DialogAlert
                    trigger={
                      <Button variant={"destructive"}>
                        <DeleteIcon className="h-4 w-4" />
                        Delete
                      </Button>
                    }
                    headMessage="Are you sure you want to delete this feedback?"
                    Icon={DeleteIcon}
                  >
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(id)}
                      disabled={isLoading}
                    >
                      Yes
                    </Button>
                  </DialogAlert>
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
            {/**
            <div className="flex justify-end pt-2">
              {isEditing && (
                <Button type="submit" disabled={loading || !hasChanges}>
                  Edit
                </Button>
              )}
            </div>  */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
