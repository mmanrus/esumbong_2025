

import z from "zod"

export const SummonFormSchema = z.object({
    residentId: z.number({ message: "Resident is required" })
        .int()
        .positive("Resident is required"),
    summonDate: z.date({ message: "Summon date is required" }),
    startTime: z.date({ message: "Start time is required" }),
    endTime: z.date().optional().nullable(),
    files: z.array(z.instanceof(File), { message: "Summon File is required" }),
})

export type SummonForm = z.infer<typeof SummonFormSchema>