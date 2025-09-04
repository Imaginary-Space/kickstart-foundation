-- Add admin access policy for waitlist management
CREATE POLICY "Admins can view waitlist" 
ON public.waitlist 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policy for waitlist management (update/delete)
CREATE POLICY "Admins can manage waitlist" 
ON public.waitlist 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));