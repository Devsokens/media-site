import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Share2, Facebook, Twitter, Linkedin, Bookmark, ArrowLeft, Eye } from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { getArticleById, formatDate, incrementViews, getArticlesByCategory, getPublishedArticles } from '@/lib/articles';
import { Article, CATEGORIES } from '@/types/article';
import { CategoryRow } from '@/components/CategoryRow';

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [recommendations, setRecommendations] = useState<{ category: string, articles: Article[] }[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticleData = async () => {
      if (id) {
        const found = await getArticleById(id);
        if (found) {
          setArticle(found);
          await incrementViews(id);

          // Get recent articles (excluding current)
          const published = await getPublishedArticles();
          setRecentArticles(published.filter(a => a.id !== id).slice(0, 4));

          // Get recommendations from different categories
          const otherCategories = CATEGORIES.filter(c => c !== found.category);
          const randomCategories = [...otherCategories]
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);

          const recs = await Promise.all(randomCategories.map(async cat => {
            const catArticles = await getArticlesByCategory(cat);
            return {
              category: cat,
              articles: catArticles.filter(a => a.id !== id).slice(0, 6)
            };
          }));

          setRecommendations(recs.filter(r => r.articles.length > 0));
        }
      }
    };

    fetchArticleData();
    window.scrollTo(0, 0);
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
    <PublicLayout withSidebar>
      <article>
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span>Retour à l'accueil</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Category */}
          <div className="category-tag mb-4">
            {article.category}
          </div>

          {/* Title */}
          <h1 className="headline-xl text-headline mt-4 mb-6 break-words">{article.title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-divider">
            <span className="font-medium text-subheadline">{article.author}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <span>{formatDate(article.publishedAt || '')}</span>
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
          <div className="aspect-[16/9] rounded-lg overflow-hidden mb-8 shadow-sm">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Summary */}
          <p className="text-xl text-subheadline leading-relaxed mb-8 font-serif italic border-l-4 border-primary pl-6 py-2">
            {article.summary}
          </p>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none body-text break-words overflow-hidden"
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

        {/* Discovery Sections at Bottom */}
        <section className="mt-16 pt-12 border-t border-divider">
          <div className="mb-10">
            <h3 className="headline-lg text-headline mb-2">Continuer la lecture</h3>
            <p className="text-muted-foreground">Découvrez d'autres sujets susceptibles de vous intéresser.</p>
          </div>

          <div className="space-y-12">
            {/* Recent Articles Section - Always show something */}
            <CategoryRow
              category="Articles récents"
              articles={recentArticles}
            />

            {/* Category Cloud / Quick Actions */}
            <div className="bg-muted/30 rounded-2xl p-6 md:p-8">
              <h4 className="font-serif text-xl font-bold mb-4">Explorer par thématiques</h4>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {CATEGORIES.map(cat => (
                  <Link
                    key={cat}
                    to={`/category/${cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').trim()}`}
                    className="px-4 py-2 bg-background border border-divider rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-all hover:shadow-sm"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* Specific Category Recommendations */}
            {recommendations.length > 0 && recommendations.map((rec) => (
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
