-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer', 'vendor', 'admin')),
  full_name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  store_name TEXT,
  store_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  category TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  in_stock BOOLEAN DEFAULT true,
  vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_main BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_email TEXT,
  vendor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  total NUMERIC NOT NULL,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Function to create a profile on user signup
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO profiles (
    id,
    email,
    role,
    full_name,
    store_name,
    store_description
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'store_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'store_description', '')
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the signup
    RAISE NOTICE 'Error creating profile: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger for profile creation
DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;
CREATE TRIGGER create_profile_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_profile_for_user();

-- Function to get vendor products
CREATE OR REPLACE FUNCTION get_vendor_products()
RETURNS SETOF products
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM products
  WHERE vendor_id = auth.uid();
END;
$$;

-- Function to create a vendor product
CREATE OR REPLACE FUNCTION create_vendor_product(p_data jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO products (
    name,
    price,
    description,
    category,
    features,
    specifications,
    in_stock,
    vendor_id,
    email
  )
  VALUES (
    p_data->>'name',
    (p_data->>'price')::numeric,
    p_data->>'description',
    p_data->>'category',
    p_data->'features',
    p_data->'specifications',
    (p_data->>'in_stock')::boolean,
    auth.uid(),
    p_data->>'email'
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

-- Function to update a vendor product
CREATE OR REPLACE FUNCTION update_vendor_product(p_id uuid, p_data jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products
  SET
    name = p_data->>'name',
    price = (p_data->>'price')::numeric,
    description = p_data->>'description',
    category = p_data->>'category',
    features = p_data->'features',
    specifications = p_data->'specifications',
    in_stock = (p_data->>'in_stock')::boolean,
    updated_at = now()
  WHERE id = p_id AND vendor_id = auth.uid();

  RETURN FOUND;
END;
$$;

-- Function to delete a vendor product
CREATE OR REPLACE FUNCTION delete_vendor_product(product_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete associated images first
  DELETE FROM product_images 
  WHERE product_id = $1 
  AND EXISTS (
    SELECT 1 FROM products 
    WHERE id = $1 
    AND vendor_id = auth.uid()
  );
  
  -- Then delete the product
  DELETE FROM products 
  WHERE id = $1 
  AND vendor_id = auth.uid();
  
  RETURN FOUND;
END;
$$;

-- Function to get vendor statistics
CREATE OR REPLACE FUNCTION get_vendor_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  vendor_id uuid := auth.uid();
BEGIN
  -- Calculate total sales, orders, customers, and average order value
  WITH order_stats AS (
    SELECT
      COUNT(DISTINCT o.id) AS total_orders,
      COUNT(DISTINCT o.customer_id) AS total_customers,
      SUM(o.total) AS total_sales
    FROM orders o
    WHERE o.vendor_id = vendor_id
  ),
  -- Get sales by month
  monthly_sales AS (
    SELECT
      TO_CHAR(o.created_at, 'Mon') AS month,
      SUM(o.total) AS sales
    FROM orders o
    WHERE o.vendor_id = vendor_id
    GROUP BY TO_CHAR(o.created_at, 'Mon')
    ORDER BY MIN(o.created_at)
  ),
  -- Get top products
  top_products AS (
    SELECT
      p.id,
      p.name,
      SUM(oi.quantity * oi.price) AS sales
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN orders o ON oi.order_id = o.id
    WHERE p.vendor_id = vendor_id
    GROUP BY p.id, p.name
    ORDER BY sales DESC
    LIMIT 5
  )
  SELECT
    jsonb_build_object(
      'total_sales', COALESCE((SELECT total_sales FROM order_stats), 0),
      'total_orders', COALESCE((SELECT total_orders FROM order_stats), 0),
      'total_customers', COALESCE((SELECT total_customers FROM order_stats), 0),
      'average_order_value', CASE 
                               WHEN (SELECT total_orders FROM order_stats) > 0 
                               THEN (SELECT total_sales FROM order_stats) / (SELECT total_orders FROM order_stats)
                               ELSE 0
                             END,
      'sales_by_month', (SELECT jsonb_agg(jsonb_build_object('month', month, 'sales', sales)) FROM monthly_sales),
      'top_products', (SELECT jsonb_agg(jsonb_build_object('id', id, 'name', name, 'sales', sales)) FROM top_products)
    ) INTO result;
  
  -- Handle null values
  IF result->'sales_by_month' IS NULL THEN
    result = result || '{"sales_by_month": []}'::jsonb;
  END IF;
  
  IF result->'top_products' IS NULL THEN
    result = result || '{"top_products": []}'::jsonb;
  END IF;
  
  RETURN result;
END;
$$;

-- Set up RLS policies for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for selecting profiles (users can view their own profile)
CREATE POLICY profiles_select_policy ON profiles
FOR SELECT USING (auth.uid() = id OR role = 'vendor');

-- Policy for inserting profiles (only authenticated users)
CREATE POLICY profiles_insert_policy ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy for updating profiles (only the user can update their own profile)
CREATE POLICY profiles_update_policy ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Set up RLS policies for products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy for selecting products (anyone can view)
CREATE POLICY products_select_policy ON products
FOR SELECT USING (true);

-- Policy for inserting products (only authenticated users)
CREATE POLICY products_insert_policy ON products
FOR INSERT WITH CHECK (auth.uid() = vendor_id);

-- Policy for updating products (only the vendor who owns the product)
CREATE POLICY products_update_policy ON products
FOR UPDATE USING (auth.uid() = vendor_id);

-- Policy for deleting products (only the vendor who owns the product)
CREATE POLICY products_delete_policy ON products
FOR DELETE USING (auth.uid() = vendor_id);

-- Set up RLS policies for product_images table
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Policy for selecting product images (anyone can view)
CREATE POLICY product_images_select_policy ON product_images
FOR SELECT USING (true);

-- Policy for inserting product images (only if user owns the related product)
CREATE POLICY product_images_insert_policy ON product_images
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM products 
    WHERE products.id = product_images.product_id 
    AND products.vendor_id = auth.uid()
  )
);

-- Policy for updating product images (only if user owns the related product)
CREATE POLICY product_images_update_policy ON product_images
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM products 
    WHERE products.id = product_images.product_id 
    AND products.vendor_id = auth.uid()
  )
);

-- Policy for deleting product images (only if user owns the related product)
CREATE POLICY product_images_delete_policy ON product_images
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM products 
    WHERE products.id = product_images.product_id 
    AND products.vendor_id = auth.uid()
  )
);

-- Set up RLS policies for orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy for selecting orders (customers can view their own orders, vendors can view orders for their products)
CREATE POLICY orders_select_policy ON orders
FOR SELECT USING (
  auth.uid() = customer_id OR auth.uid() = vendor_id
);

-- Policy for inserting orders (only authenticated users)
CREATE POLICY orders_insert_policy ON orders
FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Policy for updating orders (vendors can update orders for their products)
CREATE POLICY orders_update_policy ON orders
FOR UPDATE USING (auth.uid() = vendor_id);

-- Set up RLS policies for order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policy for selecting order items (customers can view their own order items, vendors can view items for their products)
CREATE POLICY order_items_select_policy ON order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.customer_id = auth.uid() OR orders.vendor_id = auth.uid())
  )
);

-- Policy for inserting order items (only authenticated users)
CREATE POLICY order_items_insert_policy ON order_items
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.customer_id = auth.uid()
  )
);

-- Create storage bucket for product images if it doesn't exist
-- Note: This needs to be done in the Supabase dashboard or API
-- The following is just a reminder

-- Storage bucket permissions:
-- 1. Allow public read access to product-images bucket
-- 2. Allow authenticated users to upload to product-images bucket
-- 3. Allow users to delete their own files

