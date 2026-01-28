import { Link } from 'react-router-dom';
import { CATEGORIES } from '@/types/article';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-headline text-primary-foreground mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="block mb-4">
              <img
                src="/assets/JEUOB_LOGO-removebg-preview.png"
                alt="JEUOB Logo"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
              Votre source d'information de confiance et d'analyses approfondies.
              Votre fenêtre sur le monde.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary-foreground">Rubriques</h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 6).map((category) => (
                <li key={category}>
                  <Link
                    to={`/category/${category.toLowerCase()}`}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary-foreground">Société</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Carrières
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Publicité
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Code d'éthique
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary-foreground">Newsletter</h3>
            <p className="text-sm text-primary-foreground/70 mb-4">
              Recevez les titres du matin directement dans votre boîte de réception.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/40"
              />
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
          <p>© 2024 JEUOB. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-foreground transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Conditions d'utilisation</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Politique des cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
