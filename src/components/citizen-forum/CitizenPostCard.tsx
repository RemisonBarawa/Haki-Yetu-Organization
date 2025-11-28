
import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, Flag, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface CitizenPostCardProps {
  post: any;
  currentCitizen: any;
  onAuthRequired: () => void;
}

const CitizenPostCard = ({ post, currentCitizen, onAuthRequired }: CitizenPostCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Fetch detailed post data with interactions and comments
  const { data: postDetails } = useQuery({
    queryKey: ['post-details', post.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('citizen_posts')
        .select(`
          *,
          citizens (name, email),
          post_interactions (interaction_type, citizen_id),
          post_comments (
            id, 
            content, 
            created_at,
            citizens (name, email)
          )
        `)
        .eq('id', post.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!post.id
  });

  const interactions = postDetails?.post_interactions || [];
  const comments = postDetails?.post_comments || [];
  
  const likeCount = interactions.filter((i: any) => i.interaction_type === 'like').length;
  const commentCount = comments.length;
  const isLiked = currentCitizen && interactions.some(
    (i: any) => i.interaction_type === 'like' && i.citizen_id === currentCitizen.id
  );

  const toggleLike = useMutation({
    mutationFn: async () => {
      if (!currentCitizen) {
        onAuthRequired();
        return;
      }

      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from('post_interactions')
          .delete()
          .eq('citizen_id', currentCitizen.id)
          .eq('post_id', post.id)
          .eq('interaction_type', 'like');

        if (error) throw error;
      } else {
        // Add like
        const { error } = await supabase
          .from('post_interactions')
          .insert({
            citizen_id: currentCitizen.id,
            post_id: post.id,
            interaction_type: 'like'
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citizen-posts'] });
      queryClient.invalidateQueries({ queryKey: ['post-details', post.id] });
    },
    onError: (error) => {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
    }
  });

  const addComment = useMutation({
    mutationFn: async (content: string) => {
      if (!currentCitizen) {
        onAuthRequired();
        return;
      }

      const { error } = await supabase
        .from('post_comments')
        .insert({
          citizen_id: currentCitizen.id,
          post_id: post.id,
          content
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: ['citizen-posts'] });
      queryClient.invalidateQueries({ queryKey: ['post-details', post.id] });
      toast({
        title: "Success",
        description: "Comment added successfully"
      });
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    }
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      'land-rights': 'bg-orange-500',
      'gender-issues': 'bg-purple-500',
      'governance': 'bg-blue-500',
      'legal-aid': 'bg-yellow-500',
      'general': 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-500',
      'published': 'bg-green-500',
      'responded': 'bg-blue-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    addComment.mutate(newComment.trim());
  };

  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${getCategoryColor(post.category)} text-white`}>
                {post.category.replace('-', ' ').toUpperCase()}
              </Badge>
              <Badge className={`${getStatusColor(post.status)} text-white`}>
                {post.status === 'responded' && <CheckCircle className="h-3 w-3 mr-1" />}
                {post.status.toUpperCase()}
              </Badge>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>By {post.citizens?.name || 'Anonymous'}</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.created_at && formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </div>
              {post.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {post.location}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>
        
        {post.photo_url && (
          <div className="mb-4">
            <img 
              src={post.photo_url} 
              alt="Post attachment" 
              className="rounded-lg max-w-full h-auto max-h-96 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        {post.status === 'responded' && post.staff_response && (
          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="font-semibold text-green-400">Official Response</span>
            </div>
            <p className="text-gray-300">{post.staff_response}</p>
          </div>
        )}
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleLike.mutate()}
            disabled={toggleLike.isPending}
            className={`flex items-center gap-2 ${isLiked ? 'text-red-400' : 'text-gray-400'} hover:text-red-400`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            {likeCount}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-400 hover:text-blue-400"
          >
            <MessageSquare className="h-4 w-4" />
            {commentCount}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-400 hover:text-orange-400"
          >
            <Flag className="h-4 w-4" />
            Report
          </Button>
        </div>
        
        {showComments && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="space-y-3 mb-4">
              {comments.map((comment: any) => (
                <div key={comment.id} className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">{comment.citizens?.name || 'Anonymous'}</span>
                    <span className="text-xs text-gray-400">
                      {comment.created_at && formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-gray-400"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCommentSubmit();
                  }
                }}
              />
              <Button
                onClick={handleCommentSubmit}
                disabled={!newComment.trim() || addComment.isPending}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                {addComment.isPending ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CitizenPostCard;
