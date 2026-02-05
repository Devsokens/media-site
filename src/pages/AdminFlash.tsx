import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Plus, Trash2, Edit, Calendar, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { getFlashInfo, saveFlashInfo, updateFlashInfo, deleteFlashInfo, FlashInfo } from '@/lib/flash';
import { uploadFile } from '@/lib/storage';

const AdminFlash = () => {
    const [flashList, setFlashList] = useState<FlashInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFlash, setEditingFlash] = useState<FlashInfo | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const fetchFlash = async () => {
        setIsLoading(true);
        try {
            const data = await getFlashInfo();
            setFlashList(data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFlash();
    }, []);

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [priority, setPriority] = useState<'high' | 'normal'>('normal');

    const openModal = (flash?: FlashInfo) => {
        if (flash) {
            setEditingFlash(flash);
            setTitle(flash.title);
            setContent(flash.content);
            setCoverImage(flash.coverImage || '');
            setPriority(flash.priority);
        } else {
            setEditingFlash(null);
            setTitle('');
            setContent('');
            setCoverImage('');
            setPriority('normal');
        }
        setIsModalOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const url = await uploadFile(file, 'jeuob', 'flash');
        if (url) {
            setCoverImage(url);
        }
        setIsUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFlash) {
            await updateFlashInfo(editingFlash.id, { title, content, coverImage, priority });
        } else {
            await saveFlashInfo({
                title,
                content,
                coverImage,
                priority,
                isActive: true,
            });
        }
        fetchFlash();
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Supprimer ce flash info ?')) {
            await deleteFlashInfo(id);
            fetchFlash();
        }
    };

    const toggleStatus = async (flash: FlashInfo) => {
        await updateFlashInfo(flash.id, { isActive: !flash.isActive });
        fetchFlash();
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="headline-lg text-headline flex items-center gap-2">
                        <Zap className="text-primary fill-primary" /> Flash Info
                        {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary/50" />}
                    </h1>
                    <p className="text-muted-foreground mt-1">Gérez les alertes en temps réel</p>
                </div>
                <Button onClick={() => openModal()} className="w-full sm:w-auto gap-2 h-10 text-sm px-4 text-white">
                    <Plus size={16} /> Nouveau Flash
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashList.map((flash, index) => (
                    <motion.div
                        key={flash.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-xl border relative overflow-hidden group hover:shadow-lg transition-shadow bg-card flex flex-col h-[450px] ${flash.priority === 'high' ? 'border-l-4 border-l-destructive' : 'border-l-4 border-l-primary'}`}
                    >
                        {flash.coverImage && (
                            <div className="aspect-video w-full rounded-lg overflow-hidden mb-4 shrink-0">
                                <img src={flash.coverImage} alt={flash.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex justify-between items-start mb-4 shrink-0">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${flash.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {flash.isActive ? 'Actif' : 'Archivé'}
                            </span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2.5 hover:bg-muted rounded-full transition-colors md:opacity-0 md:group-hover:opacity-100 bg-muted/20 md:bg-transparent">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => openModal(flash)}>
                                        <Edit className="mr-2 h-4 w-4" /> Modifier
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => toggleStatus(flash)}>
                                        <Zap className="mr-2 h-4 w-4" /> {flash.isActive ? 'Désactiver' : 'Activer'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(flash.id)} className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <h3 className="text-lg font-bold text-headline mb-2 line-clamp-2 shrink-0">{flash.title}</h3>
                        <div
                            className="text-muted-foreground text-sm mb-4 prose prose-sm max-w-none prose-p:leading-relaxed overflow-y-auto pr-2 custom-scrollbar flex-1"
                            dangerouslySetInnerHTML={{ __html: flash.content }}
                        />

                        <div className="flex items-center text-xs text-muted-foreground mt-auto pt-4 border-t border-border shrink-0">
                            <Calendar size={12} className="mr-1" />
                            {flash.createdAt && new Date(flash.createdAt).toLocaleDateString()}
                        </div>
                    </motion.div>
                ))}
            </div>

            {!isLoading && flashList.length === 0 && (
                <div className="text-center py-24 bg-muted/20 rounded-2xl border-2 border-dashed border-border mt-6">
                    <Zap className="mx-auto text-primary/20 mb-4" size={64} />
                    <p className="text-headline font-bold text-xl mb-1">Aucun flash info</p>
                    <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                        Publiez des alertes rapides ou des informations de dernière minute ici.
                    </p>
                    <Button onClick={() => openModal()} variant="outline" className="mt-6 gap-2">
                        <Plus size={16} /> Créer un flash
                    </Button>
                </div>
            )}

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="w-[95vw] sm:max-w-[700px] max-h-[95vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6 text-headline">
                    <DialogHeader>
                        <DialogTitle>{editingFlash ? 'Modifier Flash Info' : 'Nouveau Flash Info'}</DialogTitle>
                        <DialogDescription>
                            Créez une alerte qui apparaîtra sur la page d'accueil avec du texte riche et une image.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 py-2 sm:py-4">
                        <div className="space-y-1.5 sm:space-y-2">
                            <Label className="text-sm sm:text-base font-semibold">Image de couverture</Label>
                            <div className="relative aspect-video sm:aspect-[3/1] w-full rounded-xl overflow-hidden border-2 border-dashed border-border hover:border-primary/50 transition-colors bg-muted flex flex-col items-center justify-center cursor-pointer group shadow-sm">
                                {coverImage ? (
                                    <>
                                        <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white text-xs sm:text-sm font-medium flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm md:bg-transparent md:p-0 md:backdrop-none">
                                                <ImageIcon size={16} /> Changer l'image
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-2 sm:p-4">
                                        {isUploading ? (
                                            <Loader2 className="mx-auto text-primary animate-spin mb-1 sm:mb-2" size={24} />
                                        ) : (
                                            <ImageIcon className="mx-auto text-muted-foreground mb-1 sm:mb-2" size={24} />
                                        )}
                                        <p className="text-[11px] sm:text-sm text-muted-foreground font-medium">
                                            {isUploading ? "Chargement..." : "Uploader une image"}
                                        </p>
                                        {!isUploading && <p className="text-[10px] text-muted-foreground/60 mt-0.5 hidden sm:block">PNG, JPG jusqu'à 5MB</p>}
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                />
                            </div>
                        </div>

                        <div className="space-y-1 sm:space-y-2">
                            <Label htmlFor="title" className="text-sm sm:text-base font-semibold">Titre</Label>
                            <Input
                                id="title"
                                placeholder="Ex: Alerte Météo"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-9 sm:h-10 text-sm"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm sm:text-base font-semibold">Contenu (Texte riche)</Label>
                            <div className="border rounded-lg overflow-hidden shadow-sm">
                                <RichTextEditor
                                    value={content}
                                    onChange={setContent}
                                    folder="flash"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base font-semibold">Priorité</Label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value="normal"
                                        checked={priority === 'normal'}
                                        onChange={() => setPriority('normal')}
                                        className="accent-primary h-4 w-4"
                                    />
                                    <span className="text-sm">Normale</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value="high"
                                        checked={priority === 'high'}
                                        onChange={() => setPriority('high')}
                                        className="accent-destructive h-4 w-4"
                                    />
                                    <span className="text-sm font-bold text-destructive">Urgente</span>
                                </label>
                            </div>
                        </div>
                        <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t flex flex-col sm:flex-row gap-2 mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto order-2 sm:order-1">
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isUploading} className="w-full sm:w-auto text-white order-1 sm:order-2">
                                {isUploading ? 'Upload en cours...' : 'Enregistrer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminFlash;
