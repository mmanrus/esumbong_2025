"use client"

import { useState, useEffect } from "react"

const url = process.env.BACKEND_URL
export function useNotification(userId?: string) {
     const [notifications, setNotification] = useState<any[]>([])
     useEffect(() => {
          res()
     }, [userId])
     const res = async () => {

          const result = await fetch(`/api/notification/me`, {
               method: "GET",
          })
          if (!result.ok) {
               throw new Error("Failed to fetch notifications")
          }
          const data = await result.json()

          console.log("Fetched notifications data:", data.data)
          setNotification(data.data)
          console.log("Notifications state after fetch:", notifications)
     }
     useEffect(() => {
          const ws = new WebSocket("ws://localhost:4001")

          ws.onmessage = (event) => {
               const data = JSON.parse(event.data)
               if (data.userId === userId) {
                    setNotification((prev) => [data, ...prev])
               }
          }

          return () => ws.close()
     }, [userId])

     return notifications
}