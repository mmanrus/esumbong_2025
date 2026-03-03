"use client";

import { useState } from "react";
import Header from "@/components/atoangUI/headers";
import { Button } from "@/components/ui/button";

export default function EmergencyPage() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Water Supply Maintenance",
      description:
        "Scheduled water supply interruption on March 15-16 for main line repairs.",
      date: "March 10, 2026",
      priority: "high",
      icon: "💧",
    },
    {
      id: 2,
      title: "Community Health Drive",
      description:
        "Free vaccination and health check-up program at barangay center.",
      date: "March 12, 2026",
      priority: "medium",
      icon: "🏥",
    },
    {
      id: 3,
      title: "Road Repair Updates",
      description:
        "Pothole repair works ongoing on Main Street. Please use alternate routes.",
      date: "March 8, 2026",
      priority: "medium",
      icon: "🚧",
    },
  ]);

  const hotlines = [
    { name: "Emergency Hotline", number: "911", available: "24/7" },
    {
      name: "Barangay Office",
      number: "(555) 123-4567",
      available: "9 AM - 5 PM",
    },
    { name: "Fire Department", number: "(555) 234-5678", available: "24/7" },
    { name: "Police Station", number: "(555) 345-6789", available: "24/7" },
    { name: "Medical Emergency", number: "(555) 456-7890", available: "24/7" },
    {
      name: "Disaster Management",
      number: "(555) 567-8901",
      available: "24/7",
    },
  ];

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnnouncement = {
      id: announcements.length + 1,
      ...formData,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      icon: formData.priority === "high" ? "⚠️" : "📢",
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setFormData({ title: "", description: "", priority: "medium" });
    setShowAddForm(false);
  };

  const handleDeleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  return (
    <main>
      <Header />
      <section className="py-12 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Emergency & Announcements
            </h1>
            <p className="text-xl text-gray-600">
              Stay informed with critical updates and emergency contact
              information for your community.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Emergency Hotlines - Sidebar */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8 sticky top-4">
                <h2 className="text-2xl font-bold text-teal-700 mb-6">
                  Emergency Hotlines
                </h2>
                <div className="space-y-4">
                  {hotlines.map((hotline, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <p className="font-semibold text-gray-900">
                        {hotline.name}
                      </p>
                      <a
                        href={`tel:${hotline.number.replace(/\D/g, "")}`}
                        className="text-teal-600 font-bold text-lg hover:text-teal-800 transition"
                      >
                        {hotline.number}
                      </a>
                      <p className="text-sm text-gray-500 mt-1">
                        {hotline.available}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Announcements - Main Content */}
            <div className="lg:col-span-2">
              {/* Add Announcement Button */}
              <div className="mb-8">
                <Button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-2 rounded-lg"
                >
                  {showAddForm ? "Cancel" : "+ Add Announcement"}
                </Button>
              </div>

              {/* Add Form */}
              {showAddForm && (
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-2 border-yellow-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    New Announcement
                  </h3>
                  <form onSubmit={handleAddAnnouncement} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Enter announcement title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Enter announcement details"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Priority Level
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) =>
                          setFormData({ ...formData, priority: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg"
                    >
                      Post Announcement
                    </Button>
                  </form>
                </div>
              )}

              {/* Announcements List */}
              <div className="space-y-6">
                {announcements.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <p className="text-gray-500 text-lg">
                      No announcements at this time.
                    </p>
                  </div>
                ) : (
                  announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-teal-500 hover:shadow-xl transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">
                              {announcement.icon}
                            </span>
                            <h3 className="text-2xl font-bold text-gray-900">
                              {announcement.title}
                            </h3>
                          </div>
                          <p className="text-gray-700 mb-4">
                            {announcement.description}
                          </p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-sm text-gray-500">
                              📅 {announcement.date}
                            </span>
                            <span
                              className={`text-xs font-semibold px-3 py-1 rounded-full border ${getPriorityColor(
                                announcement.priority,
                              )}`}
                            >
                              {announcement.priority.charAt(0).toUpperCase() +
                                announcement.priority.slice(1)}{" "}
                              Priority
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleDeleteAnnouncement(announcement.id)
                          }
                          className="text-red-500 hover:text-red-700 font-bold text-lg transition"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
