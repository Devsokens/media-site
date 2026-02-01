import { useState, useEffect } from 'react';
import { Settings, Globe, Bell, Lock, Save } from 'lucide-react';
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

const AdminSettings = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    // Password change state
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const { isLoadingProfile } = useOutletContext<{ isLoadingProfile: boolean }>();

    useEffect(() => {
        const fetchSettings = async () => {
            const data = await getSiteSettings();
            setSettings(data);
            setLoading(false);
        };
        fetchSettings();
    }, []);

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
        if (passwords.new !== passwords.confirm) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Les nouveaux mots de passe ne correspondent pas.",
            });
            return;
        }

        setIsSaving(true);
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
                title: "Mot de passe mis à jour",
                description: "Votre mot de passe a été modifié avec succès.",
            });
            setPasswords({ current: '', new: '', confirm: '' });
        }
        setIsSaving(false);
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
                    <p className="text-muted-foreground mt-1">Configuration générale du site</p>
                </div>
                <Button onClick={handleSaveGeneral} disabled={isSaving} className="gap-2">
                    <Save size={18} /> {isSaving ? 'Enregistrement...' : 'Sauvegarder'}
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="general" className="gap-2"><Globe size={16} /> Général</TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2"><Bell size={16} /> Notifications</TabsTrigger>
                    <TabsTrigger value="security" className="gap-2"><Lock size={16} /> Sécurité</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <div className="admin-card space-y-6 border-divider">
                        <div>
                            <h3 className="text-lg font-bold text-headline mb-4">Informations du Site</h3>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="siteName">Nom du site</Label>
                                    <Input
                                        id="siteName"
                                        value={settings?.siteName}
                                        onChange={(e) => setSettings(s => s ? { ...s, siteName: e.target.value } : null)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description (Méta)</Label>
                                    <Textarea
                                        id="description"
                                        value={settings?.siteDescription}
                                        onChange={(e) => setSettings(s => s ? { ...s, siteDescription: e.target.value } : null)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="contactEmail">Email de contact</Label>
                                    <Input
                                        id="contactEmail"
                                        type="email"
                                        value={settings?.contactEmail}
                                        onChange={(e) => setSettings(s => s ? { ...s, contactEmail: e.target.value } : null)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-divider">
                            <h3 className="text-lg font-bold text-headline mb-4">Fonctionnement</h3>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Mode Maintenance</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Désactiver l'accès public au site temporairement.
                                    </p>
                                </div>
                                <Switch
                                    checked={settings?.maintenanceMode}
                                    onCheckedChange={(checked) => setSettings(s => s ? { ...s, maintenanceMode: checked } : null)}
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                    <div className="admin-card space-y-6 border-divider">
                        <h3 className="text-lg font-bold text-headline mb-4">Préférences Email</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Nouveaux articles</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Notification lors de la soumission d'un article.
                                    </p>
                                </div>
                                <Switch
                                    checked={settings?.notifyNewArticles}
                                    onCheckedChange={(val) => setSettings(s => s ? { ...s, notifyNewArticles: val } : null)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Commentaires</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Notification lors d'un nouveau commentaire.
                                    </p>
                                </div>
                                <Switch
                                    checked={settings?.notifyComments}
                                    onCheckedChange={(val) => setSettings(s => s ? { ...s, notifyComments: val } : null)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Rapport Hebdomadaire</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Recevoir les statistiques de la semaine chaque lundi.
                                    </p>
                                </div>
                                <Switch
                                    checked={settings?.notifyWeeklyReport}
                                    onCheckedChange={(val) => setSettings(s => s ? { ...s, notifyWeeklyReport: val } : null)}
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <form onSubmit={handlePasswordChange} className="admin-card space-y-6 border-divider">
                        <h3 className="text-lg font-bold text-headline mb-4">Sécurité du Compte</h3>

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="new">Nouveau mot de passe</Label>
                                <Input
                                    id="new"
                                    type="password"
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm">Confirmer le nouveau mot de passe</Label>
                                <Input
                                    id="confirm"
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" variant="outline" className="w-full mt-2" disabled={isSaving}>
                            {isSaving ? 'Mise à jour...' : 'Changer le mot de passe'}
                        </Button>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminSettings;
