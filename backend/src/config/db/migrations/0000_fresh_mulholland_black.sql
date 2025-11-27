CREATE TABLE "cart_items" (
	"user_id" integer,
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
	"user_id" integer,
	"order_no" varchar(18) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_no_unique" UNIQUE("order_no")
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
CREATE UNIQUE INDEX "uniqueUserCartItem" ON "cart_items" USING btree ("user_id","product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniqueProductOrders" ON "order_products" USING btree ("product_id","order_id");