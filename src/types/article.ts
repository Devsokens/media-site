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
  'Académie',
  'Vie Étudiante',
  'Opportunités',
  'Monde',
  'Culture & Arts',
  'Sports',
  'Technologies',
  'Opinions/Tribunes',
] as const;

export type Category = typeof CATEGORIES[number];

export type ArticleFormData = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>;
