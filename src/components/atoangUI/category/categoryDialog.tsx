import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useSWR, { KeyedMutator } from "swr";

import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from "./column";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryInput, CategorySchema } from "@/defs/category";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Delete, Edit2, Save } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type CategoryDialogProps = {
  category: Category;
  triggerButton: React.ReactNode;
  mutate: KeyedMutator<{ categories: Category[] }>; // ✅ correctly typed
};

export function CategoryDialogView({
  triggerButton,
  category,
  mutate,
}: CategoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [originalValues, setOriginalValues] = useState<{
    name: string;
    description: string;
    type: "concern" | "feedback" | undefined;
  } | null>(null);

  const form = useForm<CategoryInput>({
    defaultValues: {
      name: category.name,
      description: category.description,
      type: category.type,
    },
    resolver: zodResolver(CategorySchema),
  });
  useEffect(() => {
    if (isOpen) {
      const vals = {
        name: category.name,
        description: category.description || "",
        type: category.type || undefined,
      };
      form.reset(vals);
      setOriginalValues(vals);
      setIsEditing(false);
    }
  }, [category, isOpen, form]);
  const { watch } = form;
  const watchName = watch("name", originalValues?.name || "");
  const watchDescription = watch(
    "description",
    originalValues?.description || "",
  );

  const watchType = watch("type", originalValues?.type ?? undefined);
  // after your watches
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentValues = form.getValues();
    if (
      originalValues &&
      currentValues.name === originalValues.name &&
      currentValues.description === originalValues.description &&
      currentValues.type === originalValues.type
    ) {
      toast.info("No changes detected.");
      return;
    }
    const isValid = await form.trigger();
    if (!isValid) {
      toast.warning("Please fix the errors in the form before submitting.");
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", form.getValues("name"));
    formData.append("description", form.getValues("description") ?? "");
    formData.append("type", form.getValues("type") ?? undefined);
    try {
      const res = await fetch(`/api/category/update/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }, // ✅ important
        body: JSON.stringify({
          name: watchName,
          description: watchDescription,
          type: watchType,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to update category.");
        return;
      }
      toast.success("Category updated successfully!");
      mutate(
        (currentData) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            categories: currentData.categories.map((c) =>
              c.id === category.id
                ? {
                    ...c,
                    name: watchName,
                    description: watchDescription || "",
                    type: watchType,
                  }
                : c,
            ),
          };
        },
        false, // don't revalidate immediately
      );

      form.reset();
      setIsOpen(false);
      return;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error submitting feedback:", error);
      }
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/category/delete/${category.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to delete category.");
        return;
      }
      toast.success("Category deleted successfully!");

      mutate(
        (currentData) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            categories: currentData.categories.filter(
              (c) => c.id !== category.id,
            ),
          };
        },
        false, // don't revalidate immediately
      );
      setIsOpen(false);
      return;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "Something went wrong upon deleting the category.",
          error,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Category</DialogTitle>
          <DialogDescription>
            Update the category details and save your changes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEdit} className="space-y-3">
          <FieldGroup>
            <Field>
              <Label htmlFor="name">Category Name</Label>
              {isEditing ? (
                <Input {...form.register("name")} id="name" name="name" />
              ) : (
                <p>{category.name}</p>
              )}
            </Field>

            {/* Feedback Type Radio Buttons */}
            {/* Replace the FormField block with this */}
            <Field>
              <Label>Feedback Type</Label>
              <RadioGroup
                value={watchType}
                onValueChange={(val) =>
                  form.setValue("type", val as "concern" | "feedback", {
                    shouldValidate: true,
                  })
                }
                disabled={!isEditing}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="concern" id="type-concern" />
                  <Label
                    htmlFor="type-concern"
                    className="font-normal cursor-pointer"
                  >
                    Concern
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="feedback" id="type-feedback" />
                  <Label
                    htmlFor="type-feedback"
                    className="font-normal cursor-pointer"
                  >
                    Feedback
                  </Label>
                </div>
              </RadioGroup>
              {form.formState.errors.type && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.type.message}
                </p>
              )}
            </Field>
            <Field>
              <Label htmlFor="username-1">Category Description</Label>
              {isEditing ? (
                <Textarea
                  {...form.register("description")}
                  id="username-1"
                  name="description"
                />
              ) : (
                <p>{category.description}</p>
              )}
            </Field>
          </FieldGroup>
          <DialogFooter>
            {isEditing === true ? (
              <>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    //form.setValue(originalValues.name)
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-destructive disabled:bg-destructive/10"
                  disabled={isLoading}
                  onClick={() => handleDelete()}
                >
                  <Delete className="h-4 w-4" />
                  Delete
                </Button>
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4" />
                  Save changes
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4" />
                Edit Category
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
