"use client"

import { useState, useEffect} from "react"
const url = process.env.BACKEND_URL
export function useNotification(userId?: string) {
     const [notifications, setNotification] = useState<any[]>([])
     useEffect(()=> {
          const res = async ()  => {
               await fetch(`${url}/notification/`)
          }
     })
     useEffect(()=> {
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