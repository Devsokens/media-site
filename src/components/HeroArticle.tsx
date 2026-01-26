import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Article } from '@/types/article';
import { formatDate } from '@/lib/articles';

interface HeroArticleProps {
  article: Article;
}

export const HeroArticle = ({ article }: HeroArticleProps) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden group"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-hero-overlay via-hero-overlay/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container flex flex-col justify-end pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl"
        >
          {/* Category Tag */}
          <Link
            to={`/category/${article.category.toLowerCase()}`}
            className="inline-block mb-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-widest rounded"
          >
            {article.category}
          </Link>

          {/* Title */}
          <Link to={`/article/${article.id}`}>
            <h2 className="headline-xl text-white mb-4 hover:text-primary-foreground/90 transition-colors">
              {article.title}
            </h2>
          </Link>

          {/* Summary */}
          <p className="text-lg md:text-xl text-white/80 mb-6 leading-relaxed">
            {article.summary}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="font-medium text-white">{article.author}</span>
            <span className="w-1 h-1 rounded-full bg-white/50" />
            <span>{formatDate(article.publishedAt)}</span>
            <span className="w-1 h-1 rounded-full bg-white/50" />
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {article.readingTime} min read
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
