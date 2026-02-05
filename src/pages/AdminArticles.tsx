import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    PenSquare,
    Eye,
    FileText,
    Clock,
    TrendingUp,
    Edit,
    Trash2,
    MoreHorizontal,
    LayoutGrid,
    List as ListIcon,
    Search,
    Loader2,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { getArticles, deleteArticle, formatDate } from '@/lib/articles';
import { Article } from '@/types/article';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const AdminArticles = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<string>('all');
    const [selectedTrimestre, setSelectedTrimestre] = useState<string>('all');
    const [selectedSemestre, setSelectedSemestre] = useState<string>('all');

    const fetchArticles = async () => {
        setIsLoading(true);
        try {
            const data = await getArticles();
            setArticles(data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
            const success = await deleteArticle(id);
            if (success) {
                fetchArticles();
            }
        }
    };

    const filteredArticles = articles.filter((article) => {
        const matchesFilter =
            filter === 'all' ? true :
                filter === 'published' ? article.isPublished :
                    !article.isPublished;

        const matchesSearch =
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.category.toLowerCase().includes(searchQuery.toLowerCase());

        const articleDate = new Date(article.createdAt);
        const year = articleDate.getFullYear().toString();
        const month = articleDate.getMonth(); // 0-11
        const trimestre = (Math.floor(month / 3) + 1).toString();
        const semestre = (Math.floor(month / 6) + 1).toString();

        const matchesYear = selectedYear === 'all' || year === selectedYear;
        const matchesTrimestre = selectedTrimestre === 'all' || trimestre === selectedTrimestre;
        const matchesSemestre = selectedSemestre === 'all' || semestre === selectedSemestre;

        return matchesFilter && matchesSearch && matchesYear && matchesTrimestre && matchesSemestre;
    });

    const years = Array.from(new Set(articles.map(a => new Date(a.createdAt).getFullYear().toString()))).sort().reverse();

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-row items-center gap-3 mb-8">
                <div className="flex-1 min-w-0">
                    <h1 className="headline-lg text-headline text-lg md:text-2xl flex items-center gap-2">
                        Articles
                        {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary/50" />}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-xs md:text-sm hidden md:block">
                        Créez, modifiez et programmez vos contenus
                    </p>
                </div>
                <Link
                    to="/admin-jeuob/new"
                    className="inline-flex items-center gap-1.5 px-2.5 py-2 text-[11px] h-8 md:gap-2 md:px-6 md:py-3 md:text-sm md:h-auto bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm whitespace-nowrap flex-shrink-0"
                >
                    <PenSquare size={14} className="md:w-[18px] md:h-[18px]" />
                    <span>Nouvel Article</span>
                </Link>
            </div>

            {/* Filter and View Toggle Row */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-wrap gap-2 order-2 md:order-1">
                        {(['all', 'published', 'draft'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                                    }`}
                            >
                                {f === 'all' ? 'Tous' : f === 'published' ? 'Publiés' : 'Brouillons'}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto order-1 md:order-2">
                        <div className="relative flex-1 md:w-[250px]">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-10 w-full bg-muted border-none"
                            />
                        </div>
                        <div className="flex items-center bg-muted p-1 rounded-lg shrink-0">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <ListIcon size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('card')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'card' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Advanced Filters Integrated */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[110px] sm:w-[120px] bg-muted border-none h-9 text-[11px] sm:text-xs">
                            <SelectValue placeholder="Année" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes les années</SelectItem>
                            {years.map(y => (
                                <SelectItem key={y} value={y}>{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedSemestre} onValueChange={setSelectedSemestre}>
                        <SelectTrigger className="w-[120px] sm:w-[140px] bg-muted border-none h-9 text-[11px] sm:text-xs">
                            <SelectValue placeholder="Semestre" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les semestres</SelectItem>
                            <SelectItem value="1">1er Semestre</SelectItem>
                            <SelectItem value="2">2ème Semestre</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={selectedTrimestre} onValueChange={setSelectedTrimestre}>
                        <SelectTrigger className="w-[120px] sm:w-[140px] bg-muted border-none h-9 text-[11px] sm:text-xs">
                            <SelectValue placeholder="Trimestre" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les trimestres</SelectItem>
                            <SelectItem value="1">1er Trimestre</SelectItem>
                            <SelectItem value="2">2ème Trimestre</SelectItem>
                            <SelectItem value="3">3ème Trimestre</SelectItem>
                            <SelectItem value="4">4ème Trimestre</SelectItem>
                        </SelectContent>
                    </Select>

                    {(selectedYear !== 'all' || selectedSemestre !== 'all' || selectedTrimestre !== 'all' || searchQuery !== '' || filter !== 'all') && (
                        <button
                            onClick={() => {
                                setSelectedYear('all');
                                setSelectedSemestre('all');
                                setSelectedTrimestre('all');
                                setSearchQuery('');
                                setFilter('all');
                            }}
                            className="text-[11px] sm:text-xs font-medium text-muted-foreground hover:text-primary transition-colors underline decoration-dotted ml-1"
                        >
                            Réinitialiser
                        </button>
                    )}
                </div>
            </div>

            {/* Articles Content */}
            {viewMode === 'list' ? (
                <div className="admin-card overflow-hidden transition-all duration-300">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                                        Titre
                                    </th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                                        Catégorie
                                    </th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                                        Auteur
                                    </th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                                        Statut
                                    </th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                                        Date
                                    </th>
                                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredArticles.map((article, index) => (
                                    <motion.tr
                                        key={article.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={article.coverImage}
                                                    alt=""
                                                    className="w-12 h-12 rounded-lg object-cover hidden sm:block border border-border"
                                                />
                                                <div>
                                                    <p className="font-medium text-headline line-clamp-1">
                                                        {article.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground line-clamp-1 md:hidden">
                                                        {article.category}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 hidden md:table-cell">
                                            <span className="text-sm text-muted-foreground">
                                                {article.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 hidden lg:table-cell">
                                            <span className="text-sm text-muted-foreground font-medium">
                                                {article.author}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col gap-1">
                                                <span
                                                    className={`inline-flex items-center w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${article.isPublished
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                >
                                                    {article.isPublished ? 'Publié' : 'Brouillon'}
                                                </span>
                                                {article.isFeatured && (
                                                    <span className="inline-flex items-center w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary/10 text-primary">
                                                        À la une
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 hidden md:table-cell">
                                            <span className="text-sm text-muted-foreground italic">
                                                {formatDate(article.createdAt)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="p-2.5 hover:bg-muted rounded-full transition-colors bg-muted/20 md:bg-transparent">
                                                        <MoreHorizontal size={20} />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-popover border-border min-w-[160px]">
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            to={`/admin-jeuob/edit/${article.id}`}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Edit size={14} className="text-muted-foreground" />
                                                            Modifier
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    {article.isPublished && (
                                                        <DropdownMenuItem asChild>
                                                            <Link
                                                                to={`/article/${article.id}`}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Eye size={14} className="text-muted-foreground" />
                                                                Voir
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(article.id)}
                                                        className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                                                    >
                                                        <Trash2 size={14} />
                                                        Supprimer
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
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article, index) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="admin-card group hover:shadow-lg transition-all"
                        >
                            <div className="aspect-video rounded-lg overflow-hidden mb-4 relative bg-muted">
                                <img
                                    src={article.coverImage}
                                    alt=""
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm ${article.isPublished ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                                        {article.isPublished ? 'Publié' : 'Brouillon'}
                                    </span>
                                    {article.isFeatured && (
                                        <span className="px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm bg-primary text-white">
                                            À la une
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                            {article.category}
                                        </span>
                                        <h3 className="font-serif font-bold text-headline line-clamp-2 leading-tight mt-1 group-hover:text-primary transition-colors">
                                            {article.title}
                                        </h3>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-2 hover:bg-muted rounded-full transition-colors flex-shrink-0 bg-muted/20 md:bg-transparent">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-popover border-border min-w-[140px]">
                                            <DropdownMenuItem asChild>
                                                <Link to={`/admin-jeuob/edit/${article.id}`} className="flex items-center gap-2">
                                                    <Edit size={14} className="text-muted-foreground" /> Modifier
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(article.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center gap-2">
                                                <Trash2 size={14} /> Supprimer
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                                            <Clock size={12} className="text-primary/60" /> {article.readingTime}m
                                        </span>
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                                            <Eye size={12} className="text-primary/60" /> {article.views || 0}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground italic">
                                        {formatDate(article.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {!isLoading && filteredArticles.length === 0 && (
                <div className="text-center py-24 bg-muted/20 rounded-2xl border-2 border-dashed border-border mt-6">
                    <FileText className="mx-auto text-primary/20 mb-4" size={64} />
                    <p className="text-headline font-bold text-xl mb-1">
                        {searchQuery || selectedYear !== 'all' ? 'Aucun résultat trouvé' : 'Aucun article trouvé'}
                    </p>
                    <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                        {searchQuery || selectedYear !== 'all'
                            ? 'Essayez de modifier vos filtres ou votre recherche.'
                            : 'Commencez à créer du contenu passionnant pour votre audience dès aujourd\'hui !'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default AdminArticles;
