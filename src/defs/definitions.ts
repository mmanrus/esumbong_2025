import { z } from "zod";

export const SignupFormSchema = z
  .object({
    fullname: z
      .string()
      .min(10, { message: "Full name must be at least 10 characters long." })
      .trim(),
    address: z.string().min(10, {message: "Address must be at least 10 characters long."}).trim(),
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
    type: z.string(),
    contactNumber: z.string().min(1, "Contact number required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match.",
  });

export type SignUpFormType = z.infer<typeof SignupFormSchema>
export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z.string().trim(),
});
