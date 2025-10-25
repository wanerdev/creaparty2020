import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navegacion: [
      { name: 'Inicio', path: '/' },
      { name: 'Catálogo', path: '/catalogo' },
      { name: 'Galería', path: '/galeria' },
      { name: 'Disponibilidad', path: '/disponibilidad' },
    ],
    servicios: [
      { name: 'Bodas', path: '/catalogo?categoria=bodas' },
      { name: 'Cumpleaños', path: '/catalogo?categoria=cumpleanos' },
      { name: 'Eventos Corporativos', path: '/catalogo?categoria=corporativos' },
      { name: 'Otros Eventos', path: '/catalogo?categoria=otros' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-autumn-900 via-rust-800 to-sage-900 text-white overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-autumn-500/20 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rust-500/20 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cream-200 to-autumn-200 bg-clip-text text-transparent">
              Creaparty2020
            </h3>
            <p className="text-cream-200 mb-6">
              Creamos momentos inolvidables con estilo y elegancia. Tu evento perfecto comienza aquí.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110 hover:-translate-y-1"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-cream-100">Navegación</h4>
            <ul className="space-y-3">
              {footerLinks.navegacion.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-cream-200 hover:text-white transition-all inline-block hover:translate-x-1 duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-cream-100">Servicios</h4>
            <ul className="space-y-3">
              {footerLinks.servicios.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-cream-200 hover:text-white transition-all inline-block hover:translate-x-1 duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-cream-100">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-autumn-300 flex-shrink-0 mt-1" />
                <span className="text-cream-200">+1 (829) 569-0578</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-autumn-300 flex-shrink-0 mt-1" />
                <span className="text-cream-200">alcequiezyuleidy25@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-autumn-300 flex-shrink-0 mt-1" />
                <span className="text-cream-200">Santo Domingo, República Dominicana</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-cream-300 text-sm">
              © {currentYear} Creaparty2020. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacidad" className="text-cream-300 hover:text-white transition-colors">
                Privacidad
              </Link>
              <Link to="/terminos" className="text-cream-300 hover:text-white transition-colors">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
