import { ReactNode } from "react";

// ─── PageHeader ───────────────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  sub?: string;
  action?: ReactNode;
}
export function PageHeader({ title, sub, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {sub && <p className="text-sm text-gray-400 mt-1">{sub}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── LoadingSkeleton ──────────────────────────────────────────────────────────
export function LoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="mt-6 flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 rounded-lg bg-gray-100 animate-pulse" />
      ))}
    </div>
  );
}

// ─── ErrorBanner ─────────────────────────────────────────────────────────────
export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
      {message}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeVariant = "blue" | "green" | "red" | "amber" | "gray" | "purple";

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  blue:   "bg-blue-50   text-blue-600",
  green:  "bg-green-50  text-green-600",
  red:    "bg-red-50    text-red-600",
  amber:  "bg-amber-50  text-amber-600",
  gray:   "bg-gray-100  text-gray-500",
  purple: "bg-purple-50 text-purple-600",
};

export function Badge({ label, variant = "blue" }: { label: string; variant?: BadgeVariant }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${BADGE_CLASSES[variant]}`}>
      {label}
    </span>
  );
}

// ─── Avatar initial ───────────────────────────────────────────────────────────
export function Avatar({ name }: { name: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-sm font-semibold text-blue-500 shrink-0">
      {name?.charAt(0).toUpperCase()}
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</p>
      {children}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      {title && (
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{title}</p>
      )}
      {children}
    </div>
  );
}

// ─── FormRow ─────────────────────────────────────────────────────────────────
export function FormRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      {children}
    </div>
  );
}

// ─── Shared input className (use with cn or directly) ────────────────────────
export const inputCls =
  "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all";

export const selectCls =
  "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white text-gray-900 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed";