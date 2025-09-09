import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type DocSection } from "@/hooks/useDocs";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Upload, 
  Bot, 
  Users, 
  Settings, 
  Shield,
  Search,
  ChevronRight,
  BookOpen
} from "lucide-react";

interface DocsNavigationProps {
  sections: DocSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  searchQuery?: string;
  onBackToHome?: () => void;
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
  searchQuery = "",
  onBackToHome
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
    <aside className="w-80 flex-shrink-0">
      <Card className="glass-card sticky top-8 max-h-[calc(100vh-4rem)]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-primary" />
              Navigation
            </CardTitle>
            {onBackToHome && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToHome}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ← Back to Hub
              </Button>
            )}
          </div>
          {searchQuery && (
            <Badge variant="secondary" className="w-fit">
              {sections.length} result{sections.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="px-6 pb-6 space-y-4">
              {Object.entries(groupedSections).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No sections found</p>
                </div>
              ) : (
                categoryOrder.map(category => {
                  const categorySections = groupedSections[category];
                  if (!categorySections?.length) return null;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground px-2 py-2 bg-secondary/50 rounded-lg">
                        <FileText className="h-4 w-4 text-primary" />
                        {category}
                      </div>
                      <div className="space-y-1 ml-2">
                        {categorySections.map((section) => {
                          const isActive = section.id === activeSection;
                          return (
                            <Button
                              key={section.id}
                              variant="ghost"
                              className={cn(
                                "w-full justify-start text-left h-auto p-3 font-normal rounded-lg transition-all duration-200",
                                isActive 
                                  ? "bg-primary/10 text-primary font-medium border border-primary/20" 
                                  : "hover:bg-secondary/80"
                              )}
                              onClick={() => onSectionChange(section.id)}
                            >
                              <div className="text-left">
                                <div className="font-medium text-sm leading-tight">
                                  {section.title}
                                </div>
                                {section.description && (
                                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {section.description}
                                  </div>
                                )}
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </aside>
  );
}