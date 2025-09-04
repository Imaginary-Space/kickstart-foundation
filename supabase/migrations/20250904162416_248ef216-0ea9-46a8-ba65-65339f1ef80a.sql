-- Add priority column to feedback table for 1-5 star ratings
ALTER TABLE public.feedback 
ADD COLUMN priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5);

-- Add comment to explain the priority column
COMMENT ON COLUMN public.feedback.priority IS 'Priority rating from 1-5 stars (1=low, 5=high priority)';

-- Update existing feedback entries to have a default priority of 3
UPDATE public.feedback 
SET priority = 3 
WHERE priority IS NULL;