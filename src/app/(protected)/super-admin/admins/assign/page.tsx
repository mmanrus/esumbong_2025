"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";
import {
  PageHeader,
  ErrorBanner,
  Card,
  FormRow,
  inputCls,
  selectCls,
} from "@/components/atoangUI/ui";

interface GeoItem {
  id: number;
  name: string;
  code?: string;
  _count?: Record<string, number>;
}

export default function AssignAdminPage() {
  const router = useRouter();
  const params = useSearchParams();
  const reassignId = params.get("reassign");
  const prefillBarangayId = params.get("barangayId");
  const isReassign = !!reassignId;

  const [islandGroups, setIslandGroups] = useState<GeoItem[]>([]);
  const [regions, setRegions] = useState<GeoItem[]>([]);
  const [provinces, setProvinces] = useState<GeoItem[]>([]);
  const [municipalities, setMunicipalities] = useState<GeoItem[]>([]);
  const [barangays, setBarangays] = useState<GeoItem[]>([]);

  const [selectedIsland, setSelectedIsland] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState(
    prefillBarangayId ?? "",
  );

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    contactNumber: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ── Geography fetches — all go through Next.js API proxy ──────────────────
  useEffect(() => {
    fetch("/api/super-admin/geography?type=island-groups")
      .then((r) => r.json())
      .then((d) => setIslandGroups(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedIsland) return void setRegions([]);
    fetch(
      `/api/super-admin/geography?type=regions&islandGroupId=${selectedIsland}`,
    )
      .then((r) => r.json())
      .then((d) => setRegions(Array.isArray(d) ? d : []))
      .catch(() => {});
    setSelectedRegion("");
    setProvinces([]);
    setSelectedProvince("");
    setMunicipalities([]);
    setSelectedMunicipality("");
    setBarangays([]);
    setSelectedBarangay("");
  }, [selectedIsland]);

  useEffect(() => {
    if (!selectedRegion) return void setProvinces([]);
    fetch(
      `/api/super-admin/geography?type=provinces&regionId=${selectedRegion}`,
    )
      .then((r) => r.json())
      .then((d) => setProvinces(Array.isArray(d) ? d : []))
      .catch(() => {});
    setSelectedProvince("");
    setMunicipalities([]);
    setSelectedMunicipality("");
    setBarangays([]);
    setSelectedBarangay("");
  }, [selectedRegion]);

  useEffect(() => {
    if (!selectedProvince) return void setMunicipalities([]);
    fetch(
      `/api/super-admin/geography?type=municipalities&provinceId=${selectedProvince}`,
    )
      .then((r) => r.json())
      .then((d) => setMunicipalities(Array.isArray(d) ? d : []))
      .catch(() => {});
    setSelectedMunicipality("");
    setBarangays([]);
    setSelectedBarangay("");
  }, [selectedProvince]);

  useEffect(() => {
    if (!selectedMunicipality) return void setBarangays([]);
    fetch(
      `/api/super-admin/geography?type=barangays&municipalityId=${selectedMunicipality}`,
    )
      .then((r) => r.json())
      .then((d) => setBarangays(Array.isArray(d) ? d : []))
      .catch(() => {});
    setSelectedBarangay("");
  }, [selectedMunicipality]);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedBarangay) {
      setError("Please select a barangay.");
      return;
    }
    setSubmitting(true);

    try {
      const res = isReassign
        ? // PATCH /api/super-admin/admins/[id]?action=reassign
          await fetch(`/api/super-admin/admins/${reassignId}?action=reassign`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ barangayId: parseInt(selectedBarangay) }),
          })
        : // POST /api/super-admin/admins  (assign new admin)
          await fetch("/api/super-admin/admins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...form,
              barangayId: parseInt(selectedBarangay),
            }),
          });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/super-admin/admins"), 1400);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle size={24} className="text-green-500" />
        </div>
        <p className="text-base font-semibold text-gray-800">
          {isReassign ? "Admin reassigned!" : "Admin created and assigned!"}
        </p>
        <p className="text-sm text-gray-400">Redirecting...</p>
      </div>
    );
  }

  const GeoSelect = ({
    label,
    value,
    onChange,
    options,
    disabled,
    placeholder,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: GeoItem[];
    disabled?: boolean;
    placeholder: string;
  }) => (
    <FormRow label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={selectCls}
        required
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
            {o.code ? ` (${o.code})` : ""}
          </option>
        ))}
      </select>
    </FormRow>
  );

  return (
    <div className="max-w-lg">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-5 transition-colors cursor-pointer"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <PageHeader
        title={isReassign ? "Reassign admin" : "Assign new admin"}
        sub={
          isReassign
            ? "Move this admin to a different barangay"
            : "Create an admin account and assign them to a barangay"
        }
      />

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {!isReassign && (
          <Card title="Admin details">
            <div className="flex flex-col gap-3">
              <FormRow label="Full name">
                <input
                  required
                  className={inputCls}
                  value={form.fullname}
                  onChange={(e) =>
                    setForm({ ...form, fullname: e.target.value })
                  }
                  placeholder="Juan Dela Cruz"
                />
              </FormRow>
              <FormRow label="Email">
                <input
                  required
                  type="email"
                  className={inputCls}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@barangay.gov.ph"
                />
              </FormRow>
              <FormRow label="Password">
                <input
                  required
                  type="password"
                  className={inputCls}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Min. 8 characters"
                  minLength={8}
                />
              </FormRow>
              <FormRow label="Contact number">
                <input
                  required
                  className={inputCls}
                  value={form.contactNumber}
                  onChange={(e) =>
                    setForm({ ...form, contactNumber: e.target.value })
                  }
                  placeholder="09XXXXXXXXX"
                />
              </FormRow>
              <FormRow label="Address">
                <input
                  required
                  className={inputCls}
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="House no., Street, Barangay..."
                />
              </FormRow>
            </div>
          </Card>
        )}

        <Card title="Assign to barangay">
          <div className="flex flex-col gap-3">
            <GeoSelect
              label="Island group"
              value={selectedIsland}
              onChange={setSelectedIsland}
              options={islandGroups}
              placeholder="Select island group"
            />
            <GeoSelect
              label="Region"
              value={selectedRegion}
              onChange={setSelectedRegion}
              options={regions}
              disabled={!selectedIsland}
              placeholder="Select region"
            />
            <GeoSelect
              label="Province"
              value={selectedProvince}
              onChange={setSelectedProvince}
              options={provinces}
              disabled={!selectedRegion}
              placeholder="Select province"
            />
            <GeoSelect
              label="Municipality / City"
              value={selectedMunicipality}
              onChange={setSelectedMunicipality}
              options={municipalities}
              disabled={!selectedProvince}
              placeholder="Select municipality"
            />
            <GeoSelect
              label="Barangay"
              value={selectedBarangay}
              onChange={setSelectedBarangay}
              options={barangays}
              disabled={!selectedMunicipality}
              placeholder="Select barangay"
            />
          </div>
        </Card>

        {error && <ErrorBanner message={error} />}

        <div className="flex items-center gap-3 mt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-60 transition-colors cursor-pointer"
          >
            {submitting
              ? "Saving..."
              : isReassign
                ? "Reassign admin"
                : "Create and assign admin"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
