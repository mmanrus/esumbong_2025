"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Loader2,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import {
  SignUpFormInput,
  SignupFormSchema,
  SignUpFormType,
} from "@/defs/definitions";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Form, FormField, FormMessage } from "../ui/form";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface GeoItem {
  id: number;
  name: string;
  code?: string;
}

// Reusable cascading select
function GeoSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  disabled,
  loading,
  icon,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  options: GeoItem[];
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
        {icon} {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || loading}
          className={`flex h-11 w-full rounded-md border appearance-none pr-10 pl-3 py-2 text-sm
            bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500
            focus:border-transparent transition-all
            ${disabled ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed" : "border-gray-300 cursor-pointer"}
            ${!value ? "text-gray-400" : "text-gray-900"}`}
        >
          <option value="">{loading ? "Loading..." : placeholder}</option>
          {options.map((o) => (
            <option key={o.id} value={String(o.id)}>
              {o.name}
              {o.code ? ` (${o.code})` : ""}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 size={15} className="animate-spin text-gray-400" />
          ) : (
            <ChevronDown size={15} className="text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // Geography state
  const [islandGroups, setIslandGroups] = useState<GeoItem[]>([]);
  const [regions, setRegions] = useState<GeoItem[]>([]);
  const [provinces, setProvinces] = useState<GeoItem[]>([]);
  const [municipalities, setMunicipalities] = useState<GeoItem[]>([]);
  const [barangays, setBarangays] = useState<GeoItem[]>([]);

  const [selIsland, setSelIsland] = useState("");
  const [selRegion, setSelRegion] = useState("");
  const [selProvince, setSelProvince] = useState("");
  const [selMunicipality, setSelMunicipality] = useState("");

  const [geoLoading, setGeoLoading] = useState<Record<string, boolean>>({});

  const geoFetch = async (
    type: string,
    params: Record<string, string> = {},
  ): Promise<GeoItem[]> => {
    const q = new URLSearchParams({ type, ...params });
    const res = await fetch(`/api/geography/public?${q}`);
    const d = await res.json();
    return Array.isArray(d) ? d : [];
  };

  // Load island groups once
  // Load island groups once
  useEffect(() => {
    geoFetch("island-groups")
      .then(setIslandGroups)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selIsland)
      return void (setRegions([]),
      setSelRegion(""),
      setProvinces([]),
      setSelProvince(""),
      setMunicipalities([]),
      setSelMunicipality(""),
      setBarangays([]));
    setGeoLoading((l) => ({ ...l, regions: true }));
    geoFetch("regions", { islandGroupId: selIsland })
      .then((d) => {
        setRegions(d);
        setSelRegion("");
        setProvinces([]);
        setSelProvince("");
        setMunicipalities([]);
        setSelMunicipality("");
        setBarangays([]);
      })
      .finally(() => setGeoLoading((l) => ({ ...l, regions: false })));
  }, [selIsland]);

  useEffect(() => {
    if (!selRegion)
      return void (setProvinces([]),
      setSelProvince(""),
      setMunicipalities([]),
      setSelMunicipality(""),
      setBarangays([]));
    setGeoLoading((l) => ({ ...l, provinces: true }));
    geoFetch("provinces", { regionId: selRegion })
      .then((d) => {
        setProvinces(d);
        setSelProvince("");
        setMunicipalities([]);
        setSelMunicipality("");
        setBarangays([]);
      })
      .finally(() => setGeoLoading((l) => ({ ...l, provinces: false })));
  }, [selRegion]);

  useEffect(() => {
    if (!selProvince)
      return void (setMunicipalities([]),
      setSelMunicipality(""),
      setBarangays([]));
    setGeoLoading((l) => ({ ...l, municipalities: true }));
    geoFetch("municipalities", { provinceId: selProvince })
      .then((d) => {
        setMunicipalities(d);
        setSelMunicipality("");
        setBarangays([]);
      })
      .finally(() => setGeoLoading((l) => ({ ...l, municipalities: false })));
  }, [selProvince]);

  useEffect(() => {
    if (!selMunicipality) return void setBarangays([]);
    setGeoLoading((l) => ({ ...l, barangays: true }));
    geoFetch("barangays", { municipalityId: selMunicipality })
      .then((d) => {
        setBarangays(d);
      })
      .finally(() => setGeoLoading((l) => ({ ...l, barangays: false })));
  }, [selMunicipality]);

  const form = useForm<SignUpFormInput, any, SignUpFormType>({
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      address: "",
      confirmPassword: "",
      contactNumber: "",
      type: "resident",
      age: 0,
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

  // Shared input class
  const inputCls = (hasError: boolean) =>
    `flex h-11 w-full rounded-md border ${hasError ? "border-red-500" : "border-gray-300"} bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`;

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left side hero — unchanged */}
      <div className="hidden lg:flex w-1/2 bg-gray-50 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-100" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
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

      {/* Right side form */}
      <div className="w-full md:mt-6 lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-teal-900 font-bold text-xl">E!</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Sign up for E-Sumbong
            </h2>
            <p className="text-sm text-gray-500">
              Create your account to report concerns in your barangay
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                      placeholder="you@example.com"
                      {...field}
                      className={inputCls(!!fieldState.error)}
                    />
                    <FormMessage className="text-xs text-red-500" />
                  </div>
                )}
              />

              {/* Full name */}
              <FormField
                control={form.control}
                name="fullname"
                render={({ field, fieldState }) => (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Full name
                    </label>
                    <input
                      type="text"
                      placeholder="Juan Dela Cruz"
                      {...field}
                      className={inputCls(!!fieldState.error)}
                    />
                    <FormMessage className="text-xs text-red-500" />
                  </div>
                )}
              />

              {/* Age + Contact */}
              <div className="flex gap-3">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field, fieldState }) => (
                    <div className="space-y-1 flex-1">
                      <label className="text-sm font-medium text-gray-700">
                        Age
                      </label>
                      <input
                        type="number"
                        placeholder="25"
                        {...field}
                        value={(field.value as number) ?? ""}
                        className={inputCls(!!fieldState.error)}
                      />
                      <FormMessage className="text-xs text-red-500" />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field, fieldState }) => (
                    <div className="space-y-1 flex-1">
                      <label className="text-sm font-medium text-gray-700">
                        Contact number
                      </label>
                      <input
                        type="tel"
                        placeholder="09XXXXXXXXX"
                        {...field}
                        className={inputCls(!!fieldState.error)}
                      />
                      <FormMessage className="text-xs text-red-500" />
                    </div>
                  )}
                />
              </div>

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field, fieldState }) => (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      House / Street address
                    </label>
                    <input
                      type="text"
                      placeholder="House no., Street name"
                      {...field}
                      className={inputCls(!!fieldState.error)}
                    />
                    <FormMessage className="text-xs text-red-500" />
                  </div>
                )}
              />

              {/* ── Location section ─────────────────────────────────────────── */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-teal-600" />
                  <p className="text-sm font-semibold text-gray-700">
                    Your location
                  </p>
                </div>
                <p className="text-xs text-gray-400 -mt-1">
                  Select your barangay so your concerns reach the right
                  officials.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <GeoSelect
                    label="Island group"
                    placeholder="Select island"
                    value={selIsland}
                    onChange={setSelIsland}
                    options={islandGroups}
                  />
                  <GeoSelect
                    label="Region"
                    placeholder="Select region"
                    value={selRegion}
                    onChange={setSelRegion}
                    options={regions}
                    disabled={!selIsland}
                    loading={geoLoading.regions}
                  />
                  <GeoSelect
                    label="Province"
                    placeholder="Select province"
                    value={selProvince}
                    onChange={setSelProvince}
                    options={provinces}
                    disabled={!selRegion}
                    loading={geoLoading.provinces}
                  />
                  <GeoSelect
                    label="Municipality"
                    placeholder="Select municipality"
                    value={selMunicipality}
                    onChange={setSelMunicipality}
                    options={municipalities}
                    disabled={!selProvince}
                    loading={geoLoading.municipalities}
                  />
                </div>

                {/* Barangay — full width, prominent */}
                <Controller
                  control={form.control}
                  name="barangayId"
                  render={({ field, fieldState }) => (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Barangay
                      </label>
                      <div className="relative">
                        <select
                          value={field.value ? String(field.value) : ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            )
                          }
                          disabled={!selMunicipality || geoLoading.barangays}
                          className={`flex h-11 w-full rounded-md border appearance-none pr-10 pl-3 py-2 text-sm
                            bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all
                            ${fieldState.error ? "border-red-500" : "border-gray-300"}
                            ${!selMunicipality ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "cursor-pointer text-gray-900"}`}
                        >
                          <option value="">
                            {geoLoading.barangays
                              ? "Loading barangays..."
                              : !selMunicipality
                                ? "Select a municipality first"
                                : "Select your barangay"}
                          </option>
                          {barangays.map((b) => (
                            <option key={b.id} value={String(b.id)}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                          {geoLoading.barangays ? (
                            <Loader2
                              size={15}
                              className="animate-spin text-gray-400"
                            />
                          ) : (
                            <ChevronDown size={15} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                      {fieldState.error && (
                        <p className="text-xs text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              {/* ── End location ─────────────────────────────────────────────── */}

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
                        placeholder="Min. 8 characters"
                        {...field}
                        className={inputCls(!!fieldState.error) + " pr-10"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

              {/* Confirm password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Confirm password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repeat your password"
                        {...field}
                        className={inputCls(!!fieldState.error) + " pr-10"}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
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
                className="w-full h-11 mt-2 bg-teal-800 text-white font-medium rounded-md hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-lg cursor-pointer"
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
                  "Create account"
                )}
              </button>
            </form>
          </Form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-teal-700 hover:text-teal-800 hover:underline transition-all"
            >
              Login here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
