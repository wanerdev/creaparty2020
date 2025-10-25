import { useState, useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { supabase } from '../../config/supabase';
import Card from '../../components/ui/Card';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'bodas', name: 'Bodas' },
    { id: 'cumpleanos', name: 'Cumpleaños' },
    { id: 'corporativos', name: 'Eventos Corporativos' },
    { id: 'otros', name: 'Otros' },
  ];

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from('galeria')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter((img) =>
    selectedCategory === 'all' ? true : img.categoria === selectedCategory
  );

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-header">Galería</h1>
          <p className="section-subheader">
            Explora nuestros eventos realizados y déjate inspirar
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-autumn-500 to-rust-500 text-white shadow-soft-lg'
                  : 'glass-card hover:bg-white/70'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-autumn-200 border-t-autumn-500 rounded-full animate-spin" />
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-autumn-600 text-lg">
              No hay imágenes en esta categoría
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.url || '/placeholder-gallery.jpg'}
                  alt={image.titulo || 'Gallery image'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-autumn-900/80 via-autumn-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-bold text-lg mb-1">
                      {image.titulo}
                    </h3>
                    {image.descripcion && (
                      <p className="text-white/80 text-sm">
                        {image.descripcion}
                      </p>
                    )}
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl w-full"
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.titulo}
                className="w-full h-auto max-h-[90vh] object-contain rounded-2xl"
              />
              {selectedImage.titulo && (
                <div className="mt-4 text-center">
                  <h3 className="text-white text-2xl font-bold mb-2">
                    {selectedImage.titulo}
                  </h3>
                  {selectedImage.descripcion && (
                    <p className="text-white/80">{selectedImage.descripcion}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
