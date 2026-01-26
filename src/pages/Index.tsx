import { useState, useEffect } from 'react';
import { PublicLayout } from '@/components/PublicLayout';
import { HeroArticle } from '@/components/HeroArticle';
import { ArticleCard } from '@/components/ArticleCard';
import { LiveFeed } from '@/components/LiveFeed';
import { getPublishedArticles, getFeaturedArticle } from '@/lib/articles';
import { Article } from '@/types/article';

const Index = () => {
  const [featuredArticle, setFeaturedArticle] = useState<Article | undefined>();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const published = getPublishedArticles();
    const featured = getFeaturedArticle();
    
    setFeaturedArticle(featured);
    setArticles(published.filter(a => !a.isFeatured));
  }, []);

  // Get main grid articles (left column)
  const mainArticles = articles.slice(0, 4);
  // Get secondary featured articles
  const secondaryFeatured = articles.slice(0, 2);
  // Get rest for live feed
  const liveFeedArticles = articles.slice(2);

  return (
    <PublicLayout>
      {/* Hero Section */}
      {featuredArticle && <HeroArticle article={featuredArticle} />}

      {/* Main Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Articles Column */}
          <div className="lg:col-span-8">
            {/* Secondary Featured */}
            <section className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {secondaryFeatured.map((article, index) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="featured"
                    index={index}
                  />
                ))}
              </div>
            </section>

            {/* Divider */}
            <div className="divider mb-12" />

            {/* Latest News */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="headline-lg text-headline">Latest News</h2>
                <div className="flex-1 h-px bg-divider" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mainArticles.map((article, index) => (
                  <ArticleCard key={article.id} article={article} index={index} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <LiveFeed articles={liveFeedArticles} />

            {/* Newsletter Signup */}
            <div className="mt-12 p-6 bg-card rounded-lg border border-divider">
              <h3 className="headline-sm text-headline mb-2">Stay Informed</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get breaking news and analysis delivered to your inbox.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-background border border-input rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Index;
