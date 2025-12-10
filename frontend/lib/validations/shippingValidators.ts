import z from "zod";

export const ShippingValidatorSchema = z.object({
  label: z.string().min(1, {
    error: "Label is required"
  }),
  recipient: z.string().min(1, {
    error: "Recipient is required"
  }),
  street: z.string().min(1, {
    error: "Street is required"
  }),
  province: z.string().min(1, {
    error: "Province is required"
  }),
  zip: z.string().refine(val => val.length === 4 && !isNaN(Number(val)), {
    error: "Zip must be valid and exactly 4 numbers"
  }),
});

export const ShippingValidatorSchemaPartial = ShippingValidatorSchema.partial();
export type ShippingValidator = z.infer<typeof ShippingValidatorSchema>
export type ShippingValidatorPartial = z.infer<typeof ShippingValidatorSchemaPartial>
