-- Create a table for products
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS) for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Allow public read access" ON public.products
    FOR SELECT USING (true);

-- Allow authenticated users (or anyone for this MVP) to insert products
-- WARNING: In a production app, you should restrict this to only admin users.
CREATE POLICY "Allow public insert access" ON public.products
    FOR INSERT WITH CHECK (true);


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
CREATE POLICY "Allow public insert access" ON public.contact_submissions
    FOR INSERT WITH CHECK (true);

-- Only authenticated users (admins) can view submissions
CREATE POLICY "Allow authenticated read access" ON public.contact_submissions
    FOR SELECT USING (auth.role() = 'authenticated');


-- Storage Bucket for Product Images
-- You need to create a bucket named 'product-images' manually in the Supabase Dashboard UI
-- Ensure the bucket is set to "Public" so images can be viewed.
