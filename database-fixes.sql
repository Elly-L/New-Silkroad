-- 1. Fix for Null vendor_id Issue
-- Modified create_vendor_product function to handle vendor_id properly
CREATE OR REPLACE FUNCTION create_vendor_product(p_data jsonb)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
  current_user_id UUID;
BEGIN
  -- Get the current user ID explicitly
  current_user_id := auth.uid();
  
  -- Log for debugging
  RAISE NOTICE 'Creating product for user ID: %', current_user_id;
  
  -- Check if user ID is available
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated or user ID not available';
  END IF;

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
    COALESCE(p_data->'features', '[]'::jsonb),
    COALESCE(p_data->'specifications', '{}'::jsonb),
    COALESCE((p_data->>'in_stock')::boolean, true),
    current_user_id,
    COALESCE(p_data->>'email', (SELECT email FROM auth.users WHERE id = current_user_id))
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

-- 2. Fix for Permission Denied Issue
-- Drop existing policies for products table
DROP POLICY IF EXISTS products_select_policy ON products;
DROP POLICY IF EXISTS products_insert_policy ON products;
DROP POLICY IF EXISTS products_update_policy ON products;
DROP POLICY IF EXISTS products_delete_policy ON products;

-- Create new policies with proper permissions
-- Allow anyone to view products (including anonymous users)
CREATE POLICY products_select_all ON products
  FOR SELECT USING (true);

-- Allow authenticated vendors to insert their own products
CREATE POLICY products_insert_vendor ON products
  FOR INSERT WITH CHECK (auth.uid() = vendor_id);

-- Allow vendors to update their own products
CREATE POLICY products_update_vendor ON products
  FOR UPDATE USING (auth.uid() = vendor_id);

-- Allow vendors to delete their own products
CREATE POLICY products_delete_vendor ON products
  FOR DELETE USING (auth.uid() = vendor_id);

-- Grant permissions to anonymous role
GRANT SELECT ON products TO anon;
GRANT SELECT ON product_images TO anon;

-- 3. Function to get all products with images for the shop page
CREATE OR REPLACE FUNCTION get_shop_products()
RETURNS TABLE (
  id UUID,
  name TEXT,
  price NUMERIC,
  description TEXT,
  category TEXT,
  features JSONB,
  specifications JSONB,
  in_stock BOOLEAN,
  vendor_id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  product_images JSON
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.price,
    p.description,
    p.category,
    p.features,
    p.specifications,
    p.in_stock,
    p.vendor_id,
    p.email,
    p.created_at,
    p.updated_at,
    (
      SELECT COALESCE(json_agg(
        json_build_object(
          'id', pi.id,
          'url', pi.url,
          'is_main', pi.is_main
        )
      ), '[]'::json)
      FROM product_images pi
      WHERE pi.product_id = p.id
    ) AS product_images
  FROM products p;
END;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION get_shop_products() TO anon;

