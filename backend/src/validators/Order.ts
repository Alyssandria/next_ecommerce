import z from "zod";

export const orderValidatorSchema = z.object({
  order_no: z.string().min(17),
  total: z.number().refine(val => !isNaN(Number(val))).transform((val) => val.toString()),
  products: z.array(z.object({
    name: z.string().min(2),
    product_id: z.number(),
    price: z.number().transform((val) => String(val)),
    quantity: z.number()
  }))
});

export type OrderValidator = z.infer<typeof orderValidatorSchema>;

export const orderPaymentSchema = orderValidatorSchema.omit({ order_no: true });

export type orderPaymentValidator = z.infer<typeof orderPaymentSchema>
