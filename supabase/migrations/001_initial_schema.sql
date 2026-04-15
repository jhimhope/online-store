-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  category VARCHAR(100),
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster category queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, stock_quantity) VALUES
('Premium Wireless Headphones', 'Noise-cancelling wireless headphones with premium sound quality', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 'Electronics', 50),
('Smart Watch Pro', 'Advanced smartwatch with health monitoring and GPS', 299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', 'Electronics', 30),
('Organic Cotton T-Shirt', 'Comfortable organic cotton t-shirt in various colors', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 'Fashion', 100),
('Stainless Steel Water Bottle', 'Insulated stainless steel water bottle keeps drinks cold for 24 hours', 34.99, 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop', 'Home', 75),
('Wireless Keyboard', 'Ergonomic wireless keyboard with backlit keys', 89.99, 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop', 'Electronics', 40),
('Yoga Mat Premium', 'Non-slip yoga mat with carrying strap', 49.99, 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=400&fit=crop', 'Fitness', 60);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE
    ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();