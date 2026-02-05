import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
    getNotifications,
    markNotificationAsRead,
    markAllAsRead,
    Notification
} from '@/lib/notifications';
import { supabase } from '@/lib/supabase';

interface NotificationBellProps {
    role: string;
}

export const NotificationBell = ({ role }: NotificationBellProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        const data = await getNotifications(role);
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
    };

    useEffect(() => {
        fetchNotifications();

        // Subscribe to real-time notifications
        const channel = supabase
            .channel('public:notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `recipient_role=eq.${role}`
                },
                (payload) => {
                    fetchNotifications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [role]);

    const handleMarkAsRead = async (id: string) => {
        const success = await markNotificationAsRead(id);
        if (success) {
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const handleMarkAllAsRead = async () => {
        const success = await markAllAsRead(role);
        if (success) {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-primary/20">
                    <Bell size={20} className={unreadCount > 0 ? "text-primary" : "text-muted-foreground"} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse border-2 border-background">
                            {unreadCount > 9 ? '+9' : unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[350px] p-0 shadow-2xl border-border overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                    <h3 className="font-bold text-headline">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-[11px] gap-1 px-2 hover:bg-primary/10 hover:text-primary transition-all"
                            onClick={handleMarkAllAsRead}
                        >
                            <Check size={14} /> Tout marquer comme lu
                        </Button>
                    )}
                </div>

                <div className="max-h-[400px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                    <AnimatePresence initial={false}>
                        {notifications.length > 0 ? (
                            notifications.map((n, idx) => (
                                <motion.div
                                    key={n.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`relative group p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors flex gap-3 ${!n.isRead ? 'bg-primary/5' : ''}`}
                                >
                                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!n.isRead ? 'bg-primary' : 'bg-transparent'}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-headline mb-0.5">{n.title}</p>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed">{n.message}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-muted-foreground/60 italic font-medium">
                                                {new Date(n.createdAt).toLocaleDateString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                            {n.articleId && (
                                                <Link
                                                    to={`/admin-jeuob/edit/${n.articleId}`}
                                                    onClick={() => {
                                                        handleMarkAsRead(n.id);
                                                        setIsOpen(false);
                                                    }}
                                                    className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline hover:gap-1.5 transition-all"
                                                >
                                                    Voir l'article <ExternalLink size={10} />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                    {!n.isRead && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsRead(n.id);
                                            }}
                                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1 hover:bg-primary/10 rounded-full transition-all text-primary hover:scale-110"
                                            title="Marquer comme lu"
                                        >
                                            <Check size={14} />
                                        </button>
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                                <Inbox size={48} className="mb-3 text-muted-foreground" />
                                <p className="text-sm font-medium">Aucune notification</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-2 bg-muted/30 border-t border-border text-center">
                    <button className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors py-1 w-full uppercase tracking-widest">
                        Historique complet
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
};
