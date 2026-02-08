import z from "zod"


export const FeedbackSchema = z.object({
    title: z.string().min(4, "Title must be at least 4 characters long"),
    feedback: z.string().min(50, "Feedback must be at least 50 characters long"),
})

export type FeedbackInput = z.infer<typeof FeedbackSchema>