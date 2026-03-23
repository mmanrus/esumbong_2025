"use client"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useNotification, type Notification } from "@/contexts/notificationContext"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"
import { Bell, CheckCheck, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/formatDate"

// ─── Notification type icon color ─────────────────────────────────────────────

const TYPE_COLOR: Record<string, string> = {
  concern:          "bg-blue-500",
  feedback:         "bg-purple-500",
  announcement:     "bg-teal-500",
  update:           "bg-green-500",
  alert:            "bg-red-500",
  userVerification: "bg-indigo-500",
}

function dotColor(type: string) {
  return TYPE_COLOR[type] ?? "bg-gray-400"
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationComponent() {
  const { notifications, unreadCount, markRead, markAllRead, isLoading } = useNotification()
  const isMobile = useIsMobile()

  // Show only latest 8 in dropdown
  const preview = notifications.slice(0, 8)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative gap-2 text-foreground hover:bg-muted"
        >
          <Bell className="h-4 w-4" />
          {!isMobile && <span className="text-sm">Notifications</span>}

          {/* Unread badge — shows actual unread count, not total */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center
                             justify-center text-[10px] font-bold bg-red-500 text-white
                             rounded-full px-1 leading-none">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 p-0 rounded-xl shadow-xl border overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-sm text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-800
                         font-medium transition"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[360px] overflow-y-auto divide-y">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-muted mt-2 flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : preview.length === 0 ? (
            <div className="py-10 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">You're all caught up!</p>
            </div>
          ) : (
            preview.map((n) => (
              <div
                key={n.id}
                onClick={() => { if (!n.read) markRead(n.id) }}
                className={cn(
                  "flex gap-3 px-4 py-3 cursor-pointer transition-colors",
                  n.read ? "bg-background" : "bg-blue-50/60 hover:bg-blue-50",
                  "hover:bg-muted/40"
                )}
              >
                {/* Type dot */}
                <span className={cn(
                  "w-2 h-2 rounded-full flex-shrink-0 mt-1.5",
                  dotColor(n.type),
                  n.read && "opacity-40"
                )} />

                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm leading-snug",
                    n.read ? "text-muted-foreground" : "text-foreground font-medium"
                  )}>
                    {n.message ?? "New notification"}
                  </p>

                  <div className="flex items-center justify-between mt-1 gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      {formatDate(new Date(n.createdAt))}
                    </span>
                    {n.url && (
                      <Link
                        href={n.url}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] text-teal-600 hover:text-teal-800 font-medium
                                   underline underline-offset-2 transition whitespace-nowrap"
                      >
                        View {n.type}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Unread dot indicator */}
                {!n.read && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t bg-muted/20 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {notifications.length} total
          </span>
          <Link
            href="/notifications"
            className="flex items-center gap-1 text-xs font-semibold text-teal-600
                       hover:text-teal-800 transition"
          >
            Manage all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}