-- Create error type enum
CREATE TYPE public.error_type AS ENUM (
  'upload_error',
  'processing_error', 
  'ai_error',
  'system_error',
  'auth_error',
  'network_error'
);

-- Create severity enum  
CREATE TYPE public.error_severity AS ENUM (
  'low',
  'medium', 
  'high',
  'critical'
);

-- Create error_logs table
CREATE TABLE public.error_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NULL,
  error_type error_type NOT NULL,
  operation TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_details JSONB NULL DEFAULT '{}',
  file_info JSONB NULL DEFAULT '{}',
  user_agent TEXT NULL,
  url TEXT NULL,
  severity error_severity NOT NULL DEFAULT 'medium',
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own error logs" 
ON public.error_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all error logs" 
ON public.error_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all error logs" 
ON public.error_logs 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can insert error logs" 
ON public.error_logs 
FOR INSERT 
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_error_logs_updated_at
BEFORE UPDATE ON public.error_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_error_logs_user_id ON public.error_logs(user_id);
CREATE INDEX idx_error_logs_error_type ON public.error_logs(error_type);
CREATE INDEX idx_error_logs_created_at ON public.error_logs(created_at DESC);
CREATE INDEX idx_error_logs_severity ON public.error_logs(severity);