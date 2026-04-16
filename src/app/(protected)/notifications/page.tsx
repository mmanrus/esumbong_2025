"use client"

import { useState, useMemo } from "react"
import { useNotification, type Notification } from "@/contexts/notificationContext"
import { Bell, CheckCheck, Trash2, ArrowRight, Inbox, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/formatDate"
import Link from "next/link"
import { toast } from "sonner"

// ─── Type color dot ───────────────────────────────────────────────────────────

const TYPE_COLOR: Record<string, string> = {
  concern:          "bg-blue-500",
  feedback:         "bg-purple-500",
  announcement:     "bg-teal-500",
  update:           "bg-green-500",
  alert:            "bg-red-500",
  userVerification: "bg-indigo-500",
}

const TYPE_BG: Record<string, string> = {
  concern:          "bg-blue-50 text-blue-700 border-blue-200",
  feedback:         "bg-purple-50 text-purple-700 border-purple-200",
  announcement:     "bg-teal-50 text-teal-700 border-teal-200",
  update:           "bg-green-50 text-green-700 border-green-200",
  alert:            "bg-red-50 text-red-700 border-red-200",
  userVerification: "bg-indigo-50 text-indigo-700 border-indigo-200",
}

function dotColor(type: string) {
  return TYPE_COLOR[type] ?? "bg-gray-400"
}

function typeBg(type: string) {
  return TYPE_BG[type] ?? "bg-gray-50 text-gray-600 border-gray-200"
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

type Tab = "all" | "unread" | "read"

// ─── Notification row ─────────────────────────────────────────────────────────

function NotificationRow({
  n,
  onMarkRead,
  onDelete,
}: {
  n: Notification
  onMarkRead: (id: number) => void
  onDelete: (id: number) => void
}) {
  return (
    <div
      className={cn(
        "group flex items-start gap-3 px-4 py-3.5 border-b border-border/50 transition-colors",
        n.read ? "bg-background" : "bg-blue-50/50"
      )}
    >
      {/* Left: type color dot */}
      <span className={cn(
        "w-2 h-2 rounded-full flex-shrink-0 mt-1.5",
        dotColor(n.type),
        n.read && "opacity-40"
      )} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm leading-snug break-words",
          n.read ? "text-muted-foreground" : "text-foreground font-medium"
        )}>
          {n.message ?? "New notification"}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
          {/* Type badge */}
          <span className={cn(
            "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
            typeBg(n.type)
          )}>
            {n.type.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
          </span>

          {/* Date */}
          <span className="text-[10px] text-muted-foreground">
            {formatDate(new Date(n.createdAt))}
          </span>

          {/* View link */}
          {n.url && (
            <Link
              href={n.url}
              className="text-[10px] text-teal-600 hover:text-teal-800 font-medium
                         underline underline-offset-2 transition flex items-center gap-0.5"
            >
              View <ArrowRight className="h-2.5 w-2.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Right: actions (visible on hover or always on mobile) */}
      <div className="flex items-center gap-1 flex-shrink-0 opacity-100 sm:opacity-0
                      sm:group-hover:opacity-100 transition-opacity">
        {!n.read && (
          <button
            onClick={() => onMarkRead(n.id)}
            title="Mark as read"
            className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-500 transition"
          >
            <CheckCheck className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={() => onDelete(n.id)}
          title="Delete"
          className="p-1.5 rounded-lg hover:bg-red-100 text-red-400 hover:text-red-600 transition"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    hasNextPage,
    isLoading,
    loadMore,
    markRead,
    markAllRead,
    deleteOne,
    deleteAll,
  } = useNotification()

  const [tab, setTab] = useState<Tab>("all")
  const [deleting, setDeleting] = useState(false)

  const filtered = useMemo(() => {
    if (tab === "unread") return notifications.filter((n) => !n.read)
    if (tab === "read")   return notifications.filter((n) => n.read)
    return notifications
  }, [notifications, tab])

  const handleDeleteAll = async () => {
    setDeleting(true)
    await deleteAll()
    toast.success("All notifications cleared")
    setDeleting(false)
  }

  const tabs: { label: string; value: Tab; count: number }[] = [
    { label: "All",    value: "all",    count: notifications.length },
    { label: "Unread", value: "unread", count: unreadCount },
    { label: "Read",   value: "read",   count: notifications.length - unreadCount },
  ]

  return (
    <div className="space-y-5 pb-20 lg:pb-0">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground
                         flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary flex-shrink-0" />
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage and review all your notifications
          </p>
        </div>

        {/* Bulk actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllRead}
              className="gap-1.5 text-xs h-8"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteAll}
              disabled={deleting}
              className="gap-1.5 text-xs h-8 text-red-600 hover:text-red-700
                         hover:bg-red-50 border-red-200"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              tab === t.value
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
            <span className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
              tab === t.value
                ? t.value === "unread" ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Notification list ── */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">

        {/* Loading skeleton */}
        {isLoading && (
          <div className="divide-y">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-3 px-4 py-3.5 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-muted mt-1.5 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-muted rounded w-4/5" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="py-16 text-center">
            <Inbox className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-medium">
              {tab === "unread" ? "No unread notifications" : "No notifications yet"}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {tab === "unread" ? "You're all caught up!" : "New notifications will appear here"}
            </p>
          </div>
        )}

        {/* Rows */}
        {!isLoading && filtered.map((n) => (
          <NotificationRow
            key={n.id}
            n={n}
            onMarkRead={markRead}
            onDelete={deleteOne}
          />
        ))}

        {/* Load more */}
        {hasNextPage && (
          <div className="px-4 py-3 border-t bg-muted/20 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadMore}
              className="text-xs text-teal-600 hover:text-teal-800"
            >
              Load more notifications
            </Button>
          </div>
        )}
      </div>

      {/* Summary footer */}
      {!isLoading && notifications.length > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          {notifications.length} notification{notifications.length !== 1 ? "s" : ""} total
          {unreadCount > 0 && ` · ${unreadCount} unread`}
        </p>
      )}
    </div>
  )
}