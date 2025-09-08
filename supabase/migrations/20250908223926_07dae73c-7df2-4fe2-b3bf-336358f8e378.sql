-- Add admin access policies for impersonation functionality

-- Photos: Allow admins to view/manage all photos
CREATE POLICY "Admins can view all photos" 
ON public.photos 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all photos" 
ON public.photos 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete all photos" 
ON public.photos 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Files: Allow admins to view/manage all files
CREATE POLICY "Admins can view all files" 
ON public.files 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all files" 
ON public.files 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete all files" 
ON public.files 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Jobs: Allow admins to view/manage all jobs
CREATE POLICY "Admins can view all jobs" 
ON public.jobs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all jobs" 
ON public.jobs 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete all jobs" 
ON public.jobs 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Todos: Allow admins to view/manage all todos
CREATE POLICY "Admins can view all todos" 
ON public.todos 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all todos" 
ON public.todos 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete all todos" 
ON public.todos 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Photo Tags: Allow admins to view/manage all photo tags
CREATE POLICY "Admins can view all photo tags" 
ON public.photo_tags 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all photo tags" 
ON public.photo_tags 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete all photo tags" 
ON public.photo_tags 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));