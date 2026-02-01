import { useState, useEffect } from 'react';
import { PublicLayout } from '@/components/PublicLayout';
import { HeroShowcase } from '@/components/HeroShowcase';
import { ArticleSearch } from '@/components/ArticleSearch';
import { CategoryRow } from '@/components/CategoryRow';
import { getPublishedArticles, getFeaturedArticle } from '@/lib/articles';
import { getActiveFlashInfo, FlashInfo } from '@/lib/flash';
import { Article, CATEGORIES } from '@/types/article';

const Index = () => {
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [flashbackArticles, setFlashbackArticles] = useState<Article[]>([]);
  const [flashInfo, setFlashInfo] = useState<FlashInfo[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [published, featured, activeFlash] = await Promise.all([
          getPublishedArticles(),
          getFeaturedArticle(),
          getActiveFlashInfo()
        ]);

        // FLASHBACKS: If no dedicated FlashInfo, use latest published articles (max 5)
        const flashbacks = published
          .filter(a => a.id !== featured?.id)
          .slice(0, 5);

        // CATEGORY CONTENT: All published articles excluding the featured one
        const otherArticles = published.filter(a => a.id !== featured?.id);

        setFeaturedArticle(featured || null);
        setFlashbackArticles(flashbacks);
        setFlashInfo(activeFlash);
        setArticles(otherArticles);
      } catch (error) {
        console.error("Error loading home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered articles by category
  const articlesByCategory = CATEGORIES.reduce((acc, category) => {
    const categoryArticles = filteredArticles.filter(a => a.category === category);
    if (categoryArticles.length > 0) {
      acc[category] = categoryArticles;
    }
    return acc;
  }, {} as Record<string, Article[]>);


  // Render skeletons while loading
  const renderSkeletons = () => (
    <div className="space-y-12">
      <div className="animate-pulse space-y-8">
        <div className="aspect-[21/9] bg-muted rounded-2xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-video bg-muted rounded-xl" />
          ))}
        </div>
      </div>
      {[1, 2].map(row => (
        <div key={row} className="space-y-4">
          <div className="h-8 bg-muted rounded w-48 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="aspect-video bg-muted rounded-xl" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const heroContent = loading ? (
    <section className="container py-2 md:py-4">
      <div className="aspect-[21/9] bg-muted rounded-2xl w-full animate-pulse" />
    </section>
  ) : (featuredArticle || flashInfo.length > 0 || flashbackArticles.length > 0) ? (
    <HeroShowcase
      featuredArticle={featuredArticle}
      flashbackArticles={flashbackArticles}
      flashInfo={flashInfo}
    />
  ) : null;

  return (
    <PublicLayout withSidebar hero={heroContent}>
      {/* Search Section */}
      <div className="mb-8">
        <ArticleSearch onSearch={setSearchQuery} />
      </div>

      <div className="space-y-12">
        {loading ? renderSkeletons() : (
          <>
            {Object.entries(articlesByCategory).map(([category, catArticles]) => (
              <CategoryRow
                key={category}
                category={category}
                articles={catArticles}
              />
            ))}

            {filteredArticles.length === 0 && (
              <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-divider">
                <p className="text-muted-foreground italic">Aucun article ne correspond à votre recherche.</p>
              </div>
            )}
          </>
        )}
      </div>
    </PublicLayout>
  );
};

export default Index;
