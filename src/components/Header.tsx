import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { name: 'Accueil', path: '/' },
  { name: 'Académie', path: '/category/academie' },
  { name: 'Vie Etudiante', path: '/category/vie-etudiante' },
  { name: 'Opportunités', path: '/category/opportunités' },
  { name: 'Culture & Arts', path: '/category/culture-arts' },
  { name: 'Sports', path: '/category/sport' },
  { name: 'Technologies', path: '/category/technologie' },
  { name: 'Opinions/Tribunes', path: '/category/opinion-tribunes' },
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
              className="absolute top-0 right-0 bottom-0 w-[260px] bg-white shadow-2xl flex flex-col pt-10"
            >
              <div className="px-5 py-4 flex items-center justify-between border-b border-divider bg-white">
                <span className="text-lg font-serif font-bold text-slate-900 uppercase tracking-tight">Menu</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-900 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <ul className="flex-1 overflow-y-auto py-4 bg-white">
                {NAV_ITEMS.map((item, index) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className="flex items-center justify-between px-6 py-4 text-lg font-serif font-bold text-slate-900 hover:bg-slate-50 transition-all border-b border-divider/40"
                    >
                      {item.name}
                      <span className="text-slate-300 text-xs">→</span>
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
