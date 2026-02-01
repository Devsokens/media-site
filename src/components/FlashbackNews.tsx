import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Article } from '@/types/article';
import { FlashInfo } from '@/lib/flash';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface FlashbackNewsProps {
    articles?: Article[];
    flashInfo?: FlashInfo[];
}

export const FlashbackNews = ({ articles = [], flashInfo = [] }: FlashbackNewsProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedFlash, setSelectedFlash] = useState<any>(null);

    // Merge or choose data source
    const hasFlashInfo = flashInfo.length > 0;
    const items = hasFlashInfo
        ? flashInfo.map(f => ({
            id: f.id,
            title: f.title,
            category: f.priority === 'high' ? 'Important' : 'Flash',
            path: null,
            content: f.content,
            fullData: f
        }))
        : articles.map(a => ({
            id: a.id,
            title: a.title,
            category: a.category,
            path: `/article/${a.id}`,
            content: null,
            fullData: a
        }));

    useEffect(() => {
        if (items.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 6000); // Slightly slower for better readability

        return () => clearInterval(timer);
    }, [items.length]);

    if (items.length === 0) return null;

    const currentItem = items[currentIndex];

    return (
        <>
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
                                {currentItem.category}
                            </span>
                            {currentItem.path ? (
                                <Link to={currentItem.path}>
                                    <h3 className="font-serif text-base md:text-xl font-bold text-headline leading-tight hover:text-primary transition-colors line-clamp-3 md:line-clamp-4">
                                        {currentItem.title}
                                    </h3>
                                </Link>
                            ) : (
                                <div>
                                    <h3 className="font-serif text-base md:text-xl font-bold text-headline leading-tight mb-2">
                                        {currentItem.title}
                                    </h3>
                                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 md:line-clamp-3">
                                        {currentItem.content}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-4 md:mt-6 flex items-center justify-between relative z-10">
                    {currentItem.path ? (
                        <Link
                            to={currentItem.path}
                            className="text-xs md:text-sm font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all"
                        >
                            Lire <span className="hidden md:inline">maintenant</span> <ChevronRight size={14} className="md:size-[16px]" />
                        </Link>
                    ) : (
                        <button
                            onClick={() => setSelectedFlash(currentItem)}
                            className="text-xs md:text-sm font-bold text-primary flex items-center gap-1.5 hover:gap-2.5 transition-all bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary/20"
                        >
                            Voir plus <ChevronRight size={14} className="md:size-[16px]" />
                        </button>
                    )}

                    <div className="flex gap-1">
                        {items.map((_, i) => (
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
                    transition={{ duration: 6, ease: "linear" }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary/30 origin-left"
                />
            </div>

            {/* Flash Info Modal - Side Drawer Style */}
            <Dialog open={!!selectedFlash} onOpenChange={(open) => !open && setSelectedFlash(null)}>
                <DialogContent className="fixed right-0 left-auto top-0 bottom-0 h-full w-[85%] max-w-[450px] translate-x-0 translate-y-0 rounded-none sm:rounded-none border-l border-divider bg-background shadow-2xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right p-0 flex flex-col">
                    <DialogHeader className="p-8 pb-4 border-b border-divider bg-muted/20">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                <Zap size={20} className="animate-pulse" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 block">Flash Information</span>
                                <span className="text-[10px] font-medium text-muted-foreground">{selectedFlash?.category}</span>
                            </div>
                        </div>
                        <DialogTitle className="font-serif text-2xl md:text-3xl text-headline leading-tight text-left">
                            {selectedFlash?.title}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            Détails complets de l'actualité flash.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto p-8 py-10">
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium">
                            {selectedFlash?.content}
                        </p>
                    </div>
                    <div className="p-8 border-t border-divider bg-muted/5 flex flex-col gap-4">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground uppercase tracking-widest font-bold">
                            <span>Campus UOB</span>
                            <span>{new Date().toLocaleDateString('fr-FR')}</span>
                        </div>
                        <button
                            onClick={() => setSelectedFlash(null)}
                            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
                        >
                            J'ai compris
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

