-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    site_name TEXT NOT NULL DEFAULT 'JEUOB',
    site_description TEXT,
    contact_email TEXT,
    maintenance_mode BOOLEAN DEFAULT false,
    notify_new_articles BOOLEAN DEFAULT true,
    notify_comments BOOLEAN DEFAULT true,
    notify_weekly_report BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
-- Everyone can read settings
CREATE POLICY "Allow public read-only access to site_settings" 
    ON public.site_settings FOR SELECT 
    USING (true);

-- Only admins can update settings
CREATE POLICY "Allow admins to update site_settings" 
    ON public.site_settings FOR UPDATE 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Allow admins to insert settings
CREATE POLICY "Allow admins to insert site_settings" 
    ON public.site_settings FOR INSERT 
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Insert initial settings if they don't exist
INSERT INTO public.site_settings (id, site_name, site_description, contact_email, maintenance_mode)
VALUES ('primary', 'JEUOB', 'Journal de l''Étudiant UOB', 'contact@jeuob.com', false)
ON CONFLICT (id) DO NOTHING;
