import { useState, useEffect } from 'react';
import { Settings, Globe, Bell, Lock, Save, User, Camera, Loader2, Eye, EyeOff } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { getSiteSettings, updateSiteSettings, SiteSettings } from '@/lib/settings';
import { supabase } from '@/lib/supabase';
import { uploadFile } from '@/lib/storage';
import { updateProfile } from '@/lib/users';

const AdminSettings = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    // Password change state
    const [passwords, setPasswords] = useState({
        current: '',
        new: ''
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [profileData, setProfileData] = useState({
        fullName: '',
        avatarUrl: ''
    });

    const [isUploading, setIsUploading] = useState(false);

    const { profile, isLoadingProfile } = useOutletContext<{ profile: any | null, isLoadingProfile: boolean }>();
    const isAdmin = profile?.role === 'admin';

    useEffect(() => {
        const fetchSettings = async () => {
            const data = await getSiteSettings();
            setSettings(data);
            setLoading(false);
        };
        fetchSettings();

        if (profile) {
            setProfileData({
                fullName: profile.fullName || '',
                avatarUrl: profile.avatarUrl || ''
            });
        }
    }, [profile]);

    const handleSaveGeneral = async () => {
        if (!settings) return;
        setIsSaving(true);
        const result = await updateSiteSettings(settings);
        if (result) {
            setSettings(result);
            toast({
                title: "Paramètres sauvegardés",
                description: "Les modifications générales ont été enregistrées.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de sauvegarder les paramètres.",
            });
        }
        setIsSaving(false);
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        // No longer checking for confirm password as it's removed from state
        // if (passwords.new !== passwords.confirm) {
        //     toast({
        //         variant: "destructive",
        //         title: "Erreur",
        //         description: "Les nouveaux mots de passe ne correspondent pas.",
        //     });
        //     return;
        // }

        setIsSaving(true);
        // Note: In standard Supabase, update({password}) doesn't strictly verify 'current' 
        // unless you use specialized re-auth, but we show it as requested.
        const { error } = await supabase.auth.updateUser({
            password: passwords.new
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message,
            });
        } else {
            toast({
                title: "Succès",
                description: "Votre mot de passe a été modifié avec succès.",
            });
            setPasswords({ current: '', new: '' }); // Reset only current and new
        }
        setIsSaving(false);
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setIsSaving(true);
        const updated = await updateProfile(profile.id, {
            fullName: profileData.fullName,
            avatarUrl: profileData.avatarUrl
        });

        if (updated) {
            toast({
                title: "Profil mis à jour",
                description: "Vos informations personnelles ont été enregistrées.",
            });
            // The AdminLayout will re-fetch or we could trigger a refresh
            window.location.reload(); // Simple way to refresh global profile state
        } else {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de mettre à jour le profil.",
            });
        }
        setIsSaving(false);
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadFile(file, 'jeuob', 'photos-profiles');
            if (url) {
                setProfileData(prev => ({ ...prev, avatarUrl: url }));
                toast({
                    title: "Image prête",
                    description: "Cliquez sur Sauvegarder pour confirmer le changement.",
                });
            }
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Erreur d'upload",
                description: "Impossible d'envoyer la photo.",
            });
        } finally {
            setIsUploading(false);
        }
    };

    if (loading || isLoadingProfile) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="headline-lg text-headline flex items-center gap-2">
                        <Settings className="text-primary" /> Paramètres
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {isAdmin ? 'Configuration générale du site' : 'Gérez vos informations personnelles'}
                    </p>
                </div>
                {/* {isAdmin && (
                    <Button onClick={handleSaveGeneral} disabled={isSaving} className="gap-2">
                        <Save size={18} /> {isSaving ? 'Enregistrement...' : 'Sauvegarder'}
                    </Button>
                )} */}
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className={`grid w-full mb-8 ${isAdmin ? 'grid-cols-2' : 'grid-cols-2'}`}>
                    <TabsTrigger value="profile" className="gap-2"><User size={16} /> Mon Profil</TabsTrigger>
                    {/* {isAdmin && <TabsTrigger value="general" className="gap-2"><Globe size={16} /> Général</TabsTrigger>}
                    {isAdmin && <TabsTrigger value="notifications" className="gap-2"><Bell size={16} /> Notifications</TabsTrigger>} */}
                    <TabsTrigger value="security" className="gap-2"><Lock size={16} /> Sécurité</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                    <form onSubmit={handleProfileUpdate} className="admin-card space-y-8 border-divider">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-muted flex items-center justify-center">
                                    {profileData.avatarUrl ? (
                                        <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={48} className="text-muted-foreground" />
                                    )}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                                            <Loader2 className="animate-spin text-white" />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer shadow-lg hover:bg-primary/90 transition-colors">
                                    <Camera size={18} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
                                </label>
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-bold">{profile?.fullName}</h3>
                                <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">{profile?.role}</p>
                            </div>
                        </div>

                        <div className="grid gap-4 max-w-md mx-auto">
                            <div className="grid gap-2">
                                <Label htmlFor="fullName">Nom complet</Label>
                                <Input
                                    id="fullName"
                                    value={profileData.fullName}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="userEmail">Email</Label>
                                <Input
                                    id="userEmail"
                                    value={profile?.email}
                                    disabled
                                    className="bg-muted/50"
                                />
                                <p className="text-[10px] text-muted-foreground italic">L'email ne peut être modifié que par un administrateur système.</p>
                            </div>
                            <Button type="submit" className="w-full mt-4" disabled={isSaving || isUploading}>
                                {isSaving ? 'Enregistrement...' : 'Mettre à jour le profil'}
                            </Button>
                        </div>
                    </form>
                </TabsContent>

                {/* {isAdmin && (
                    <>
                        <TabsContent value="general" className="space-y-6">
                            ...
                        </TabsContent>

                        <TabsContent value="notifications" className="space-y-6">
                            ...
                        </TabsContent>
                    </>
                )} */}

                <TabsContent value="security" className="space-y-6">
                    <form onSubmit={handlePasswordChange} className="admin-card space-y-6 border-divider">
                        <h3 className="text-lg font-bold text-headline mb-4">Sécurité du Compte</h3>
                        <p className="text-xs text-muted-foreground mb-6 bg-muted/50 p-3 rounded-lg border border-divider italic">
                            Pour votre sécurité, les mots de passe enregistrés sont cryptés. Utilisez l'icône d'œil pour vérifier votre saisie d'un nouveau mot de passe.
                        </p>

                        <div className="grid gap-4 max-w-md mx-auto">
                            <div className="grid gap-2">
                                <Label htmlFor="current">Ancien mot de passe</Label>
                                <div className="relative">
                                    <Input
                                        id="current"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                        placeholder="••••••••"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="new">Nouveau mot de passe</Label>
                                <div className="relative">
                                    <Input
                                        id="new"
                                        type={showNewPassword ? "text" : "password"}
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                        required
                                        minLength={6}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full mt-4" disabled={isSaving}>
                                {isSaving ? 'Mise à jour...' : 'Changer le mot de passe'}
                            </Button>
                        </div>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminSettings;
