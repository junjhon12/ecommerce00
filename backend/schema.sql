-- feat: establish core e-commerce relational schema
-- UUIDs were chosen for primary keys over sequential integers to optimize cross-environment 
-- data merging and prevent resource enumeration, balancing security with distinct readability.

CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) DEFAULT 'CUSTOMER',
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "products" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "price" DECIMAL(10, 2) NOT NULL,
    "stock_quantity" INT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "orders" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "status" VARCHAR(50) DEFAULT 'PENDING',
    "total_amount" DECIMAL(10, 2) NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- feat: create junction table for many-to-many relationship
-- A dedicated order_items table was chosen over an array column to optimize complex aggregations 
-- and ensure accurate historical pricing, balancing normalization with analytical performance.

CREATE TABLE "order_items" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "quantity" INT NOT NULL,
    "price_at_time" DECIMAL(10, 2) NOT NULL,
    CONSTRAINT "fk_order" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT
);