-- Create jobs table for tracking batch operations
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  job_type TEXT NOT NULL, -- 'batch_ai_analysis'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  progress INTEGER DEFAULT 0, -- 0-100
  total_items INTEGER NOT NULL,
  processed_items INTEGER DEFAULT 0,
  input_data JSONB NOT NULL, -- photo IDs and settings
  output_data JSONB DEFAULT '{}', -- results
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create photo_tags table for storing AI-generated and user tags
CREATE TABLE public.photo_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id UUID NOT NULL REFERENCES public.photos(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  confidence FLOAT DEFAULT 1.0,
  source TEXT DEFAULT 'ai', -- 'ai', 'user'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add analysis fields to photos table
ALTER TABLE public.photos ADD COLUMN 
  ai_description TEXT,
  ai_generated_tags TEXT[],
  analysis_completed_at TIMESTAMP WITH TIME ZONE;

-- Enable RLS on jobs table
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for jobs table
CREATE POLICY "Users can view their own jobs" 
ON public.jobs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own jobs" 
ON public.jobs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs" 
ON public.jobs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jobs" 
ON public.jobs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Enable RLS on photo_tags table
ALTER TABLE public.photo_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for photo_tags table
CREATE POLICY "Users can view tags for their own photos" 
ON public.photo_tags 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.photos 
    WHERE photos.id = photo_tags.photo_id 
    AND photos.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create tags for their own photos" 
ON public.photo_tags 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.photos 
    WHERE photos.id = photo_tags.photo_id 
    AND photos.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update tags for their own photos" 
ON public.photo_tags 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.photos 
    WHERE photos.id = photo_tags.photo_id 
    AND photos.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete tags for their own photos" 
ON public.photo_tags 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.photos 
    WHERE photos.id = photo_tags.photo_id 
    AND photos.user_id = auth.uid()
  )
);

-- Create trigger for updating jobs updated_at timestamp
CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_jobs_user_id_status ON public.jobs(user_id, status);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX idx_photo_tags_photo_id ON public.photo_tags(photo_id);
CREATE INDEX idx_photo_tags_tag ON public.photo_tags(tag);

-- Enable realtime for jobs table
ALTER TABLE public.jobs REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.jobs;