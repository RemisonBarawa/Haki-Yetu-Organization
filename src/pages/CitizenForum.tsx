
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, MessageSquare, Heart, Flag } from 'lucide-react';
import FloatingElements from '@/components/FloatingElements';
import MagneticButton from '@/components/MagneticButton';
import CitizenPostCard from '@/components/citizen-forum/CitizenPostCard';
import CreatePostDialog from '@/components/citizen-forum/CreatePostDialog';
import CitizenAuthDialog from '@/components/citizen-forum/CitizenAuthDialog';
import { useToast } from '@/hooks/use-toast';

const CitizenForum = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [currentCitizen, setCurrentCitizen] = useState(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'land-rights', label: 'Land Rights' },
    { value: 'gender-issues', label: 'Gender Issues' },
    { value: 'governance', label: 'Governance' },
    { value: 'legal-aid', label: 'Legal Aid' },
    { value: 'general', label: 'General' }
  ];

  // Check for existing citizen session
  useEffect(() => {
    const citizenData = localStorage.getItem('citizen_session');
    if (citizenData) {
      setCurrentCitizen(JSON.parse(citizenData));
    }
  }, []);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['citizen-posts', selectedCategory, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('citizen_posts')
        .select(`
          *,
          citizens (name, email),
          post_interactions (interaction_type),
          post_comments (id)
        `)
        .in('status', ['published', 'responded'])
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  const handleCreatePost = () => {
    if (!currentCitizen) {
      setIsAuthDialogOpen(true);
    } else {
      setIsCreatePostOpen(true);
    }
  };

  const handleCitizenAuth = (citizenData: any) => {
    setCurrentCitizen(citizenData);
    localStorage.setItem('citizen_session', JSON.stringify(citizenData));
    setIsCreatePostOpen(true);
  };

  const handleSignOut = () => {
    setCurrentCitizen(null);
    localStorage.removeItem('citizen_session');
    toast({
      title: "Signed out",
      description: "You have been signed out successfully"
    });
  };

  const filteredPosts = posts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-green-900 relative overflow-hidden">
      <FloatingElements />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Community Voice
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Share your concerns, support others, and engage with our organization for positive change
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-12 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value} className="bg-gray-800">
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2 items-center">
              {currentCitizen ? (
                <div className="flex items-center gap-4">
                  <span className="text-green-400">Welcome, {currentCitizen.name}</span>
                  <Button 
                    onClick={handleSignOut}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setIsAuthDialogOpen(true)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Sign In / Register
                </Button>
              )}
              
              <MagneticButton>
                <Button 
                  onClick={handleCreatePost}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Share Your Voice
                </Button>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 pb-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white/10 rounded-xl h-48"></div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-400 text-lg mb-4">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'No posts found matching your criteria' 
                  : 'No posts yet'
                }
              </div>
              <p className="text-gray-500 mb-8">
                Be the first to share your voice and start the conversation
              </p>
              <Button 
                onClick={handleCreatePost}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Post
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <CitizenPostCard 
                  key={post.id} 
                  post={post}
                  currentCitizen={currentCitizen}
                  onAuthRequired={() => setIsAuthDialogOpen(true)}
                />
              ))}
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

      {/* Dialogs */}
      <CreatePostDialog 
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        currentCitizen={currentCitizen}
        categories={categories.filter(c => c.value !== 'all')}
      />
      
      <CitizenAuthDialog 
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
        onAuth={handleCitizenAuth}
      />
    </div>
  );
};

export default CitizenForum;
