export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  coverImage: string;
  author: string;
  readingTime: number;
  views: number;
  publishedAt: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ArticleStatus = 'draft' | 'published';

export const CATEGORIES = [
  'Monde',
  'Technologie',
  'Culture',
  'Économie',
  'Sciences',
  'Politique',
  'Sports',
  'Opinion',
] as const;

export type Category = typeof CATEGORIES[number];

export type ArticleFormData = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>;
