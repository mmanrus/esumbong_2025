"use client"

import { useWebSocket } from "@/contexts/webSocketContext"
import { useState, useEffect } from "react"

const url = process.env.NEXT_PUBLIC_BACKEND_URL
export function useNotification() {
     const [notifications, setNotification] = useState<any[]>([])
     const socket = useWebSocket()
     useEffect(() => {
          if (!socket) return
          const fetchNotification = async () => {
               const result = await fetch(`/api/notification/me`, {
                    credentials: "include",
                    method: "GET",
               })
               if (!result.ok) {
                    throw new Error("Failed to fetch notifications")
               }
               const data = await result.json()

               setNotification(data.data)
          }
          fetchNotification()
          socket.onmessage = (event) => {
               const data = JSON.parse(event.data)
               if (process.env.NODE_ENV === "development") {
                    console.log("Websocket response", data)
               }
               if (data.type === "NEW_NOTIFICATION") {
                    setNotification((prev) => [
                         data.notification,
                         ...prev
                    ])
               }
          }
     }, [socket])

     return notifications
}