
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import FloatingElements from '@/components/FloatingElements';
import MagneticButton from '@/components/MagneticButton';
import ArticleCard from '@/components/articles/ArticleCard';
import ArticleForm from '@/components/articles/ArticleForm';
import SampleArticles from '@/components/articles/SampleArticles';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Articles = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  
  const canEdit = userRole === 'admin' || userRole === 'staff';

  const { data: articles = [], isLoading, error } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      console.log('Fetching articles...');
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }
      console.log('Fetched articles:', data);
      return data || [];
    }
  });

  // Also fetch all articles for debugging
  const { data: allArticles } = useQuery({
    queryKey: ['all-articles-debug'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log('All articles in database:', data);
      return data || [];
    }
  });

  const deleteArticle = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Article deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive"
      });
      console.error('Error deleting article:', error);
    }
  });

  const filteredArticles = articles.filter(article => {
    if (!searchTerm) return true;
    return (
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const featuredArticle = filteredArticles[0];
  const otherArticles = filteredArticles.slice(1);

  const handleEdit = (article: any) => {
    setEditingArticle(article);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle.mutate(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingArticle(null);
  };

  // Debug logging
  console.log('Articles loading state:', isLoading);
  console.log('Articles error:', error);
  console.log('Published articles count:', articles.length);
  console.log('All articles count:', allArticles?.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-green-900 relative overflow-hidden">
      <FloatingElements />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Articles & News
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Latest insights, press statements, and updates from our human rights advocacy work
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-12 max-w-4xl mx-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            
            {canEdit && (
              <div className="flex gap-2">
                <SampleArticles />
                <MagneticButton>
                  <Button 
                    onClick={() => setIsFormOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    New Article
                  </Button>
                </MagneticButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 pb-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="space-y-8">
              <div className="animate-pulse bg-white/10 rounded-xl h-96"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white/10 rounded-xl h-64"></div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-400 text-lg mb-4">Error loading articles</div>
              <p className="text-gray-500 mb-8">Please try refreshing the page</p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Refresh Page
              </Button>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 text-lg mb-4">
                {articles.length === 0 ? 'No articles published yet' : 'No articles found'}
              </div>
              <p className="text-gray-500 mb-8">
                {articles.length === 0 
                  ? canEdit 
                    ? 'Start by adding some sample articles or create your first article' 
                    : 'Check back soon for updates'
                  : 'Try adjusting your search criteria'
                }
              </p>
              {canEdit && articles.length === 0 && (
                <div className="flex gap-4 justify-center">
                  <SampleArticles />
                  <Button 
                    onClick={() => setIsFormOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Article
                  </Button>
                </div>
              )}
              {/* Debug info for admins */}
              {canEdit && (
                <div className="mt-8 text-left bg-gray-800/50 p-4 rounded-lg max-w-md mx-auto">
                  <h3 className="text-white font-semibold mb-2">Debug Info:</h3>
                  <p className="text-gray-300 text-sm">Total articles in DB: {allArticles?.length || 0}</p>
                  <p className="text-gray-300 text-sm">Published articles: {articles.length}</p>
                  <p className="text-gray-300 text-sm">Loading: {isLoading ? 'Yes' : 'No'}</p>
                  <p className="text-gray-300 text-sm">Error: {error ? 'Yes' : 'No'}</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featuredArticle && (
                <div className="mb-16">
                  <ArticleCard 
                    article={featuredArticle} 
                    featured={true}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              )}

              {/* Article Grid */}
              {otherArticles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherArticles.map((article) => (
                    <ArticleCard 
                      key={article.id} 
                      article={article}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </>
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

      {/* Article Form Dialog */}
      <ArticleForm 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        article={editingArticle}
      />
    </div>
  );
};

export default Articles;
