
-- Create a dedicated gallery table for better organization
CREATE TABLE public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  event_id UUID REFERENCES public.events(id),
  photographer TEXT,
  captured_at TIMESTAMP WITH TIME ZONE,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for gallery
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to gallery
CREATE POLICY "Gallery is publicly readable" 
  ON public.gallery 
  FOR SELECT 
  USING (true);

-- Add indexes for better performance
CREATE INDEX idx_gallery_category ON public.gallery(category);
CREATE INDEX idx_gallery_featured ON public.gallery(is_featured) WHERE is_featured = true;
CREATE INDEX idx_gallery_display_order ON public.gallery(display_order);

-- Enable RLS policies for existing tables to make them publicly readable
-- (since these are public content pages)

-- Articles public read policy
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Articles are publicly readable" 
  ON public.articles 
  FOR SELECT 
  USING (status = 'published');

-- Resources public read policy  
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public resources are readable" 
  ON public.resources 
  FOR SELECT 
  USING (is_public = true);

-- Events public read policy
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events are publicly readable" 
  ON public.events 
  FOR SELECT 
  USING (true);

-- Add some sample gallery data
INSERT INTO public.gallery (title, description, image_url, category, tags, is_featured) VALUES
('Human Rights Workshop', 'Community workshop on legal rights awareness', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800', 'workshops', ARRAY['education', 'community'], true),
('Legal Aid Session', 'Providing free legal consultation to community members', 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=800', 'legal-aid', ARRAY['legal', 'consultation'], false),
('Youth Empowerment Program', 'Engaging young people in human rights advocacy', 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800', 'programs', ARRAY['youth', 'empowerment'], true),
('Community Meeting', 'Monthly community gathering to discuss local issues', 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800', 'meetings', ARRAY['community', 'discussion'], false),
('Women Rights Campaign', 'Advocating for gender equality and womens rights', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800', 'campaigns', ARRAY['women', 'rights'], true);
