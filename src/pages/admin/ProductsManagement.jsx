import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Upload, Search } from 'lucide-react';
import { supabase } from '../../config/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Card from '../../components/ui/Card';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_id: '',
    stock: '',
    imagen_url: '',
    disponible: true,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select(`
          *,
          categorias (
            id,
            nombre
          )
        `)
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
      };

      if (editingProduct) {
        // Actualizar producto existente
        const { error } = await supabase
          .from('productos')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        alert('Producto actualizado exitosamente');
      } else {
        // Crear nuevo producto
        const { error } = await supabase
          .from('productos')
          .insert([productData]);

        if (error) throw error;
        alert('Producto creado exitosamente');
      }

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto');
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      alert('Producto eliminado exitosamente');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion || '',
      precio: product.precio.toString(),
      categoria_id: product.categoria_id || '',
      stock: product.stock.toString(),
      imagen_url: product.imagen_url || '',
      disponible: product.disponible,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria_id: '',
      stock: '',
      imagen_url: '',
      disponible: true,
    });
  };

  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Gestión de Productos</h2>
          <p className="text-autumn-600 mt-2">Administra tu catálogo de mobiliario</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setShowModal(true);
          }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Búsqueda */}
      <Card className="mb-8 p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-autumn-400" />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>
      </Card>

      {/* Lista de Productos */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-16 h-16 border-4 border-autumn-200 border-t-autumn-500 rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="text-center py-20">
          <p className="text-autumn-600">No hay productos. Crea uno nuevo.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id}>
              <Card className="h-full flex flex-col">
                {/* Imagen */}
                <div className="aspect-video bg-autumn-100 rounded-2xl mb-4 overflow-hidden">
                  {product.imagen_url ? (
                    <img
                      src={product.imagen_url}
                      alt={product.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-autumn-400">
                      <Upload className="w-12 h-12" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-autumn-800 line-clamp-2">
                      {product.nombre}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.disponible
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                  </div>

                  {product.categorias && (
                    <p className="text-sm text-autumn-500 mb-2">
                      {product.categorias.nombre}
                    </p>
                  )}

                  <p className="text-autumn-600 text-sm mb-4 line-clamp-2">
                    {product.descripcion}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold gradient-text">
                        ${product.precio}
                      </div>
                      <div className="text-xs text-autumn-500">por día</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-autumn-700">
                        {product.stock}
                      </div>
                      <div className="text-xs text-autumn-500">en stock</div>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-4 border-t border-autumn-200">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditModal(product)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Crear/Editar */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold gradient-text">
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-autumn-100 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-autumn-700" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Nombre del Producto"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    required
                  />

                  <Textarea
                    label="Descripción"
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    rows={3}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Precio (por día)"
                      type="number"
                      step="0.01"
                      value={formData.precio}
                      onChange={(e) =>
                        setFormData({ ...formData, precio: e.target.value })
                      }
                      required
                    />

                    <Input
                      label="Stock Disponible"
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-autumn-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={formData.categoria_id}
                      onChange={(e) =>
                        setFormData({ ...formData, categoria_id: e.target.value })
                      }
                      className="input-modern"
                      required
                    >
                      <option value="">Seleccionar categoría...</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="URL de Imagen"
                    type="url"
                    value={formData.imagen_url}
                    onChange={(e) =>
                      setFormData({ ...formData, imagen_url: e.target.value })
                    }
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="disponible"
                      checked={formData.disponible}
                      onChange={(e) =>
                        setFormData({ ...formData, disponible: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-autumn-300 text-autumn-600 focus:ring-autumn-500"
                    />
                    <label htmlFor="disponible" className="text-autumn-700 font-medium">
                      Producto disponible
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" variant="primary" className="flex-1">
                      {editingProduct ? 'Actualizar' : 'Crear'} Producto
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        )}
    </div>
  );
};

export default ProductsManagement;
