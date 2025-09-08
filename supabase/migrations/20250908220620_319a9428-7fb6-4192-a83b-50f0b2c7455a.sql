-- Create names table for the random name API
CREATE TABLE public.names (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  label text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Insert some sample names for demo
INSERT INTO public.names (label) VALUES 
  ('Aurora'),
  ('Phoenix'),
  ('Atlas'),
  ('Luna'),
  ('Nova'),
  ('Zephyr'),
  ('Iris'),
  ('Cosmos'),
  ('Sage'),
  ('River'),
  ('Echo'),
  ('Storm'),
  ('Vale'),
  ('Orion'),
  ('Willow');

-- Enable RLS
ALTER TABLE public.names ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read names (public demo data)
CREATE POLICY "Names are publicly readable" 
ON public.names 
FOR SELECT 
USING (true);