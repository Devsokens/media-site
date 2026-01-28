import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '@/types/article';
import { ArticleCard } from './ArticleCard';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CategoryRowProps {
    category: string;
    articles: Article[];
}

export const CategoryRow = ({ category, articles }: CategoryRowProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = React.useState(0);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const progress = scrollLeft / (scrollWidth - clientWidth);
            setScrollProgress(progress);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = window.innerWidth < 768 ? 300 : 500;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const numDots = Math.min(articles.length, 5);

    if (articles.length === 0) return null;

    return (
        <section className="mb-12 relative group">
            <div className="flex items-center justify-between mb-6 pr-4">
                <h2 className="headline-md text-headline">{category}</h2>
                <Link
                    to={`/category/${category.toLowerCase()}`}
                    className="text-sm font-medium text-primary hover:underline transition-colors"
                >
                    Voir tout
                </Link>
            </div>

            <div className="relative">
                {/* Scroll Buttons */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-background border border-divider shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:block hover:bg-muted"
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={20} />
                </button>

                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {articles.map((article, index) => (
                        <div key={article.id} className="min-w-[240px] md:min-w-[280px] snap-start">
                            <ArticleCard article={article} index={index} />
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-background border border-divider shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:block hover:bg-muted"
                    aria-label="Scroll right"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-1.5 mt-2">
                {Array.from({ length: numDots }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            Math.round(scrollProgress * (numDots - 1)) === i
                                ? "w-4 bg-primary"
                                : "w-1.5 bg-divider"
                        )}
                    />
                ))}
            </div>
        </section>
    );
};
