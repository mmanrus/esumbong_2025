"use client"

import { useState, useEffect } from "react"

const url = process.env.NEXT_PUBLIC_BACKEND_URL
export function useNotification(userId?: string, type?: string) {
     const [notifications, setNotification] = useState<any[]>([])
     useEffect(() => {
          if (!userId) return
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
          const wsUrl = process.env.WEBSOCKET_URL
          if (!wsUrl) {
               throw new Error("Please set up WEBSOCKET_URL in the ENV.")
          }
          const ws = new WebSocket(wsUrl)
          ws.onopen = () => {
               console.log("Connected");
               ws.send(JSON.stringify({
                    type: "AUTH",
                    userId,
                    role: type
               }))

          }
          ws.onerror = (err) => console.error("WS error", err)
          ws.onmessage = (event) => {
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
          ws.onclose = () => {
               console.log("Disconnected")
          }
          return () => {
               ws.close()
          }
     }, [userId, type])

     return notifications
}