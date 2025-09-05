-- Add DELETE policy for error logs - admins can delete all error logs
CREATE POLICY "Admins can delete all error logs" 
ON public.error_logs 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));