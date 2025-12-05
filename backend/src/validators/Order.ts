import z from "zod";
import { ShippingValidatorSchema } from "./Shipping";

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

export const orderValidatorSchema = z.object({
  order_no: z.string().min(17),
  shipping_id: z.number(),
  total: z.number().refine(val => !isNaN(Number(val))).transform((val) => val.toString()),
  products: z.array(z.object({
    name: z.string().min(2),
    product_id: z.number(),
    price: z.number().transform((val) => String(val)),
    quantity: z.number()
  }))
});

export type OrderValidator = z.infer<typeof orderValidatorSchema>;

