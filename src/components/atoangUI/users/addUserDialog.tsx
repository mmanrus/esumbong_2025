"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignupFormSchema, SignUpFormType } from "@/defs/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/contexts/authContext"; // adjust path if needed

export default function OpenAddUserDialog({
  open,
  setOpen,
  mutate,
}: {
  open: boolean;
  mutate: () => Promise<unknown>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user } = useAuth();

  const form = useForm({
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      address: "",
      confirmPassword: "",
      contactNumber: "",
      age: undefined as number | undefined,
      type: undefined as "admin" | "resident" | "barangay_official" | undefined,
      barangayId: user?.barangayId ?? undefined,
    },
    resolver: zodResolver(SignupFormSchema),
  });

  // Sync barangayId whenever the dialog opens or user changes
  useEffect(() => {
    if (open && user?.barangayId) {
      form.setValue("barangayId", user.barangayId);
    }
  }, [open, user?.barangayId, form]);

  // Cleanup: ensure dialog closes on unmount
  useEffect(() => {
    return () => {
      if (open) {
        setOpen(false);
      }
    };
  }, [open, setOpen]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: SignUpFormType) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error("Registration failed", {
          description:
            errorData?.error || errorData?.message || "Unknown error",
        });
        return;
      }

      toast.success("User added successfully!");
      setOpen(false);
      form.reset();
      try {
        await mutate();
      } catch (error) {
        console.warn("Failed to refresh users after add:", error);
      }
    } catch {
      toast.error("An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          {/* Show which barangay this user will be added to */}
          {user?.barangay?.name && (
            <p className="text-sm text-gray-500 mt-1">
              Adding to{" "}
              <span className="font-medium text-gray-700">
                {user.barangay.name}
              </span>
            </p>
          )}
        </DialogHeader>

        <Form {...form}>
          <form
            className="w-full space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact number</FormLabel>
                  <FormControl>
                    <Input placeholder="09XXXXXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => {
                const ageValue = field.value as number | undefined;
                return (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Age"
                        min={18}
                        max={100}
                        value={ageValue ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type — admin can only create residents or officials, not other admins */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* superAdmin is excluded server-side and never shown */}
                      <SelectItem value="resident">Resident</SelectItem>
                      <SelectItem value="barangay_official">
                        Barangay Official
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* barangayId is hidden — prefilled from session */}
            <input
              type="hidden"
              {...form.register("barangayId", { valueAsNumber: true })}
            />

            <Button type="submit" disabled={isLoading} className="mt-2 w-full">
              {isLoading ? "Adding..." : "Add User"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
