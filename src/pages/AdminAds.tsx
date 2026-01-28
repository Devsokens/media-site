import { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Megaphone, Plus, Calendar, Trash2, Edit, Upload, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface Ad {
    id: string;
    name: string;
    imageUrl: string;
    link: string;
    placement: 'sidebar' | 'header' | 'article';
    clicks: number;
    isActive: boolean;
}

const INITIAL_ADS: Ad[] = [
    {
        id: '1',
        name: 'Promo Été',
        imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        link: 'https://example.com',
        placement: 'header',
        clicks: 1240,
        isActive: true,
    },
    {
        id: '2',
        name: 'Partenaire Tech',
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        link: 'https://tech-partner.com',
        placement: 'sidebar',
        clicks: 856,
        isActive: true,
    },
];

const AdminAds = () => {
    const [ads, setAds] = useState<Ad[]>(INITIAL_ADS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAd, setEditingAd] = useState<Ad | null>(null);

    // Form
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [placement, setPlacement] = useState<'sidebar' | 'header' | 'article'>('sidebar');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const openModal = (ad?: Ad) => {
        if (ad) {
            setEditingAd(ad);
            setName(ad.name);
            setLink(ad.link);
            setPlacement(ad.placement);
            setImagePreview(ad.imageUrl);
        } else {
            setEditingAd(null);
            setName('');
            setLink('');
            setPlacement('sidebar');
            setImagePreview(null);
        }
        setIsModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!imagePreview) return;

        if (editingAd) {
            setAds(ads.map(ad => ad.id === editingAd.id ? { ...ad, name, link, placement, imageUrl: imagePreview } : ad));
        } else {
            const newAd: Ad = {
                id: Math.random().toString(36).substr(2, 9),
                name,
                link,
                placement,
                imageUrl: imagePreview,
                clicks: 0,
                isActive: true,
            };
            setAds([newAd, ...ads]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Supprimer cette publicité ?')) {
            setAds(ads.filter(a => a.id !== id));
        }
    };

    const toggleStatus = (id: string) => {
        setAds(ads.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
    };

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="headline-lg text-headline flex items-center gap-2">
                            <Megaphone className="text-primary" /> Campagnes Publicitaires
                        </h1>
                        <p className="text-muted-foreground mt-1">Gérez vos bannières et partenariats</p>
                    </div>
                    <Button onClick={() => openModal()} className="gap-2 h-8 text-xs px-3 md:h-10 md:text-sm md:px-4">
                        <Plus size={16} className="md:w-[18px] md:h-[18px]" /> Nouvelle Publicité
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ads.map((ad, index) => (
                        <motion.div
                            key={ad.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="admin-card group hover:shadow-lg transition-all"
                        >
                            <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
                                <img src={ad.imageUrl} alt={ad.name} className={`w-full h-full object-cover transition-opacity ${ad.isActive ? 'opacity-100' : 'opacity-50 grayscale'}`} />
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm ${ad.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                        {ad.isActive ? 'Actif' : 'Inactif'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-headline line-clamp-1">{ad.name}</h3>
                                    <p className="text-xs text-muted-foreground capitalize flex items-center gap-1 mt-1">
                                        Placement: <span className="px-1.5 py-0.5 bg-muted rounded font-medium">{ad.placement}</span>
                                    </p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-1.5 hover:bg-muted rounded-full transition-colors">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => openModal(ad)}>
                                            <Edit className="mr-2 h-4 w-4" /> Modifier
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => toggleStatus(ad.id)}>
                                            <Megaphone className="mr-2 h-4 w-4" /> {ad.isActive ? 'Désactiver' : 'Activer'}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <a href={ad.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                                <ExternalLink className="mr-2 h-4 w-4" /> Tester le lien
                                            </a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(ad.id)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>


                        </motion.div>
                    ))}
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingAd ? 'Modifier la publicité' : 'Nouvelle publicité'}</DialogTitle>
                            <DialogDescription>
                                Ajoutez une bannière publicitaire à votre site.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Nom de la campagne</Label>
                                <Input
                                    id="title"
                                    placeholder="Ex: Promo Été 2024"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Image (Bannière)</Label>
                                <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-dashed border-border hover:border-primary/50 transition-colors bg-muted flex flex-col items-center justify-center cursor-pointer group">
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white font-medium flex items-center gap-2">
                                                    <Upload size={18} /> Changer
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-4">
                                            <ImageIcon className="mx-auto text-muted-foreground mb-2" size={32} />
                                            <p className="text-sm text-muted-foreground font-medium">Ajouter une image</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                        required={!imagePreview}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="link">Lien de redirection</Label>
                                <Input
                                    id="link"
                                    placeholder="https://..."
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Emplacement</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={placement}
                                    onChange={(e) => setPlacement(e.target.value as any)}
                                >
                                    <option value="sidebar">Barre latérale</option>
                                    <option value="header">En-tête</option>
                                    <option value="article">Dans les articles</option>
                                </select>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Annuler
                                </Button>
                                <Button type="submit">Enregistrer</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default AdminAds;
