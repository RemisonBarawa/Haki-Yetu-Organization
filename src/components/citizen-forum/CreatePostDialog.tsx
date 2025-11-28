
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface CreatePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentCitizen: any;
  categories: Array<{ value: string; label: string }>;
}

const CreatePostDialog = ({ isOpen, onClose, currentCitizen, categories }: CreatePostDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    location: '',
    photo_url: ''
  });

  const createPost = useMutation({
    mutationFn: async (postData: any) => {
      const { error } = await supabase
        .from('citizen_posts')
        .insert({
          citizen_id: currentCitizen.id,
          title: postData.title,
          content: postData.content,
          category: postData.category,
          location: postData.location || null,
          photo_url: postData.photo_url || null,
          status: 'published' // Auto-publish posts
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your post has been shared successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['citizen-posts'] });
      setFormData({ title: '', content: '', category: 'general', location: '', photo_url: '' });
      onClose();
    },
    onError: (error) => {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    createPost.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Share Your Voice
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What's your concern or suggestion?"
              className="bg-white/10 border-white/20 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
              required
            >
              {categories.map(category => (
                <option key={category.value} value={category.value} className="bg-gray-800">
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Details *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Describe your concern, suggestion, or question in detail..."
              className="bg-white/10 border-white/20 text-white min-h-32"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo_url">Photo URL (Optional)</Label>
            <Input
              id="photo_url"
              value={formData.photo_url}
              onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="bg-white/10 border-white/20 text-white"
              type="url"
            />
            <p className="text-xs text-gray-400">
              Add a link to an image that supports your post (optional)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, district, or specific location"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              <strong>Note:</strong> Your post will be visible to the public and our organization's staff. 
              We review all posts and will respond to actionable concerns.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createPost.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {createPost.isPending ? 'Sharing...' : 'Share Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
