
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight, Edit2, Trash2 } from 'lucide-react';
import TiltCard from '@/components/TiltCard';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  article: any;
  onEdit?: (article: any) => void;
  onDelete?: (id: string) => void;
  featured?: boolean;
}

const ArticleCard = ({ article, onEdit, onDelete, featured = false }: ArticleCardProps) => {
  const { user, userRole } = useAuth();
  const canEdit = userRole === 'admin' || userRole === 'staff';

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Press Statements':
        return 'bg-red-600';
      case 'Haki Yetu Blog':
        return 'bg-green-600';
      case 'Publications':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  const articleLink = article.slug ? `/articles/${article.slug}` : `/articles/${article.id}`;

  if (featured) {
    return (
      <TiltCard className="group">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-white/10">
          {article.featured_image && (
            <div className="relative h-64 md:h-96 overflow-hidden">
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
          )}
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-4">
              <Badge className={`${getCategoryColor(article.category || 'Press Statements')} text-white`}>
                Featured
              </Badge>
              {canEdit && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit?.(article)}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete?.(article.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">
              {article.title}
            </h2>
            {article.excerpt && (
              <p className="text-gray-300 text-lg mb-6 line-clamp-3">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center gap-6 text-gray-400 text-sm mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(article.published_at || article.created_at), 'MMM dd, yyyy')}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {getReadingTime(article.content)} min read
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white group" asChild>
              <Link to={articleLink}>
                Read Article
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </TiltCard>
    );
  }

  return (
    <TiltCard className="group h-full">
      <div className="h-full flex flex-col bg-gradient-to-br from-green-600/10 to-blue-600/10 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        {article.featured_image && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <Badge className={`${getCategoryColor(article.category || 'Press Statements')} text-white text-xs`}>
              {article.category || 'Press Statements'}
            </Badge>
            {canEdit && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(article)}
                  className="h-8 w-8 p-0 hover:bg-white/20"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(article.id)}
                  className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-400"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-gray-300 mb-4 line-clamp-3 flex-1">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {format(new Date(article.published_at || article.created_at), 'MMM dd, yyyy')}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {getReadingTime(article.content)} min
            </div>
          </div>
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10 group"
            asChild
          >
            <Link to={articleLink}>
              Read More
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </TiltCard>
  );
};

export default ArticleCard;
