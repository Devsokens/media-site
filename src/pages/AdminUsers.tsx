import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Users, UserPlus, Shield, Mail, MoreHorizontal, Edit, Trash2, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
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
import { getProfiles, updateProfile, deleteProfile, UserProfile as User, getCurrentProfile } from '@/lib/users';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const AdminUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    // Form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');

    const fetchProfiles = async () => {
        const data = await getProfiles();
        setUsers(data);
    };

    const { profile, isLoadingProfile } = useOutletContext<{ profile: User | null, isLoadingProfile: boolean }>();
    const [isCheckingRole, setIsCheckingRole] = useState(true);

    useEffect(() => {
        const checkRole = async () => {
            if (isLoadingProfile) return;

            if (profile && profile.role !== 'admin') {
                toast({
                    variant: "destructive",
                    title: "Accès refusé",
                    description: "Vous n'avez pas les droits pour accéder à cette page.",
                });
                navigate('/admin-jeuob');
            }
            setIsCheckingRole(false);
        };
        checkRole();
        fetchProfiles();
    }, [navigate, toast, profile, isLoadingProfile]);

    const openModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setName(user.fullName);
            setEmail(user.email || '');
            setRole(user.role);
        } else {
            setEditingUser(null);
            setName('');
            setEmail('');
            setPassword('');
            setRole('viewer');
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editingUser) {
                const result = await updateProfile(editingUser.id, { fullName: name, role });
                if (result) {
                    toast({
                        title: "Profil mis à jour",
                        description: `Le rôle de ${name} a été modifié.`,
                    });
                }
            } else {
                // Création directe de compte avec mot de passe
                // On utilise un client temporaire sans persistance pour ne pas déconnecter l'admin
                const { createClient } = await import('@supabase/supabase-js');
                const tempSupabase = createClient(
                    import.meta.env.VITE_SUPABASE_URL,
                    import.meta.env.VITE_SUPABASE_ANON_KEY,
                    { auth: { persistSession: false } }
                );

                const { data, error } = await tempSupabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                            role: role
                        }
                    }
                });

                if (error) throw error;

                toast({
                    title: "Compte créé",
                    description: `Le compte pour ${name} a été créé avec succès.`,
                });
            }
            fetchProfiles();
            setIsModalOpen(false);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Un problème est survenu.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Supprimer cet utilisateur ?')) {
            await deleteProfile(id);
            fetchProfiles();
        }
    };

    const toggleStatus = async (user: User) => {
        await updateProfile(user.id, { status: user.status === 'active' ? 'inactive' : 'active' });
        fetchProfiles();
    };

    if (isLoadingProfile || isCheckingRole) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="headline-lg text-headline flex items-center gap-2">
                        <Users className="text-primary" /> Utilisateurs
                    </h1>
                    <p className="text-muted-foreground mt-1">Gérez les membres de l'équipe</p>
                </div>
                <Button onClick={() => openModal()} className="gap-2 h-8 text-xs px-3 md:h-10 md:text-sm md:px-4">
                    <UserPlus size={16} className="md:w-[18px] md:h-[18px]" /> Créer un compte
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
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden border border-divider shrink-0">
                                                {user.avatarUrl ? (
                                                    <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Users size={16} />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-headline truncate">{user.fullName}</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Mail size={10} /> {user.email || 'Pas d\'email'}
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
                                        <span className="text-sm text-muted-foreground">Récemment</span>
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
                                                <DropdownMenuItem onClick={() => toggleStatus(user)}>
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
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {user.fullName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-headline">{user.fullName}</h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Mail size={10} /> {user.email || 'Pas d\'email'}
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
                                    <DropdownMenuItem onClick={() => toggleStatus(user)}>
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
                <DialogContent className="w-[95vw] sm:max-w-[425px] max-h-[95vh] overflow-y-auto p-4 sm:p-6 text-headline">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? 'Modifier l\'utilisateur' : 'Créer un nouveau compte'}</DialogTitle>
                        <DialogDescription>
                            {editingUser ? 'Modifiez le rôle de ce membre.' : 'Saisissez les informations pour créer un compte directement.'}
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
                                disabled={!!editingUser}
                                required
                            />
                        </div>
                        {!editingUser && (
                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe initial</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                    L'utilisateur pourra modifier ce mot de passe plus tard.
                                </p>
                            </div>
                        )}
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
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Envoi...' : 'Enregistrer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminUsers;
