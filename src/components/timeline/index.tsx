"use client";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/formatDate";

export interface TimelineUpdate {
  id: number;
  title: string;
  message: string;
  type: string;
  createdAt: string;
}

interface TimelineProps {
  updates: TimelineUpdate[];
}

export default function Timeline({ updates }: TimelineProps) {
  if (!updates || updates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No updates yet. Check back later for progress.
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "approved":
      case "resolved":
      case "completed":
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case "pending":
      case "in_progress":
        return <Clock className="h-5 w-5 text-amber-600" />;
      case "rejected":
      case "denied":
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type?.toLowerCase()) {
      case "approved":
      case "resolved":
      case "completed":
        return "bg-emerald-50";
      case "pending":
      case "in_progress":
        return "bg-amber-50";
      case "rejected":
      case "denied":
      case "error":
        return "bg-red-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="relative space-y-6">
      {/* Timeline line */}
      <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-blue-200 to-gray-200"></div>

      {updates.map((update, index) => (
        <div key={update.id} className="relative pl-12">
          {/* Timeline dot */}
          <div className={`absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center ${getIconBg(update.type)} border-2 border-white shadow-sm`}>
            {getIcon(update.type)}
          </div>

          {/* Content card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {update.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(new Date(update.createdAt))}
                </p>
              </div>
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                update.type?.toLowerCase() === "approved" || update.type?.toLowerCase() === "resolved"
                  ? "bg-emerald-100 text-emerald-700"
                  : update.type?.toLowerCase() === "pending" || update.type?.toLowerCase() === "in_progress"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {update.type}
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-3 leading-relaxed">
              {update.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
