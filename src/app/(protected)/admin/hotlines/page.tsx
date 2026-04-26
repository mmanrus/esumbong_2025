"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";
import { ICON_OPTIONS, getIcon } from "@/components/hotlinePanel";
import { useAuth } from "@/contexts/authContext"; // however you access the user

const COLOR_PRESETS = [
  {
    label: "Blue",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    iconBg: "bg-blue-500",
  },
  {
    label: "Red",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    iconBg: "bg-red-500",
  },
  {
    label: "Orange",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    iconBg: "bg-orange-500",
  },
  {
    label: "Green",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    iconBg: "bg-green-500",
  },
  {
    label: "Indigo",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    iconBg: "bg-indigo-600",
  },
  {
    label: "Teal",
    bg: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-700",
    iconBg: "bg-teal-500",
  },
];

type Hotline = {
  id?: number;
  label: string;
  number: string;
  icon: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconBg: string;
  isNew?: boolean;
};

const BLANK: Omit<Hotline, "id"> = {
  label: "",
  number: "",
  icon: "Phone",
  bgColor: "bg-blue-50",
  borderColor: "border-blue-200",
  textColor: "text-blue-700",
  iconBg: "bg-blue-500",
  isNew: true,
};

export default function ManageHotlinesPage() {
  const [hotlines, setHotlines] = useState<Hotline[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | string | null>(null);
  const { user } = useAuth();
  const barangayId = user?.barangayId;
  useEffect(() => {
      fetch(`/api/hotline?barangayId=${barangayId}`)
      .then((r) => r.json())
      .then((data) => setHotlines(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const addNew = () =>
    setHotlines((prev) => [...prev, { ...BLANK, id: undefined }]);

  const update = (index: number, field: keyof Hotline, value: string) => {
    setHotlines((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)),
    );
  };

  const applyPreset = (index: number, preset: (typeof COLOR_PRESETS)[0]) => {
    setHotlines((prev) =>
      prev.map((h, i) =>
        i === index
          ? {
              ...h,
              bgColor: preset.bg,
              borderColor: preset.border,
              textColor: preset.text,
              iconBg: preset.iconBg,
            }
          : h,
      ),
    );
  };

  const save = async (index: number) => {
    const h = hotlines[index];
    setSaving(index);
    try {
      const isNew = !h.id;
      // POST / PATCH on save
      const res = await fetch(isNew ? "/api/hotline" : `/api/hotline/${h.id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(h),
      });
      const saved = await res.json();
      if (!res.ok) throw new Error(saved.error);
      setHotlines((prev) =>
        prev.map((item, i) =>
          i === index ? { ...saved, isNew: false } : item,
        ),
      );
    } catch (err) {
      alert("Failed to save: " + (err as Error).message);
    } finally {
      setSaving(null);
    }
  };

  const remove = async (index: number) => {
    const h = hotlines[index];
    if (h.id) {
      await fetch(`/api/hotline/${h.id}`, { method: "DELETE" });
    }
    setHotlines((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading)
    return <div className="p-8 text-gray-400">Loading hotlines...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Emergency Hotlines
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure hotlines shown to residents
          </p>
        </div>
        <button
          onClick={addNew}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white
                     rounded-lg hover:bg-teal-700 transition text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> Add Hotline
        </button>
      </div>

      {hotlines.length === 0 && (
        <div className="text-center py-16 text-gray-400 border-2 border-dashed rounded-xl">
          No hotlines yet. Click "Add Hotline" to get started.
        </div>
      )}

      <div className="flex flex-col gap-4">
        {hotlines.map((h, index) => {
          const Icon = getIcon(h.icon);
          return (
            <div
              key={h.id ?? `new-${index}`}
              className={`rounded-xl border p-4 ${h.bgColor} ${h.borderColor}`}
            >
              <div className="flex items-start gap-3">
                {/* Preview icon */}
                <div
                  className={`${h.iconBg} p-2.5 rounded-lg shadow-sm shrink-0 mt-1`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Label */}
                  <input
                    value={h.label}
                    onChange={(e) => update(index, "label", e.target.value)}
                    placeholder="Label (e.g. Police)"
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                  {/* Number */}
                  <input
                    value={h.number}
                    onChange={(e) => update(index, "number", e.target.value)}
                    placeholder="Number (e.g. 166)"
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />

                  {/* Icon picker */}
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-500 mb-1.5 font-medium">
                      Icon
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ICON_OPTIONS.map(({ name, Icon: Ic }) => (
                        <button
                          key={name}
                          onClick={() => update(index, "icon", name)}
                          className={`p-2 rounded-lg border-2 transition
                            ${
                              h.icon === name
                                ? "border-teal-500 bg-teal-50"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          title={name}
                        >
                          <Ic className="w-4 h-4 text-gray-600" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color preset picker */}
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-500 mb-1.5 font-medium">
                      Color
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => applyPreset(index, preset)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border-2 transition
                            ${preset.text} ${preset.bg} ${preset.border}
                            ${h.bgColor === preset.bg ? "ring-2 ring-offset-1 ring-teal-500" : ""}`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => save(index)}
                    disabled={saving === index}
                    className="p-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition disabled:opacity-50"
                    title="Save"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => remove(index)}
                    className="p-2 rounded-lg bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
