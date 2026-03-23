"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react"
import { useWebSocket } from "@/contexts/webSocketContext"

export type Notification = {
  id: number
  url: string | null
  itemId: number | null
  message: string | null
  createdAt: string
  type: string
  read: boolean
}

type NotificationContextType = {
  notifications: Notification[]
  unreadCount: number
  hasNextPage: boolean
  isLoading: boolean
  loadMore: () => Promise<void>
  markRead: (id: number) => Promise<void>
  markAllRead: () => Promise<void>
  deleteOne: (id: number) => Promise<void>
  deleteAll: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [nextCursor, setNextCursor] = useState<number | null>(null)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const socket = useWebSocket()

  const fetchNotifications = useCallback(async (cursor?: number) => {
    const params = new URLSearchParams()
    if (cursor) params.set("cursor", String(cursor))
    params.set("take", "20")
    const res = await fetch(`/api/notification/me?${params}`, {
      credentials: "include",
    })
    if (!res.ok) throw new Error("Failed to fetch notifications")
    return res.json()
  }, [])

  // Initial load
  useEffect(() => {
    setIsLoading(true)
    fetchNotifications()
      .then((data) => {
        setNotifications(data.data ?? [])
        setUnreadCount(data.unreadCount ?? 0)
        setNextCursor(data.nextCursor ?? null)
        setHasNextPage(data.hasNextPage ?? false)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [fetchNotifications])

  // WebSocket: real-time new notifications
  useEffect(() => {
    if (!socket) return
    const prev = socket.onmessage
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "NEW_NOTIFICATION") {
        setNotifications((p) => [data.notification, ...p])
        setUnreadCount((c) => c + 1)
      }
      if (prev) prev.call(socket, event)
    }
  }, [socket])

  // Load more (append next page)
  const loadMore = useCallback(async () => {
    if (!nextCursor) return
    const data = await fetchNotifications(nextCursor)
    setNotifications((p) => [...p, ...(data.data ?? [])])
    setNextCursor(data.nextCursor ?? null)
    setHasNextPage(data.hasNextPage ?? false)
  }, [nextCursor, fetchNotifications])

  // Mark single as read — optimistic
  const markRead = useCallback(async (id: number) => {
    setNotifications((p) =>
      p.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    setUnreadCount((c) => Math.max(0, c - 1))
    await fetch(`/api/notification/${id}`, {
      method: "PATCH",
      credentials: "include",
    })
  }, [])

  // Mark all as read — optimistic
  const markAllRead = useCallback(async () => {
    setNotifications((p) => p.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
    await fetch(`/api/notification/read-all`, {
      method: "PATCH",
      credentials: "include",
    })
  }, [])

  // Delete single — optimistic
  const deleteOne = useCallback(
    async (id: number) => {
      const target = notifications.find((n) => n.id === id)
      setNotifications((p) => p.filter((n) => n.id !== id))
      if (target && !target.read) setUnreadCount((c) => Math.max(0, c - 1))
      await fetch(`/api/notification/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
    },
    [notifications]
  )

  // Delete all — optimistic
  const deleteAll = useCallback(async () => {
    setNotifications([])
    setUnreadCount(0)
    setNextCursor(null)
    setHasNextPage(false)
    await fetch(`/api/notification/all`, {
      method: "DELETE",
      credentials: "include",
    })
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        hasNextPage,
        isLoading,
        loadMore,
        markRead,
        markAllRead,
        deleteOne,
        deleteAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) {
    throw new Error("useNotification must be used inside <NotificationProvider>")
  }
  return ctx
}