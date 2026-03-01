"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema } from "@/defs/definitions";
import { useAuth } from "@/contexts/authContext";
import { login } from "@/action/auth";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginFormSchema),
  });

  const { refreshUser } = useAuth();
  const onSubmit = async (values: { email: string; password: string }) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.set("email", values.email);
      formData.set("password", values.password);

      // Call your server action
      const result = await login(null, formData);
      console.log(result.isLocked)
      if (result.isLocked) {
        router.push("/locked"); // ✅ explicitly redirect to /locked
        return;
      }
      if (!result.success) {
        // Handle errors
        toast.error("Login failed: " + result.message);
        return;
      }

      // Refresh AuthProvider to get updated user
      await refreshUser();
      if (result.user?.type === "admin") router.push("/admin");
      else if (result.user?.type === "resident") router.push("/resident");
      else if (result.user?.type === "barangay_official")
        router.push("/officials");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-teal-50 via-teal-500 to-teal-800   pt-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Side - Login Form */}
            <motion.div
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="flex items-center justify-center"
            >
              <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 border border-gray-100">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-linear-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                      <span className="text-white font-bold text-2xl">E!</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Welcome Back
                    </h1>
                    <p className="text-gray-600">
                      Sign in to continue to e-Sumbong
                    </p>
                  </div>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                  {...field}
                                  type="email"
                                  placeholder="your.email@example.com"
                                  disabled={isSubmitting}
                                  {...field}
                                  className={`flex h-11 w-full rounded-md border ${
                                    fieldState.error
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-teal-500
            focus:border-transparent transition-all pl-10`}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                  {...field}
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter your password"
                                  disabled={isSubmitting}
                                  className={`flex h-11 w-full rounded-md border ${
                                    fieldState.error
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-teal-500
            focus:border-transparent transition-all pl-10`}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Forgot Password 
                      <div className="flex items-center justify-end">
                        <Link
                          href="/forgot-password"
                          className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors hover:underline"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                      */}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 cursor-pointer bg-linear-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-lg shadow-md hover:from-teal-700 hover:to-teal-800 hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="animate-spin h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Verifying...
                          </span>
                        ) : (
                          "Sign In"
                        )}
                      </button>
                    </form>
                  </Form>
                  {/* Register Link */}
                  <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-gray-600">
                      Don't have an account?{" "}
                      <Link
                        href="/register"
                        className="text-teal-600 hover:text-teal-700 font-bold transition-colors hover:underline"
                      >
                        Create Account
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Hero Image (Desktop Only) */}
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
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-full h-full min-h-[600px] rounded-2xl overflow-hidden shadow-2xl group">
                <Image
                  src="/login.webp"
                  alt="Community collaboration"
                  sizes="w-full"
                  fill
                  className="
                    object-cover
                    transform-gpu
                    transition-transform
                    duration-1200
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                  "
                />

                <div className="absolute inset-0 bg-linear-to-t from-teal-900/90 via-teal-900/40 to-transparent flex items-end">
                  <div className="p-12 text-white">
                    <h2 className="text-4xl font-bold mb-4 leading-tight">
                      Together for a <br />
                      Better Community
                    </h2>
                    <p className="text-lg text-teal-100 max-w-md leading-relaxed">
                      Join thousands of residents who are making a difference.
                      Report issues, track progress, and build a safer
                      neighborhood with e-Sumbong.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
export default LoginPage;
