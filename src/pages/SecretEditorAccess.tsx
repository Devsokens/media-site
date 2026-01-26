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

const AdminDashboard = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    setArticles(getArticles());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle(id);
      setArticles(getArticles());
    }
  };

  const filteredArticles = articles.filter((article) => {
    if (filter === 'published') return article.isPublished;
    if (filter === 'draft') return !article.isPublished;
    return true;
  });

  const stats = {
    total: articles.length,
    published: articles.filter((a) => a.isPublished).length,
    drafts: articles.filter((a) => !a.isPublished).length,
    totalReading: articles.reduce((acc, a) => acc + a.readingTime, 0),
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="headline-lg text-headline">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your articles and publications
            </p>
          </div>
          <Link
            to="/secret-editor-access/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <PenSquare size={18} />
            New Article
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="admin-card"
          >
            <div className="flex items-center gap-3 mb-2">
              <FileText className="text-primary" size={20} />
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="admin-stat">{stats.total}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="admin-card"
          >
            <div className="flex items-center gap-3 mb-2">
              <Eye className="text-primary" size={20} />
              <span className="text-sm text-muted-foreground">Published</span>
            </div>
            <p className="admin-stat">{stats.published}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="admin-card"
          >
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-muted-foreground" size={20} />
              <span className="text-sm text-muted-foreground">Drafts</span>
            </div>
            <p className="admin-stat">{stats.drafts}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="admin-card"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-sidebar-primary" size={20} />
              <span className="text-sm text-muted-foreground">Read Time</span>
            </div>
            <p className="admin-stat">{stats.totalReading}m</p>
          </motion.div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(['all', 'published', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Articles Table */}
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                    Title
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                    Category
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                    Author
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                    Status
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
                    className="border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={article.coverImage}
                          alt=""
                          className="w-12 h-12 rounded object-cover hidden sm:block"
                        />
                        <div>
                          <p className="font-medium text-foreground line-clamp-1">
                            {article.title}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-1 md:hidden">
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
                      <span className="text-sm text-muted-foreground">
                        {article.author}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          article.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {article.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(article.createdAt)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <MoreHorizontal size={18} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/secret-editor-access/edit/${article.id}`}
                              className="flex items-center gap-2"
                            >
                              <Edit size={16} />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          {article.isPublished && (
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/article/${article.id}`}
                                className="flex items-center gap-2"
                              >
                                <Eye size={16} />
                                View
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(article.id)}
                            className="flex items-center gap-2 text-destructive focus:text-destructive"
                          >
                            <Trash2 size={16} />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto text-muted-foreground mb-4" size={48} />
              <p className="text-muted-foreground">No articles found</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
