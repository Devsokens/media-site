import { useEffect, useState } from 'react';
import { Navigate, useLocation, useOutletContext, Outlet } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const location = useLocation();
    const context = useOutletContext(); // Inherit context from AdminLayout

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (isAuthenticated === null) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin-jeuob/login" state={{ from: location }} replace />;
    }

    // Use Outlet to render child routes and pass the context down
    return <Outlet context={context} />;
};
