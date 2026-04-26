"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  ShieldAlert,
  UserX,
  User,
  Tags,
  Activity,
  Timer,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Range = "7d" | "30d" | "90d" | "1y";

interface TrendPoint {
  label: string;
  total: number;
  resolved: number;
}

interface CategoryItem {
  name: string;
  count: number;
}

interface StatusBreakdown {
  pending?: number;
  inProgress?: number;
  verified?: number;
  approved?: number;
  rejected?: number;
  resolved?: number;
  unresolved?: number;
  canceled?: number;
}

interface AnalyticsData {
  statusBreakdown: StatusBreakdown;
  trend: TrendPoint[];
  categoryBreakdown: CategoryItem[];
  resolutionRate: number;
  avgResolutionDays: number | null;
  anonymousCount: number;
  namedCount: number;
  spamCount: number;
  needsAssistanceCount: number;
  total: number;
  range: Range;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_META: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  pending:    { label: "Pending",     color: "text-amber-600",  bg: "bg-amber-50",   border: "border-amber-200" },
  inProgress: { label: "In Progress", color: "text-blue-600",   bg: "bg-blue-50",    border: "border-blue-200"  },
  verified:   { label: "Verified",    color: "text-indigo-600", bg: "bg-indigo-50",  border: "border-indigo-200"},
  approved:   { label: "Approved",    color: "text-teal-600",   bg: "bg-teal-50",    border: "border-teal-200"  },
  rejected:   { label: "Rejected",    color: "text-rose-600",   bg: "bg-rose-50",    border: "border-rose-200"  },
  resolved:   { label: "Resolved",    color: "text-green-600",  bg: "bg-green-50",   border: "border-green-200" },
  unresolved: { label: "Unresolved",  color: "text-red-600",    bg: "bg-red-50",     border: "border-red-200"   },
  canceled:   { label: "Canceled",    color: "text-gray-500",   bg: "bg-gray-50",    border: "border-gray-200"  },
};

// Bar chart fill colors per status (Recharts needs hex/named CSS)
const STATUS_FILL: Record<string, string> = {
  pending:    "#f59e0b",
  inProgress: "#3b82f6",
  verified:   "#6366f1",
  approved:   "#14b8a6",
  rejected:   "#f43f5e",
  resolved:   "#22c55e",
  unresolved: "#ef4444",
  canceled:   "#9ca3af",
};

const PIE_COLORS = [
  "#3b82f6", "#22c55e", "#f59e0b", "#ef4444",
  "#6366f1", "#14b8a6", "#f43f5e", "#9ca3af",
];

const RANGE_OPTIONS: { value: Range; label: string }[] = [
  { value: "7d",  label: "Last 7 days"   },
  { value: "30d", label: "Last 30 days"  },
  { value: "90d", label: "Last 90 days"  },
  { value: "1y",  label: "Last 12 months"},
];

