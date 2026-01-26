import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Share2, Facebook, Twitter, Linkedin, Bookmark, ArrowLeft } from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { ArticleCard } from '@/components/ArticleCard';
import { getArticleById, getPublishedArticles, formatDate } from '@/lib/articles';
import { Article } from '@/types/article';

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (id) {
      const found = getArticleById(id);
      if (found && found.isPublished) {
        setArticle(found);
        // Get related articles from same category
        const related = getPublishedArticles()
          .filter(a => a.category === found.category && a.id !== found.id)
          .slice(0, 3);
        setRelatedArticles(related);
      }
    }
  }, [id]);

  if (!article) {
    return (
      <PublicLayout>
        <div className="container py-16 text-center">
          <h1 className="headline-lg mb-4">Article not found</h1>
          <Link to="/" className="text-primary hover:underline">
            Return to homepage
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
          <span>Back to Home</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-8"
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
                {article.readingTime} min read
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
              <span className="text-sm font-medium text-subheadline">Share:</span>
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

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <h3 className="headline-sm text-headline mb-6">Related Articles</h3>
              <div className="space-y-6">
                {relatedArticles.map((related, index) => (
                  <ArticleCard
                    key={related.id}
                    article={related}
                    variant="compact"
                    index={index}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>
    </PublicLayout>
  );
};

export default ArticlePage;
