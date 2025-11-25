import z from "zod";

export const orderValidatorSchema = z.object({
  order_no: z.string().min(2),
  total: z.number().refine(val => !isNaN(Number(val))).transform((val) => val.toString()),
  products: z.array(z.object({
    product_id: z.number(),
    price: z.number().transform((val) => String(val)),
    quantity: z.number()
  }))
})

export type OrderValidator = z.infer<typeof orderValidatorSchema>;
