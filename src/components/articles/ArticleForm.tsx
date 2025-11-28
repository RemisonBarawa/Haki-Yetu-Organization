
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Save, X } from 'lucide-react';

interface ArticleFormProps {
  isOpen: boolean;
  onClose: () => void;
  article?: any;
}

const ArticleForm = ({ isOpen, onClose, article }: ArticleFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    content: article?.content || '',
    excerpt: article?.excerpt || '',
    featured_image: article?.featured_image || '',
    status: article?.status || 'draft',
    category: article?.category || 'Press Statements'
  });

  const createArticle = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('articles')
        .insert([{
          ...data,
          author_id: '00000000-0000-0000-0000-000000000000', // Placeholder author
          published_at: data.status === 'published' ? new Date().toISOString() : null
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Article created successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create article",
        variant: "destructive"
      });
      console.error('Error creating article:', error);
    }
  });

  const updateArticle = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('articles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
          published_at: data.status === 'published' && !article?.published_at 
            ? new Date().toISOString() 
            : article?.published_at
        })
        .eq('id', article.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Article updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update article",
        variant: "destructive"
      });
      console.error('Error updating article:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive"
      });
      return;
    }

    // Generate slug if empty
    const slug = formData.slug || formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const articleData = {
      ...formData,
      slug
    };

    if (article) {
      updateArticle.mutate(articleData);
    } else {
      createArticle.mutate(articleData);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white/95 to-green-50/95 backdrop-blur-xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent">
            {article ? 'Edit Article' : 'Create New Article'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {article ? 'Update your article content and settings' : 'Create a new article for the website'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Article title"
                className="bg-white/80 border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="article-slug"
                  className="bg-white/80 border-gray-200"
                />
                <Button type="button" variant="outline" onClick={generateSlug}>
                  Generate
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief summary of the article"
              rows={3}
              className="bg-white/80 border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Article content"
              rows={12}
              className="bg-white/80 border-gray-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="featured_image">Featured Image URL</Label>
              <Input
                id="featured_image"
                value={formData.featured_image}
                onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="bg-white/80 border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-white/80 border-gray-200">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Press Statements">Press Statements</SelectItem>
                  <SelectItem value="Haki Yetu Blog">Haki Yetu Blog</SelectItem>
                  <SelectItem value="Publications">Publications</SelectItem>
                  <SelectItem value="News">News</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="bg-white/80 border-gray-200">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createArticle.isPending || updateArticle.isPending}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {article ? 'Update Article' : 'Create Article'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleForm;
