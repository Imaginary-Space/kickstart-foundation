import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Sparkles, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category: string;
  relevance_score: number;
  snippet: string;
  content_preview: string;
}

interface AIDocsSearchProps {
  onSelectDoc: (docId: string) => void;
}

export function AIDocsSearch({ onSelectDoc }: AIDocsSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { toast } = useToast();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const resultsRef = useRef<HTMLDivElement>(null);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-docs-search', {
        body: { query: searchQuery }
      });

      if (error) throw error;

      setResults(data.results || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search documentation. Please try again.",
        variant: "destructive",
      });
      setResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 500);
  };

  const handleSelectResult = (result: SearchResult) => {
    onSelectDoc(result.id);
    setShowResults(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelectResult(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setSelectedIndex(-1);
    }
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={resultsRef}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Sparkles className="h-4 w-4 text-primary" />
          )}
        </div>
        
        <Input
          type="text"
          placeholder="I am looking for..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-12 pr-4 h-12 text-base bg-background/50 backdrop-blur-sm border-border/50 focus:bg-background/80 focus:border-primary/50 transition-all duration-200"
        />
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={result.id}
              onClick={() => handleSelectResult(result)}
              className={`w-full text-left p-4 border-b border-border/30 last:border-b-0 hover:bg-muted/50 transition-colors ${
                index === selectedIndex ? 'bg-muted/70' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm text-foreground truncate">
                      {result.title}
                    </h4>
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      {Math.round(result.relevance_score)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
                    {result.snippet}
                  </p>
                  <p className="text-xs text-muted-foreground/70 line-clamp-2">
                    {result.content_preview}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && !isSearching && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg z-50 p-4 text-center">
          <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Try a different search term or browse the documentation below.</p>
        </div>
      )}
    </div>
  );
}