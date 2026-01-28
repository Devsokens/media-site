import { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Users, UserPlus, Shield, Mail, Calendar, MoreHorizontal, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    status: 'active' | 'inactive';
    lastLogin: string;
}

const INITIAL_USERS: User[] = [
    {
        id: '1',
        name: 'Admin Principal',
        email: 'admin@jeuob.com',
        role: 'admin',
        status: 'active',
        lastLogin: 'Il y a 2 heures',
    },
    {
        id: '2',
        name: 'Rédacteur Chef',
        email: 'editor@jeuob.com',
        role: 'editor',
        status: 'active',
        lastLogin: 'Il y a 1 jour',
    },
];

const AdminUsers = () => {
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');

    const openModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        } else {
            setEditingUser(null);
            setName('');
            setEmail('');
            setRole('viewer');
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, name, email, role } : u));
        } else {
            const newUser: User = {
                id: Math.random().toString(36).substr(2, 9),
                name,
                email,
                role,
                status: 'active',
                lastLogin: 'Jamais',
            };
            setUsers([...users, newUser]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Supprimer cet utilisateur ?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const toggleStatus = (id: string) => {
        setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
    };

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="headline-lg text-headline flex items-center gap-2">
                            <Users className="text-primary" /> Utilisateurs
                        </h1>
                        <p className="text-muted-foreground mt-1">Gérez les membres de l'équipe</p>
                    </div>
                    <Button onClick={() => openModal()} className="gap-2 h-8 text-xs px-3 md:h-10 md:text-sm md:px-4">
                        <UserPlus size={16} className="md:w-[18px] md:h-[18px]" /> Inviter un membre
                    </Button>
                </div>

                {/* Desktop View */}
                <div className="hidden md:block admin-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Utilisateur</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Rôle</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Statut</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground hidden lg:table-cell">Dernière connexion</th>
                                    <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-headline">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Mail size={10} /> {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Shield size={14} className={user.role === 'admin' ? 'text-primary' : 'text-muted-foreground'} />
                                                <span className="capitalize text-sm font-medium">
                                                    {user.role === 'admin' ? 'Administrateur' : user.role === 'editor' ? 'Éditeur' : 'Observateur'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {user.status === 'active' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                                {user.status === 'active' ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 hidden lg:table-cell">
                                            <span className="text-sm text-muted-foreground">{user.lastLogin}</span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="p-2 hover:bg-muted rounded-full transition-colors">
                                                        <MoreHorizontal size={18} />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openModal(user)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Modifier rôle
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => toggleStatus(user.id)}>
                                                        {user.status === 'active' ? <XCircle className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                                        {user.status === 'active' ? 'Désactiver' : 'Activer'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                    {users.map((user, index) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="admin-card p-4 space-y-4"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-headline">{user.name}</h3>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Mail size={10} /> {user.email}
                                        </p>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-2 -mr-2 hover:bg-muted rounded-full transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => openModal(user)}>
                                            <Edit className="mr-2 h-4 w-4" /> Modifier rôle
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => toggleStatus(user.id)}>
                                            {user.status === 'active' ? <XCircle className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                            {user.status === 'active' ? 'Désactiver' : 'Activer'}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Rôle</p>
                                    <div className="flex items-center gap-2">
                                        <Shield size={14} className={user.role === 'admin' ? 'text-primary' : 'text-muted-foreground'} />
                                        <span className="capitalize text-sm font-medium">
                                            {user.role === 'admin' ? 'Admin' : user.role === 'editor' ? 'Éditeur' : 'Observateur'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Statut</p>
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {user.status === 'active' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingUser ? 'Modifier l\'utilisateur' : 'Inviter un membre'}</DialogTitle>
                            <DialogDescription>
                                Configurez les accès de ce membre de l'équipe.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom complet</Label>
                                <Input
                                    id="name"
                                    placeholder="Jean Dupont"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="jean@jeuob.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Rôle</Label>
                                <Select value={role} onValueChange={(val: any) => setRole(val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selectionner un rôle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Administrateur</SelectItem>
                                        <SelectItem value="editor">Éditeur</SelectItem>
                                        <SelectItem value="viewer">Observateur</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    * Les administrateurs ont tous les droits. Les éditeurs peuvent gérer le contenu.
                                </p>
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

export default AdminUsers;
