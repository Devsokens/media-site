import { motion } from 'framer-motion';
import { Article } from '@/types/article';
import { FlashbackNews } from './FlashbackNews';
import { Link } from 'react-router-dom';
import { FlashInfo } from '@/lib/flash';

interface HeroShowcaseProps {
    featuredArticle?: Article | null;
    flashbackArticles?: Article[];
    flashInfo?: FlashInfo[];
}

export const HeroShowcase = ({ featuredArticle, flashbackArticles, flashInfo }: HeroShowcaseProps) => {
    // If no data at all, return null
    if (!featuredArticle && (!flashbackArticles || flashbackArticles.length === 0) && (!flashInfo || flashInfo.length === 0)) {
        return null;
    }

    return (
        <section className="container py-2 md:py-4">
            <div className={`grid grid-cols-1 ${featuredArticle ? 'lg:grid-cols-12' : ''} gap-6 md:gap-8 min-h-[300px] lg:min-h-[340px]`}>
                {/* Main Image Section (Left) */}
                {featuredArticle && (
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
                                    <span className="inline-block px-3 py-1 bg-primary text-white text-[12px] md:text-[14px] font-bold uppercase tracking-widest rounded-full mb-2 md:mb-3">
                                        À LA UNE
                                    </span>
                                    <h2 className="text-lg md:text-3xl font-serif font-bold text-white leading-tight max-w-2xl group-hover:text-primary transition-colors line-clamp-2">
                                        {featuredArticle.title}
                                    </h2>
                                </motion.div>
                            </div>
                        </Link>
                    </motion.div>
                )}

                {/* Flashback Section (Right/Full) */}
                <motion.div
                    initial={{ opacity: 0, x: featuredArticle ? 50 : 0, y: featuredArticle ? 0 : 20 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`${featuredArticle ? 'lg:col-span-4' : 'w-full'} h-auto`}
                >
                    <FlashbackNews articles={flashbackArticles} flashInfo={flashInfo} />
                </motion.div>
            </div>
        </section>
    );
};
