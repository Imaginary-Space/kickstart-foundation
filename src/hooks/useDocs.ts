import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DocSection {
  id: string;
  title: string;
  description?: string;
  category: string;
  content: string;
  sections?: DocSubsection[];
  example?: ExampleType;
  relatedLinks?: Array<{
    title: string;
    description: string;
    id: string;
  }>;
  keywords: string[];
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocSubsection {
  title: string;
  content: string;
  steps?: string[];
  tips?: string[];
  warnings?: string[];
}

export interface ExampleType {
  type: 'photo-upload' | 'renaming-pattern' | 'gallery-view' | 'admin-panel';
  title: string;
  description: string;
  steps: string[];
}

export const useDocs = () => {
  const [docsContent, setDocsContent] = useState<DocSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('docs')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true });

      if (error) {
        throw error;
      }

      // Transform the data to match our interface
      const transformedData: DocSection[] = data.map(doc => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        category: doc.category,
        content: doc.content,
        sections: Array.isArray(doc.sections) ? (doc.sections as unknown as DocSubsection[]) : [],
        example: doc.example ? (doc.example as unknown as ExampleType) : undefined,
        relatedLinks: Array.isArray(doc.related_links) ? (doc.related_links as unknown as Array<{title: string; description: string; id: string;}>) : [],
        keywords: Array.isArray(doc.keywords) ? doc.keywords : [],
        sort_order: doc.sort_order,
        published: doc.published,
        created_at: doc.created_at,
        updated_at: doc.updated_at
      }));

      setDocsContent(transformedData);
    } catch (err) {
      console.error('Error fetching docs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch documentation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return {
    docsContent,
    loading,
    error,
    refetch: fetchDocs
  };
};