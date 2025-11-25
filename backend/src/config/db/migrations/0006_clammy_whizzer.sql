ALTER TABLE "order_products" RENAME COLUMN "cart_item_id" TO "product_id";--> statement-breakpoint
ALTER TABLE "order_products" DROP CONSTRAINT "order_products_cart_item_id_cart_items_id_fk";
--> statement-breakpoint
DROP INDEX "uniqueProductOrders";--> statement-breakpoint
ALTER TABLE "order_products" DROP CONSTRAINT "order_products_cart_item_id_order_id_pk";--> statement-breakpoint
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_product_id_order_id_pk" PRIMARY KEY("product_id","order_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniqueProductOrders" ON "order_products" USING btree ("product_id","order_id");