import { supabase } from './supabase';

export interface Ad {
    id: string;
    name: string;
    imageUrl: string;
    link: string;
    placement: 'sidebar' | 'header' | 'article';
    clicks: number;
    isActive: boolean;
    createdAt?: string;
}

const mapAd = (dbAd: any): Ad => ({
    id: dbAd.id,
    name: dbAd.name,
    imageUrl: dbAd.image_url,
    link: dbAd.link,
    placement: dbAd.placement,
    clicks: dbAd.clicks,
    isActive: dbAd.is_active,
    createdAt: dbAd.created_at,
});

const AD_SELECT = 'id, name, image_url, link, placement, clicks, is_active, created_at';

export const getAds = async (): Promise<Ad[]> => {
    const { data, error } = await supabase
        .from('ads')
        .select(AD_SELECT)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching ads:', error);
        return [];
    }

    return data.map(mapAd);
};

export const getActiveAdsByPlacement = async (placement: Ad['placement']): Promise<Ad[]> => {
    const { data, error } = await supabase
        .from('ads')
        .select(AD_SELECT)
        .eq('is_active', true)
        .eq('placement', placement)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(`Error fetching active ads for placement ${placement}:`, error);
        return [];
    }

    return data.map(mapAd);
};

export const saveAd = async (ad: Omit<Ad, 'id' | 'clicks'>): Promise<Ad | null> => {
    const dbAd = {
        name: ad.name,
        image_url: ad.imageUrl,
        link: ad.link,
        placement: ad.placement,
        is_active: ad.isActive,
        clicks: 0,
    };

    const { data, error } = await supabase
        .from('ads')
        .insert([dbAd])
        .select()
        .single();

    if (error) {
        console.error('Error saving ad:', error);
        return null;
    }

    return mapAd(data);
};

export const updateAd = async (id: string, updates: Partial<Ad>): Promise<Ad | null> => {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
    if (updates.link !== undefined) dbUpdates.link = updates.link;
    if (updates.placement !== undefined) dbUpdates.placement = updates.placement;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
    if (updates.clicks !== undefined) dbUpdates.clicks = updates.clicks;

    const { data, error } = await supabase
        .from('ads')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating ad:', error);
        return null;
    }

    return mapAd(data);
};

export const deleteAd = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting ad:', error);
        return false;
    }

    return true;
};

export const incrementAdClicks = async (adId: string) => {
    const { data: ad } = await supabase
        .from('ads')
        .select('clicks')
        .eq('id', adId)
        .single();

    if (ad) {
        await supabase
            .from('ads')
            .update({ clicks: (ad.clicks || 0) + 1 })
            .eq('id', adId);
    }
};
