-- Enable realtime for photos table
ALTER TABLE public.photos REPLICA IDENTITY FULL;

-- Add photos table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.photos;