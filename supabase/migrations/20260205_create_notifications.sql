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

-- Users can read notifications sent to them specifically (if we added recipient_id, but here we use roles)
-- For role-based, we'll allow all authenticated users to read notifications where their role matches
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
CREATE POLICY "Anyone can create notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Users can update notifications (mark as read) if they are the recipient
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

-- Create a function to delete old notifications (optional cleanup)
-- For now, keep it simple.

-- Add to realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
