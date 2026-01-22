"use client";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { AnnouncementForm, AnnouncementFormSchema } from "@/defs/announcements";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
export default function Page() {
  const [form, setForm] = useState<AnnouncementForm>({
    title: "",
    announcement: "",
    notifyResidents: false,
    notifyOfficials: false,
  });
  const [isLoading, setIsLoading] = useState(false)
  const handleChange = (field: any, value: any) => {
      setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true)
    const validation = AnnouncementFormSchema.safeParse(form);
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
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("announcement", form.announcement);
      formData.append("notifyResidents", String(form.notifyResidents || false));
      formData.append("notifyOfficials", String(form.notifyOfficials || false));
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
        notifyResidents: false,
        notifyOfficials: false,
      });
      setIsLoading(false)
      return;
    } catch (error) {

      console.error(error);
      toast.error("An error occurred while adding the announcement.");
      return;
    } finally {
      setIsLoading(false)
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

          <SimpleEditor
            content={form.announcement}
            onChange={(html: string) => handleChange("announcement", html)}
          />
          <div className="flex flex-row gap-3 justify-start">
            <Button
              type="submit"
              className="cursor-pointer bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700"
              disabled={!form.title || !form.announcement || isLoading }
            >
              Add Announcement
            </Button>
            <div className="flex items-center space-x-2">
              <Switch
                id="notify-officials"
                checked={form.notifyOfficials}
                onCheckedChange={(checked) =>
                  handleChange("notifyOfficials", checked)
                }
              />
              <Label htmlFor="notify-officials">Notify Officials</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="notify-residents"
                checked={form.notifyResidents}
                onCheckedChange={(checked) =>
                  handleChange("notifyResidents", checked)
                }
              />
              <Label htmlFor="notify-residents">Notify Residents</Label>
            </div>
          </div>
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
