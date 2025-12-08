import z from "zod";

export const ShippingValidatorSchema = z.object({
  label: z.string().min(1),
  recipient: z.string().min(1),
  street: z.string().min(1),
  province: z.string().min(1),
  zip: z.string().min(4).max(4),
});

export const ShippingValidatorSchemaPartial = ShippingValidatorSchema.partial();
export type ShippingValidator = z.infer<typeof ShippingValidatorSchema>
export type ShippingValidatorPartial = z.infer<typeof ShippingValidatorSchemaPartial>
