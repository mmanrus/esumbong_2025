"use client"

import { useState, useEffect } from "react"

const url = process.env.NEXT_PUBLIC_BACKEND_URL
export function useNotification(userId?: string) {
     const [notifications, setNotification] = useState<any[]>([])
     useEffect(() => {
          res()
     }, [userId])
     const res = async () => {

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