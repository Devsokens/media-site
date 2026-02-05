-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- e.g., 'article_draft'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    recipient_role TEXT DEFAULT 'admin',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
-- Admins can read all notifications
DROP POLICY IF EXISTS "Admins can read all notifications" ON public.notifications;
CREATE POLICY "Admins can read all notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Users can read notifications sent to them specifically
DROP POLICY IF EXISTS "Users can read notifications for their role" ON public.notifications;
CREATE POLICY "Users can read notifications for their role"
ON public.notifications
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND (profiles.role = notifications.recipient_role OR notifications.recipient_role IS NULL)
    )
);

-- Anyone can create a notification (e.g. Editors creating notifications for Admins)
DROP POLICY IF EXISTS "Anyone can create notifications" ON public.notifications;
CREATE POLICY "Anyone can create notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Users can update notifications (mark as read) if they are the recipient
DROP POLICY IF EXISTS "Recipients can mark notifications as read" ON public.notifications;
CREATE POLICY "Recipients can mark notifications as read"
ON public.notifications
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND (profiles.role = notifications.recipient_role)
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND (profiles.role = notifications.recipient_role)
    )
);

-- Grant permissions explicitly
GRANT ALL ON TABLE public.notifications TO authenticated;
GRANT ALL ON TABLE public.notifications TO service_role;

-- Add to realtime (only if not already present)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'notifications'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
    END IF;
END $$;
