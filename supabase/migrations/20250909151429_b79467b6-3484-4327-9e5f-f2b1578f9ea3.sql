-- Drop existing docs table if it exists
DROP TABLE IF EXISTS public.docs CASCADE;

-- Create docs table for dynamic documentation content
CREATE TABLE public.docs (
    id text PRIMARY KEY,
    title text NOT NULL,
    description text,
    category text NOT NULL,
    content text NOT NULL,
    sections jsonb DEFAULT '[]'::jsonb,
    example jsonb DEFAULT null,
    related_links jsonb DEFAULT '[]'::jsonb,
    keywords text[] DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    published boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.docs ENABLE ROW LEVEL SECURITY;

-- Create policies for docs access
CREATE POLICY "Docs are publicly readable" 
ON public.docs 
FOR SELECT 
USING (published = true);

CREATE POLICY "Admins can manage all docs" 
ON public.docs 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_docs_category ON public.docs(category);
CREATE INDEX idx_docs_published ON public.docs(published);
CREATE INDEX idx_docs_sort_order ON public.docs(sort_order);
CREATE INDEX idx_docs_keywords ON public.docs USING GIN(keywords);

-- Create trigger for updated_at
CREATE TRIGGER update_docs_updated_at
    BEFORE UPDATE ON public.docs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();