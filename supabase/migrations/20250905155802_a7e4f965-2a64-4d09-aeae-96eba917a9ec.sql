-- Create files table to track user file metadata
CREATE TABLE public.files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  original_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for files
CREATE POLICY "Users can view their own files metadata" 
ON public.files 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own files metadata" 
ON public.files 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own files metadata" 
ON public.files 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files metadata" 
ON public.files 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_files_updated_at
BEFORE UPDATE ON public.files
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_files_user_id ON public.files(user_id);
CREATE INDEX idx_files_created_at ON public.files(created_at);
CREATE INDEX idx_files_file_name ON public.files(file_name);