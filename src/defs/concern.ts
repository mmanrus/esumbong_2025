import z from "zod";

export const ConcernFormSchema = z
  .object({
    title: z.string().min(1, "Title is required")
      .max(100, "Title must be at most 100 characters long"),
    categoryId: z.string().optional().default(""),
    other: z.string().optional().default(""),
    details: z.string().min(1, "Details are required."),
    location: z.string().min(2, "location is required."),
    needsBarangayAssistance: z.boolean().nullable().optional(),
    isSpam: z.boolean(),
  })
  .refine(
    (data) => {
      const hasCategory = !!data.categoryId && data.categoryId !== "other";
      const hasOther = !!data.other && data.other !== "";
      // Either categoryId or other must be set, but not both
      return (hasCategory || hasOther) && !(hasCategory && hasOther);
    },
    {
      message: "Either categoryId or 'other' must be selected, but not both",
      path: ["categoryId"],
    }
  );


export type ConcernForm = z.infer<typeof ConcernFormSchema>;
