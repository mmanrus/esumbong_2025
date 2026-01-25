"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Page() {
  const [form, setForm] = useState({
    fullname: "Juan Dela Cruz",
    email: "juan@email.com",
    contact: "09123456789",
  });
  const [loading, setLoading] = useState(false);
  // Generic handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData()
      formData.append("fullname", form.fullname)
      formData.append("email", form.email)
      formData.append("contact", form.contact)
      formData.append("password", "") // No password change for now
      const res = await fetch("/api/profile/update", {
        method: "PATCH",
        body: formData
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error)
        return
      }
      toast.success("Profile updated successfully.")
    } catch(e) {
      toast.error("Failed to update profile.")
    }
  
  }
  return (
    <>
      <h2 className="text-3xl font-bold mb-4">Manage Profile</h2>

      <form className="bg-white p-6 md:p-8 rounded-xl shadow-md space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-2 font-medium text-lg">Full Name</label>
          <Input
            name="fullName"
            value={form.fullname}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-lg">
            Email Address
          </label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-lg">
            Contact Number
          </label>
          <Input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            className="w-full"
          />
        </div>

       
        <div className="flex justify-center">
          <Button
            type="submit"
            className={clsx(
              `bg-green-600 text-white px-6 py-3 
                         rounded-md hover:bg-green-700 text-lg
                         font-semibold transition`,
              loading && "bg-green-950"
            )}
            disabled={loading}
          >
            <span>{loading ? "Updating..." : "Update Profile"}</span>
          </Button>
        </div>
      </form>
    </>
  );
}
