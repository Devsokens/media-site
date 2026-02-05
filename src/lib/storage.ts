import { supabase } from './supabase';

/**
 * Uploads a file to a Supabase bucket.
 * @param file The file to upload.
 * @param bucket The name of the bucket (default: 'jeuob').
 * @param folder Optional folder path within the bucket.
 * @returns The public URL of the uploaded file or null if it fails.
 */
export const uploadFile = async (
    file: File,
    bucket = 'jeuob',
    folder = 'media'
): Promise<string | null> => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = folder ? `${folder}/${fileName}` : fileName;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    }
};

/**
 * Deletes a file from a Supabase bucket.
 * @param publicUrl The public URL of the file to delete.
 */
export const deleteFileByUrl = async (publicUrl: string): Promise<boolean> => {
    try {
        // Extract the path from the URL
        // Example: https://xxx.supabase.co/storage/v1/object/public/jeuob/media/filename.jpg
        const parts = publicUrl.split('/public/');
        if (parts.length < 2) return false;

        const pathWithBucket = parts[1];
        const bucketMatch = pathWithBucket.match(/^([^\/]+)\/(.+)$/);

        if (!bucketMatch) return false;

        const bucket = bucketMatch[1];
        const filePath = bucketMatch[2];

        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
};
