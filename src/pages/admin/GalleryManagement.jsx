import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../config/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Card from '../../components/ui/Card';

const GalleryManagement = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    url: '',
    categoria: 'bodas',
  });

  const categories = [
    { id: 'all', name: 'Todas' },
    { id: 'bodas', name: 'Bodas' },
    { id: 'cumpleanos', name: 'Cumpleaños' },
    { id: 'corporativos', name: 'Eventos Corporativos' },
    { id: 'otros', name: 'Otros' },
  ];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('galeria')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from('galeria').insert([formData]);

      if (error) throw error;

      alert('Imagen agregada exitosamente');
      setShowModal(false);
      resetForm();
      fetchImages();
    } catch (error) {
      console.error('Error adding image:', error);
      alert('Error al agregar la imagen');
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;

    try {
      const { error } = await supabase.from('galeria').delete().eq('id', imageId);

      if (error) throw error;
      alert('Imagen eliminada exitosamente');
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error al eliminar la imagen');
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      url: '',
      categoria: 'bodas',
    });
  };

  const filteredImages = images.filter((img) =>
    selectedCategory === 'all' ? true : img.categoria === selectedCategory
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Gestión de Galería</h2>
          <p className="text-autumn-600 mt-2">
            Administra las imágenes de eventos realizados
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Imagen
        </Button>
      </div>

      {/* Filtros por categoría */}
      <Card className="mb-8 p-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-autumn-500 to-rust-500 text-white shadow-soft-lg'
                  : 'bg-white text-autumn-700 hover:bg-autumn-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </Card>

      {/* Galería */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-16 h-16 border-4 border-autumn-200 border-t-autumn-500 rounded-full animate-spin" />
        </div>
      ) : filteredImages.length === 0 ? (
        <Card className="text-center py-20">
          <ImageIcon className="w-16 h-16 text-autumn-300 mx-auto mb-4" />
          <p className="text-autumn-600">
            No hay imágenes en esta categoría. Agrega una nueva.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div key={image.id}>
              <Card className="group overflow-hidden p-0">
                {/* Imagen */}
                <div className="aspect-square bg-autumn-100 relative overflow-hidden">
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={image.titulo || 'Gallery image'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-autumn-400" />
                    </div>
                  )}

                  {/* Overlay con botón eliminar */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 right-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(image.id)}
                        className="bg-white/10 backdrop-blur-sm text-white hover:bg-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  {image.titulo && (
                    <h4 className="font-semibold text-autumn-800 mb-1 line-clamp-1">
                      {image.titulo}
                    </h4>
                  )}
                  {image.descripcion && (
                    <p className="text-sm text-autumn-600 line-clamp-2">
                      {image.descripcion}
                    </p>
                  )}
                  <div className="mt-2">
                    <span className="inline-block px-3 py-1 bg-autumn-100 text-autumn-700 text-xs font-medium rounded-full">
                      {categories.find((c) => c.id === image.categoria)?.name ||
                        image.categoria}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Modal Agregar Imagen */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl"
          >
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold gradient-text">
                    Agregar Imagen a Galería
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
                    label="URL de la Imagen"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    required
                  />

                  {/* Preview de la imagen */}
                  {formData.url && (
                    <div className="aspect-video bg-autumn-100 rounded-2xl overflow-hidden">
                      <img
                        src={formData.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <Input
                    label="Título (opcional)"
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData({ ...formData, titulo: e.target.value })
                    }
                    placeholder="Ej: Boda Elegante en Jardín"
                  />

                  <Textarea
                    label="Descripción (opcional)"
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    placeholder="Describe brevemente este evento..."
                    rows={3}
                  />

                  <div>
                    <label className="block text-sm font-medium text-autumn-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={formData.categoria}
                      onChange={(e) =>
                        setFormData({ ...formData, categoria: e.target.value })
                      }
                      className="input-modern"
                      required
                    >
                      {categories
                        .filter((c) => c.id !== 'all')
                        .map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" variant="primary" className="flex-1">
                      <Upload className="w-5 h-5 mr-2" />
                      Agregar Imagen
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

                {/* Nota sobre storage */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Tip:</strong> Para subir imágenes, puedes usar servicios
                    gratuitos como{' '}
                    <a
                      href="https://imgur.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold"
                    >
                      Imgur
                    </a>{' '}
                    o configurar Supabase Storage (ver SETUP_GUIDE.md)
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}
    </div>
  );
};

export default GalleryManagement;
