
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, FileText, File, Image, Video, Filter } from 'lucide-react';
import TiltCard from '@/components/TiltCard';
import MagneticButton from '@/components/MagneticButton';
import FloatingElements from '@/components/FloatingElements';

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const categories = ['all', ...new Set(resources.map(resource => resource.category))];
  const fileTypes = ['all', ...new Set(resources.map(resource => resource.file_type))];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = !searchTerm || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesFileType = !selectedFileType || selectedFileType === 'all' || resource.file_type === selectedFileType;
    
    return matchesSearch && matchesCategory && matchesFileType;
  });

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-400" />;
      case 'doc':
      case 'docx':
        return <File className="h-8 w-8 text-blue-400" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="h-8 w-8 text-green-400" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="h-8 w-8 text-purple-400" />;
      default:
        return <File className="h-8 w-8 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = async (resource: any) => {
    try {
      // Increment download count
      await supabase
        .from('resources')
        .update({ download_count: (resource.download_count || 0) + 1 })
        .eq('id', resource.id);
      
      // Open file in new tab
      window.open(resource.file_url, '_blank');
    } catch (error) {
      console.error('Error downloading resource:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-green-900 relative overflow-hidden">
      <FloatingElements />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Resources
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Access our collection of guides, reports, and educational materials
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search resources..."
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
            <div className="mb-4">
              <div className="text-gray-400 text-sm mb-2">Category:</div>
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
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* File Type Filters */}
            <div>
              <div className="text-gray-400 text-sm mb-2">File Type:</div>
              <div className="flex flex-wrap gap-2">
                {fileTypes.map((fileType) => (
                  <Button
                    key={fileType}
                    variant={selectedFileType === fileType ? "default" : "outline"}
                    onClick={() => setSelectedFileType(fileType === 'all' ? null : fileType)}
                    className={`uppercase ${
                      selectedFileType === fileType
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    {fileType}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="relative z-10 pb-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white/10 rounded-xl h-64"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <TiltCard key={resource.id} className="group h-full">
                  <div className="h-full flex flex-col bg-gradient-to-br from-green-600/10 to-blue-600/10 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0">
                          {getFileIcon(resource.file_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
                            {resource.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className="text-xs uppercase">
                              {resource.file_type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {resource.category}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {resource.description && (
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1">
                          {resource.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
                        <span>{formatFileSize(resource.file_size)}</span>
                        <span>{resource.download_count || 0} downloads</span>
                      </div>

                      {resource.tags && resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {resource.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <MagneticButton>
                        <Button 
                          onClick={() => handleDownload(resource)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white group"
                        >
                          <Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                          Download
                        </Button>
                      </MagneticButton>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          )}

          {filteredResources.length === 0 && !isLoading && (
            <div className="text-center py-20">
              <div className="text-gray-400 text-lg mb-4">No resources found</div>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

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

export default Resources;
