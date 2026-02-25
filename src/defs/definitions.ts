import { z } from "zod";

export const SignupFormSchema = z
  .object({
    fullname: z
      .string()
      .min(10, { message: "Full name must be at least 10 characters long." })
      .trim(),
    address: z.string().min(10, { message: "Address must be at least 10 characters long." }).trim(),
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    password: z
      .string()
      .min(8, { message: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
    confirmPassword: z.string().trim(),
    type: z
      .enum(["resident", "barangay_official", "admin"])
      .refine((val) => !!val, {
        message: "User type is required",
      }),

    contactNumber: z.string().min(1, "Contact number required"),
    age: z.coerce
      .number({
        error: "Age must be a number"
      })
      .min(18, "Must be at least 18")
      .max(100, "Must be 100 or less"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match.",
  });

/** RAW form values (before validation) */
export type SignUpFormInput = z.input<typeof SignupFormSchema>;

/** VALIDATED values (after resolver) */
export type SignUpFormType = z.output<typeof SignupFormSchema>;


export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z.string().trim(),
});

export const profileSchema = z.object({
  fullname: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100),

  email: z
    .string()
    .email("Invalid email format"),

  phone: z
    .string()
    .regex(/^(\+63|0)9\d{9}$/, "Invalid Philippine phone number"),

  address: z
    .string()
    .min(5, "Address is too short")
    .optional()
    .or(z.literal("")),

});


export type profileSchemaType = z.infer<typeof profileSchema>