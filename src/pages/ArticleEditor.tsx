
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { getArticleById, saveArticle, updateArticle } from '@/lib/articles';
import { ArticleFormData } from '@/types/article';
import { ArrowLeft, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { RichTextEditor } from '@/components/admin/RichTextEditor';

import { CATEGORIES } from '@/types/article';

const ArticleEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    const { register, control, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<ArticleFormData>({
        defaultValues: {
            isPublished: false,
            readingTime: 5,
            views: 0,
            author: 'Admin',
        }
    });

    const isPublished = watch('isPublished');

    useEffect(() => {
        const fetchArticle = async () => {
            if (id) {
                const article = await getArticleById(id);
                if (article) {
                    reset(article);
                    setCoverPreview(article.coverImage);
                } else {
                    navigate('/admin-jeuob/articles');
                    toast({
                        title: "Erreur",
                        description: "Article introuvable",
                        variant: "destructive",
                    });
                }
            }
        };
        fetchArticle();
    }, [id, reset, navigate, toast]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result as string);
                setValue('coverImage', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: ArticleFormData) => {
        try {
            if (id) {
                await updateArticle(id, data);
                toast({
                    title: "Succès",
                    description: "Article mis à jour avec succès",
                });
            } else {
                await saveArticle(data);
                toast({
                    title: "Succès",
                    description: "Article créé avec succès",
                });
            }
            navigate('/admin-jeuob/articles');
        } catch (error) {
            console.error(error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la sauvegarde",
                variant: "destructive",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-4 border-b border-border -mx-4 px-4 md:-mx-8 md:px-8">
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/admin-jeuob/articles')}
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="headline-lg text-headline">
                            {id ? 'Modifier l\'article' : 'Nouvel article'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {id ? 'Mettez à jour votre contenu' : 'Créez un nouveau contenu captivant'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button type="submit" disabled={isSubmitting} className="gap-2">
                        <Save size={18} />
                        {isSubmitting ? 'Sauvegarde...' : 'Enregistrer'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <div className="space-y-4">
                        <Label htmlFor="title" className="text-base font-semibold">Titre de l'article</Label>
                        <Input
                            id="title"
                            placeholder="Un titre accrocheur..."
                            className="text-lg font-serif"
                            {...register('title', { required: 'Le titre est requis' })}
                        />
                        {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-4">
                        <Label htmlFor="summary" className="text-base font-semibold">Chapô (Extrait)</Label>
                        <Textarea
                            id="summary"
                            placeholder="Un résumé court pour donner envie de lire..."
                            className="h-24 resize-none"
                            {...register('summary', { required: 'L\'extrait est requis' })}
                        />
                        {errors.summary && <p className="text-destructive text-sm">{errors.summary.message}</p>}
                    </div>

                    <div className="space-y-4">
                        <Label htmlFor="content" className="text-base font-semibold">Contenu</Label>
                        <Controller
                            name="content"
                            control={control}
                            rules={{ required: 'Le contenu est requis' }}
                            render={({ field }) => (
                                <RichTextEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.content && <p className="text-destructive text-sm">{errors.content.message}</p>}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="admin-card space-y-4">
                        <h3 className="font-semibold text-headline border-b border-border pb-2">Status & Visibilité</h3>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="published" className="cursor-pointer">Publier l'article</Label>
                            <Switch
                                id="published"
                                checked={isPublished}
                                onCheckedChange={(checked) => {
                                    setValue('isPublished', checked);
                                    if (checked && !watch('publishedAt')) {
                                        setValue('publishedAt', new Date().toISOString());
                                    }
                                }}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="featured" className="cursor-pointer">Mettre à la une</Label>
                            <Switch
                                id="featured"
                                checked={watch('isFeatured')}
                                onCheckedChange={(checked) => setValue('isFeatured', checked)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Catégorie</Label>
                            <Select onValueChange={(val) => setValue('category', val)} defaultValue={watch('category')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisir une catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <input type="hidden" {...register('category', { required: true })} />
                        </div>

                        <div className="space-y-2">
                            <Label>Temps de lecture (min)</Label>
                            <Input
                                type="number"
                                min="1"
                                {...register('readingTime', { valueAsNumber: true })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Auteur</Label>
                            <Input {...register('author')} />
                        </div>
                    </div>

                    <div className="admin-card space-y-4">
                        <h3 className="font-semibold text-headline border-b border-border pb-2">Image de couverture</h3>

                        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-dashed border-border hover:border-primary/50 transition-colors bg-muted flex flex-col items-center justify-center cursor-pointer group">
                            {coverPreview ? (
                                <>
                                    <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white font-medium flex items-center gap-2">
                                            <Upload size={18} /> Changer
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-4">
                                    <ImageIcon className="mx-auto text-muted-foreground mb-2" size={32} />
                                    <p className="text-sm text-muted-foreground font-medium">Cliquez pour ajouter une image</p>
                                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG jusqu'à 5MB</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                            />
                        </div>
                        <input type="hidden" {...register('coverImage', { required: 'L\'image est requise' })} />
                        {errors.coverImage && <p className="text-destructive text-sm">{errors.coverImage.message}</p>}
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ArticleEditor;