// ─── Small helper components ──────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  border,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  sub?: string;
}) {
  return (
    <Card className={`border-l-4 ${border} shadow-sm`}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
            <p className={`text-2xl sm:text-3xl font-bold mt-0.5 tabular-nums ${color}`}>
              {value}
            </p>
            {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
          </div>
          <div className={`p-1.5 rounded-full ${bg} shrink-0`}>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Custom tooltip for line/bar charts
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-semibold text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function OfficialAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<Range>("30d");
  const [rangeOpen, setRangeOpen] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/concerns?range=${range}`);
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json);
    } catch {
      toast.error("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!rangeOpen) return;
    const handler = () => setRangeOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [rangeOpen]);

  const currentRangeLabel = RANGE_OPTIONS.find((o) => o.value === range)?.label;

  // Status breakdown as array for bar chart
  const statusChartData = data
    ? Object.entries(data.statusBreakdown)
        .map(([key, val]) => ({
          status: STATUS_META[key]?.label ?? key,
          count: val,
          fill: STATUS_FILL[key] ?? "#6b7280",
        }))
        .sort((a, b) => b.count - a.count)
    : [];

  // Resolution rate indicator
  const rate = data?.resolutionRate ?? 0;
  const RateIcon = rate >= 70 ? TrendingUp : rate >= 40 ? Minus : TrendingDown;
  const rateColor = rate >= 70 ? "text-green-600" : rate >= 40 ? "text-amber-500" : "text-red-500";

  return (
    <div className="space-y-5 sm:space-y-6 pb-20 lg:pb-0">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Concern Analytics
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Data-driven insights for your barangay
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Range picker */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5 h-8"
              onClick={() => setRangeOpen((o) => !o)}
            >
              {currentRangeLabel}
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
            {rangeOpen && (
              <div className="absolute right-0 top-9 z-50 bg-background border rounded-lg shadow-lg py-1 min-w-[150px]">
                {RANGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors",
                      range === opt.value && "font-semibold text-blue-600 bg-blue-50"
                    )}
                    onClick={() => { setRange(opt.value); setRangeOpen(false); }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2"
            onClick={fetchAnalytics}
            disabled={loading}
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <LoadingSkeleton />
      ) : !data ? (
        <div className="rounded-xl border bg-card p-10 text-center text-muted-foreground text-sm">
          No analytics data available.
        </div>
      ) : (
        <div className="space-y-5">

          {/* ── KPI row ── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            <StatCard
              label="Total Concerns"
              value={data.total}
              icon={Tags}
              color="text-blue-600"
              bg="bg-blue-50"
              border="border-l-blue-400"
            />
            <StatCard
              label="Resolution Rate"
              value={`${data.resolutionRate}%`}
              icon={RateIcon}
              color={rateColor}
              bg={rate >= 70 ? "bg-green-50" : rate >= 40 ? "bg-amber-50" : "bg-red-50"}
              border={rate >= 70 ? "border-l-green-400" : rate >= 40 ? "border-l-amber-400" : "border-l-red-400"}
              sub={rate >= 70 ? "Good standing" : rate >= 40 ? "Needs attention" : "Requires action"}
            />
            <StatCard
              label="Avg. Resolution"
              value={data.avgResolutionDays !== null ? `${data.avgResolutionDays}d` : "—"}
              icon={Timer}
              color="text-indigo-600"
              bg="bg-indigo-50"
              border="border-l-indigo-400"
              sub="Days to resolve"
            />
            <StatCard
              label="Needs Assistance"
              value={data.needsAssistanceCount}
              icon={AlertTriangle}
              color="text-orange-600"
              bg="bg-orange-50"
              border="border-l-orange-400"
              sub="Flagged concerns"
            />
          </div>

          {/* ── Trend + Status breakdown ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Trend line chart */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold">Concern Trend</CardTitle>
                <p className="text-xs text-muted-foreground">Submitted vs resolved over time</p>
              </CardHeader>
              <CardContent className="px-2 pb-4">
                {data.trend.every((t) => t.total === 0) ? (
                  <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
                    No data in this range
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={210}>
                    <LineChart data={data.trend} margin={{ top: 5, right: 16, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line
                        type="monotone"
                        dataKey="total"
                        name="Total"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="resolved"
                        name="Resolved"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Status bar chart */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold">Status Breakdown</CardTitle>
                <p className="text-xs text-muted-foreground">All-time count per status</p>
              </CardHeader>
              <CardContent className="px-2 pb-4">
                {statusChartData.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
                    No data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={210}>
                    <BarChart data={statusChartData} margin={{ top: 5, right: 16, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="status"
                        tick={{ fontSize: 9 }}
                        tickLine={false}
                        interval={0}
                        angle={-20}
                        dy={6}
                      />
                      <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="count" name="Concerns" radius={[4, 4, 0, 0]}>
                        {statusChartData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Categories + Pie breakdown ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Category horizontal bars */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold">Top Categories</CardTitle>
                <p className="text-xs text-muted-foreground">Most reported concern types</p>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-2.5">
                {data.categoryBreakdown.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-6 text-center">
                    No category data yet
                  </p>
                ) : (
                  data.categoryBreakdown.map((cat, i) => {
                    const pct = data.total > 0 ? Math.round((cat.count / data.total) * 100) : 0;
                    return (
                      <div key={cat.name}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-foreground truncate max-w-[65%]">
                            {cat.name}
                          </span>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {cat.count} <span className="text-[10px]">({pct}%)</span>
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Misc stats grid + pie donut */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold">Submission Insights</CardTitle>
                <p className="text-xs text-muted-foreground">Anonymous vs named, spam, and more</p>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {/* Mini donut pie for anonymous vs named */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <ResponsiveContainer width={90} height={90}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Named", value: data.namedCount },
                            { name: "Anonymous", value: data.anonymousCount },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={40}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#d1d5db" />
                        </Pie>
                        <Tooltip
                          content={<ChartTooltip />}
                          wrapperStyle={{ fontSize: 11 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">Named:</span>
                      <span className="font-semibold">{data.namedCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-300" />
                      <span className="text-muted-foreground">Anonymous:</span>
                      <span className="font-semibold">{data.anonymousCount}</span>
                    </div>
                  </div>
                </div>

                {/* Extra stat pills */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border bg-rose-50 border-rose-100 p-2.5 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Spam Flagged</p>
                      <p className="text-base font-bold text-rose-600 tabular-nums">
                        {data.spamCount}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-amber-50 border-amber-100 p-2.5 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Needs Help</p>
                      <p className="text-base font-bold text-amber-600 tabular-nums">
                        {data.needsAssistanceCount}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-green-50 border-green-100 p-2.5 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Resolved</p>
                      <p className="text-base font-bold text-green-600 tabular-nums">
                        {data.statusBreakdown.resolved ?? 0}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-amber-50 border-amber-100 p-2.5 flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-amber-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Pending</p>
                      <p className="text-base font-bold text-amber-600 tabular-nums">
                        {data.statusBreakdown.pending ?? 0}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Status legend chips (full breakdown) ── */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold">All Statuses</CardTitle>
              <p className="text-xs text-muted-foreground">Complete count per status type</p>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.statusBreakdown).map(([key, val]) => {
                  const meta = STATUS_META[key];
                  if (!meta) return null;
                  return (
                    <div
                      key={key}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium",
                        meta.bg,
                        meta.border,
                        meta.color
                      )}
                    >
                      <span>{meta.label}</span>
                      <span className="font-bold tabular-nums">{val}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
}