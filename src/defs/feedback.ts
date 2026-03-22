import z from "zod"

export const FeedbackSchema = z.object({
    title: z.string().min(4, "Title must be at least 4 characters long"),
    feedback: z.string().min(10, "Feedback must be at least 10 characters long"),
    other: z.string().optional().default(""),
    categoryId: z.string().optional().default(""),
    star: z
        .number("Please select a star rating")
        .int("Rating must be a whole number")
        .min(1, "Rating must be at least 1 star")
        .max(5, "Rating cannot exceed 5 stars"),
}).refine(
    (data) => {
        const hasCategory = !!data.categoryId && data.categoryId !== "other";
        const hasOther = !!data.other && data.other !== "";
        return (hasCategory || hasOther) && !(hasCategory && hasOther);
    },
    {
        message: "Either a category or 'other' must be selected, but not both",
        path: ["categoryId"],
    }
);

export type FeedbackInput = z.infer<typeof FeedbackSchema>