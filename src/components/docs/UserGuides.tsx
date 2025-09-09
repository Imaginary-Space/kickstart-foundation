import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  FileText, 
  Code, 
  HelpCircle,
  ChevronRight
} from "lucide-react";
import { type DocSection } from "@/hooks/useDocs";

interface UserGuidesProps {
  sections: DocSection[];
  onSectionClick: (sectionId: string) => void;
}

const featuredSectionIds = [
  "getting-started",
  "photo-upload", 
  "ai-renaming",
  "batch-processing",
  "user-management",
  "troubleshooting"
];

export function UserGuides({ sections, onSectionClick }: UserGuidesProps) {
  const userGuideSections = sections.filter(section => 
    !featuredSectionIds.includes(section.id)
  );

  const groupedSections = userGuideSections.reduce((acc, section) => {
    const category = section.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(section);
    return acc;
  }, {} as Record<string, DocSection[]>);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'api':
      case 'technical':
        return Code;
      case 'help':
      case 'support':
        return HelpCircle;
      case 'guides':
        return BookOpen;
      default:
        return FileText;
    }
  };

  if (Object.keys(groupedSections).length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Additional Resources</h2>
        <p className="text-lg text-muted-foreground">
          Explore more detailed documentation and guides
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Object.entries(groupedSections).map(([category, categorySections]) => {
          const IconComponent = getCategoryIcon(category);
          
          return (
            <Card 
              key={category}
              className="glass-card border-border/50"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{category}</CardTitle>
                    <CardDescription>
                      {categorySections.length} guide{categorySections.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {categorySections.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50 cursor-pointer transition-all duration-200 hover:bg-background/80 hover:border-primary/30 group"
                    onClick={() => onSectionClick(section.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {section.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {section.description}
                      </p>
                      <div className="flex gap-1 mt-2">
                        {section.keywords.slice(0, 2).map((keyword) => (
                          <Badge 
                            key={keyword} 
                            variant="outline" 
                            className="text-xs px-2 py-0.5"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-3 flex-shrink-0" />
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}