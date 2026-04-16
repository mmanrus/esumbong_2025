"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  PageHeader,
  LoadingSkeleton,
  ErrorBanner,
  Badge,
} from "@/components/atoangUI/ui";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Barangay {
  id: number;
  name: string;
  municipality?: {
    name: string;
    province?: { name: string; region?: { code: string } };
  };
  _count?: { users: number; concerns: number };
}

export default function BarangaysPage() {
  const router = useRouter();
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/super-admin/barangays")
      .then((r) => r.json())
      .then((data) => {
        setBarangays(Array.isArray(data) ? data : (data.data ?? []));
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load barangays.");
        setLoading(false);
      });
  }, []);

  const filtered = barangays.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.municipality?.name.toLowerCase().includes(search.toLowerCase()) ||
      b.municipality?.province?.name
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Barangays"
        sub={`${barangays.length} barangays registered`}
      />

      {/* Search */}
      <div className="relative mt-2 mb-5">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search by barangay, municipality, or province..."
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
                  "Barangay",
                  "Municipality",
                  "Province",
                  "Region",
                  "Users",
                  "Concerns",
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
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {b.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {b.municipality?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {b.municipality?.province?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      label={b.municipality?.province?.region?.code ?? "—"}
                      variant="blue"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {b._count?.users ?? 0}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {b._count?.concerns ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        router.push(`/super-admin/barangays/${b.id}`)
                      }
                      className="px-3 py-1 text-xs text-blue-500 border border-gray-200 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-gray-400"
                  >
                    No barangays found.
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
