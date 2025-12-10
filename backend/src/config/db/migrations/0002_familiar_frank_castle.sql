ALTER TABLE "orders" DROP CONSTRAINT "orders_shipping_id_shipping_details_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_id_shipping_details_id_fk" FOREIGN KEY ("shipping_id") REFERENCES "public"."shipping_details"("id") ON DELETE cascade ON UPDATE no action;