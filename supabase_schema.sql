-- Create a table for products
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    brand TEXT,
    category TEXT,
    price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) DEFAULT 0.0,
    rating DECIMAL(3, 2) DEFAULT 0.0,
    reviews_count INTEGER DEFAULT 0,
    ingredients TEXT,
    how_to_use TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS) for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
CREATE POLICY "Allow public read access" ON public.products
    FOR SELECT USING (true);

-- Allow authenticated users to insert products
DROP POLICY IF EXISTS "Allow public insert access" ON public.products;
DROP POLICY IF EXISTS "Allow authenticated insert access" ON public.products;
CREATE POLICY "Allow authenticated insert access" ON public.products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access" ON public.products
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access" ON public.products
    FOR DELETE USING (auth.role() = 'authenticated');


-- Create a table for contact form submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS) for contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact submissions
DROP POLICY IF EXISTS "Allow public insert access" ON public.contact_submissions;
CREATE POLICY "Allow public insert access" ON public.contact_submissions
    FOR INSERT WITH CHECK (true);

-- Only authenticated users (admins) can view submissions
DROP POLICY IF EXISTS "Allow authenticated read access" ON public.contact_submissions;
CREATE POLICY "Allow authenticated read access" ON public.contact_submissions
    FOR SELECT USING (auth.role() = 'authenticated');


-- Storage Bucket for Product Images
-- You need to create a bucket named 'product-images' manually in the Supabase Dashboard UI
-- Ensure the bucket is set to "Public" so images can be viewed.

-- Allow authenticated users to upload to the product-images bucket
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-images');
