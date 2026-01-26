import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { ArticleGrid } from '@/components/ArticleGrid';
import { getArticlesByCategory } from '@/lib/articles';
import { Article, CATEGORIES } from '@/types/article';
import { ChevronRight } from 'lucide-react';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (category) {
      const found = CATEGORIES.find(
        c => c.toLowerCase() === category.toLowerCase()
      );
      if (found) {
        setCategoryName(found);
        setArticles(getArticlesByCategory(found));
      }
    }
  }, [category]);

  if (!categoryName) {
    return (
      <PublicLayout>
        <div className="container py-16 text-center">
          <h1 className="headline-lg mb-4">Category not found</h1>
          <Link to="/" className="text-primary hover:underline">
            Return to homepage
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-foreground">{categoryName}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="headline-xl text-headline mb-4">{categoryName}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            The latest news, analysis, and commentary on {categoryName.toLowerCase()}.
          </p>
        </div>

        {/* Articles */}
        <ArticleGrid articles={articles} />
      </div>
    </PublicLayout>
  );
};

export default CategoryPage;
