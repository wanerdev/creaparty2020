import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Image, Award } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Home = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Diseño Único',
      description: 'Cada evento es una obra maestra personalizada según tus sueños.',
    },
    {
      icon: Calendar,
      title: 'Disponibilidad en Tiempo Real',
      description: 'Consulta nuestro calendario y reserva tu fecha ideal al instante.',
    },
    {
      icon: Image,
      title: 'Mobiliario Premium',
      description: 'Amplio catálogo de muebles y decoración de alta calidad.',
    },
    {
      icon: Award,
      title: 'Experiencia Garantizada',
      description: 'Años de experiencia creando momentos inolvidables.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="blob top-1/4 left-1/4 w-96 h-96 bg-autumn-300 animate-blob" />
          <div className="blob top-1/2 right-1/4 w-[500px] h-[500px] bg-rust-200 animate-blob animation-delay-2000" />
          <div className="blob bottom-1/4 left-1/3 w-80 h-80 bg-sage-200 animate-blob animation-delay-4000" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="animate-fade-in-up">
              <span className="inline-block px-6 py-2 mb-6 text-sm font-semibold text-autumn-700 bg-white/60 backdrop-blur-sm rounded-full border border-autumn-200/50">
                ✨ Creamos experiencias únicas
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight animate-fade-in-up animation-delay-200">
              <span className="gradient-text">Transforma</span>
              <br />
              <span className="text-autumn-800">tus eventos en</span>
              <br />
              <span className="gradient-text">momentos mágicos</span>
            </h1>

            <p className="text-xl md:text-2xl text-autumn-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
              Mobiliario elegante y decoración excepcional para bodas, cumpleaños y eventos corporativos que dejarán huella.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-600">
              <Link to="/cotizacion">
                <Button variant="primary" size="lg">
                  Solicitar Cotización
                </Button>
              </Link>
              <Link to="/catalogo">
                <Button variant="secondary" size="lg">
                  Ver Catálogo
                </Button>
              </Link>
            </div>

            {/* Floating Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up animation-delay-800">
              {[
                { value: '500+', label: 'Eventos Realizados' },
                { value: '98%', label: 'Clientes Satisfechos' },
                { value: '1000+', label: 'Productos' },
                { value: '24/7', label: 'Atención' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="glass-card p-6 rounded-2xl transition-transform duration-300 hover:scale-105"
                >
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-autumn-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-autumn-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-autumn-500 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-header">¿Por qué elegir Creaparty2020?</h2>
            <p className="section-subheader">
              Ofrecemos mucho más que mobiliario, creamos experiencias completas
            </p>
          </div>

          <div className="card-grid">
            {features.map((feature, index) => (
              <div key={index}>
                <Card className="text-center h-full group">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-autumn-400 to-rust-400 text-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-autumn-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-autumn-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-autumn-500 via-rust-500 to-terracotta-600" />
        <div className="absolute inset-0 bg-mesh opacity-30" />

        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              ¿Listo para crear tu evento soñado?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Solicita una cotización gratuita y descubre cómo podemos hacer realidad tus ideas
            </p>
            <Link to="/cotizacion">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white hover:bg-cream-50"
              >
                Comenzar Ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
