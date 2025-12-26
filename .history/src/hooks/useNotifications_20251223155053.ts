"use client"

import { useState, useEffect} from "react"

export function useNotification(userId: string) {
     const [notifications, setNotification] = useState<any[]>([])

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