import z from "zod";
import { ShippingValidatorSchema } from "./shippingValidators";

export const paymentFormValidatorSchema = z.discriminatedUnion("type",
  [
    z.object({
      type: z.literal("existing"),
      shipping_id: z.number(),
      total: z.number().refine(val => !isNaN(Number(val))).transform((val) => val.toString()),
      products: z.array(z.object({
        name: z.string().min(2),
        product_id: z.number(),
        price: z.number().transform((val) => String(val)),
        quantity: z.number()
      }))
    }),
    z.object({
      type: z.literal("new"),
      shippingDetails: z.object(ShippingValidatorSchema.shape),
      total: z.number().refine(val => !isNaN(Number(val))).transform((val) => val.toString()),
      products: z.array(z.object({
        name: z.string().min(2),
        product_id: z.number(),
        price: z.number().transform((val) => String(val)),
        quantity: z.number()
      }))
    }),
  ]
)

export type paymentFormValidator = z.infer<typeof paymentFormValidatorSchema>;
