-- LovMeds Product Categories Schema
-- Run this script in your Supabase SQL Editor to add categories support
-- This extends the existing products schema with categories functionality

-- ============================================
-- PRODUCT CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for product_categories
CREATE INDEX IF NOT EXISTS idx_categories_slug ON product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON product_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON product_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON product_categories(display_order);

-- ============================================
-- PRODUCT CATEGORY JUNCTION TABLE
-- ============================================
-- Many-to-many relationship between products and categories
CREATE TABLE IF NOT EXISTS product_category_relations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, category_id)
);

-- Indexes for product_category_relations
CREATE INDEX IF NOT EXISTS idx_product_category_product_id ON product_category_relations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_category_category_id ON product_category_relations(category_id);

-- ============================================
-- FUNCTION: Auto-update updated_at timestamp for categories
-- ============================================
CREATE OR REPLACE FUNCTION update_category_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at on product_categories
CREATE TRIGGER update_product_categories_updated_at
  BEFORE UPDATE ON product_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_category_updated_at();

-- ============================================
-- FUNCTION: Auto-generate slug from category name
-- ============================================
CREATE OR REPLACE FUNCTION generate_category_slug(name_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(name_text, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on new tables
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_category_relations ENABLE ROW LEVEL SECURITY;

-- Product Categories: Public read, authenticated write
CREATE POLICY "Categories are viewable by everyone"
  ON product_categories FOR SELECT
  USING (true);

CREATE POLICY "Categories can be inserted by authenticated users"
  ON product_categories FOR INSERT
  WITH CHECK (true); -- Adjust based on your auth requirements

CREATE POLICY "Categories can be updated by authenticated users"
  ON product_categories FOR UPDATE
  USING (true); -- Adjust based on your auth requirements

CREATE POLICY "Categories can be deleted by authenticated users"
  ON product_categories FOR DELETE
  USING (true); -- Adjust based on your auth requirements

-- Product Category Relations: Public read, authenticated write
CREATE POLICY "Category relations are viewable by everyone"
  ON product_category_relations FOR SELECT
  USING (true);

CREATE POLICY "Category relations can be inserted by authenticated users"
  ON product_category_relations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Category relations can be updated by authenticated users"
  ON product_category_relations FOR UPDATE
  USING (true);

CREATE POLICY "Category relations can be deleted by authenticated users"
  ON product_category_relations FOR DELETE
  USING (true);

-- ============================================
-- SAMPLE CATEGORIES (Optional - for testing)
-- ============================================
-- Uncomment to insert sample categories

/*
INSERT INTO product_categories (name, slug, description, display_order) VALUES
('Acne & Blemishes', 'acne-blemishes', 'Products to help with acne and blemish control', 1),
('Dark Spots & Hyperpigmentation', 'dark-spots-hyperpigmentation', 'Solutions for dark spots and uneven skin tone', 2),
('Dryness & Dehydration', 'dryness-dehydration', 'Moisturizing products for dry and dehydrated skin', 3),
('Aging & Wrinkles', 'aging-wrinkles', 'Anti-aging solutions for fine lines and wrinkles', 4),
('Sensitivity & Redness', 'sensitivity-redness', 'Gentle products for sensitive and irritated skin', 5),
('Oily Skin', 'oily-skin', 'Products designed for oily and combination skin types', 6);
*/

-- ============================================
-- HELPER VIEW: Products with Categories
-- ============================================
-- This view makes it easier to query products with their categories
CREATE OR REPLACE VIEW products_with_categories AS
SELECT 
  p.id,
  p.title,
  p.description,
  p.slug,
  p.normal_price,
  p.sale_price,
  p.cost_price,
  p.stock,
  p.image_url,
  p.featured,
  p.created_at,
  p.updated_at,
  COALESCE(
    json_agg(
      json_build_object(
        'id', pc.id,
        'name', pc.name,
        'slug', pc.slug,
        'description', pc.description,
        'image_url', pc.image_url
      )
    ) FILTER (WHERE pc.id IS NOT NULL),
    '[]'::json
  ) AS categories
FROM products p
LEFT JOIN product_category_relations pcr ON p.id = pcr.product_id
LEFT JOIN product_categories pc ON pcr.category_id = pc.id AND pc.is_active = TRUE
GROUP BY p.id, p.title, p.description, p.slug, p.normal_price, p.sale_price, 
         p.cost_price, p.stock, p.image_url, p.featured, p.created_at, p.updated_at;

-- ============================================
-- HELPER FUNCTION: Get products by category slug
-- ============================================
CREATE OR REPLACE FUNCTION get_products_by_category(category_slug_param TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  slug TEXT,
  normal_price DECIMAL(10, 2),
  sale_price DECIMAL(10, 2),
  cost_price DECIMAL(10, 2),
  stock INTEGER,
  image_url TEXT,
  featured BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    p.id,
    p.title,
    p.description,
    p.slug,
    p.normal_price,
    p.sale_price,
    p.cost_price,
    p.stock,
    p.image_url,
    p.featured,
    p.created_at,
    p.updated_at
  FROM products p
  INNER JOIN product_category_relations pcr ON p.id = pcr.product_id
  INNER JOIN product_categories pc ON pcr.category_id = pc.id
  WHERE pc.slug = category_slug_param
    AND pc.is_active = TRUE
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;
