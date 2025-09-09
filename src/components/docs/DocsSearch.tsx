import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocsSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultsCount?: number;
}

export function DocsSearch({ value, onChange, resultsCount }: DocsSearchProps) {
  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search documentation..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 pr-20"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {value && resultsCount !== undefined && (
        <div className="absolute top-full left-0 right-0 mt-2 z-10">
          <Badge variant="secondary" className="text-xs">
            {resultsCount} result{resultsCount !== 1 ? 's' : ''}
          </Badge>
        </div>
      )}
    </div>
  );
}