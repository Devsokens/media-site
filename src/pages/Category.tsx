import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { ArticleGrid } from '@/components/ArticleGrid';
import { ArticleSearch } from '@/components/ArticleSearch';
import { getArticlesByCategory } from '@/lib/articles';
import { Article, CATEGORIES } from '@/types/article';
import { ChevronRight } from 'lucide-react';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (category) {
        // Clean slug for comparison
        const slugify = (str: string) =>
          str.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .trim();

        const categorySlug = slugify(category);
        const found = CATEGORIES.find(c => slugify(c) === categorySlug);

        if (found) {
          setCategoryName(found);
          const categoryArticles = await getArticlesByCategory(found);
          setArticles(categoryArticles);
        } else {
          // If still not found, try a direct lowercase check as fallback
          const fallbackFound = CATEGORIES.find(
            c => c.toLowerCase() === category.toLowerCase()
          );
          if (fallbackFound) {
            setCategoryName(fallbackFound);
            const categoryArticles = await getArticlesByCategory(fallbackFound);
            setArticles(categoryArticles);
          }
        }
      }
    };

    fetchCategoryData();
  }, [category]);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!categoryName) {
    return (
      <PublicLayout>
        <div className="container py-16 text-center">
          <h1 className="headline-lg mb-4">Catégorie non trouvée</h1>
          <Link to="/" className="text-primary hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout withSidebar>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-primary transition-colors">
          Accueil
        </Link>
        <ChevronRight size={14} />
        <span className="text-foreground">{categoryName}</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="headline-xl text-headline mb-4">{categoryName}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Les dernières nouvelles, analyses et commentaires sur {categoryName.toLowerCase()}.
        </p>
      </div>

      {/* Search */}
      <ArticleSearch onSearch={setSearchQuery} placeholder={`Rechercher dans ${categoryName.toLowerCase()}...`} />

      {/* Articles */}
      <ArticleGrid articles={filteredArticles} />
    </PublicLayout>
  );
};

export default CategoryPage;
