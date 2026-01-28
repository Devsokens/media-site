import { useState, useEffect } from 'react';
import { PublicLayout } from '@/components/PublicLayout';
import { HeroShowcase } from '@/components/HeroShowcase';
import { AdSidebar } from '@/components/AdSidebar';
import { ArticleSearch } from '@/components/ArticleSearch';
import { CategoryRow } from '@/components/CategoryRow';
import { getPublishedArticles, getFeaturedArticle } from '@/lib/articles';
import { Article, CATEGORIES } from '@/types/article';

const Index = () => {
  const [featuredArticle, setFeaturedArticle] = useState<Article | undefined>();
  const [flashbackArticles, setFlashbackArticles] = useState<Article[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const published = getPublishedArticles();
    const featured = getFeaturedArticle();

    // Sort by latest for flashbacks, excluding the featured one
    const flashbacks = [...published]
      .filter(a => a.id !== featured?.id)
      .slice(0, 5);

    setFeaturedArticle(featured);
    setFlashbackArticles(flashbacks);
    setArticles(published.filter(a => !a.isFeatured));
  }, []);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered articles by category
  const articlesByCategory = CATEGORIES.reduce((acc, category) => {
    const categoryArticles = filteredArticles.filter(a => a.category === category);
    if (categoryArticles.length > 0) {
      acc[category] = categoryArticles;
    }
    return acc;
  }, {} as Record<string, Article[]>);

  return (
    <PublicLayout>
      {/* Hero Section */}
      {featuredArticle && (
        <HeroShowcase
          featuredArticle={featuredArticle}
          flashbackArticles={flashbackArticles}
        />
      )}

      {/* Main Content */}
      <div className="container py-12">
        {/* Search Section */}
        <ArticleSearch onSearch={setSearchQuery} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Articles Column */}
          <div className="lg:col-span-8">
            {Object.entries(articlesByCategory).map(([category, catArticles]) => (
              <CategoryRow
                key={category}
                category={category}
                articles={catArticles}
              />
            ))}

            {filteredArticles.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground italic">Aucun article ne correspond à votre recherche.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 lg:border-l lg:border-divider lg:pl-8">
            <AdSidebar />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Index;
