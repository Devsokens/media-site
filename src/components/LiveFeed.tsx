import { Article } from '@/types/article';
import { ArticleCard } from './ArticleCard';
import { Radio } from 'lucide-react';

interface LiveFeedProps {
  articles: Article[];
}

export const LiveFeed = ({ articles }: LiveFeedProps) => {
  return (
    <aside className="lg:sticky lg:top-24">
      <div className="flex items-center gap-2 mb-6">
        <Radio className="text-primary animate-pulse" size={18} />
        <h3 className="headline-sm text-headline">Live Updates</h3>
      </div>
      <div className="divide-y divide-divider">
        {articles.slice(0, 5).map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="compact"
            index={index}
          />
        ))}
      </div>
    </aside>
  );
};
