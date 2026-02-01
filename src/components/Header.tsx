import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { CATEGORIES } from '@/types/article';

const slugify = (str: string) =>
  str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .trim();

const CATEGORY_ITEMS = CATEGORIES.map(cat => ({
  name: cat,
  path: `/category/${slugify(cat)}`
}));

const NAV_ITEMS = [
  { name: 'Accueil', path: '/' },
  ...CATEGORY_ITEMS,
  { name: 'À propos', path: '/about' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        setIsScrolled(true);
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
          setIsHidden(true);
        } else {
          setIsHidden(false);
        }
      } else {
        setIsScrolled(false);
        setIsHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Main header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md transition-all duration-300 border-b border-divider ${isScrolled ? 'py-2 shadow-md' : 'py-4'
          } ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="container">
          {/* Logo row */}
          <div className="flex items-center justify-between gap-4 py-2">
            <Link to="/" className="shrink-0 flex items-center gap-3">
              <img
                src="/assets/JEUOB_LOGO-removebg-preview.png"
                alt="JEUOB Logo"
                className="h-12 md:h-20 w-auto object-contain transition-all"
              />
              <div className="md:hidden">
                <h1 className="font-serif text-xl font-bold text-primary leading-tight">
                  JEUOB
                </h1>
              </div>
            </Link>

            <div className="flex-1 text-center hidden md:block">
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-primary tracking-tight leading-tight">
                Journal de l’Etudiant de l’Université Omar Bongo
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors text-primary"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Ouvrir le menu"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block mt-4 border-t border-divider pt-4">
            <ul className="flex items-center justify-center gap-8">
              {NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-sm font-bold uppercase tracking-wider text-subheadline hover:text-primary transition-colors relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation Overlay - Outside Header for best visibility */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[280px] bg-background shadow-2xl flex flex-col pt-0 border-l border-divider"
            >
              <div className="px-6 py-6 flex items-center justify-between border-b border-divider bg-muted/30">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-tight">
                  Journal de l'Étudiant <br /> de l'Université Omar Bongo
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-muted rounded-full text-foreground transition-colors border border-divider shadow-sm"
                >
                  <X size={18} />
                </button>
              </div>
              <ul className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                {NAV_ITEMS.map((item, index) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group ${location.pathname === item.path
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'text-foreground hover:bg-muted font-medium'
                        }`}
                    >
                      <span className="text-sm tracking-wide lowercase first-letter:uppercase">
                        {item.name}
                      </span>
                      <ChevronRight
                        size={14}
                        className={`transition-transform group-hover:translate-x-1 ${location.pathname === item.path ? 'text-white/70' : 'text-muted-foreground'
                          }`}
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
      {/* Spacer to prevent content from going under the fixed header */}
      <div className="h-[120px] md:h-[200px]" />
    </>
  );
};
