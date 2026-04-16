"use client";
import { useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Loader2,
  X,
  MapPin,
} from "lucide-react";
import { PageHeader, ErrorBanner } from "@/components/atoangUI/ui";

interface GeoItem {
  id: number;
  name: string;
  code?: string;
  _count?: Record<string, number>;
}
interface Selected {
  island: GeoItem | null;
  region: GeoItem | null;
  province: GeoItem | null;
  municipality: GeoItem | null;
}
type LoadingKey = "regions" | "provinces" | "municipalities" | "barangays";
type MobileSection =
  | "island"
  | "region"
  | "province"
  | "municipality"
  | "barangay"
  | null;
type ModalMode = "municipality" | "barangay" | null;

// ── Modal ─────────────────────────────────────────────────────────────────────
function AddModal({
  mode,
  onClose,
  onSave,
  contextLabel,
}: {
  mode: ModalMode;
  onClose: () => void;
  onSave: (name: string) => Promise<string | null>; // returns error string or null
  contextLabel: string;
}) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 60);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    const err = await onSave(name.trim());
    setSaving(false);
    if (err) setError(err);
    else {
      setName("");
      onClose();
    }
  };

  const label = mode === "municipality" ? "municipality" : "barangay";

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-semibold text-gray-900">Add {label}</p>
            <p className="text-sm text-gray-500 mt-0.5">
              Adding to{" "}
              <span className="font-medium text-gray-700">{contextLabel}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 capitalize">
              {label} name
            </label>
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`e.g. ${mode === "municipality" ? "San Jose" : "Barangay Poblacion"}`}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900 placeholder:text-gray-400"
            />
            {error && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-2.5">
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Plus size={14} />
              )}
              {saving ? "Saving..." : `Add ${label}`}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function GeographyPage() {
  const [islandGroups, setIslandGroups] = useState<GeoItem[]>([]);
  const [regions, setRegions] = useState<GeoItem[]>([]);
  const [provinces, setProvinces] = useState<GeoItem[]>([]);
  const [municipalities, setMunicipalities] = useState<GeoItem[]>([]);
  const [barangays, setBarangays] = useState<GeoItem[]>([]);
  const [selected, setSelected] = useState<Selected>({
    island: null,
    region: null,
    province: null,
    municipality: null,
  });
  const [loading, setLoading] = useState<Record<LoadingKey, boolean>>({
    regions: false,
    provinces: false,
    municipalities: false,
    barangays: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<MobileSection>("island");

  // Modal
  const [modalMode, setModalMode] = useState<ModalMode>(null);

  const geo = async (
    type: string,
    params: Record<string, string | number> = {},
  ): Promise<GeoItem[]> => {
    const q = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, String(v)]),
      ),
    );
    const res = await fetch(`/api/super-admin/geography?type=${type}&${q}`);
    const d = await res.json();
    return Array.isArray(d) ? d : [];
  };

  useEffect(() => {
    geo("island-groups")
      .then(setIslandGroups)
      .catch(() => setError("Failed to load geography."));
  }, []);

  const pickIsland = async (item: GeoItem) => {
    setSelected({
      island: item,
      region: null,
      province: null,
      municipality: null,
    });
    setRegions([]);
    setProvinces([]);
    setMunicipalities([]);
    setBarangays([]);
    setLoading((l) => ({ ...l, regions: true }));
    setRegions(await geo("regions", { islandGroupId: item.id }));
    setLoading((l) => ({ ...l, regions: false }));
    setMobileExpanded("region");
  };
  const pickRegion = async (item: GeoItem) => {
    setSelected((s) => ({
      ...s,
      region: item,
      province: null,
      municipality: null,
    }));
    setProvinces([]);
    setMunicipalities([]);
    setBarangays([]);
    setLoading((l) => ({ ...l, provinces: true }));
    setProvinces(await geo("provinces", { regionId: item.id }));
    setLoading((l) => ({ ...l, provinces: false }));
    setMobileExpanded("province");
  };
  const pickProvince = async (item: GeoItem) => {
    setSelected((s) => ({ ...s, province: item, municipality: null }));
    setMunicipalities([]);
    setBarangays([]);
    setLoading((l) => ({ ...l, municipalities: true }));
    setMunicipalities(await geo("municipalities", { provinceId: item.id }));
    setLoading((l) => ({ ...l, municipalities: false }));
    setMobileExpanded("municipality");
  };
  const pickMunicipality = async (item: GeoItem) => {
    setSelected((s) => ({ ...s, municipality: item }));
    setBarangays([]);
    setLoading((l) => ({ ...l, barangays: true }));
    setBarangays(await geo("barangays", { municipalityId: item.id }));
    setLoading((l) => ({ ...l, barangays: false }));
    setMobileExpanded("barangay");
  };

  // ── Modal save handlers ────────────────────────────────────────────────────
  const handleSaveMunicipality = async (
    name: string,
  ): Promise<string | null> => {
    if (!selected.province) return "No province selected.";
    const res = await fetch("/api/super-admin/geography/municipality", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, provinceId: selected.province.id }),
    });
    const data = await res.json();
    if (!res.ok) return data.error ?? "Failed to add municipality.";
    setMunicipalities((m) => [...m, data]);
    return null;
  };

  const handleSaveBarangay = async (name: string): Promise<string | null> => {
    if (!selected.municipality) return "No municipality selected.";
    const res = await fetch("/api/super-admin/geography/barangay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, municipalityId: selected.municipality.id }),
    });
    const data = await res.json();
    if (!res.ok) return data.error ?? "Failed to add barangay.";
    setBarangays((b) => [...b, data]);
    return null;
  };

  const handleDeleteBarangay = async (id: number) => {
    if (!confirm("Delete this barangay? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/super-admin/geography/barangay?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) setBarangays((b) => b.filter((x) => x.id !== id));
      else {
        const d = await res.json();
        alert(d.error ?? "Failed to delete.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setDeletingId(null);
    }
  };

  const breadcrumbs = [
    selected.island,
    selected.region,
    selected.province,
    selected.municipality,
  ].filter(Boolean) as GeoItem[];

  const modalContextLabel =
    modalMode === "municipality"
      ? (selected.province?.name ?? "")
      : (selected.municipality?.name ?? "");

  return (
    <>
      {/* Modal */}
      {modalMode && (
        <AddModal
          mode={modalMode}
          onClose={() => setModalMode(null)}
          onSave={
            modalMode === "municipality"
              ? handleSaveMunicipality
              : handleSaveBarangay
          }
          contextLabel={modalContextLabel}
        />
      )}

      <div className="flex flex-col gap-4">
        <PageHeader
          title="Geography"
          sub="Browse and manage the geographic hierarchy"
        />
        {error && <ErrorBanner message={error} />}

        {/* Breadcrumb */}
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap -mt-2">
            <MapPin size={13} className="text-blue-400 shrink-0" />
            {breadcrumbs.map((b, i) => (
              <span key={b.id} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={12} className="text-gray-300" />}
                <span
                  className={
                    i === breadcrumbs.length - 1
                      ? "text-gray-800 font-semibold"
                      : "text-gray-500"
                  }
                >
                  {b.name}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* ── DESKTOP ─────────────────────────────────────────────────────── */}
        <div className="hidden lg:flex border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
          {/* Island groups */}
          <Col title="Island groups">
            {islandGroups.map((g) => (
              <ColBtn
                key={g.id}
                label={g.name}
                sub={`${g._count?.regions ?? 0} regions`}
                active={selected.island?.id === g.id}
                onClick={() => pickIsland(g)}
              />
            ))}
          </Col>

          {/* Regions */}
          <Col title="Regions">
            {!selected.island ? (
              <ColHint>← Select an island group</ColHint>
            ) : loading.regions ? (
              <ColSpinner />
            ) : (
              regions.map((r) => (
                <ColBtn
                  key={r.id}
                  label={r.name}
                  sub={r.code ?? ""}
                  active={selected.region?.id === r.id}
                  onClick={() => pickRegion(r)}
                />
              ))
            )}
          </Col>

          {/* Provinces */}
          <Col title="Provinces">
            {!selected.region ? (
              <ColHint>← Select a region</ColHint>
            ) : loading.provinces ? (
              <ColSpinner />
            ) : (
              provinces.map((p) => (
                <ColBtn
                  key={p.id}
                  label={p.name}
                  sub={`${p._count?.municipalities ?? 0} municipalities`}
                  active={selected.province?.id === p.id}
                  onClick={() => pickProvince(p)}
                />
              ))
            )}
          </Col>

          {/* Municipalities */}
          <Col
            title="Municipalities"
            action={
              selected.province ? (
                <button
                  onClick={() => setModalMode("municipality")}
                  className="flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors cursor-pointer bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md"
                >
                  <Plus size={12} /> Add
                </button>
              ) : undefined
            }
          >
            {!selected.province ? (
              <ColHint>← Select a province</ColHint>
            ) : loading.municipalities ? (
              <ColSpinner />
            ) : municipalities.length === 0 ? (
              <ColHint>No municipalities yet</ColHint>
            ) : (
              municipalities.map((m) => (
                <ColBtn
                  key={m.id}
                  label={m.name}
                  sub={`${m._count?.barangays ?? 0} barangays`}
                  active={selected.municipality?.id === m.id}
                  onClick={() => pickMunicipality(m)}
                />
              ))
            )}
          </Col>

          {/* Barangays */}
          <Col
            title="Barangays"
            isLast
            action={
              selected.municipality ? (
                <button
                  onClick={() => setModalMode("barangay")}
                  className="flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors cursor-pointer bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md"
                >
                  <Plus size={12} /> Add
                </button>
              ) : undefined
            }
          >
            {!selected.municipality ? (
              <ColHint>← Select a municipality</ColHint>
            ) : loading.barangays ? (
              <ColSpinner />
            ) : barangays.length === 0 ? (
              <ColHint>No barangays yet</ColHint>
            ) : (
              barangays.map((b) => (
                <BarangayRow
                  key={b.id}
                  b={b}
                  deletingId={deletingId}
                  onDelete={handleDeleteBarangay}
                />
              ))
            )}
          </Col>
        </div>

        {/* ── MOBILE ──────────────────────────────────────────────────────── */}
        <div className="lg:hidden flex flex-col gap-2">
          {[
            {
              key: "island" as const,
              title: "Island group",
              subtitle: selected.island?.name,
              items: islandGroups,
              isLoading: false,
              onPick: pickIsland,
              locked: false,
              canAdd: false,
            },
            {
              key: "region" as const,
              title: "Region",
              subtitle: selected.region?.name,
              items: regions,
              isLoading: loading.regions,
              onPick: pickRegion,
              locked: !selected.island,
              canAdd: false,
            },
            {
              key: "province" as const,
              title: "Province",
              subtitle: selected.province?.name,
              items: provinces,
              isLoading: loading.provinces,
              onPick: pickProvince,
              locked: !selected.region,
              canAdd: false,
            },
            {
              key: "municipality" as const,
              title: "Municipality",
              subtitle: selected.municipality?.name,
              items: municipalities,
              isLoading: loading.municipalities,
              onPick: pickMunicipality,
              locked: !selected.province,
              canAdd: !!selected.province,
            },
          ].map((s) => (
            <div
              key={s.key}
              className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm ${s.locked ? "opacity-40 pointer-events-none" : ""}`}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <button
                  onClick={() =>
                    setMobileExpanded(mobileExpanded === s.key ? null : s.key)
                  }
                  className="flex-1 flex items-center justify-between cursor-pointer"
                >
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {s.title}
                    </p>
                    {s.subtitle ? (
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">
                        {s.subtitle}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 mt-0.5">
                        Not selected
                      </p>
                    )}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform mr-2 ${mobileExpanded === s.key ? "rotate-180" : ""}`}
                  />
                </button>
                {s.canAdd && (
                  <button
                    onClick={() => setModalMode("municipality")}
                    className="flex items-center gap-1 text-xs font-medium text-blue-500 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg px-2.5 py-1.5 cursor-pointer transition-colors"
                  >
                    <Plus size={11} /> Add
                  </button>
                )}
              </div>
              {mobileExpanded === s.key && (
                <div className="border-t border-gray-100 max-h-60 overflow-y-auto">
                  {s.isLoading ? (
                    <ColSpinner />
                  ) : (
                    s.items.map((item) => (
                      <ColBtn
                        key={item.id}
                        label={item.name}
                        sub={
                          item.code ??
                          `${Object.values(item._count ?? {})[0] ?? 0} items`
                        }
                        active={selected[s.key]?.id === item.id}
                        onClick={() => s.onPick(item)}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Barangays */}
          {selected.municipality && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <button
                  onClick={() =>
                    setMobileExpanded(
                      mobileExpanded === "barangay" ? null : "barangay",
                    )
                  }
                  className="flex-1 flex items-center justify-between cursor-pointer"
                >
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Barangays
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">
                      {barangays.length} barangay
                      {barangays.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform mr-2 ${mobileExpanded === "barangay" ? "rotate-180" : ""}`}
                  />
                </button>
                <button
                  onClick={() => setModalMode("barangay")}
                  className="flex items-center gap-1 text-xs font-medium text-blue-500 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg px-2.5 py-1.5 cursor-pointer transition-colors"
                >
                  <Plus size={11} /> Add
                </button>
              </div>
              {mobileExpanded === "barangay" && (
                <div className="border-t border-gray-100 max-h-64 overflow-y-auto">
                  {loading.barangays ? (
                    <ColSpinner />
                  ) : barangays.length === 0 ? (
                    <ColHint>No barangays yet. Tap + Add.</ColHint>
                  ) : (
                    barangays.map((b) => (
                      <BarangayRow
                        key={b.id}
                        b={b}
                        deletingId={deletingId}
                        onDelete={handleDeleteBarangay}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Col({
  title,
  children,
  action,
  isLast,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex flex-col min-w-44 w-52 shrink-0 ${!isLast ? "border-r border-gray-200" : ""}`}
    >
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200 bg-gray-50">
        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
          {title}
        </p>
        {action}
      </div>
      <div className="flex flex-col overflow-y-auto max-h-[420px]">
        {children}
      </div>
    </div>
  );
}

function ColBtn({
  label,
  sub,
  active,
  onClick,
}: {
  label: string;
  sub: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-3 border-b border-gray-100 border-l-[3px] transition-all cursor-pointer
        ${
          active
            ? "bg-blue-50 border-l-blue-500 text-gray-900"
            : "border-l-transparent hover:bg-gray-50 text-gray-700"
        }`}
    >
      <p
        className={`text-sm leading-tight ${active ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}
      >
        {label}
      </p>
      <p
        className={`text-xs mt-0.5 ${active ? "text-blue-500" : "text-gray-500"}`}
      >
        {sub}
      </p>
    </button>
  );
}

function BarangayRow({
  b,
  deletingId,
  onDelete,
}: {
  b: GeoItem;
  deletingId: number | null;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-3 border-b border-gray-100 hover:bg-gray-50 group transition-colors">
      <div>
        <p className="text-sm font-medium text-gray-800">{b.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {b._count?.users ?? 0} users · {b._count?.concerns ?? 0} concerns
        </p>
      </div>
      <button
        onClick={() => onDelete(b.id)}
        disabled={deletingId === b.id}
        className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
      >
        {deletingId === b.id ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Trash2 size={14} />
        )}
      </button>
    </div>
  );
}

function ColHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-4 py-8 text-sm text-gray-400 text-center leading-relaxed">
      {children}
    </p>
  );
}

function ColSpinner() {
  return (
    <div className="flex justify-center py-8">
      <Loader2 size={18} className="animate-spin text-gray-300" />
    </div>
  );
}
