-- Add paid field to orders table
-- Run this script in your Supabase SQL Editor

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS paid BOOLEAN DEFAULT FALSE;

-- Create index for paid status
CREATE INDEX IF NOT EXISTS idx_orders_paid ON orders(paid);
