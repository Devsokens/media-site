import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ChevronRight, Eye, EyeOff, Loader2, Newspaper, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    // Rediriger si déjà connecté
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) navigate('/admin-jeuob', { replace: true });
        };
        checkSession();
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            toast({
                title: "Connexion réussie",
                description: "Bienvenue dans votre espace d'administration.",
            });

            const from = (location.state as any)?.from?.pathname || '/admin-jeuob';
            navigate(from, { replace: true });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur de connexion",
                description: error.message || "Identifiants invalides.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex overflow-hidden">
            {/* Left Side: Animated Visuals (Desktop only) */}
            <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-12 text-white">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/30">
                            <Newspaper size={24} />
                        </div>
                        <span className="text-xl font-serif font-bold tracking-tight">JEUOB</span>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-md"
                    >
                        <h1 className="text-5xl font-serif font-bold leading-tight mb-6">
                            L'information <br />
                            <span className="text-white/60 italic font-medium">universitaire </span> <br />
                            réinventée.
                        </h1>
                        <p className="text-white/70 text-lg leading-relaxed">
                            Accédez à votre plateforme de gestion éditoriale pour informer, éduquer et engager la communauté estudiantine de l'UOB.
                        </p>
                    </motion.div>
                </div>

                {/* Animated Mock Cards */}
                <div className="absolute right-[-100px] top-1/2 -translate-y-1/2 w-[400px] flex flex-col gap-6 opacity-40 select-none pointer-events-none">
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [-10, 10, -10],
                                rotate: [i % 2 === 0 ? 2 : -2, i % 2 === 0 ? -2 : 2, i % 2 === 0 ? 2 : -2]
                            }}
                            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
                            className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl"
                        >
                            <div className="w-12 h-2 bg-white/30 rounded-full mb-4" />
                            <div className="w-full h-4 bg-white/20 rounded-full mb-2" />
                            <div className="w-2/3 h-4 bg-white/20 rounded-full" />
                        </motion.div>
                    ))}
                </div>

                <div className="relative z-10 flex items-center gap-4 text-white/60 text-sm">
                    <ShieldCheck size={18} />
                    <span>Propulsé par la Direction de la Communication • UOB</span>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-[400px]"
                >
                    <div className="mb-10 lg:hidden flex justify-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                <Newspaper size={24} />
                            </div>
                            <span className="text-xl font-serif font-bold text-headline">JEUOB</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-serif font-bold text-headline mb-2">Bon retour</h2>
                        <p className="text-muted-foreground">Connectez-vous pour gérer votre contenu.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                Adresse Email
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center text-muted-foreground group-focus-within:text-primary transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@jeuob.ga"
                                    className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-divider rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    Mot de passe
                                </label>
                                <button
                                    type="button"
                                    className="text-xs font-bold text-primary hover:underline transition-colors"
                                >
                                    Oublié ?
                                </button>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center text-muted-foreground group-focus-within:text-primary transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 bg-muted/30 border border-divider rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-headline transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    Se connecter <ChevronRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2">
                            <ChevronRight size={14} className="rotate-180" />
                            Retour au site public
                        </Link>
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            </div>
        </div>
    );
};

export default Login;
