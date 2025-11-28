
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import ArticleCard from '@/components/articles/ArticleCard';
import ArticleForm from '@/components/articles/ArticleForm';
import SampleArticles from '@/components/articles/SampleArticles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Temporary type extension until Supabase types are regenerated
type ArticleWithCategory = {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  status: string | null;
  author_id: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  slug: string;
  category: string | null;
  thematic_area: string | null;
};

const ArticlesList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleWithCategory | null>(null);

  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async (): Promise<ArticleWithCategory[]> => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ArticleWithCategory[];
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

  const handleEdit = (article: ArticleWithCategory) => {
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

  if (isLoading) {
    return <div className="text-center py-8">Loading articles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Articles & News</h2>
        <div className="flex gap-2">
          <SampleArticles />
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Article
          </Button>
        </div>
      </div>

      {(!articles || articles.length === 0) ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles yet</h3>
          <p className="text-gray-600 mb-4">Start creating content for your website</p>
          <div className="flex gap-2 justify-center">
            <SampleArticles />
            <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create First Article
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                  <p className="text-gray-600 mt-1">{article.excerpt || 'No excerpt available'}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>Status: {article.status}</span>
                    <span>Category: {article.category || 'Press Statements'}</span>
                    <span>Thematic Area: {article.thematic_area || 'General'}</span>
                    <span>Created: {new Date(article.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(article)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(article.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ArticleForm 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        article={editingArticle}
      />
    </div>
  );
};

export default ArticlesList;
