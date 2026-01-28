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
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { getArticles } from '@/lib/articles';
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

// Mock data for charts
const viewData = [
  { name: 'Lun', views: 400 },
  { name: 'Mar', views: 300 },
  { name: 'Mer', views: 600 },
  { name: 'Jeu', views: 800 },
  { name: 'Ven', views: 500 },
  { name: 'Sam', views: 900 },
  { name: 'Dim', views: 1100 },
];

const categoryData = [
  { name: 'Actualité', value: 400 },
  { name: 'Politique', value: 300 },
  { name: 'Économie', value: 200 },
  { name: 'Culture', value: 150 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SecretEditorAccess = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    setArticles(getArticles());
  }, []);

  const totalViews = articles.reduce((acc, a) => acc + (a.views || 0), 0);
  const publishedArticles = articles.filter(a => a.isPublished).length;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="headline-lg text-headline">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Bienvenue sur votre espace d'administration "JEUOB". Voici un aperçu de vos performances.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Vues totales', value: totalViews, icon: Eye, color: 'text-blue-500', trend: '+12.5%', isUp: true },
            { label: 'Articles publiés', value: publishedArticles, icon: FileText, color: 'text-green-500', trend: '+2', isUp: true },
            { label: 'Lecteurs actifs', value: '1.2k', icon: Users, color: 'text-orange-500', trend: '-3.2%', isUp: false },
            { label: 'Temps moyen', value: '4m 32s', icon: Clock, color: 'text-purple-500', trend: '+15s', isUp: true },
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 admin-card h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-headline flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" />
                Évolution des vues
              </h3>
              <select className="bg-muted border-none rounded-md text-xs px-2 py-1 outline-none">
                <option>7 derniers jours</option>
                <option>30 derniers jours</option>
              </select>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={viewData}>
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

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 admin-card">
            <h3 className="font-bold text-headline mb-6">Articles récents</h3>
            <div className="space-y-4">
              {articles.slice(0, 5).map((article) => (
                <div key={article.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                  <div className="flex items-center gap-4">
                    <img src={article.coverImage} className="w-12 h-12 rounded-lg object-cover" alt="" />
                    <div>
                      <h4 className="font-bold text-headline text-sm line-clamp-1">{article.title}</h4>
                      <p className="text-xs text-muted-foreground">{article.category} • Il y a 2h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-headline">{article.views || 0}</span>
                    <Eye size={14} className="text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card">
            <h3 className="font-bold text-headline mb-6">Notifications</h3>
            <div className="space-y-6">
              {[
                { label: 'Nouvel utilisateur', desc: 'Sékou vient de rejoindre l\'équipe', time: '10m', icon: Users, color: 'bg-blue-100 text-blue-600' },
                { label: 'Article approuvé', desc: 'L\'article sur le pétrole est en ligne', time: '1h', icon: FileText, color: 'bg-green-100 text-green-600' },
                { label: 'Alerte Système', desc: 'Mise à jour de maintenance prévue', time: '2h', icon: TrendingUp, color: 'bg-orange-100 text-orange-600' },
              ].map((notif, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${notif.color}`}>
                    <notif.icon size={18} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center w-full">
                      <h5 className="text-sm font-bold text-headline">{notif.label}</h5>
                      <span className="text-[10px] text-muted-foreground">{notif.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{notif.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SecretEditorAccess;
