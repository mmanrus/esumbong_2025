
import z from "zod"

export const AnnouncementFormSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    announcement: z.string().min(1, "Announcement content is required"),
    notifyResidents: z.boolean(),
    notifyOfficials: z.boolean(),
}).refine((data) => data.notifyOfficials || data.notifyResidents, {
    message: "At least one notification option must be selected",
    path: ["notifyResidents"],
})


export type AnnouncementForm= z.infer<typeof AnnouncementFormSchema>