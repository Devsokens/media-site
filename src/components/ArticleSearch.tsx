import { Search } from 'lucide-react';

interface ArticleSearchProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export const ArticleSearch = ({ onSearch, placeholder = "Rechercher des articles..." }: ArticleSearchProps) => {
    return (
        <div className="relative max-w-2xl mx-auto mb-12">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground">
                <Search size={20} />
            </div>
            <input
                type="text"
                placeholder={placeholder}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-divider rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all placeholder:text-muted-foreground/50 text-headline shadow-sm"
            />
        </div>
    );
};
