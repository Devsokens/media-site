import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import Article from "./pages/Article";
import Category from "./pages/Category";
import Login from "./pages/Login";
import SecretEditorAccess from './pages/SecretEditorAccess';
import AdminArticles from './pages/AdminArticles';
import AdminFlash from './pages/AdminFlash';
import AdminAds from './pages/AdminAds';
import AdminUsers from './pages/AdminUsers';
import AdminSettings from './pages/AdminSettings';
import ArticleEditor from './pages/ArticleEditor';
import About from './pages/About';
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { AdminLayout } from "./components/admin/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/about" element={<About />} />

          {/* Login Admin */}
          <Route path="/admin-jeuob/login" element={<Login />} />

          {/* Routes Admin Protégées avec Layout Persistant */}
          <Route element={<AdminLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/admin-jeuob" element={<SecretEditorAccess />} />
              <Route path="/admin-jeuob/articles" element={<AdminArticles />} />
              <Route path="/admin-jeuob/new" element={<ArticleEditor />} />
              <Route path="/admin-jeuob/edit/:id" element={<ArticleEditor />} />
              <Route path="/admin-jeuob/flash" element={<AdminFlash />} />
              <Route path="/admin-jeuob/ads" element={<AdminAds />} />
              <Route path="/admin-jeuob/users" element={<AdminUsers />} />
              <Route path="/admin-jeuob/settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* Legacy Redirect */}
          <Route path="/secret-editor-access/*" element={<Navigate to="/admin-jeuob" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
