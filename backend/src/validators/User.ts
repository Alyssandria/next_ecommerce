import z from "zod";

export const userValidator = z.object({
  first_name: z.string().min(2, "First Name must be at least 2 characters"),
  last_name: z.string().min(2, "Last Name must be at least 2 characters"),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
}).required()

export type userValidator = z.infer<typeof userValidator>
