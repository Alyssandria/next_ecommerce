CREATE TABLE "shipping_details" (
	"label" varchar(256) NOT NULL,
	"recipient" varchar(256) NOT NULL,
	"street" varchar(256) NOT NULL,
	"province" varchar(256) NOT NULL,
	"zip" varchar(4) NOT NULL,
	"user_id" integer,
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_id" integer;--> statement-breakpoint
ALTER TABLE "shipping_details" ADD CONSTRAINT "shipping_details_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_id_shipping_details_id_fk" FOREIGN KEY ("shipping_id") REFERENCES "public"."shipping_details"("id") ON DELETE no action ON UPDATE no action;