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
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }

      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    try {
      setUploading(true);

      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `galeria/${fileName}`;

      const { data, error } = await supabase.storage
        .from('imagenes')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('imagenes')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen: ' + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = formData.url;

      // Si hay un archivo seleccionado, subirlo primero
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          alert('No se pudo subir la imagen. Intenta de nuevo.');
          return;
        }
      }

      // Validar que haya una URL (del archivo o manual)
      if (!imageUrl) {
        alert('Por favor selecciona una imagen o ingresa una URL');
        return;
      }

      const imageData = {
        ...formData,
        url: imageUrl,
      };

      const { error } = await supabase.from('galeria').insert([imageData]);

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
    setImageFile(null);
    setImagePreview(null);
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
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
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
                  {/* Subida de Imagen */}
                  <div>
                    <label className="block text-sm font-medium text-autumn-700 mb-2">
                      Imagen
                    </label>

                    {/* Preview de imagen */}
                    {(imagePreview || formData.url) && (
                      <div className="mb-4 relative aspect-video bg-autumn-100 rounded-2xl overflow-hidden">
                        <img
                          src={imagePreview || formData.url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        {imagePreview && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Nueva imagen seleccionada
                          </div>
                        )}
                      </div>
                    )}

                    {/* Botón para seleccionar archivo */}
                    <div className="mb-4">
                      <label className="block">
                        <div className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-autumn-300 rounded-xl cursor-pointer hover:border-autumn-500 hover:bg-autumn-50 transition-colors">
                          <Upload className="w-6 h-6 text-autumn-500 mr-3" />
                          <span className="text-autumn-700 font-medium">
                            {imageFile ? imageFile.name : 'Seleccionar imagen desde tu computadora'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-autumn-500 mt-2">
                        O ingresa una URL de imagen externa abajo (JPG, PNG, máx. 5MB)
                      </p>
                    </div>

                    {/* Campo de URL (opcional) */}
                    <Input
                      label="URL de Imagen (opcional)"
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      disabled={!!imageFile}
                    />
                    {imageFile && (
                      <p className="text-xs text-amber-600 mt-1">
                        Se usará la imagen seleccionada. Para usar URL, elimina la selección primero.
                      </p>
                    )}
                  </div>

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
                    <Button type="submit" variant="primary" className="flex-1" disabled={uploading}>
                      {uploading ? (
                        <>
                          <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Subiendo imagen...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 mr-2" />
                          Agregar Imagen
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowModal(false)}
                      disabled={uploading}
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

export default GalleryManagement;
