import z from "zod";

export const registerSchema = z.object({
  first_name: z.string().min(2, "First name must have at least 2 characters"),
  last_name: z.string().min(2, "First name must have at least 2 characters"),
  email: z.email(),
  password: z.string().min(8, "Passwords name must have at least 8 characters"),
  confirm: z.string().min(8, "Confirm password name must have at least 8 characters"),
  agree: z.boolean().refine(val => val === true, {
    error: "You must agree to terms and conditions"
  })
}).refine(val => val.password === val.confirm, {
  error: "Passwords don't match",
  path: ['confirm']
});

export type RegisterValidator = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Passwords name must have at least 8 characters"),
});

export type LoginValidator = z.infer<typeof loginSchema>;
