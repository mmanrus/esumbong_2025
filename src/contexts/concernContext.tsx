"use client"

import { Concern } from "@/components/atoangUI/concern/concernRows"
import React, { createContext, useContext, useState } from "react"

export type ConcernUpdates = {
  status: string
  updateMessage: string
  createdAt: string
}

type ConcernContextType = {
  concernId: string | null
  setConcernId: React.Dispatch<React.SetStateAction<string | null>>
  concern: any
  setConcern: React.Dispatch<React.SetStateAction<any>>
  concernUpdates: ConcernUpdates[]
  setConcernUpdates: React.Dispatch<React.SetStateAction<ConcernUpdates[]>>
}

const ConcernContext = createContext<ConcernContextType | undefined>(undefined)

export function ConcernProvider({ children }: { children: React.ReactNode }) {
  const [concernId, setConcernId] = useState<string | null>(null)
  const [concern, setConcern] = useState<Concern | null>(null)
  const [concernUpdates, setConcernUpdates] = useState<ConcernUpdates[]>([])

  return (
    <ConcernContext.Provider
      value={{
        concernId,
        setConcernId,
        concern,
        setConcern,
        concernUpdates,
        setConcernUpdates,
      }}
    >
      {children}
    </ConcernContext.Provider>
  )
}

export function useConcern() {
  const context = useContext(ConcernContext)

  if (!context) {
    throw new Error("useConcern must be used within a ConcernProvider")
  }

  return context
}
