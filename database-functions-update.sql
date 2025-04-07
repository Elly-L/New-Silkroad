-- Make sure the products table has the correct columns
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  category TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  in_stock BOOLEAN DEFAULT true,
  vendor_id UUID REFERENCES auth.users(id),
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Make sure the product_images table has the correct columns
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_main BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Update the create_vendor_product function to use email
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

