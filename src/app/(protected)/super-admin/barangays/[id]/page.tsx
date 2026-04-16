"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  PageHeader,
  LoadingSkeleton,
  ErrorBanner,
  Badge,
  Section,
  Avatar,
} from "@/components/atoangUI/ui";

const API = process.env.NEXT_PUBLIC_API_URL;

const STATUS_VARIANTS: Record<
  string,
  "blue" | "green" | "red" | "amber" | "gray" | "purple"
> = {
  pending: "amber",
  inProgress: "blue",
  verified: "purple",
  approved: "green",
  rejected: "red",
  resolved: "green",
  unresolved: "gray",
  canceled: "gray",
};

interface BarangayStats {
  barangay: { id: number; name: string };
  assignedAdmin: {
    id: number;
    fullname: string;
    email: string;
    isActive: boolean;
  } | null;
  stats: {
    totalUsers: number;
    totalFeedback: number;
    concernsByStatus: { status: string; _count: { status: number } }[];
  };
}

export default function BarangayDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<BarangayStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/super-admin/barangays/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load barangay details.");
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="p-8">
        <LoadingSkeleton />
      </div>
    );
  if (error)
    return (
      <div className="p-8">
        <ErrorBanner message={error} />
      </div>
    );
  if (!data) return null;

  const { barangay, assignedAdmin, stats } = data;
  const totalConcerns = stats.concernsByStatus.reduce(
    (a, c) => a + c._count.status,
    0,
  );

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-5 transition-colors cursor-pointer"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <PageHeader title={barangay.name} sub="Barangay detail and statistics" />

      {/* Stat mini cards */}
      <div className="grid grid-cols-3 gap-4 mt-2">
        {[
          { label: "Total users", value: stats.totalUsers },
          { label: "Total feedback", value: stats.totalFeedback },
          { label: "Total concerns", value: totalConcerns },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white border border-gray-100 rounded-xl px-5 py-4"
          >
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
              {label}
            </p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Concerns by status */}
      <Section title="Concerns by status">
        {stats.concernsByStatus.length === 0 ? (
          <p className="text-sm text-gray-400">No concerns yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {stats.concernsByStatus.map((row) => (
              <div
                key={row.status}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm"
              >
                <Badge
                  label={row.status}
                  variant={STATUS_VARIANTS[row.status] ?? "gray"}
                />
                <span className="font-semibold text-gray-800">
                  {row._count.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Assigned admin */}
      <Section title="Assigned admin">
        {!assignedAdmin ? (
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-400">
              No admin assigned to this barangay.
            </p>
            <button
              onClick={() =>
                router.push(`/super-admin/admins/assign?barangayId=${id}`)
              }
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Assign admin
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-4 py-3">
            <Avatar name={assignedAdmin.fullname} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {assignedAdmin.fullname}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {assignedAdmin.email}
              </p>
            </div>
            <Badge
              label={assignedAdmin.isActive ? "Active" : "Inactive"}
              variant={assignedAdmin.isActive ? "green" : "gray"}
            />
          </div>
        )}
      </Section>
    </div>
  );
}
