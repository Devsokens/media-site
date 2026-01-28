import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Settings, Globe, Bell, Lock, Save, Moon, Sun } from 'lucide-react';
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

const AdminSettings = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Paramètres sauvegardés",
                description: "Vos modifications ont été prises en compte.",
            });
        }, 1000);
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="headline-lg text-headline flex items-center gap-2">
                            <Settings className="text-primary" /> Paramètres
                        </h1>
                        <p className="text-muted-foreground mt-1">Configuration générale du site</p>
                    </div>
                    <Button onClick={handleSave} disabled={loading} className="gap-2">
                        <Save size={18} /> {loading ? 'Enregistrement...' : 'Sauvegarder'}
                    </Button>
                </div>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="general" className="gap-2"><Globe size={16} /> Général</TabsTrigger>
                        <TabsTrigger value="notifications" className="gap-2"><Bell size={16} /> Notifications</TabsTrigger>
                        <TabsTrigger value="security" className="gap-2"><Lock size={16} /> Sécurité</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-6">
                        <div className="admin-card space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-headline mb-4">Informations du Site</h3>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="siteName">Nom du site</Label>
                                        <Input id="siteName" defaultValue="JEUOB - Journal des Élèves" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description (Méta)</Label>
                                        <Textarea id="description" defaultValue="Le journal d'actualité des élèves du Togo, par les élèves." />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="contactEmail">Email de contact</Label>
                                        <Input id="contactEmail" defaultValue="contact@jeuob.com" type="email" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border">
                                <h3 className="text-lg font-bold text-headline mb-4">Apparence</h3>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Mode Maintenance</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Désactiver l'accès public au site temporairement.
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-6">
                        <div className="admin-card space-y-6">
                            <h3 className="text-lg font-bold text-headline mb-4">Préférences Email</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Nouveaux articles</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Recevoir un email quand un rédacteur soumet un article.
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Commentaires</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Notification lors d'un nouveau commentaire.
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Rapport Hebdomadaire</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Recevoir les statistiques de la semaine chaque lundi.
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="security" className="space-y-6">
                        <div className="admin-card space-y-6">
                            <h3 className="text-lg font-bold text-headline mb-4">Sécurité du Compte</h3>

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="current">Mot de passe actuel</Label>
                                    <Input id="current" type="password" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="new">Nouveau mot de passe</Label>
                                    <Input id="new" type="password" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirm">Confirmer le mot de passe</Label>
                                    <Input id="confirm" type="password" />
                                </div>
                            </div>

                            <Button variant="outline" className="w-full mt-2">
                                Changer le mot de passe
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
