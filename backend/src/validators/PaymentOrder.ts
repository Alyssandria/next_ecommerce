import z from "zod";
import { ShippingValidatorSchema } from "./Shipping";

export const PaymentOrderValidatorSchema = z.object({
  shipping_id: z.number(),
  shippingDetails: z.object({
    ...ShippingValidatorSchema.shape
  }),
  total: z.number().refine(val => !isNaN(Number(val))).transform((val) => val.toString()),
  products: z.array(z.object({
    name: z.string().min(2),
    product_id: z.number(),
    price: z.number().transform((val) => String(val)),
    quantity: z.number()
  }))
});

export type PaymentOrderValidator = z.infer<typeof PaymentOrderValidatorSchema>;
