-- Promo Messages Schema for LovMeds
-- Run this script in your Supabase SQL Editor

-- ============================================
-- PROMO MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS promo_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  link_url TEXT,
  link_text TEXT,
  background_color TEXT DEFAULT '#A33D4A',
  text_color TEXT DEFAULT '#FFFFFF',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for active promo messages
CREATE INDEX IF NOT EXISTS idx_promo_messages_active ON promo_messages(is_active);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_promo_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_promo_messages_updated_at
  BEFORE UPDATE ON promo_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_promo_messages_updated_at();

-- Row Level Security (RLS) Policies
ALTER TABLE promo_messages ENABLE ROW LEVEL SECURITY;

-- Promo messages: Public read, authenticated write
CREATE POLICY "Promo messages are viewable by everyone"
  ON promo_messages FOR SELECT
  USING (true);

CREATE POLICY "Promo messages can be inserted by authenticated users"
  ON promo_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Promo messages can be updated by authenticated users"
  ON promo_messages FOR UPDATE
  USING (true);

CREATE POLICY "Promo messages can be deleted by authenticated users"
  ON promo_messages FOR DELETE
  USING (true);

-- Insert default promo message (inactive)
INSERT INTO promo_messages (message, is_active, background_color, text_color)
VALUES ('Welcome to LovMeds! Free shipping on orders over $100.', false, '#A33D4A', '#FFFFFF')
ON CONFLICT DO NOTHING;
