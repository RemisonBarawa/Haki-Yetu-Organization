
-- Extend profiles table with role-specific fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS office_location TEXT CHECK (office_location IN ('mombasa', 'kilifi', 'kwale'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Create signup workflow tracking table
CREATE TABLE IF NOT EXISTS public.signup_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 1,
  role_intent app_role,
  signup_data JSONB DEFAULT '{}',
  status TEXT CHECK (status IN ('pending', 'completed', 'requires_approval')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create approval requests table
CREATE TABLE IF NOT EXISTS public.approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  requested_role app_role NOT NULL,
  justification TEXT,
  supporting_documents JSONB DEFAULT '[]',
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create user preferences table for dashboard customization
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  dashboard_layout JSONB DEFAULT '{"cards": []}',
  theme_preferences JSONB DEFAULT '{}',
  notification_settings JSONB DEFAULT '{"email": true, "push": false}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.signup_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for signup_workflows
CREATE POLICY "Users can view their own signup workflow"
  ON public.signup_workflows
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own signup workflow"
  ON public.signup_workflows
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all signup workflows"
  ON public.signup_workflows
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for approval_requests
CREATE POLICY "Users can view their own approval requests"
  ON public.approval_requests
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create approval requests"
  ON public.approval_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and staff can view all approval requests"
  ON public.approval_requests
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Admins can update approval requests"
  ON public.approval_requests
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_preferences
CREATE POLICY "Users can manage their own preferences"
  ON public.user_preferences
  FOR ALL
  USING (auth.uid() = user_id);

-- Update the handle_new_user function to support the new workflow
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name')
  );
  
  -- Create signup workflow record
  INSERT INTO public.signup_workflows (user_id)
  VALUES (NEW.id);
  
  -- Create user preferences record
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  -- Don't assign default role immediately - let the signup flow handle it
  
  RETURN NEW;
END;
$$;
