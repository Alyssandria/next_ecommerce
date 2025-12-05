CREATE TABLE "cart_items" (
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_products" (
	"price" numeric(10, 2) NOT NULL,
	"quantity" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	CONSTRAINT "order_products_product_id_order_id_pk" PRIMARY KEY("product_id","order_id")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"user_id" integer NOT NULL,
	"shipping_id" integer NOT NULL,
	"order_no" varchar(18) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_no_unique" UNIQUE("order_no")
);
--> statement-breakpoint
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
CREATE TABLE "users" (
	"first_name" varchar(256) NOT NULL,
	"last_name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(64) NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_id_shipping_details_id_fk" FOREIGN KEY ("shipping_id") REFERENCES "public"."shipping_details"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping_details" ADD CONSTRAINT "shipping_details_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uniqueUserCartItem" ON "cart_items" USING btree ("user_id","product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniqueProductOrders" ON "order_products" USING btree ("product_id","order_id");