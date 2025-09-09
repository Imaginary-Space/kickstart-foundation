import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type DocSection } from "@/hooks/useDocs";
import { 
  FileText, 
  Upload, 
  Bot, 
  Users, 
  Settings, 
  Shield,
  Search,
  ChevronRight
} from "lucide-react";

interface DocsNavigationProps {
  sections: DocSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  searchQuery: string;
}

const categoryIcons = {
  "getting-started": FileText,
  "photo-upload": Upload,
  "photo-gallery": FileText,
  "ai-renaming": Bot,
  "photo-renamer": Settings,
  "profile": Users,
  "authentication": Shield,
  "user-roles": Users,
  "dashboard": FileText,
  "user-management": Users,
  "health-monitoring": Settings,
  "error-logs": FileText,
  "analytics": FileText,
  "api-endpoints": Settings,
  "file-processing": Settings,
  "database-schema": Settings,
  "troubleshooting": Settings,
};

export function DocsNavigation({ 
  sections, 
  activeSection, 
  onSectionChange, 
  searchQuery 
}: DocsNavigationProps) {
  // Group sections by category
  const groupedSections = sections.reduce((acc, section) => {
    if (!acc[section.category]) {
      acc[section.category] = [];
    }
    acc[section.category].push(section);
    return acc;
  }, {} as Record<string, DocSection[]>);

  const categoryOrder = [
    "Getting Started",
    "Photo Management", 
    "User Account",
    "Admin Features",
    "Technical"
  ];

  return (
    <aside className="w-80 shrink-0">
      <Card className="sticky top-6">
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="p-4">
              {searchQuery && (
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Search Results</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Found {sections.length} result{sections.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </p>
                </div>
              )}

              {categoryOrder.map(category => {
                const categorySections = groupedSections[category];
                if (!categorySections?.length) return null;

                return (
                  <div key={category} className="mb-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {category}
                    </h3>
                    <div className="space-y-1">
                      {categorySections.map(section => {
                        const Icon = categoryIcons[section.id as keyof typeof categoryIcons] || FileText;
                        const isActive = section.id === activeSection;
                        
                        return (
                          <Button
                            key={section.id}
                            variant="ghost"
                            className={`w-full justify-start h-auto p-3 text-left ${
                              isActive 
                                ? "bg-primary/10 text-primary border-l-2 border-primary" 
                                : "hover:bg-muted/50"
                            }`}
                            onClick={() => onSectionChange(section.id)}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <Icon className="h-4 w-4 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">{section.title}</div>
                                {section.description && (
                                  <div className="text-xs text-muted-foreground truncate">
                                    {section.description}
                                  </div>
                                )}
                              </div>
                              {isActive && <ChevronRight className="h-4 w-4 shrink-0" />}
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {searchQuery && Object.keys(groupedSections).length === 0 && (
                <div className="text-center py-8">
                  <Search className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No results found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </aside>
  );
}