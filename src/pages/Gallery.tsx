
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import TiltCard from '@/components/TiltCard';
import MagneticButton from '@/components/MagneticButton';
import FloatingElements from '@/components/FloatingElements';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const { data: galleryItems = [], isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const categories = ['all', ...new Set(galleryItems.map(item => item.category))];
  
  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-green-900 relative overflow-hidden">
      <FloatingElements />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Gallery
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Documenting our journey in defending human rights and empowering communities
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search gallery..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 h-5 w-5" />
                <span className="text-gray-400 text-sm">Filter:</span>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category === 'all' ? null : category)}
                  className={`capitalize ${
                    selectedCategory === category
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  {category.replace('-', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="relative z-10 pb-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white/10 rounded-xl aspect-square"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <TiltCard key={item.id} className="group cursor-pointer">
                  <div 
                    className="relative overflow-hidden rounded-xl aspect-square bg-gradient-to-br from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-white/10"
                    onClick={() => setSelectedImage(item)}
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                        {item.description && (
                          <p className="text-gray-300 text-sm line-clamp-2">{item.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags?.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    {item.is_featured && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-green-600 text-white">Featured</Badge>
                      </div>
                    )}
                  </div>
                </TiltCard>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && !isLoading && (
            <div className="text-center py-20">
              <div className="text-gray-400 text-lg mb-4">No images found</div>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedImage.image_url}
              alt={selectedImage.title}
              className="w-full h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <h3 className="text-white text-2xl font-bold mb-2">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-gray-300 mb-3">{selectedImage.description}</p>
              )}
              {selectedImage.photographer && (
                <p className="text-gray-400 text-sm">Photo by: {selectedImage.photographer}</p>
              )}
              <div className="flex flex-wrap gap-1 mt-3">
                {selectedImage.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Home */}
      <div className="fixed bottom-8 left-8 z-20">
        <MagneticButton>
          <Button 
            onClick={() => window.history.back()}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            ← Back
          </Button>
        </MagneticButton>
      </div>
    </div>
  );
};

export default Gallery;
