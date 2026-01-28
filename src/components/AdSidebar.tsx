import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface Ad {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    targetUrl: string;
    provider: string;
}

const SAMPLE_ADS: Ad[] = [
    {
        id: '1',
        title: 'Devenez Développeur Web',
        description: 'Apprenez les technologies les plus demandées en 12 semaines.',
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop',
        targetUrl: 'https://example.com/learn-web-dev',
        provider: 'Academy Tech',
    },
    {
        id: '2',
        title: 'Investissez dans le Futur',
        description: 'Une plateforme de trading simple et sécurisée pour vos actifs.',
        imageUrl: 'https://images.unsplash.com/photo-1611974717483-582807c6fb64?w=400&h=250&fit=crop',
        targetUrl: 'https://example.com/invest-future',
        provider: 'FutureTrade',
    },
    {
        id: '3',
        title: 'Évadez-vous aux Maldives',
        description: 'Profitez de nos offres exclusives pour vos prochaines vacances.',
        imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=250&fit=crop',
        targetUrl: 'https://example.com/travel-maldives',
        provider: 'Globe Trotter',
    },
    {
        id: '4',
        title: 'Le Nouveau MacBook Pro',
        description: 'Puissance phénoménale. Écran incroyable. Autonomie record.',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=250&fit=crop',
        targetUrl: 'https://example.com/macbook-pro',
        provider: 'Premium Tech',
    },
    {
        id: '5',
        title: 'Masterclass Photographie',
        description: 'Maîtrisez votre appareil photo avec les meilleurs professionnels.',
        imageUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=250&fit=crop',
        targetUrl: 'https://example.com/photography-masterclass',
        provider: 'Creative Vision',
    },
    {
        id: '6',
        title: 'Vivez l\'Aventure en Safari',
        description: 'Découvrez la faune sauvage dans son habitat naturel en Afrique.',
        imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=250&fit=crop',
        targetUrl: 'https://example.com/safari-adventure',
        provider: 'Wild Travel',
    },
    {
        id: '7',
        title: 'Nouvelle Gamme Bio',
        description: 'Mangez mieux, vivez mieux avec nos produits locaux et certifiés.',
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop',
        targetUrl: 'https://example.com/bio-living',
        provider: 'Green Hub',
    },
    {
        id: '8',
        title: 'Design Intérieur Moderne',
        description: 'Transformez votre espace de vie avec nos conseils d\'experts.',
        imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=250&fit=crop',
        targetUrl: 'https://example.com/interior-design',
        provider: 'Lux Deco',
    },
    {
        id: '9',
        title: 'Apprentissage des Langues',
        description: 'Devenez bilingue en un temps record avec notre méthode immersive.',
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=250&fit=crop',
        targetUrl: 'https://example.com/learn-languages',
        provider: 'Lingua Pro',
    },
];

export const AdSidebar = () => {
    return (
        <aside className="space-y-8 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    Publicité
                </span>
                <div className="flex-1 h-px bg-divider" />
            </div>

            <div className="space-y-6">
                {SAMPLE_ADS.slice(0, 5).map((ad, index) => (
                    <motion.div
                        key={ad.id}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <a
                            href={ad.targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block bg-card border border-divider rounded-lg overflow-hidden transition-all hover:shadow-xl hover:border-primary/50"
                        >
                            <div className="aspect-[16/10] overflow-hidden">
                                <img
                                    src={ad.imageUrl}
                                    alt={ad.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                            </div>
                            <div className="p-3">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className="text-[9px] font-bold text-primary uppercase">{ad.provider}</span>
                                    <ExternalLink size={10} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h4 className="font-bold text-xs mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                    {ad.title}
                                </h4>
                                <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight">
                                    {ad.description}
                                </p>
                            </div>
                        </a>
                    </motion.div>
                ))}
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
