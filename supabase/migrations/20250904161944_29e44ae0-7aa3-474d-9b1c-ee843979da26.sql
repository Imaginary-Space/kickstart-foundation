-- Drop the existing restrictive policy for viewing feedback
DROP POLICY "Users can view their own feedback" ON public.feedback;

-- Create a new policy that allows all authenticated users to view feedback
CREATE POLICY "Authenticated users can view all feedback" 
ON public.feedback 
FOR SELECT 
TO authenticated
USING (true);