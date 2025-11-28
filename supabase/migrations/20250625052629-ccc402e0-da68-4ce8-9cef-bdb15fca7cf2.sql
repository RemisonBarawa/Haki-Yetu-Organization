
-- Create citizens table for lighter authentication
CREATE TABLE public.citizens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create citizen_posts table
CREATE TABLE public.citizen_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  citizen_id UUID REFERENCES public.citizens(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'pending',
  location TEXT,
  priority TEXT DEFAULT 'normal',
  staff_response TEXT,
  responded_by UUID,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create post_interactions table (likes, reports, etc.)
CREATE TABLE public.post_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  citizen_id UUID REFERENCES public.citizens(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.citizen_posts(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- 'like', 'report', 'support'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(citizen_id, post_id, interaction_type)
);

-- Create post_comments table
CREATE TABLE public.post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  citizen_id UUID REFERENCES public.citizens(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.citizen_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for citizens table
CREATE POLICY "Citizens can view all citizens" ON public.citizens FOR SELECT USING (true);
CREATE POLICY "Anyone can insert citizens" ON public.citizens FOR INSERT WITH CHECK (true);
CREATE POLICY "Citizens can update their own data" ON public.citizens FOR UPDATE USING (true);

-- RLS Policies for citizen_posts table
CREATE POLICY "Everyone can view published posts" ON public.citizen_posts FOR SELECT USING (status = 'published' OR status = 'responded');
CREATE POLICY "Staff can view all posts" ON public.citizen_posts FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);
CREATE POLICY "Anyone can insert posts" ON public.citizen_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can update posts" ON public.citizen_posts FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

-- RLS Policies for post_interactions table
CREATE POLICY "Everyone can view interactions" ON public.post_interactions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert interactions" ON public.post_interactions FOR INSERT WITH CHECK (true);

-- RLS Policies for post_comments table
CREATE POLICY "Everyone can view comments" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert comments" ON public.post_comments FOR INSERT WITH CHECK (true);
