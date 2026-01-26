import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '@/types/article';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Top bar with date */}
      <div className="bg-background border-b border-divider py-2">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">
          <span>{currentDate}</span>
          <span className="hidden md:block">Your trusted source for news</span>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 bg-background transition-all duration-300 ${
          isScrolled ? 'shadow-md' : ''
        } ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="container py-4">
          {/* Logo and search row */}
          <div className="flex items-center justify-between mb-4">
            <button
              className="md:hidden p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/" className="flex-1 text-center md:text-left">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-headline tracking-tight">
                The Daily Chronicle
              </h1>
            </Link>

            <button
              className="p-2 -mr-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Toggle search"
            >
              <Search size={24} />
            </button>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-4"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="search"
                    placeholder="Search articles..."
                    className="w-full pl-12 pr-4 py-3 bg-muted rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Navigation */}
          <nav className="hidden md:block border-t border-b border-divider py-3">
            <ul className="flex items-center justify-center gap-8">
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    to={`/category/${category.toLowerCase()}`}
                    className="text-sm font-medium uppercase tracking-wider text-subheadline hover:text-primary transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-divider overflow-hidden"
            >
              <ul className="container py-4 space-y-2">
                {CATEGORIES.map((category, index) => (
                  <motion.li
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={`/category/${category.toLowerCase()}`}
                      className="block py-2 text-lg font-medium text-subheadline hover:text-primary transition-colors"
                    >
                      {category}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
