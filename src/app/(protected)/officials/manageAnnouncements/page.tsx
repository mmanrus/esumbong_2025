"use client";
import Tiptap from "@/components/MenuBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [form, setForm] = useState({
    title: "",
    announcement: "",
  });
  const handleChange = (field: any, value: any) => {
    if (field === "files") {
      setForm((prev) => ({ ...prev, files: Array.from(value) }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("announcement", form.announcement);
      // Submit formData to your API endpoint
      const res = await fetch("/api/announcement", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to add announcement");
        return;
      }
      toast.success("Announcement added successfully");
      setForm({
        title: "",
        announcement: "",
      });
      return;
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the announcement.");
      return;
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-6 text-[#1F4251] flex items-center space-x-3">
        <i data-lucide="megaphone" className="w-7 h-7"></i>
        <span>Manage Announcements</span>
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <form
          id="announcementForm"
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            placeholder="Title of Announcement"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          <Tiptap
            content={form.announcement}
            onChange={(html: string) => handleChange("announcement", html)}
          />
          <Button
            type="submit"
            className="cursor-pointer bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700"
          >
            Add Announcement
          </Button>
        </form>
        <hr className="my-6" />
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Current Announcements
        </h3>
        <ul id="announcementList" className="space-y-3 text-gray-800">
          <li className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded">
            📢 Barangay Council Meeting at 9 AM on October 12.
          </li>
          <li className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
            ⚠️ Submit all pending reports before Friday.
          </li>
        </ul>
      </div>
    </>
  );
}
