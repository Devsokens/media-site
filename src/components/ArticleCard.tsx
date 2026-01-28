import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Eye, Share2, Facebook } from 'lucide-react';
import { Article } from '@/types/article';
import { formatDateShort } from '@/lib/articles';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured';
  index?: number;
}

export const ArticleCard = ({ article, variant = 'default', index = 0 }: ArticleCardProps) => {
  if (variant === 'compact') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="article-card flex gap-4 py-4 border-b border-divider last:border-0"
      >
        <Link to={`/article/${article.id}`} className="flex-shrink-0">
          <div className="article-card-image w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            to={`/category/${article.category.toLowerCase()}`}
            className="category-tag hover:underline"
          >
            {article.category}
          </Link>
          <Link to={`/article/${article.id}`}>
            <h3 className="article-card-title headline-sm text-headline mt-1 line-clamp-2 transition-colors">
              {article.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span>{formatDateShort(article.publishedAt)}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {article.readingTime} min
            </span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {article.views || 0}
            </span>
          </div>
        </div>
      </motion.article>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="article-card"
      >
        <Link to={`/article/${article.id}`}>
          <div className="article-card-image aspect-[16/10] rounded-lg overflow-hidden mb-4">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
        <Link
          to={`/category/${article.category.toLowerCase()}`}
          className="category-tag hover:underline"
        >
          {article.category}
        </Link>
        <Link to={`/article/${article.id}`}>
          <h3 className="article-card-title headline-lg text-headline mt-2 mb-3 transition-colors">
            {article.title}
          </h3>
        </Link>
        <p className="body-text text-sm line-clamp-2 mb-3">{article.summary}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-medium text-subheadline">{article.author}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {article.readingTime} min
          </span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {(article.views || 0).toLocaleString()} vues
          </span>
        </div>
      </motion.article>
    );
  }

  // Default variant (used in CategoryRow)
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="article-card bg-card rounded-lg border border-divider overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow"
    >
      <Link to={`/article/${article.id}`}>
        <div className="article-card-image aspect-video overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      <div className="p-2 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-1">
          <Link
            to={`/category/${article.category.toLowerCase()}`}
            className="text-[8px] font-bold uppercase tracking-wider text-primary hover:underline"
          >
            {article.category}
          </Link>
          <span className="text-muted-foreground text-[8px]">•</span>
          <span className="text-[8px] text-muted-foreground font-medium">
            {formatDateShort(article.publishedAt)}
          </span>
        </div>

        <Link to={`/article/${article.id}`}>
          <h3 className="text-[11px] md:text-xs font-bold text-headline leading-tight mb-1.5 line-clamp-2 hover:text-primary transition-colors">
            {article.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-[8px] text-muted-foreground mb-2">
          <span className="flex items-center gap-0.5">
            <Clock size={8} />
            {article.readingTime} min
          </span>
          <span className="flex items-center gap-0.5">
            <Eye size={8} />
            {(article.views || 0).toLocaleString()} vues
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-divider">
          <Link
            to={`/article/${article.id}`}
            className="text-[10px] font-bold text-primary hover:gap-1 transition-all flex items-center gap-0.5"
          >
            Lire <span className="text-sm">→</span>
          </Link>
          <div className="flex items-center gap-2 text-muted-foreground">
            <button className="hover:text-primary transition-colors">
              <Share2 size={12} />
            </button>
            <button className="hover:text-primary transition-colors">
              <Facebook size={12} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
