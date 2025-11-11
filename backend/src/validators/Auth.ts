import z from "zod";

export const authLoginValidatorSchema = z.object({
  email: z.email(),
  password: z.string()
}).required().strict();

export type authLoginValidator = z.infer<typeof authLoginValidatorSchema>
