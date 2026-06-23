-- Run these queries in the Supabase SQL Editor to update your existing products table
-- and fix the Row-Level Security issues.

-- 1. Add new columns
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5, 2) DEFAULT 0.0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS rating DECIMAL(3, 2) DEFAULT 0.0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ingredients TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS how_to_use TEXT;

-- 2. Fix the Row-Level Security (RLS) policy for inserting products
DROP POLICY IF EXISTS "Allow public insert access" ON public.products;
CREATE POLICY "Allow public insert access" ON public.products FOR INSERT WITH CHECK (true);

-- 3. Ensure the read policy is there (optional if already exists, but safe to replace)
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
CREATE POLICY "Allow public read access" ON public.products FOR SELECT USING (true);
