import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { DocsSearch } from "@/components/docs/DocsSearch";
import { DocSection } from "@/components/docs/DocSection";
import { useDocs, type DocSection as DocSectionType } from "@/hooks/useDocs";
import { BookOpen, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Docs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("getting-started");
  const { docsContent, loading, error } = useDocs();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading documentation...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <Alert className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load documentation: {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Filter sections based on search query
  const filteredSections = docsContent.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.keywords.some(keyword => 
      keyword.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const currentSection = docsContent.find(section => section.id === activeSection) || docsContent[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Documentation
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete guide to using our AI-powered photo management platform
          </p>
        </header>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <DocsSearch 
            value={searchQuery}
            onChange={setSearchQuery}
            resultsCount={filteredSections.length}
          />
        </div>

        {/* Main Content */}
        <DocsLayout>
          <DocsNavigation
            sections={searchQuery ? filteredSections : docsContent}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            searchQuery={searchQuery}
          />
          
          <main className="flex-1">
            <DocSection 
              section={currentSection}
              searchQuery={searchQuery}
            />
          </main>
        </DocsLayout>
      </div>
    </div>
  );
}