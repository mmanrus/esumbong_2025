"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Building2,
  Mail,
  Phone,
  MessageSquare,
  User,
  ChevronRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const timeSlots = [
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
];

const residentRanges = [
  "Under 1,000",
  "1,000 - 5,000",
  "5,000 - 10,000",
  "10,000 - 20,000",
  "Over 20,000",
];

type FormData = {
  barangayName: string;
  officialName: string;
  email: string;
  phone: string;
  numberOfResidents: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialForm: FormData = {
  barangayName: "",
  officialName: "",
  email: "",
  phone: "",
  numberOfResidents: "",
  preferredDate: "",
  preferredTime: "",
  message: "",
};

function validate(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.barangayName.trim()) errors.barangayName = "Barangay name is required.";
  if (!form.officialName.trim()) errors.officialName = "Official name is required.";
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "A valid email is required.";
  if (!form.phone.trim()) errors.phone = "Phone number is required.";
  if (!form.numberOfResidents) errors.numberOfResidents = "Please select a range.";
  return errors;
}

export default function BookDemo() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const newErrors = validate(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/book-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, submittedAt: new Date().toISOString() }),
      });

      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or contact us directly.");
    }
  };

  if (status === "success") {
    return (
      <section className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-teal-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-teal-800 mb-4">Request Received!</h2>
          <p className="text-muted-foreground text-lg mb-3 leading-relaxed">
            Thank you, <span className="font-semibold text-teal-700">{form.officialName}</span>! We've received your demo request for{" "}
            <span className="font-semibold text-teal-700">Barangay {form.barangayName}</span>.
          </p>
          <p className="text-muted-foreground mb-8">
            Our team will reach out to you within 24 hours to confirm your schedule.
          </p>
          <button
            onClick={() => { setForm(initialForm); setStatus("idle"); }}
            className="inline-flex items-center gap-2 bg-teal-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            Book Another Demo
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-teal-50 to-white px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-yellow-400 text-teal-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
            Free Demo
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            See e-Sumbong in Action
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Schedule a personalized walkthrough for your barangay. We'll show you how e-Sumbong can transform your community's concern management.
          </p>
        </div>

        {/* What to expect */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Clock, label: "30-minute session", sub: "Focused and efficient" },
            { icon: Users, label: "For barangay officials", sub: "Tailored to your needs" },
            { icon: CheckCircle2, label: "No commitment", sub: "Completely free" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Form header */}
          <div className="bg-teal-600 px-8 py-6">
            <h2 className="text-xl font-bold text-white">Your Information</h2>
            <p className="text-teal-100 text-sm mt-1">Fill in your barangay details to get started</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Barangay Name */}
              <FormField
                label="Barangay Name"
                icon={<Building2 className="w-4 h-4" />}
                error={errors.barangayName}
              >
                <input
                  name="barangayName"
                  value={form.barangayName}
                  onChange={handleChange}
                  placeholder="e.g. Barangay San Jose"
                  className={inputClass(!!errors.barangayName)}
                />
              </FormField>

              {/* Official Name */}
              <FormField
                label="Official's Name"
                icon={<User className="w-4 h-4" />}
                error={errors.officialName}
              >
                <input
                  name="officialName"
                  value={form.officialName}
                  onChange={handleChange}
                  placeholder="e.g. Kagawad Maria Santos"
                  className={inputClass(!!errors.officialName)}
                />
              </FormField>

              {/* Email */}
              <FormField
                label="Email Address"
                icon={<Mail className="w-4 h-4" />}
                error={errors.email}
              >
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="official@email.com"
                  className={inputClass(!!errors.email)}
                />
              </FormField>

              {/* Phone */}
              <FormField
                label="Phone Number"
                icon={<Phone className="w-4 h-4" />}
                error={errors.phone}
              >
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+63 912 345 6789"
                  className={inputClass(!!errors.phone)}
                />
              </FormField>

              {/* Number of Residents */}
              <FormField
                label="Number of Residents"
                icon={<Users className="w-4 h-4" />}
                error={errors.numberOfResidents}
              >
                <select
                  name="numberOfResidents"
                  value={form.numberOfResidents}
                  onChange={handleChange}
                  className={inputClass(!!errors.numberOfResidents)}
                >
                  <option value="">Select range...</option>
                  {residentRanges.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </FormField>

              {/* Preferred Date */}
              <FormField
                label="Preferred Date"
                icon={<Calendar className="w-4 h-4" />}
              >
                <input
                  name="preferredDate"
                  type="date"
                  value={form.preferredDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={inputClass(false)}
                />
              </FormField>

              {/* Preferred Time */}
              <FormField
                label="Preferred Time Slot"
                icon={<Clock className="w-4 h-4" />}
              >
                <select
                  name="preferredTime"
                  value={form.preferredTime}
                  onChange={handleChange}
                  className={inputClass(false)}
                >
                  <option value="">Any time works</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </FormField>

              {/* Message - full width */}
              <div className="md:col-span-2">
                <FormField
                  label="Additional Notes"
                  icon={<MessageSquare className="w-4 h-4" />}
                  optional
                >
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your barangay's main challenges or specific features you'd like to see..."
                    className={`${inputClass(false)} resize-none`}
                  />
                </FormField>
              </div>
            </div>

            {/* Error banner */}
            {status === "error" && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                🔒 Your information is kept private and never shared.
              </p>
              <button
                onClick={handleSubmit}
                disabled={status === "loading"}
                className="inline-flex items-center gap-2 bg-teal-600 text-white font-bold py-3 px-10 rounded-lg hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 text-base shadow-md hover:shadow-lg"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Book My Free Demo
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Prefer to reach us directly?{" "}
          <a href="mailto:hello@esumbong.ph" className="text-teal-600 font-medium hover:underline">
            hello@esumbong.ph
          </a>
        </p>
      </div>
    </section>
  );
}

/* ─── Helpers ────────────────────────────────────────────── */

function inputClass(hasError: boolean) {
  return [
    "w-full rounded-lg border px-4 py-2.5 text-sm text-foreground bg-white",
    "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent",
    "placeholder:text-gray-400 transition-colors duration-150",
    hasError ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-teal-300",
  ].join(" ");
}

function FormField({
  label,
  icon,
  error,
  optional = false,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
        <span className="text-teal-600">{icon}</span>
        {label}
        {optional && <span className="text-gray-400 font-normal">(optional)</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}