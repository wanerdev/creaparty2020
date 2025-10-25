import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { supabase } from '../../config/supabase';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('disponible', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.categoria_id === selectedCategory;
    const matchesSearch = product.nombre
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-header">Nuestro Catálogo</h1>
          <p className="section-subheader">
            Descubre nuestra colección de mobiliario y decoración premium
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="glass-card p-6 rounded-3xl">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-autumn-400" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14"
                />
              </div>

              {/* Filter Button Mobile */}
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Categories - Desktop */}
            <div className="hidden md:flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-autumn-500 to-rust-500 text-white shadow-soft-lg'
                    : 'bg-white/80 text-autumn-700 hover:bg-white'
                }`}
              >
                Todos
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-autumn-500 to-rust-500 text-white shadow-soft-lg'
                      : 'bg-white/80 text-autumn-700 hover:bg-white'
                  }`}
                >
                  {category.nombre}
                </button>
              ))}
            </div>

            {/* Categories - Mobile */}
            {showFilters && (
              <div className="md:hidden mt-4 space-y-2">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setShowFilters(false);
                  }}
                  className={`w-full px-6 py-3 rounded-xl font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-autumn-500 to-rust-500 text-white'
                      : 'bg-white/80 text-autumn-700'
                  }`}
                >
                  Todos
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setShowFilters(false);
                    }}
                    className={`w-full px-6 py-3 rounded-xl font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-autumn-500 to-rust-500 text-white'
                        : 'bg-white/80 text-autumn-700'
                    }`}
                  >
                    {category.nombre}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-autumn-200 border-t-autumn-500 rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-3xl bg-autumn-100">
              <X className="w-12 h-12 text-autumn-400" />
            </div>
            <h3 className="text-2xl font-bold text-autumn-800 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-autumn-600">
              Intenta con otros filtros o búsqueda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  return (
    <Card className="group cursor-pointer overflow-hidden h-full flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square bg-autumn-100">
        <img
          src={product.imagen_url || '/placeholder-product.jpg'}
          alt={product.nombre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-autumn-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Availability Badge */}
          <div className="absolute top-4 right-4">
            <span className="px-4 py-2 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-autumn-700">
              {product.stock > 0 ? 'Disponible' : 'No disponible'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-autumn-800 mb-2 line-clamp-2">
            {product.nombre}
          </h3>
          <p className="text-sm text-autumn-600 mb-4 line-clamp-2 flex-1">
            {product.descripcion}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold gradient-text">
                ${product.precio}
              </div>
              <div className="text-xs text-autumn-500">por día</div>
            </div>

            <button className="px-4 py-2 bg-gradient-to-r from-autumn-500 to-rust-500 text-white rounded-xl text-sm font-semibold shadow-soft hover:shadow-soft-lg transition-shadow">
              Ver Detalles
            </button>
          </div>
        </div>
    </Card>
  );
};

export default Catalog;
