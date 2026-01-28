import { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Zap, Plus, Trash2, Edit, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

interface FlashInfo {
    id: string;
    title: string;
    content: string;
    priority: 'high' | 'normal';
    createdAt: string;
    isActive: boolean;
}

// Mock data
const INITIAL_FLASH: FlashInfo[] = [
    {
        id: '1',
        title: 'Alerte Météo',
        content: 'Fortes pluies attendues sur la région maritime ce soir.',
        priority: 'high',
        createdAt: new Date().toISOString(),
        isActive: true,
    },
    {
        id: '2',
        title: 'Match reporté',
        content: 'Le match Eperviers vs Lions est reporté à demain.',
        priority: 'normal',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        isActive: false,
    },
];

const AdminFlash = () => {
    const [flashList, setFlashList] = useState<FlashInfo[]>(INITIAL_FLASH);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFlash, setEditingFlash] = useState<FlashInfo | null>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState<'high' | 'normal'>('normal');

    const openModal = (flash?: FlashInfo) => {
        if (flash) {
            setEditingFlash(flash);
            setTitle(flash.title);
            setContent(flash.content);
            setPriority(flash.priority);
        } else {
            setEditingFlash(null);
            setTitle('');
            setContent('');
            setPriority('normal');
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFlash) {
            setFlashList(flashList.map(f => f.id === editingFlash.id ? { ...f, title, content, priority } : f));
        } else {
            const newFlash: FlashInfo = {
                id: Math.random().toString(36).substr(2, 9),
                title,
                content,
                priority,
                createdAt: new Date().toISOString(),
                isActive: true,
            };
            setFlashList([newFlash, ...flashList]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Supprimer ce flash info ?')) {
            setFlashList(flashList.filter(f => f.id !== id));
        }
    };

    const toggleStatus = (id: string) => {
        setFlashList(flashList.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f));
    };

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="headline-lg text-headline flex items-center gap-2">
                            <Zap className="text-primary fill-primary" /> Flash Info
                        </h1>
                        <p className="text-muted-foreground mt-1">Gérez les alertes en temps réel</p>
                    </div>
                    <Button onClick={() => openModal()} className="gap-2 h-8 text-xs px-3 md:h-10 md:text-sm md:px-4">
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
                            className={`p-6 rounded-xl border relative overflow-hidden group hover:shadow-lg transition-shadow bg-card ${flash.priority === 'high' ? 'border-l-4 border-l-destructive' : 'border-l-4 border-l-primary'}`}
                        >
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
                                        <DropdownMenuItem onClick={() => toggleStatus(flash.id)}>
                                            <Zap className="mr-2 h-4 w-4" /> {flash.isActive ? 'Désactiver' : 'Activer'}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(flash.id)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <h3 className="text-lg font-bold text-headline mb-2">{flash.title}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-3 mb-4 min-h-[60px]">
                                {flash.content}
                            </p>

                            <div className="flex items-center text-xs text-muted-foreground mt-auto pt-4 border-t border-border">
                                <Calendar size={12} className="mr-1" />
                                {new Date(flash.createdAt).toLocaleDateString()}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingFlash ? 'Modifier Flash Info' : 'Nouveau Flash Info'}</DialogTitle>
                            <DialogDescription>
                                Créez une alerte qui apparaîtra sur la page d'accueil.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
                                <Label htmlFor="content">Contenu</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Détails de l'alerte..."
                                    className="h-24"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
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

export default AdminFlash;
