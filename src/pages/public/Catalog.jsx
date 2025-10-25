import { useState, useEffect } from 'react';
import { Search, Filter, X, ShoppingCart, Plus, Check, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { supabase } from '../../config/supabase';
import { useCart } from '../../context/CartContext';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [eventDate, setEventDate] = useState('');
  const [productStockMap, setProductStockMap] = useState({});
  const { getTotalItems, selectedDate, setSelectedDate } = useCart();
  const navigate = useNavigate();

  // Sincronizar fecha del carrito
  useEffect(() => {
    if (selectedDate) {
      setEventDate(selectedDate);
    }
  }, [selectedDate]);

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

  const checkAllProductsStock = async (fecha) => {
    if (!fecha || products.length === 0) return;

    console.log('🔍 Verificando stock para fecha:', fecha);
    console.log('📦 Productos a verificar:', products.length);

    try {
      const stockMap = {};

      await Promise.all(
        products.map(async (product) => {
          try {
            const { data, error } = await supabase.rpc('get_stock_disponible', {
              p_producto_id: product.id,
              p_fecha: fecha,
            });

            if (!error && data !== null) {
              stockMap[product.id] = data;
              console.log(`✅ ${product.nombre}: Stock total=${product.stock}, Disponible=${data}`);
            } else {
              // Fallback al stock total si hay error
              console.warn(`⚠️ Error obteniendo stock para ${product.nombre}:`, error);
              stockMap[product.id] = product.stock;
            }
          } catch (err) {
            // Si la función no existe, usar stock total
            console.warn('❌ Stock check failed for product:', product.nombre, err);
            stockMap[product.id] = product.stock;
          }
        })
      );

      console.log('📊 Mapa de stock final:', stockMap);
      setProductStockMap(stockMap);
    } catch (error) {
      console.error('💥 Error checking stock:', error);
      // En caso de error general, usar stock total para todos
      const fallbackMap = {};
      products.forEach(p => {
        fallbackMap[p.id] = p.stock;
      });
      setProductStockMap(fallbackMap);
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setEventDate(newDate);
    setSelectedDate(newDate);
    checkAllProductsStock(newDate);
  };

  useEffect(() => {
    if (eventDate && products.length > 0) {
      checkAllProductsStock(eventDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventDate]);

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

              {/* Date Selector */}
              <div className="md:w-64">
                <Input
                  type="date"
                  value={eventDate}
                  onChange={handleDateChange}
                  placeholder="Fecha del evento"
                  className="w-full"
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

            {/* Date Info Banner */}
            {eventDate ? (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-800">
                  <strong>✓ Mostrando disponibilidad para:</strong> {new Date(eventDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tip:</strong> Selecciona una fecha para ver el stock disponible para tu evento
                </p>
              </div>
            )}

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
              <ProductCard
                key={product.id}
                product={product}
                availableStock={productStockMap[product.id] !== undefined ? productStockMap[product.id] : product.stock}
                hasDateSelected={!!eventDate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <button
          onClick={() => navigate('/cotizacion')}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-autumn-500 to-rust-500 text-white p-4 rounded-full shadow-soft-xl hover:shadow-soft-2xl transition-all duration-300 flex items-center gap-3 z-40 group"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="font-semibold">{getTotalItems()}</span>
          <span className="hidden md:inline-block">Ver Carrito</span>
          <div className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
            {getTotalItems()}
          </div>
        </button>
      )}
    </div>
  );
};

const ProductCard = ({ product, availableStock, hasDateSelected }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const inCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value > availableStock) {
      alert(`Solo hay ${availableStock} unidades disponibles`);
      setQuantity(availableStock);
    } else if (value < 1) {
      setQuantity(1);
    } else {
      setQuantity(value);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, quantity);
    setQuantity(1); // Reset quantity after adding
  };

  return (
    <Card className="group overflow-hidden h-full flex flex-col relative">
      {/* Image */}
      <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square bg-autumn-100">
        <img
          src={product.imagen_url || '/placeholder-product.jpg'}
          alt={product.nombre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400?text=Sin+Imagen';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-autumn-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-sm ${
            availableStock === 0
              ? 'bg-red-500/90 text-white'
              : availableStock < 5 && hasDateSelected
              ? 'bg-amber-500/90 text-white'
              : 'bg-white/90 text-autumn-700'
          }`}>
            {hasDateSelected ? `Disponibles: ${availableStock}` : `Stock: ${product.stock}`}
          </span>
        </div>

        {/* In Cart Badge */}
        {inCart && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white flex items-center gap-1">
              <Check className="w-3 h-3" />
              En carrito ({cartQuantity})
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-autumn-800 mb-2 line-clamp-2">
          {product.nombre}
        </h3>
        <p className="text-sm text-autumn-600 mb-3 line-clamp-2 flex-1">
          {product.descripcion}
        </p>

        <div className="text-2xl font-bold gradient-text mb-3">
          ${product.precio}
          <span className="text-xs text-autumn-500 font-normal ml-1">por día</span>
        </div>

        {/* Quantity Selector */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-autumn-700 mb-1">
            Cantidad
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(Math.max(1, quantity - 1));
              }}
              className="p-2 bg-autumn-100 hover:bg-autumn-200 rounded-lg transition-colors"
            >
              <Minus className="w-4 h-4 text-autumn-700" />
            </button>

            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              max={availableStock}
              className="w-full px-3 py-2 border-2 border-autumn-200 rounded-lg text-center font-semibold focus:border-autumn-500 focus:outline-none"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(Math.min(availableStock, quantity + 1));
              }}
              className="p-2 bg-autumn-100 hover:bg-autumn-200 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 text-autumn-700" />
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={availableStock === 0}
          className={`w-full px-4 py-3 rounded-xl text-sm font-semibold shadow-soft hover:shadow-soft-lg transition-all ${
            availableStock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : inCart
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gradient-to-r from-autumn-500 to-rust-500 text-white'
          }`}
        >
          {availableStock === 0 ? (
            'Sin stock'
          ) : inCart ? (
            <span className="flex items-center justify-center gap-1">
              <Plus className="w-4 h-4" />
              Agregar {quantity} más
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1">
              <ShoppingCart className="w-4 h-4" />
              Agregar {quantity} {quantity === 1 ? 'unidad' : 'unidades'}
            </span>
          )}
        </button>
      </div>
    </Card>
  );
};

export default Catalog;
