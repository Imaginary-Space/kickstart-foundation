-- Add missing admin policies for profiles table (avoiding duplicates)

-- Check if policy exists and create if not for INSERT
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Admins can insert any profile'
    ) THEN
        CREATE POLICY "Admins can insert any profile" 
        ON public.profiles 
        FOR INSERT 
        WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
    END IF;
END $$;

-- Check if policy exists and create if not for DELETE
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Admins can delete any profile'
    ) THEN
        CREATE POLICY "Admins can delete any profile" 
        ON public.profiles 
        FOR DELETE 
        USING (has_role(auth.uid(), 'admin'::app_role));
    END IF;
END $$;