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
  DELETE FROM product_images WHERE product_id = $1 AND EXISTS (
    SELECT 1 FROM products WHERE id = $1 AND vendor_id = auth.uid()
  );
  
  DELETE FROM products WHERE id = $1 AND vendor_id = auth.uid();
  
  RETURN FOUND;
END;
$$;

-- Function to add a product image
CREATE OR REPLACE FUNCTION add_product_image(p_id uuid, img_url text, is_main boolean)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_image_id uuid;
BEGIN
  -- Verify the product belongs to the current user
  IF NOT EXISTS (SELECT 1 FROM products WHERE id = p_id AND vendor_id = auth.uid()) THEN
    RAISE EXCEPTION 'Product not found or you do not have permission';
  END IF;
  
  -- Insert the new image
  INSERT INTO product_images (product_id, url, is_main)
  VALUES (p_id, img_url, is_main)
  RETURNING id INTO new_image_id;
  
  RETURN new_image_id;
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

