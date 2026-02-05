import { supabase } from './supabase';
import { Article } from '@/types/article';

// Helper to map DB snake_case to Frontend camelCase
const mapArticle = (dbArticle: any): Article => ({
  id: dbArticle.id,
  title: dbArticle.title,
  summary: dbArticle.summary,
  content: dbArticle.content,
  category: dbArticle.category,
  coverImage: dbArticle.cover_image,
  author: dbArticle.author,
  readingTime: dbArticle.reading_time,
  views: dbArticle.views,
  publishedAt: dbArticle.published_at,
  isPublished: dbArticle.is_published,
  isFeatured: dbArticle.is_featured,
  createdAt: dbArticle.created_at,
  updatedAt: dbArticle.updated_at,
});

// Lean selection for list views to improve performance (excludes content)
const LEAN_SELECT = 'id, title, summary, category, cover_image, author, reading_time, views, published_at, is_published, is_featured, created_at, updated_at';

export const getArticles = async (): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select(LEAN_SELECT)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return data.map(mapArticle);
};

export const getPublishedArticles = async (): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select(LEAN_SELECT)
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching published articles:', error);
    return [];
  }

  return data.map(mapArticle);
};

export const getFeaturedArticle = async (): Promise<Article | undefined> => {
  const { data, error } = await supabase
    .from('articles')
    .select(LEAN_SELECT)
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching featured article:', error);
    return undefined;
  }

  return data ? mapArticle(data) : undefined;
};

export const getArticleById = async (id: string): Promise<Article | undefined> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*') // Full content needed for single view
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching article by id:', error);
    return undefined;
  }

  return mapArticle(data);
};

export const getArticlesByCategory = async (category: string): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select(LEAN_SELECT)
    .eq('is_published', true)
    .ilike('category', category)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles by category:', error);
    return [];
  }

  return data.map(mapArticle);
};

export const saveArticle = async (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article | null> => {
  const dbArticle = {
    title: article.title,
    summary: article.summary,
    content: article.content,
    category: article.category,
    cover_image: article.coverImage,
    author: article.author,
    reading_time: article.readingTime,
    views: article.views,
    published_at: article.publishedAt,
    is_published: article.isPublished,
    is_featured: article.isFeatured,
  };

  const { data, error } = await supabase
    .from('articles')
    .insert([dbArticle])
    .select()
    .single();

  if (error) {
    console.error('Error saving article:', error);
    return null;
  }

  return mapArticle(data);
};

export const updateArticle = async (id: string, updates: Partial<Article>): Promise<Article | null> => {
  const dbUpdates: any = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.summary !== undefined) dbUpdates.summary = updates.summary;
  if (updates.content !== undefined) dbUpdates.content = updates.content;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.coverImage !== undefined) dbUpdates.cover_image = updates.coverImage;
  if (updates.author !== undefined) dbUpdates.author = updates.author;
  if (updates.readingTime !== undefined) dbUpdates.reading_time = updates.readingTime;
  if (updates.views !== undefined) dbUpdates.views = updates.views;
  if (updates.publishedAt !== undefined) dbUpdates.published_at = updates.publishedAt;
  if (updates.isPublished !== undefined) dbUpdates.is_published = updates.isPublished;
  if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured;

  dbUpdates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('articles')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating article:', error);
    return null;
  }

  return mapArticle(data);
};

export const deleteArticle = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting article:', error);
    return false;
  }

  return true;
};

export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateShort = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    month: 'short',
    day: 'numeric',
  });
};

export const incrementViews = async (articleId: string) => {
  // Use RPC for atomic increment if available, or just update
  const { data: article } = await supabase
    .from('articles')
    .select('views')
    .eq('id', articleId)
    .single();

  if (article) {
    await supabase
      .from('articles')
      .update({ views: (article.views || 0) + 1 })
      .eq('id', articleId);
  }
};
