import z from "zod";
import { ShippingValidatorSchema } from "./shippingValidators";


export const paymentFormValidatorSchema = z.object({
  type: z.enum(["new", "existing"]),
  shipping_id: z.number().optional(),
  shippingDetails: z.object(ShippingValidatorSchema.shape).optional(),
  total: z.string(),
  products: z.array(z.object({
    name: z.string().min(2),
    product_id: z.number(),
    price: z.string(),
    quantity: z.number()
  }))
})

export type paymentFormValidator = z.infer<typeof paymentFormValidatorSchema>;
