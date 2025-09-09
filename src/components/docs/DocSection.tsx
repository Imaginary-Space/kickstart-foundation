import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InteractiveExample } from "./InteractiveExample";
import { type DocSection as DocSectionType } from "@/hooks/useDocs";
import { 
  BookOpen, 
  ExternalLink, 
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb
} from "lucide-react";

interface DocSectionProps {
  section: DocSectionType;
  searchQuery?: string;
}

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-primary/20 text-primary font-medium rounded px-1">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

export function DocSection({ section, searchQuery = "" }: DocSectionProps) {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">
              {highlightText(section.title, searchQuery)}
            </h1>
            <Badge variant="secondary" className="mt-2">
              {section.category}
            </Badge>
          </div>
        </div>
        
        {section.description && (
          <p className="text-lg text-muted-foreground">
            {highlightText(section.description, searchQuery)}
          </p>
        )}
      </div>

      {/* Table of Contents */}
      {section.sections && section.sections.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5" />
              On this page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {section.sections.map((subsection, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="justify-start h-auto p-2 text-sm"
                  onClick={() => {
                    const element = document.getElementById(`section-${index}`);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {subsection.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="space-y-8">
        {/* Overview content */}
        <Card>
          <CardContent className="p-6">
            <div className="prose prose-slate max-w-none">
              <div dangerouslySetInnerHTML={{ 
                __html: highlightText(section.content, searchQuery)
                  .toString()
                  .replace(/\n/g, '<br/>')
              }} />
            </div>
          </CardContent>
        </Card>

        {/* Interactive Example */}
        {section.example && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Interactive Example
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InteractiveExample example={section.example} />
            </CardContent>
          </Card>
        )}

        {/* Detailed Sections */}
        {section.sections?.map((subsection, index) => (
          <Card key={index} id={`section-${index}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                {highlightText(subsection.title, searchQuery)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-slate max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: highlightText(subsection.content, searchQuery)
                    .toString()
                    .replace(/\n/g, '<br/>')
                }} />
              </div>

              {subsection.steps && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Step-by-step guide:</h4>
                  <div className="space-y-2">
                    {subsection.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {stepIndex + 1}
                        </div>
                        <div className="flex-1">
                          <div dangerouslySetInnerHTML={{ 
                            __html: highlightText(step, searchQuery)
                              .toString()
                              .replace(/\n/g, '<br/>')
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {subsection.tips && subsection.tips.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Tips</span>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {subsection.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{highlightText(tip, searchQuery)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {subsection.warnings && subsection.warnings.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="font-medium text-amber-800">Important</span>
                  </div>
                  <ul className="text-sm text-amber-700 space-y-1">
                    {subsection.warnings.map((warning, warningIndex) => (
                      <li key={warningIndex} className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">⚠</span>
                        <span>{highlightText(warning, searchQuery)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Related Links */}
        {section.relatedLinks && section.relatedLinks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Related Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {section.relatedLinks.map((link, index) => (
                  <Button 
                    key={index}
                    variant="ghost" 
                    className="justify-start h-auto p-3"
                  >
                    <div className="text-left">
                      <div className="font-medium">{link.title}</div>
                      <div className="text-xs text-muted-foreground">{link.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Keywords */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Related topics:</span>
          {section.keywords.map((keyword, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}