"use client";
import React, { useState, useActionState } from "react";

import {
  FigmaIcon,
  GithubIcon,
  InstagramIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { Logo } from "@/components/logo";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LoginFormSchema } from "@/defs/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/authContext";
import { login } from "@/action/auth";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginFormSchema),
  });

  const [state, action, pending] = useActionState(login, {
    errors: {},
    message: "",
    success: false,
  });
  const { isLoading } = useAuth();

  return (
    <div className="max-w-xs m-auto w-full flex flex-col items-center">
      <Logo className="h-9 w-9" />
      <p className="mt-4 text-xl font-semibold tracking-tight">
        Login your e-Sumbong account
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
        <form className="w-full space-y-4" action={action}>
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
          <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
            Login
          </Button>
        </form>
      </Form>

      <p className="mt-5 text-sm text-center">
        Don't have an account?
        <Link
          href="/landingPage/auth?form=sign-up"
          className="ml-1 underline text-muted-foreground cursor-pointer"
        >
          Register now!
        </Link>
      </p>
      <a className="ml-1 underline text-muted-foreground cursor-pointer">
        <p className="mt-5 text-sm text-center">Forgot password?</p>
      </a>
    </div>
  );
}
