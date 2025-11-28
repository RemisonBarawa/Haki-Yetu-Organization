import { useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import FloatingElements from '@/components/FloatingElements';
import MagneticButton from '@/components/MagneticButton';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, BookOpen, Sparkles } from 'lucide-react';

const isUuid = (value: string) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    value
  );

const ArticleCanvas = () => {
  const { identifier = '' } = useParams<{ identifier: string }>();
  const navigate = useNavigate();

  const {
    data: article,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['article-detail', identifier],
    queryFn: async () => {
      if (!identifier) throw new Error('Missing article identifier');

      let query = supabase.from('articles').select('*').eq('status', 'published');
      query = isUuid(identifier) ? query.eq('id', identifier) : query.eq('slug', identifier);

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error('Error fetching article', error);
        throw error;
      }

      if (!data) {
        throw new Error('Article not found');
      }

      return data;
    },
    enabled: Boolean(identifier),
  });

  const { data: relatedArticles = [] } = useQuery({
    queryKey: ['article-related', article?.id],
    queryFn: async () => {
      if (!article?.id) return [];

      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, excerpt, published_at, created_at')
        .eq('status', 'published')
        .neq('id', article.id)
        .order('published_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error fetching related articles', error);
        throw error;
      }

      return data || [];
    },
    enabled: Boolean(article?.id),
  });

  const readingTime = useMemo(() => {
    if (!article?.content) return 0;
    const wordsPerMinute = 200;
    const wordCount = article.content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }, [article?.content]);

  const contentBlocks = useMemo(() => {
    if (!article?.content) return [];
    return article.content
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .filter(Boolean);
  }, [article?.content]);

  const renderSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-emerald-950 relative overflow-hidden">
      <FloatingElements />
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-16 space-y-10">
        <Skeleton className="h-10 w-40 bg-white/10" />
        <Skeleton className="h-16 w-3/4 bg-white/10" />
        <Skeleton className="h-6 w-1/2 bg-white/10" />
        <Skeleton className="h-[32rem] w-full bg-white/10 rounded-3xl" />
        <div className="grid md:grid-cols-3 gap-8">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-64 bg-white/10 rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return renderSkeleton();
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-emerald-950 relative overflow-hidden">
        <FloatingElements />
        <div className="relative z-10 container mx-auto px-4 pt-32 pb-16 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-red-500/10 px-4 py-1 text-red-200 mb-6">
            Something went wrong
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">We could not load this article</h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-10">
            The article may have been unpublished or the link you followed is invalid. Please
            return to the articles list and try again.
          </p>
          <Button onClick={() => navigate('/articles')} className="bg-emerald-600 hover:bg-emerald-700">
            Back to Articles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-emerald-950 relative overflow-hidden">
      <FloatingElements />

      <div className="fixed top-8 left-8 z-20">
        <MagneticButton>
          <Button
            variant="outline"
            className="bg-white/5 text-white border-white/20 backdrop-blur"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </MagneticButton>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-24">
        <div className="max-w-4xl mb-12">
          <Badge className="bg-emerald-600 text-white/90 mb-4">
            {article.category || 'Haki Yetu Blog'}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>
          {article.excerpt && <p className="text-xl text-gray-300 mb-8">{article.excerpt}</p>}
          <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-400" />
              {format(new Date(article.published_at || article.created_at), 'MMM dd, yyyy')}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              {readingTime} min read
            </span>
            <span className="inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              {Math.max(1, article.content?.split(/\s+/).length || 0)} words
            </span>
          </div>
        </div>

        {article.featured_image && (
          <div className="relative mb-16 rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-[420px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-emerald-300" />
              <span className="text-sm uppercase tracking-widest">Immersive reading canvas</span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)] gap-10 items-start">
          <article className="bg-white/5 border border-white/10 rounded-[32px] p-10 space-y-6 shadow-2xl backdrop-blur">
            {contentBlocks.length > 0 ? (
              contentBlocks.map((block, index) => (
                <p key={index} className="text-lg leading-8 text-gray-100">
                  {block}
                </p>
              ))
            ) : (
              <p className="text-gray-300 text-lg leading-8 whitespace-pre-wrap">{article.content}</p>
            )}
          </article>

          <aside className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 backdrop-blur">
              <h3 className="text-white font-semibold text-lg">Reading tools</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Enjoy distraction-free reading. Save this article for later or share it with your
                community.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="flex-1 border-white/20 text-white bg-white/5">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1 border-white/20 text-white bg-white/5">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
              <h3 className="text-white font-semibold text-lg mb-4">More to explore</h3>
              <div className="space-y-4">
                {relatedArticles.length === 0 && (
                  <p className="text-gray-400 text-sm">
                    More articles will appear here as they get published.
                  </p>
                )}
                {relatedArticles.map((related) => {
                  const link = related.slug ? `/articles/${related.slug}` : `/articles/${related.id}`;
                  return (
                    <Link
                      key={related.id}
                      to={link}
                      className="block bg-white/5 border border-white/5 rounded-xl p-4 hover:border-emerald-500/40 transition-all"
                    >
                      <p className="text-white font-medium mb-1">{related.title}</p>
                      {related.excerpt && (
                        <p className="text-gray-400 text-sm line-clamp-2 mb-2">{related.excerpt}</p>
                      )}
                      <span className="text-xs text-gray-500">
                        {related.published_at || related.created_at
                          ? format(new Date(related.published_at || related.created_at), 'MMM dd, yyyy')
                          : 'Coming soon'}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ArticleCanvas;

