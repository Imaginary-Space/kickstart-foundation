-- Remove the dangerous public access policy
DROP POLICY "Anyone can view emails" ON public.emails;

-- Add user_id columns to track ownership and access
ALTER TABLE public.emails 
ADD COLUMN sender_user_id UUID REFERENCES auth.users(id),
ADD COLUMN recipient_user_id UUID REFERENCES auth.users(id);

-- Create secure RLS policies for email access
CREATE POLICY "Users can view emails they sent" 
ON public.emails 
FOR SELECT 
USING (auth.uid() = sender_user_id);

CREATE POLICY "Users can view emails sent to them" 
ON public.emails 
FOR SELECT 
USING (auth.uid() = recipient_user_id);

-- Create policies for email operations
CREATE POLICY "Users can insert emails they send" 
ON public.emails 
FOR INSERT 
WITH CHECK (auth.uid() = sender_user_id);

CREATE POLICY "Users can update emails they sent" 
ON public.emails 
FOR UPDATE 
USING (auth.uid() = sender_user_id);

-- Create enum for user roles (if not exists)
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION 
    WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table for proper role management
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    );
$$;

-- Allow admins to view all emails for moderation purposes
CREATE POLICY "Admins can view all emails" 
ON public.emails 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Update existing fake data to be less realistic and add demo prefix
UPDATE public.emails 
SET 
    sender_email = 'demo' || substr(id::text, 1, 8) || '@example.com',
    recipient_email = 'user' || substr(id::text, 1, 8) || '@example.com',
    body = '[DEMO DATA] ' || body
WHERE sender_email LIKE '%@%';