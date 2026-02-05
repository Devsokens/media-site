import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  Eye,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Bell,
} from 'lucide-react';
import { getArticles } from '@/lib/articles';
import { getProfiles, UserProfile } from '@/lib/users';
import { getNotifications, Notification } from '@/lib/notifications';
import { useOutletContext } from 'react-router-dom';
import { Article } from '@/types/article';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'];

const SecretEditorAccess = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useOutletContext<{ profile: UserProfile | null }>();

  useEffect(() => {
    const fetchData = async () => {
      const [articlesData, profilesData] = await Promise.all([
        getArticles(),
        getProfiles()
      ]);

      setArticles(articlesData);
      setUsersCount(profilesData.length);

      if (profile) {
        const notifs = await getNotifications(profile.role);
        setNotifications(notifs);
      }

      setLoading(false);
    };
    fetchData();
  }, [profile]);

  const totalViews = articles.reduce((acc, a) => acc + (a.views || 0), 0);
  const publishedArticles = articles.filter(a => a.isPublished).length;

  // Articles this month
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const articlesThisMonth = articles.filter(a => {
    if (!a.createdAt) return false;
    const d = new Date(a.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  // Real data for category chart
  const categoryCounts = articles.reduce((acc: Record<string, number>, article) => {
    const cat = article.category || 'Sans catégorie';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value).slice(0, 8);

  // Real data for views/articles evolution (last 7 days based on creation)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      name: d.toLocaleDateString('fr-FR', { weekday: 'short' }),
      dateStr: d.toISOString().split('T')[0],
      views: 0,
      articles: 0
    };
  });

  // Populate with actual data
  articles.forEach(article => {
    const date = article.createdAt?.split('T')[0];
    const day = last7Days.find(d => d.dateStr === date);
    if (day) {
      day.views += (article.views || 0);
      day.articles += 1;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="headline-lg text-headline">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Bienvenue sur votre espace d'administration "JEUOB". Voici un aperçu de vos performances réelles.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Vues totales', value: totalViews.toLocaleString(), icon: Eye, color: 'text-blue-500', trend: 'Total cumulé', isUp: true },
          { label: 'Articles publiés', value: publishedArticles, icon: FileText, color: 'text-green-500', trend: `${articles.length} total`, isUp: true },
          { label: 'Membres Équipe', value: usersCount, icon: Users, color: 'text-orange-500', trend: 'Actifs', isUp: true },
          { label: 'Articles ce mois-ci', value: articlesThisMonth, icon: Clock, color: 'text-purple-500', trend: 'Activité récente', isUp: true },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="admin-card hover:border-primary/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-muted`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.isUp ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend}
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold text-headline mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 admin-card h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-headline flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              Évolution des vues (7 derniers jours)
            </h3>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7Days}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorViews)"
                  strokeWidth={3}
                  name="Vues"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-card h-[400px] flex flex-col">
          <h3 className="font-bold text-headline mb-6">Articles par catégorie</h3>
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Content & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 admin-card">
          <h3 className="font-bold text-headline mb-6">Articles récents</h3>
          <div className="space-y-4">
            {articles.slice(0, 5).map((article) => (
              <div key={article.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                    {article.coverImage && <img src={article.coverImage} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-headline text-sm truncate">{article.title}</h4>
                    <p className="text-xs text-muted-foreground">{article.category} • {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Brouillon'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold text-headline">{article.views || 0}</span>
                  <Eye size={14} className="text-muted-foreground" />
                </div>
              </div>
            ))}
            {articles.length === 0 && (
              <p className="text-center text-muted-foreground py-8 italic">Aucun article pour le moment.</p>
            )}
          </div>
        </div>

        <div className="admin-card">
          <h3 className="font-bold text-headline mb-6">Activités Récentes</h3>
          <div className="space-y-6">
            {notifications.length > 0 ? notifications.slice(0, 5).map((notif) => (
              <div key={notif.id} className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-primary/10 text-primary`}>
                  <Bell size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-center w-full">
                    <h5 className="text-sm font-bold text-headline truncate">{notif.title}</h5>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notif.message}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground italic">Aucune activité récente.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecretEditorAccess;
