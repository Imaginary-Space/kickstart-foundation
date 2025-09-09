import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileImage, 
  Wand2, 
  FolderOpen, 
  Settings, 
  Users, 
  Shield,
  BookOpen,
  Zap
} from "lucide-react";
import { type DocSection } from "@/hooks/useDocs";

interface FeaturedArticlesProps {
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

const iconMap = {
  "getting-started": BookOpen,
  "photo-upload": FileImage,
  "ai-renaming": Wand2,
  "batch-processing": FolderOpen,
  "user-management": Users,
  "troubleshooting": Settings,
  "authentication": Shield,
  "admin-features": Zap
};

const colorMap = {
  "getting-started": "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50",
  "photo-upload": "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800/50",
  "ai-renaming": "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/50",
  "batch-processing": "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800/50",
  "user-management": "bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800/50",
  "troubleshooting": "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50",
  "authentication": "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/50",
  "admin-features": "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800/50"
};

export function FeaturedArticles({ sections, onSectionClick }: FeaturedArticlesProps) {
  const featuredSections = sections.filter(section => 
    featuredSectionIds.includes(section.id)
  );

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Featured Guides</h2>
        <p className="text-xl text-muted-foreground">
          Get started with the most important features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredSections.map((section) => {
          const IconComponent = iconMap[section.id as keyof typeof iconMap] || BookOpen;
          const colorClasses = colorMap[section.id as keyof typeof colorMap] || "bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-800/50";
          
          return (
            <Card 
              key={section.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 ${colorClasses}`}
              onClick={() => onSectionClick(section.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-background/50 border">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {section.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm line-clamp-3">
                  {section.description}
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-3">
                  {section.keywords.slice(0, 3).map((keyword) => (
                    <Badge 
                      key={keyword} 
                      variant="outline" 
                      className="text-xs px-2 py-0.5"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}