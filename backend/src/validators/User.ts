import z from "zod";

export const userValidatorSchema = z.object({
  first_name: z.string().min(2, "First Name must be at least 2 characters"),
  last_name: z.string().min(2, "Last Name must be at least 2 characters"),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
}).required().strict()

export type userValidator = z.infer<typeof userValidatorSchema>;

export const userValidatorSchemaPartial = userValidatorSchema.partial();

export type userValidatorPartial = z.infer<typeof userValidatorSchemaPartial>
