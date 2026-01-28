import { motion } from 'framer-motion';
import { Article } from '@/types/article';
import { FlashbackNews } from './FlashbackNews';
import { Link } from 'react-router-dom';

interface HeroShowcaseProps {
    featuredArticle: Article;
    flashbackArticles: Article[];
}

export const HeroShowcase = ({ featuredArticle, flashbackArticles }: HeroShowcaseProps) => {
    return (
        <section className="container py-2 md:py-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 min-h-[300px] lg:min-h-[380px]">
                {/* Main Image Section (Left) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="lg:col-span-8 relative aspect-video lg:h-full rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer shadow-sm"
                >
                    <Link to={`/article/${featuredArticle.id}`}>
                        <div className="absolute inset-0">
                            <motion.img
                                src={featuredArticle.coverImage}
                                alt={featuredArticle.title}
                                className="w-full h-full object-cover"
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.7 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <span className="inline-block px-2 py-0.5 bg-primary text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full mb-2 md:mb-3">
                                    À LA UNE
                                </span>
                                <h2 className="text-lg md:text-3xl font-serif font-bold text-white leading-tight max-w-2xl group-hover:text-primary transition-colors line-clamp-2">
                                    {featuredArticle.title}
                                </h2>
                            </motion.div>
                        </div>
                    </Link>
                </motion.div>

                {/* Flashback Section (Right) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="lg:col-span-4 h-auto"
                >
                    <FlashbackNews articles={flashbackArticles} />
                </motion.div>
            </div>
        </section>
    );
};
