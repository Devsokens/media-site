import { supabase } from './supabase';

export interface UserProfile {
    id: string;
    fullName: string;
    email?: string; // Optional if not in profiles yet
    role: 'admin' | 'editor' | 'viewer';
    status: 'active' | 'inactive';
    avatarUrl?: string;
    createdAt?: string;
}

const mapProfile = (dbProfile: any): UserProfile => ({
    id: dbProfile.id,
    fullName: dbProfile.full_name,
    email: dbProfile.email, // Assume it might be there or joined
    role: dbProfile.role,
    status: dbProfile.status,
    avatarUrl: dbProfile.avatar_url,
    createdAt: dbProfile.created_at,
});

export const getProfiles = async (): Promise<UserProfile[]> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching profiles:', error);
        return [];
    }

    return data.map(mapProfile);
};

export const updateProfile = async (id: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
    const dbUpdates: any = {};
    if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
    if (updates.role !== undefined) dbUpdates.role = updates.role;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;

    const { data, error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating profile:', error);
        return null;
    }

    return mapProfile(data);
};

export const deleteProfile = async (id: string): Promise<boolean> => {
    // Note: Deleting from profiles will cascade if set up, 
    // but usually we want to delete from auth.users too which requires service_role key or admin API.
    // For now we just handle the profile deletion.
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting profile:', error);
        return false;
    }

    return true;
};

export const getCurrentProfile = async (): Promise<UserProfile | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error('Error fetching current profile:', error);
        return null;
    }

    return mapProfile(data);
};
