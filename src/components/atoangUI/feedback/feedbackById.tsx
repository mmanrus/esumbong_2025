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
import { FeedbackInput } from "@/defs/feedback";
import { useForm, Controller } from "react-hook-form";
import clsx from "clsx";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { fetcher } from "@/lib/swrFetcher";
import useSWR from "swr";
import { formatDate } from "@/lib/formatDate";
import DialogAlert from "../alertDialog";
import Loading from "@/app/(protected)/feedback/[id]/loading";
import { StarRatingDisplay, StarRatingInput } from "@/components/atoangUI/starRating";

// ─── Types ────────────────────────────────────────────────────────────────────

type Feedback = {
  id: string;
  title: string;
  feedback: string;
  star: number | null;
  issuedAt: string;
  user: {
    fullname: string;
    id: any;
    email: string;
    contactNumber: string;
  };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function maskName(name: string) {
  return name.charAt(0) + "***** ******";
}
function maskEmail(email: string) {
  return email.charAt(0) + "*****@****.com";
}
function maskPhone(phone: string) {
  return phone.charAt(0) + "********";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FeedbackById() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data, isLoading, mutate } = useSWR(`/api/feedback/${id}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });

  const form = useForm<FeedbackInput>({
    defaultValues: { title: "", feedback: "", star: 0 as unknown as number },
  });

  const [originalValues, setOriginalValues] = useState<{
    title: string;
    feedback: string;
    star: number;
  } | null>(null);

  useEffect(() => {
    if (!data) return;
    setFeedback(data.data);
    const init = {
      title: data.data.title,
      feedback: data.data.feedback,
      star: data.data.star ?? 0,
    };
    setOriginalValues(init);
    form.reset(init);
  }, [data]);

  if (isLoading) return <Loading />;

  const { watch, formState } = form;
  const watchedTitle = watch("title");
  const watchedFeedback = watch("feedback");
  const watchedStar = watch("star");

  const hasChanges =
    originalValues &&
    (watchedTitle !== originalValues.title ||
      watchedFeedback !== originalValues.feedback ||
      watchedStar !== originalValues.star);

  // ── Edit submit ──────────────────────────────────────────────────────────────

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const current = form.getValues();

    if (
      originalValues &&
      current.title === originalValues.title &&
      current.feedback === originalValues.feedback &&
      current.star === originalValues.star
    ) {
      toast.info("No changes detected.");
      return;
    }

    const isValid = await form.trigger(["title", "feedback"]);
    if (!isValid) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    const payload: Partial<{ title: string; feedback: string; star: number }> =
      {};
    if (current.title !== originalValues?.title) payload.title = current.title;
    if (current.feedback !== originalValues?.feedback)
      payload.feedback = current.feedback;
    if (current.star !== originalValues?.star) payload.star = current.star;

    try {
      setLoading(true);
      const res = await fetch(`/api/feedback/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Failed to update feedback");
        return;
      }
      toast.success("Feedback updated!");
      setIsEditing(false);
      mutate();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/feedback/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const json = await res.json();
        toast.error(json.error ?? "Error deleting feedback");
        return;
      }
      toast.success("Feedback deleted.");
      router.push("/feedback");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isOwner = user?.id === feedback?.user?.id;

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in h-full flex flex-col">
      {/* ── Page header ── */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7 text-primary flex-shrink-0" />
          Feedback Details
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          View the full feedback submission and related information.
        </p>
      </div>

      <Card className="shadow-sm flex flex-col flex-1">
        {/* ── Card header ── */}
        <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-3">
          <CardTitle className="text-base sm:text-lg">
            Submitted Feedback
          </CardTitle>

          {/* Action buttons */}
          {isOwner && (
            <CardAction className="flex items-center gap-2 flex-wrap">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <>
                  {/* Cancel */}
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      form.reset(originalValues ?? undefined);
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {/* Save */}
                  <Button
                    onClick={handleEdit}
                    disabled={loading || !hasChanges}
                    size="sm"
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>

                  {/* Delete */}
                  <DialogAlert
                    trigger={
                      <Button variant="destructive" size="sm" className="gap-2">
                        <DeleteIcon className="h-4 w-4" />
                        Delete
                      </Button>
                    }
                    headMessage="Are you sure you want to delete this feedback?"
                    Icon={DeleteIcon}
                  >
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(id)}
                      disabled={loading}
                    >
                      Yes, delete
                    </Button>
                  </DialogAlert>
                </>
              )}
            </CardAction>
          )}
        </CardHeader>

        <CardContent className="flex flex-1 pt-0">
          <form
            onSubmit={handleEdit}
            className="space-y-5 flex-1 flex-col flex w-full"
          >
            {/* ── Meta: submitter + date ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/40 rounded-xl border border-border/50">
              {/* Submitter */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Submitted By
                </p>
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">
                      {feedback?.user?.fullname
                        ? maskName(feedback.user.fullname)
                        : "—"}
                    </span>
                  </p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">
                      {feedback?.user?.email
                        ? maskEmail(feedback.user.email)
                        : "—"}
                    </span>
                  </p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span>
                      {feedback?.user?.contactNumber
                        ? maskPhone(feedback.user.contactNumber)
                        : "—"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Date + Star rating (read-only) */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Date Submitted
                  </p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    {feedback?.issuedAt
                      ? formatDate(new Date(feedback.issuedAt))
                      : "N/A"}
                  </p>
                </div>

                {/* Star — read-only when not editing */}
                {!isEditing && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Rating
                    </p>
                    <StarRatingDisplay
                      value={feedback?.star ?? null}
                      size="sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ── Star (edit mode) ── */}
            {isEditing && (
              <div className="space-y-2">
                <Label
                  className={clsx(formState.errors.star && "text-destructive")}
                >
                  Update Rating
                </Label>
                <Controller
                  control={form.control}
                  name="star"
                  render={({ field, fieldState }) => (
                    <StarRatingInput
                      value={field.value ?? 0}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                      disabled={loading}
                    />
                  )}
                />
              </div>
            )}

            {/* ── Title ── */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 items-center">
                <Label
                  htmlFor="subject"
                  className={clsx(formState.errors.title && "text-destructive")}
                >
                  Title
                </Label>
                {formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {formState.errors.title.message}
                  </p>
                )}
              </div>

              {isEditing ? (
                <Input
                  id="subject"
                  className={clsx(formState.errors.title && "border-red-400")}
                  {...form.register("title")}
                  placeholder="e.g., Suggestion for better service"
                />
              ) : (
                <p className="text-sm sm:text-base font-medium text-foreground break-words">
                  {feedback?.title ?? "—"}
                </p>
              )}
            </div>

            {/* ── Feedback message ── */}
            <div className="space-y-2 flex flex-1 flex-col">
              <div className="flex flex-wrap gap-2 items-center">
                <Label
                  htmlFor="message"
                  className={clsx(
                    formState.errors.feedback && "text-destructive",
                  )}
                >
                  {isEditing ? "Edit Feedback" : "Feedback Message"}
                </Label>
                {formState.errors.feedback && (
                  <p className="text-sm text-destructive">
                    {formState.errors.feedback.message}
                  </p>
                )}
              </div>

              {isEditing ? (
                <Textarea
                  id="message"
                  className={clsx(
                    formState.errors.feedback && "border-red-400",
                    "flex-1 min-h-[120px]",
                  )}
                  placeholder="Share your feedback, suggestions, or comments..."
                  {...form.register("feedback")}
                  rows={6}
                />
              ) : (
                <div className="flex-1 bg-muted/30 rounded-lg p-4 border border-border/40">
                  <p className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-wrap break-words">
                    {feedback?.feedback ?? "—"}
                  </p>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
