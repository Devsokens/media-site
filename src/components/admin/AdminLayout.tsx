import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
  Megaphone,
  Users,
  ChevronLeft,
  User as UserIcon,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { getCurrentProfile, UserProfile } from '@/lib/users';

// No props needed for the root layout

const navItems = [
  { icon: BarChart3, label: 'Tableau de bord', path: '/admin-jeuob' },
  { icon: FileText, label: 'Articles', path: '/admin-jeuob/articles' },
  { icon: Zap, label: 'Flash info', path: '/admin-jeuob/flash' },
  { icon: Megaphone, label: 'Publicité', path: '/admin-jeuob/ads' },
  { icon: Users, label: 'Utilisateurs', path: '/admin-jeuob/users' },
  { icon: Settings, label: 'Paramètres', path: '/admin-jeuob/settings' },
];

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('admin_sidebar_open');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [userRoleHint, setUserRoleHint] = useState(() => localStorage.getItem('admin_role_hint'));
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getCurrentProfile();
        setProfile(data);
        if (data?.role) localStorage.setItem('admin_role_hint', data.role);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    localStorage.setItem('admin_sidebar_open', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const filteredNavItems = navItems.filter(item => {
    // Determine current role (real profile or hint)
    const effectiveRole = profile?.role || userRoleHint;

    // Only admins can see user management and settings
    if ((item.path === '/admin-jeuob/users' || item.path === '/admin-jeuob/settings')) {
      // If we HAVE a role and it's not admin, hide.
      // If we're still loading and have NO hint, hide (or keep if we want to be optimistic).
      if (effectiveRole && effectiveRole !== 'admin') return false;
    }
    return true;
  });

  const handleLogout = async () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        toast({
          title: "Déconnexion",
          description: "Vous avez été déconnecté avec succès.",
        });
        navigate('/');
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Un problème est survenu lors de la déconnexion.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 fixed top-0 bottom-0 left-0 z-50 border-r border-sidebar-border ${isSidebarOpen ? 'w-64' : 'w-20'
          }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <h1 className="font-serif text-xl font-bold text-sidebar-foreground">
                JEUOB Admin
              </h1>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              <ChevronLeft
                size={20}
                className={`transition-transform ${!isSidebarOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                      : 'hover:bg-sidebar-accent text-sidebar-foreground'
                      }`}
                  >
                    <item.icon size={20} />
                    {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info and Logout */}
        <div className="mt-auto border-t border-sidebar-border">
          {isLoadingProfile ? (
            <div className="px-6 py-4 border-b border-sidebar-border bg-black/5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sidebar-accent/50 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-sidebar-accent/50 rounded w-24" />
                  <div className="h-2 bg-sidebar-accent/50 rounded w-16" />
                </div>
              </div>
            </div>
          ) : profile && isSidebarOpen && (
            <div className="px-6 py-4 border-b border-sidebar-border bg-black/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <UserIcon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {profile.fullName}
                  </p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider">
                    {profile.role === 'admin' ? 'Administrateur' : profile.role === 'editor' ? 'Éditeur' : 'Observateur'}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-left"
            >
              <LogOut size={20} />
              {isSidebarOpen && <span className="font-medium">Déconnexion</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area - with margin for the sidebar on desktop */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-sidebar-accent"
            >
              <Menu size={24} />
            </button>
            <h1 className="font-serif text-xl font-bold text-white">JEUOB Admin</h1>
            <div className="w-10" />
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileSidebarOpen(false)}
                className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="md:hidden fixed left-0 top-0 bottom-0 w-72 bg-sidebar text-sidebar-foreground z-50 flex flex-col shadow-2xl"
              >
                <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
                  <h1 className="font-serif text-xl font-bold text-white">JEUOB Admin</h1>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-sidebar-accent"
                  >
                    <X size={24} />
                  </button>
                </div>
                <nav className="flex-1 p-4 overflow-y-auto">
                  <ul className="space-y-2">
                    {filteredNavItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                              ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                              : 'hover:bg-sidebar-accent'
                              }`}
                          >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
                <div className="p-4 border-t border-sidebar-border">
                  {profile && (
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-black/5 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{profile.fullName}</p>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-wider">
                          {profile.role === 'admin' ? 'Administrateur' : profile.role === 'editor' ? 'Éditeur' : 'Observateur'}
                        </p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={async () => {
                      setIsMobileSidebarOpen(false);
                      await handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Déconnexion</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>


        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 bg-muted/30 min-h-screen">
          <Outlet context={{ profile, isLoadingProfile }} />
        </main>
      </div>
    </div>
  );
};
