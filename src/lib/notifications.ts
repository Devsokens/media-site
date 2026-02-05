import { supabase } from './supabase';

export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    articleId?: string;
    senderId?: string;
    recipientRole: string;
    isRead: boolean;
    createdAt: string;
}

const mapNotification = (dbNotif: any): Notification => ({
    id: dbNotif.id,
    type: dbNotif.type,
    title: dbNotif.title,
    message: dbNotif.message,
    articleId: dbNotif.article_id,
    senderId: dbNotif.sender_id,
    recipientRole: dbNotif.recipient_role,
    isRead: dbNotif.is_read,
    createdAt: dbNotif.created_at,
});

export const getNotifications = async (role: string): Promise<Notification[]> => {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_role', role)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }

    return data.map(mapNotification);
};

export const createNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<Notification | null> => {
    const dbNotif = {
        type: notification.type,
        title: notification.title,
        message: notification.message,
        article_id: notification.articleId,
        sender_id: notification.senderId,
        recipient_role: notification.recipientRole,
    };

    const { data, error } = await supabase
        .from('notifications')
        .insert([dbNotif])
        .select()
        .single();

    if (error) {
        console.error('Error creating notification:', error);
        return null;
    }

    return mapNotification(data);
};

export const markNotificationAsRead = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

    if (error) {
        console.error('Error marking notification as read:', error);
        return false;
    }

    return true;
};

export const markAllAsRead = async (role: string): Promise<boolean> => {
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_role', role)
        .eq('is_read', false);

    if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
    }

    return true;
};
