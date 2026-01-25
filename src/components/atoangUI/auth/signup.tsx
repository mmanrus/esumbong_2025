"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SignupFormSchema, SignUpFormType } from "@/defs/definitions";
import { zodResolver } from "@hookform/resolvers/zod";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  FigmaIcon,
  GithubIcon,
  InstagramIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  // Enums = admin, barangay_official, resident
  const form = useForm({
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      address: "",
      confirmPassword: "",
      contactNumber: "",
      type: "resident",
    },
    resolver: zodResolver(SignupFormSchema),
  });
  const onSubmit = async (data: SignUpFormType) => {
    setIsLoading(true);
    console.log("Data to be sent", data);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error("Registration failed", {
          description: errorData?.message || "Unknown error"
        })
      }

       await res.json();
      toast.success("Registration successful!")
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="max-w-xs m-auto w-full flex flex-col items-center">
      <Logo className="h-9 w-9" />
      <p className="mt-4 text-xl font-semibold tracking-tight">
        Sign up for e-Sumbong
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10"
        >
          <GithubIcon className="h-[18px]! w-[18px]!" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10"
        >
          <InstagramIcon className="h-[18px]! w-[18px]!" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10"
        >
          <TwitterIcon className="h-[18px]! w-[18px]!" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10"
        >
          <FigmaIcon className="h-[18px]! w-[18px]!" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10"
        >
          <TwitchIcon className="h-[18px]! w-[18px]!" />
        </Button>
      </div>

      <div className="my-7 w-full flex items-center justify-center overflow-hidden">
        <Separator />
        <span className="text-sm px-2">OR</span>
        <Separator />
      </div>

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
                  <Input
                    type="email"
                    placeholder="Email"
                    className="w-full"
                    {...field}
                  />
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
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    type="fullname"
                    placeholder="Enter your full name"
                    className="w-full"
                    {...field}
                  />
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
                  <Input
                    type="text"
                    placeholder="Enter your address"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Password"
                    className="w-full"
                    {...field}
                  />
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
                <FormLabel>Enter your password again</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    className="w-full"
                    {...field}
                  />
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
                  <Input
                    type="contactNumber"
                    placeholder="Enter your contact number"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="mt-4 w-full">
            Continue with Email
          </Button>
        </form>
      </Form>

      <p className="mt-5 text-sm text-center">
        Already have an account?
        <Link
          href="/landingPage/auth?form=login" 
          className="ml-1 underline text-muted-foreground cursor-pointer"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
