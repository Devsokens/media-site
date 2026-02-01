import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { getActiveAdsByPlacement, Ad } from '@/lib/ads';

export const AdSidebar = () => {
    const [ads, setAds] = useState<Ad[]>([]);

    useEffect(() => {
        const fetchAds = async () => {
            const sidebarAds = await getActiveAdsByPlacement('sidebar');
            setAds(sidebarAds);
        };
        fetchAds();
    }, []);

    // Autonomous scroll for mobile
    useEffect(() => {
        if (ads.length <= 1) return;

        const interval = setInterval(() => {
            const container = document.getElementById('ad-mobile-carousel');
            if (container && window.innerWidth < 1024) {
                const scrollAmount = 300; // width of card + gap
                const maxScroll = container.scrollWidth - container.clientWidth;

                if (container.scrollLeft >= maxScroll - 10) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }
        }, 4000); // Scroll every 4 seconds

        return () => clearInterval(interval);
    }, [ads]);

    return (
        <aside className="space-y-8 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    Publicité
                </span>
                <div className="flex-1 h-px bg-divider" />
            </div>

            <div
                id="ad-mobile-carousel"
                className="flex flex-row overflow-x-auto lg:flex-col lg:overflow-visible gap-4 lg:gap-6 pb-4 lg:pb-0 scrollbar-hide snap-x snap-mandatory"
            >
                {ads.slice(0, 5).map((ad, index) => (
                    <motion.div
                        key={ad.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="min-w-[280px] lg:min-w-full snap-center"
                    >
                        <a
                            href={ad.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block bg-card border border-divider rounded-lg overflow-hidden transition-all hover:shadow-xl hover:border-primary/50"
                        >
                            <div className="aspect-[16/9] lg:aspect-[16/10] overflow-hidden">
                                <img
                                    src={ad.imageUrl}
                                    alt={ad.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                            </div>
                            <div className="p-3">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className="text-[9px] font-bold text-primary uppercase">Sponsorisé</span>
                                    <ExternalLink size={10} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h4 className="font-bold text-xs mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                    {ad.name}
                                </h4>
                            </div>
                        </a>
                    </motion.div>
                ))}

                {ads.length === 0 && (
                    <div className="w-full py-8 text-center border-2 border-dashed border-divider rounded-xl">
                        <p className="text-[10px] text-muted-foreground">Espace disponible</p>
                    </div>
                )}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="p-4 bg-primary/5 rounded-xl border border-primary/10 border-dashed border-2 text-center mt-auto"
            >
                <h5 className="font-bold text-xs text-headline mb-1">Espace Annonceur</h5>
                <p className="text-[10px] text-muted-foreground mb-2 leading-relaxed">
                    Boostez votre visibilité auprès des étudiants de l'UOB.
                </p>
                <button className="w-full py-1.5 bg-primary text-white text-[9px] font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-colors">
                    Sponsoriser
                </button>
            </motion.div>
        </aside>
    );
};
