"use client"

import { useState } from "react"

export function useSummon() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectStart, setSelectStart] = useState<Date | undefined>(undefined);
    const [selectEnd, setSelectEnd] = useState<Date | undefined>(undefined);

    return { selectedDate, setSelectedDate, selectStart, setSelectStart, selectEnd, setSelectEnd  }
}