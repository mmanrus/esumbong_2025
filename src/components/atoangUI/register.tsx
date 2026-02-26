"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import { toast } from "sonner";
import {
  SignUpFormInput,
  SignupFormSchema,
  SignUpFormType,
} from "@/defs/definitions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Form, FormField, FormMessage } from "../ui/form";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<SignUpFormInput, any, SignUpFormType>({
    defaultValues: {
      fullname: "Emmanuel Rusiana",
      email: "emanrusiana@yahoo.com",
      password: "Pi3.1415",
      address: "Sitio La Pursima, Cogon Pardo",
      confirmPassword: "Pi3.1415",
      contactNumber: "0999655788",
      type: "resident",
      age: 23,
    },
    resolver: zodResolver(SignupFormSchema),
  });
  const onSubmit = async (data: SignUpFormType) => {
    setIsLoading(true);
    const validation = SignupFormSchema.safeParse(data);
    if (!validation.success) {
      toast.error("Validation failed", {
        description: Object.values(validation.error.flatten().fieldErrors)
          .flat()
          .join(", "),
      });
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error("Registration failed", {
          description: errorData?.error || "Unknown error",
        });
        return;
      }

      await res.json();
      toast.success("Registration successful!");
      router.push("/login");
      return;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration.");
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = () => {
    toast("🚧 Coming Soon");
  };
  return (
    <>
      <div className="min-h-screen w-full flex bg-white">
        {/* Left Side - Hero Image (Desktop Only) */}
        <div className="hidden lg:flex w-1/2 bg-gray-50 items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gray-100" />
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
            }}
            className="absolute z-10 inset-0"
          >
            <Image
              fill
              src="/register.webp"
              sizes="w-full"
              alt="Kalinisan Day Community Activity"
              className="rounded-2xl shadow-2xl object-cover"
            />
            <div className="absolute rounded-2xl shadow-2xl inset-0 bg-gray-400/50" />
          </motion.div>
        </div>

        {/* Right Side - Form Container */}
        <div className="w-full md:mt-6 lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12 overflow-y-auto">
          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="w-full max-w-md space-y-8"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-teal-900 font-bold text-xl">E!</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Sign up for E-Sumbong
              </h2>
            </div>

            {/* Social Sign Up */}
            {/**<div className="flex justify-center gap-4 py-2">
              {[
                {
                  icon: Instagram,
                  label: "Instagram",
                },
                {
                  icon: Twitter,
                  label: "Twitter",
                },
                {
                  icon: Linkedin,
                  label: "LinkedIn",
                },
                {
                  icon: Facebook,
                  label: "Facebook",
                },
              ].map((social, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSocialLogin()}
                  className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 hover:border-teal-500 hover:text-teal-600 transition-colors duration-200"
                  title={`Sign up with ${social.label}`}
                >
                  <social.icon size={20} className="text-gray-600" />
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">OR</span>
              </div>
            </div>*/}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="Email"
                        {...field}
                        className={`flex h-11 w-full rounded-md border ${
                          fieldState.error
                            ? "border-red-500"
                            : "border-gray-300"
                        } bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-teal-500
            focus:border-transparent transition-all`}
                      />
                      <FormMessage className="text-xs text-red-500" />
                    </div>
                  )}
                />

                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field, fieldState }) => (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        {...field}
                        className={`flex h-11 w-full rounded-md border ${
                          fieldState.error
                            ? "border-red-500"
                            : "border-gray-300"
                        } bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-teal-500
            focus:border-transparent transition-all`}
                      />
                      <FormMessage className="text-xs text-red-500" />
                    </div>
                  )}
                />

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field, fieldState }) => (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your address"
                        {...field}
                        className={`flex h-11 w-full rounded-md border ${
                          fieldState.error
                            ? "border-red-500"
                            : "border-gray-300"
                        } bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-teal-500
            focus:border-transparent transition-all`}
                      />
                      <FormMessage className="text-xs text-red-500" />
                    </div>
                  )}
                />
                <div className="flex flex-row w-full justify-between gap-1">
                  {/* Age */}
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field, fieldState }) => (
                      <div className="space-y-1 w-1/2">
                        <label className="text-sm font-medium text-gray-700">
                          Age
                        </label>
                        <input
                          type="number"
                          placeholder="Enter your Age"
                          {...field}
                          value={(field.value as number) ?? ""}
                          className={`flex h-11 w-full rounded-md border ${
                            fieldState.error
                              ? "border-red-500"
                              : "border-gray-300"
                          } bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-teal-500
            focus:border-transparent transition-all`}
                        />
                        <FormMessage className="text-xs text-red-500" />
                      </div>
                    )}
                  />
                  {/* Contact Number */}
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field, fieldState }) => (
                      <div className="space-y-1 w-1/2">
                        <label className="text-sm font-medium text-gray-700">
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          placeholder="Enter your contact number"
                          {...field}
                          className={`flex h-11 w-full rounded-md border ${
                            fieldState.error
                              ? "border-red-500"
                              : "border-gray-300"
                          } bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-teal-500
        focus:border-transparent transition-all`}
                        />
                        <FormMessage className="text-xs text-red-500" />
                      </div>
                    )}
                  />
                </div>
                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                          className={`flex h-11 w-full rounded-md border ${
                            fieldState.error
                              ? "border-red-500"
                              : "border-gray-300"
                          } bg-white px-3 py-2 pr-10 text-sm text-gray-900
              placeholder:text-gray-400 focus:outline-none
              focus:ring-2 focus:ring-teal-500
              focus:border-transparent transition-all`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2
              text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      <FormMessage className="text-xs text-red-500" />
                    </div>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Enter your password again
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          {...field}
                          className={`flex h-11 w-full rounded-md border ${
                            fieldState.error
                              ? "border-red-500"
                              : "border-gray-300"
                          } bg-white px-3 py-2 pr-10 text-sm text-gray-900
              placeholder:text-gray-400 focus:outline-none
              focus:ring-2 focus:ring-teal-500
              focus:border-transparent transition-all`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2
              text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      <FormMessage className="text-xs text-red-500" />
                    </div>
                  )}
                />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 mt-4 bg-teal-800 text-white font-medium
      rounded-md hover:bg-teal-900 focus:outline-none
      focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
      transition-all duration-200 disabled:opacity-70
      disabled:cursor-not-allowed flex items-center
      justify-center shadow-lg cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>
            </Form>

            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-teal-700 hover:text-teal-800 hover:underline transition-all"
              >
                Login here
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
