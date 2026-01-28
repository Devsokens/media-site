import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Article } from '@/types/article';

interface FlashbackNewsProps {
    articles: Article[];
}

export const FlashbackNews = ({ articles }: FlashbackNewsProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % articles.length);
        }, 20000); // 20 seconds as requested

        return () => clearInterval(timer);
    }, [articles.length]);

    if (articles.length === 0) return null;

    const currentArticle = articles[currentIndex];

    return (
        <div className="h-full bg-primary/5 rounded-xl md:rounded-2xl border border-primary/10 p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group min-h-[300px] lg:min-h-full">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg text-primary">
                    <Zap size={16} className="animate-pulse md:size-[20px]" />
                </div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary">Flash Info</span>
            </div>

            <div className="flex-1 relative flex items-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.6 }}
                        className="w-full"
                    >
                        <span className="text-[9px] md:text-[10px] font-bold text-primary/60 uppercase mb-1 md:mb-2 block">
                            {currentArticle.category}
                        </span>
                        <Link to={`/article/${currentArticle.id}`}>
                            <h3 className="font-serif text-base md:text-xl font-bold text-headline leading-tight hover:text-primary transition-colors line-clamp-3 md:line-clamp-4">
                                {currentArticle.title}
                            </h3>
                        </Link>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-4 md:mt-6 flex items-center justify-between">
                <Link
                    to={`/article/${currentArticle.id}`}
                    className="text-xs md:text-sm font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                    Lire <span className="hidden md:inline">maintenant</span> <ChevronRight size={14} className="md:size-[16px]" />
                </Link>
                <div className="flex gap-1">
                    {articles.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 transition-all duration-300 rounded-full ${i === currentIndex ? 'w-4 bg-primary' : 'w-1 bg-primary/20'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Modern Progress Line */}
            <motion.div
                key={`progress-${currentIndex}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 20, ease: "linear" }}
                className="absolute bottom-0 left-0 right-0 h-1 bg-primary origin-left"
            />
        </div>
    );
};
