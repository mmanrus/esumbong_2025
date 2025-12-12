import z from "zod"

export const CategorySchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Category name is required"),
    description: z.string().optional()
})

export type Category = z.infer<typeof CategorySchema>