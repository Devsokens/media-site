import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Share2, Facebook, Twitter, Linkedin, Bookmark, ArrowLeft, Eye } from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { ArticleCard } from '@/components/ArticleCard';
import { getArticleById, getPublishedArticles, formatDate, incrementViews, getArticlesByCategory } from '@/lib/articles';
import { Article, CATEGORIES } from '@/types/article';
import { AdSidebar } from '@/components/AdSidebar';
import { CategoryRow } from '@/components/CategoryRow';

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [recommendations, setRecommendations] = useState<{ category: string, articles: Article[] }[]>([]);

  useEffect(() => {
    if (id) {
      const found = getArticleById(id);
      if (found && found.isPublished) {
        setArticle(found);
        incrementViews(found.id);

        // Get recommendations from different categories
        const otherCategories = CATEGORIES.filter(c => c !== found.category);
        const randomCategories = [...otherCategories]
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);

        const recs = randomCategories.map(cat => ({
          category: cat,
          articles: getArticlesByCategory(cat).slice(0, 6)
        }));

        setRecommendations(recs);
      }
    }
  }, [id]);

  if (!article) {
    return (
      <PublicLayout>
        <div className="container py-16 text-center">
          <h1 className="headline-lg mb-4">Article non trouvé</h1>
          <Link to="/" className="text-primary hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article className="container py-8">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span>Retour à l'accueil</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main content */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Category */}
              <Link
                to={`/category/${article.category.toLowerCase()}`}
                className="category-tag hover:underline"
              >
                {article.category}
              </Link>

              {/* Title */}
              <h1 className="headline-xl text-headline mt-4 mb-6">{article.title}</h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-divider">
                <span className="font-medium text-subheadline">{article.author}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span>{formatDate(article.publishedAt)}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {article.readingTime} min de lecture
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  {(article.views || 0).toLocaleString()} vues
                </span>
              </div>

              {/* Cover Image */}
              <div className="aspect-[16/9] rounded-lg overflow-hidden mb-8">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Summary */}
              <p className="text-xl text-subheadline leading-relaxed mb-8 font-serif">
                {article.summary}
              </p>

              {/* Content */}
              <div
                className="prose prose-lg max-w-none body-text"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Share buttons */}
              <div className="flex items-center gap-4 mt-12 pt-8 border-t border-divider">
                <span className="text-sm font-medium text-subheadline">Partager:</span>
                <button className="p-2 rounded-full hover:bg-muted transition-colors">
                  <Facebook size={20} className="text-muted-foreground hover:text-primary" />
                </button>
                <button className="p-2 rounded-full hover:bg-muted transition-colors">
                  <Twitter size={20} className="text-muted-foreground hover:text-primary" />
                </button>
                <button className="p-2 rounded-full hover:bg-muted transition-colors">
                  <Linkedin size={20} className="text-muted-foreground hover:text-primary" />
                </button>
                <button className="p-2 rounded-full hover:bg-muted transition-colors ml-auto">
                  <Bookmark size={20} className="text-muted-foreground hover:text-primary" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Exclusive for Ads */}
          <div className="lg:col-span-4">
            <AdSidebar />
          </div>
        </div>

        {/* Discovery Sections at Bottom */}
        <section className="mt-16 pt-12 border-t border-divider">
          <div className="mb-8">
            <h3 className="headline-lg text-headline mb-2">Continuer la lecture</h3>
            <p className="text-muted-foreground">Découvrez d'autres sujets susceptibles de vous intéresser.</p>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec) => (
              <CategoryRow
                key={rec.category}
                category={rec.category}
                articles={rec.articles}
              />
            ))}
          </div>
        </section>
      </article>
    </PublicLayout>
  );
};

export default ArticlePage;
