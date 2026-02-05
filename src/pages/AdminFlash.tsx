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
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="headline-lg text-headline flex items-center gap-2">
                        <Zap className="text-primary fill-primary" /> Flash Info
                        {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary/50" />}
                    </h1>
                    <p className="text-muted-foreground mt-1">Gérez les alertes en temps réel</p>
                </div>
                <Button onClick={() => openModal()} className="gap-2 h-8 text-xs px-3 md:h-10 md:text-sm md:px-4 text-white">
                    <Plus size={16} className="md:w-[18px] md:h-[18px]" /> Nouveau Flash
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashList.map((flash, index) => (
                    <motion.div
                        key={flash.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-xl border relative overflow-hidden group hover:shadow-lg transition-shadow bg-card flex flex-col ${flash.priority === 'high' ? 'border-l-4 border-l-destructive' : 'border-l-4 border-l-primary'}`}
                    >
                        {flash.coverImage && (
                            <div className="aspect-video w-full rounded-lg overflow-hidden mb-4">
                                <img src={flash.coverImage} alt={flash.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${flash.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {flash.isActive ? 'Actif' : 'Archivé'}
                            </span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 hover:bg-muted rounded-full transition-colors opacity-0 group-hover:opacity-100">
                                        <MoreHorizontal size={16} />
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

                        <h3 className="text-lg font-bold text-headline mb-2">{flash.title}</h3>
                        <div className="text-muted-foreground text-sm mb-4 prose prose-sm max-w-none prose-p:leading-relaxed" dangerouslySetInnerHTML={{ __html: flash.content }} />

                        <div className="flex items-center text-xs text-muted-foreground mt-auto pt-4 border-t border-border">
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
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingFlash ? 'Modifier Flash Info' : 'Nouveau Flash Info'}</DialogTitle>
                        <DialogDescription>
                            Créez une alerte qui apparaîtra sur la page d'accueil avec du texte riche et une image.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Titre</Label>
                            <Input
                                id="title"
                                placeholder="Ex: Alerte Météo"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Image de couverture</Label>
                            <div className="flex items-center gap-4">
                                {coverImage && (
                                    <div className="h-20 w-20 rounded-lg overflow-hidden border">
                                        <img src={coverImage} alt="Preview" className="h-full w-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <Label
                                        htmlFor="cover-upload"
                                        className="flex flex-col items-center justify-center h-20 w-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                                    >
                                        {isUploading ? (
                                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                        ) : (
                                            <>
                                                <ImageIcon className="h-6 w-6 text-muted-foreground mb-1" />
                                                <span className="text-xs text-muted-foreground">Cliquez pour uploader</span>
                                            </>
                                        )}
                                        <input
                                            id="cover-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={isUploading}
                                        />
                                    </Label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Contenu (Texte riche)</Label>
                            <RichTextEditor
                                value={content}
                                onChange={setContent}
                                folder="flash"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Priorité</Label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value="normal"
                                        checked={priority === 'normal'}
                                        onChange={() => setPriority('normal')}
                                        className="accent-primary"
                                    />
                                    <span className="text-sm">Normale</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value="high"
                                        checked={priority === 'high'}
                                        onChange={() => setPriority('high')}
                                        className="accent-destructive"
                                    />
                                    <span className="text-sm font-bold text-destructive">Urgente</span>
                                </label>
                            </div>
                        </div>
                        <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isUploading} className="text-white">
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
