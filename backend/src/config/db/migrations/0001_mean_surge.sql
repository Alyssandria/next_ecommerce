ALTER TABLE "shipping_details" DROP CONSTRAINT "shipping_details_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "shipping_details" ADD CONSTRAINT "shipping_details_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;