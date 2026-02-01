import { supabase } from './supabase';

export interface SiteSettings {
    id: string;
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    maintenanceMode: boolean;
    notifyNewArticles: boolean;
    notifyComments: boolean;
    notifyWeeklyReport: boolean;
    updatedAt?: string;
}

const mapSettings = (dbSettings: any): SiteSettings => ({
    id: dbSettings.id,
    siteName: dbSettings.site_name,
    siteDescription: dbSettings.site_description,
    contactEmail: dbSettings.contact_email,
    maintenanceMode: dbSettings.maintenance_mode,
    notifyNewArticles: dbSettings.notify_new_articles,
    notifyComments: dbSettings.notify_comments,
    notifyWeeklyReport: dbSettings.notify_weekly_report,
    updatedAt: dbSettings.updated_at,
});

export const getSiteSettings = async (): Promise<SiteSettings | null> => {
    const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'primary')
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No settings found, return default
            return {
                id: 'primary',
                siteName: 'JEUOB',
                siteDescription: 'Journal de l\'Étudiant UOB',
                contactEmail: 'contact@jeuob.com',
                maintenanceMode: false,
                notifyNewArticles: true,
                notifyComments: true,
                notifyWeeklyReport: false
            };
        }
        console.error('Error fetching site settings:', error);
        return null;
    }

    return mapSettings(data);
};

export const updateSiteSettings = async (updates: Partial<SiteSettings>): Promise<SiteSettings | null> => {
    const dbUpdates: any = {};
    if (updates.siteName !== undefined) dbUpdates.site_name = updates.siteName;
    if (updates.siteDescription !== undefined) dbUpdates.site_description = updates.siteDescription;
    if (updates.contactEmail !== undefined) dbUpdates.contact_email = updates.contactEmail;
    if (updates.maintenanceMode !== undefined) dbUpdates.maintenance_mode = updates.maintenanceMode;
    if (updates.notifyNewArticles !== undefined) dbUpdates.notify_new_articles = updates.notifyNewArticles;
    if (updates.notifyComments !== undefined) dbUpdates.notify_comments = updates.notifyComments;
    if (updates.notifyWeeklyReport !== undefined) dbUpdates.notify_weekly_report = updates.notifyWeeklyReport;
    dbUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
        .from('site_settings')
        .upsert({ id: 'primary', ...dbUpdates })
        .select()
        .single();

    if (error) {
        console.error('Error updating site settings:', error);
        return null;
    }

    return mapSettings(data);
};
