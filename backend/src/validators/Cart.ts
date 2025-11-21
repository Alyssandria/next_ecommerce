import z from "zod";

export const cartValidatorSchema = z.object({
  user_id: z.number(),
  product_id: z.number(),
  quantity: z.number()
}).strict();


export type cartValidator = z.infer<typeof cartValidatorSchema>;

export const cartValidatorSchemaPartial = cartValidatorSchema.partial();

export type cartValidatorPartial = z.infer<typeof cartValidatorSchemaPartial>

export const updateCartValidatorSchema = cartValidatorSchema.omit({ user_id: true, product_id: true })
export type updateCartValidator = z.infer<typeof updateCartValidatorSchema>
