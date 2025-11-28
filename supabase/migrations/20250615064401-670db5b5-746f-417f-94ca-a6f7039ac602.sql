
-- Create articles/news table for blog posts and updates
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create programs table for thematic areas
CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  thematic_area TEXT CHECK (thematic_area IN ('land_housing', 'gender_law', 'governance', 'cohesion')) NOT NULL,
  image TEXT,
  objectives TEXT[],
  activities TEXT[],
  status TEXT CHECK (status IN ('active', 'completed', 'planned')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create events table for community activities
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT NOT NULL,
  event_type TEXT CHECK (event_type IN ('workshop', 'seminar', 'community_meeting', 'training', 'other')) NOT NULL,
  max_participants INTEGER,
  registration_required BOOLEAN DEFAULT false,
  image TEXT,
  organizer_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')) DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create team members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  photo TEXT,
  email TEXT,
  phone TEXT,
  office_location TEXT CHECK (office_location IN ('mombasa', 'kilifi', 'kwale')),
  specializations TEXT[],
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create resources table for documents and guides
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  category TEXT CHECK (category IN ('legal_guide', 'case_study', 'report', 'form', 'other')) NOT NULL,
  tags TEXT[],
  is_public BOOLEAN DEFAULT true,
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for articles
CREATE POLICY "Anyone can view published articles"
  ON public.articles
  FOR SELECT
  USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "Staff and admins can manage articles"
  ON public.articles
  FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'staff') OR
    author_id = auth.uid()
  );

-- RLS Policies for programs
CREATE POLICY "Anyone can view active programs"
  ON public.programs
  FOR SELECT
  USING (status = 'active' OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins and staff can manage programs"
  ON public.programs
  FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'staff')
  );

-- RLS Policies for events
CREATE POLICY "Anyone can view upcoming events"
  ON public.events
  FOR SELECT
  USING (status IN ('upcoming', 'ongoing') OR auth.uid() IS NOT NULL);

CREATE POLICY "Staff and admins can manage events"
  ON public.events
  FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'staff') OR
    organizer_id = auth.uid()
  );

-- RLS Policies for team members
CREATE POLICY "Anyone can view active team members"
  ON public.team_members
  FOR SELECT
  USING (is_active = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage team members"
  ON public.team_members
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for resources
CREATE POLICY "Anyone can view public resources"
  ON public.resources
  FOR SELECT
  USING (is_public = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Staff and admins can manage resources"
  ON public.resources
  FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'staff') OR
    uploaded_by = auth.uid()
  );

-- Create storage bucket for content files
INSERT INTO storage.buckets (id, name, public) VALUES ('content', 'content', true);

-- Storage policies for content bucket
CREATE POLICY "Anyone can view content files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'content');

CREATE POLICY "Authenticated users can upload content files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'content');

CREATE POLICY "Users can update their own content files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'content' AND auth.uid()::text = (storage.foldername(name))[1]);
