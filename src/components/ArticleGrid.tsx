import { Article } from '@/types/article';
import { ArticleCard } from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
  title?: string;
}

export const ArticleGrid = ({ articles, title }: ArticleGridProps) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun article trouvé.</p>
      </div>
    );
  }

  return (
    <section>
      {title && (
        <div className="flex items-center gap-4 mb-8">
          <h2 className="headline-lg text-headline">{title}</h2>
          <div className="flex-1 h-px bg-divider" />
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {articles.map((article, index) => (
          <ArticleCard key={article.id} article={article} index={index} />
        ))}
      </div>
    </section>
  );
};
