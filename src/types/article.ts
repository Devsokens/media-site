export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  coverImage: string;
  author: string;
  readingTime: number;
  publishedAt: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ArticleStatus = 'draft' | 'published';

export const CATEGORIES = [
  'World',
  'Technology',
  'Culture',
  'Business',
  'Science',
  'Politics',
  'Sports',
  'Opinion',
] as const;

export type Category = typeof CATEGORIES[number];
