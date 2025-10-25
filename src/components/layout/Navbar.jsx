import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Catálogo', path: '/catalogo' },
    { name: 'Galería', path: '/galeria' },
    { name: 'Disponibilidad', path: '/disponibilidad' },
    { name: 'Cotización', path: '/cotizacion' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-soft py-4'
          : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative transition-transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-autumn-400 to-rust-400 blur-xl opacity-50 rounded-full" />
              <h1 className="relative text-2xl md:text-3xl font-bold gradient-text">
                Creaparty
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'nav-link',
                  location.pathname === link.path && 'active'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/cotizacion">
              <Button variant="primary" size="sm">
                Solicitar Cotización
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-autumn-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-autumn-700" />
            ) : (
              <Menu className="w-6 h-6 text-autumn-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden overflow-hidden animate-fade-in">
            <div className="pt-4 pb-6 space-y-3">
              {navLinks.map((link) => (
                <div key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-autumn-700 font-medium hover:bg-autumn-100 transition-colors',
                      location.pathname === link.path &&
                        'bg-gradient-to-r from-autumn-100 to-rust-100'
                    )}
                  >
                    {link.name}
                  </Link>
                </div>
              ))}
              <div className="pt-4">
                <Link to="/cotizacion" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Solicitar Cotización
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
