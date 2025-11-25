ALTER TABLE "order_products" ADD CONSTRAINT "order_products_cart_item_id_order_id_pk" PRIMARY KEY("cart_item_id","order_id");--> statement-breakpoint
ALTER TABLE "order_products" ADD COLUMN "price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "order_products" ADD COLUMN "quantity" integer NOT NULL;