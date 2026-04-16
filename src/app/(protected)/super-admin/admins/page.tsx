"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";
import {
  PageHeader,
  LoadingSkeleton,
  ErrorBanner,
  Badge,
  Avatar,
} from "@/components/atoangUI/ui";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Admin {
  id: number;
  fullname: string;
  email: string;
  contactNumber: string;
  isActive: boolean;
  isVerified: boolean;
  createAt: string;
  barangayId: number | null;
  barangay?: {
    id: number;
    name: string;
    municipality?: { name: string };
  } | null;
}

export default function AdminsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deactivating, setDeactivating] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const fetchAdmins = () => {
    setLoading(true);
    fetch("/api/super-admin/admins")
      .then((r) => r.json())
      .then((data) => {
        setAdmins(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load admins.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDeactivate = async (adminId: number) => {
    if (
      !confirm("Deactivate this admin? They will no longer be able to log in.")
    )
      return;
    setDeactivating(adminId);
    const token = localStorage.getItem("token");
    try {
      fetch(`/api/super-admin/admins/${adminId}?action=deactivate`, {
        method: "PATCH",
      });
      fetchAdmins();
    } catch {
      alert("Failed to deactivate admin.");
    } finally {
      setDeactivating(null);
    }
  };

  const filtered = admins.filter(
    (a) =>
      a.fullname.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.barangay?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Admins"
        sub={`${admins.length} barangay admins`}
        action={
          <button
            onClick={() => router.push("/super-admin/admins/assign")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
          >
            <Plus size={15} />
            Assign new admin
          </button>
        }
      />

      {/* Search */}
      <div className="relative mt-2 mb-5">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search by name, email, or barangay..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-white outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
        />
      </div>

      {loading && <LoadingSkeleton />}
      {error && <ErrorBanner message={error} />}

      {!loading && !error && (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {[
                  "Admin",
                  "Email",
                  "Barangay",
                  "Municipality",
                  "Status",
                  "Created",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((admin) => (
                <tr
                  key={admin.id}
                  className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${!admin.isActive ? "opacity-50" : ""}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={admin.fullname} />
                      <span className="font-medium text-gray-800">
                        {admin.fullname}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{admin.email}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {admin.barangay?.name ?? (
                      <span className="text-gray-300">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {admin.barangay?.municipality?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      label={admin.isActive ? "Active" : "Inactive"}
                      variant={admin.isActive ? "green" : "gray"}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(admin.createAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center flex-col gap-2">
                      <button
                        onClick={() =>
                          router.push(
                            `/super-admin/admins/assign?reassign=${admin.id}`,
                          )
                        }
                        className="px-3 py-1 text-xs text-blue-500 border border-gray-200 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        Reassign
                      </button>
                      {admin.isActive && (
                        <button
                          onClick={() => handleDeactivate(admin.id)}
                          disabled={deactivating === admin.id}
                          className="px-3 py-1 text-xs text-red-400 border border-red-100 rounded-md hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {deactivating === admin.id ? "..." : "Deactivate"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-gray-400"
                  >
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
