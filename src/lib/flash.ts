import { supabase } from './supabase';

export interface FlashInfo {
    id: string;
    title: string;
    content: string;
    coverImage?: string;
    priority: 'high' | 'normal';
    isActive: boolean;
    createdAt?: string;
}

const mapFlash = (dbFlash: any): FlashInfo => ({
    id: dbFlash.id,
    title: dbFlash.title,
    content: dbFlash.content,
    coverImage: dbFlash.cover_image,
    priority: dbFlash.priority,
    isActive: dbFlash.is_active,
    createdAt: dbFlash.created_at,
});

const FLASH_SELECT = 'id, title, content, cover_image, priority, is_active, created_at';

export const getFlashInfo = async (): Promise<FlashInfo[]> => {
    const { data, error } = await supabase
        .from('flash_info')
        .select(FLASH_SELECT)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching flash info:', error);
        return [];
    }

    return data.map(mapFlash);
};

export const getActiveFlashInfo = async (): Promise<FlashInfo[]> => {
    const { data, error } = await supabase
        .from('flash_info')
        .select(FLASH_SELECT)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching active flash info:', error);
        return [];
    }

    return data.map(mapFlash);
};

export const saveFlashInfo = async (flash: Omit<FlashInfo, 'id'>): Promise<FlashInfo | null> => {
    const dbFlash = {
        title: flash.title,
        content: flash.content,
        cover_image: flash.coverImage,
        priority: flash.priority,
        is_active: flash.isActive,
    };

    const { data, error } = await supabase
        .from('flash_info')
        .insert([dbFlash])
        .select()
        .single();

    if (error) {
        console.error('Error saving flash info:', error);
        return null;
    }

    return mapFlash(data);
};

export const updateFlashInfo = async (id: string, updates: Partial<FlashInfo>): Promise<FlashInfo | null> => {
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.coverImage !== undefined) dbUpdates.cover_image = updates.coverImage;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;

    const { data, error } = await supabase
        .from('flash_info')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating flash info:', error);
        return null;
    }

    return mapFlash(data);
};

export const deleteFlashInfo = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('flash_info')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting flash info:', error);
        return false;
    }

    return true;
};
