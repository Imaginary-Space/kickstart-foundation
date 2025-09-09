import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { DocsSearch } from "@/components/docs/DocsSearch";
import { DocSection } from "@/components/docs/DocSection";
import { FeaturedArticles } from "@/components/docs/FeaturedArticles";
import { UserGuides } from "@/components/docs/UserGuides";
import { useDocs, type DocSection as DocSectionType } from "@/hooks/useDocs";
import { BookOpen, Loader2, AlertCircle, Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Docs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
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

  const currentSection = activeSection ? docsContent.find(section => section.id === activeSection) : null;
  const isHomepage = !activeSection;

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setShowSearch(false);
  };

  const handleBackToHome = () => {
    setActiveSection(null);
    setSearchQuery("");
    setShowSearch(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Glass Header */}
      <header className="glass-header sticky top-0 z-40">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={handleBackToHome}
              >
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Documentation Hub
                  </h1>
                  {activeSection && (
                    <p className="text-sm text-muted-foreground">
                      {currentSection?.title}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {!showSearch && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSearch(true)}
                  className="gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search docs
                </Button>
              )}
              {showSearch && (
                <div className="w-80">
                  <DocsSearch 
                    value={searchQuery}
                    onChange={setSearchQuery}
                    resultsCount={filteredSections.length}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {isHomepage ? (
          // Homepage View
          <div className="space-y-16">
            <div className="text-center space-y-4 py-8">
              <h2 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Welcome to Our Docs
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Everything you need to master our AI-powered photo management platform. 
                From getting started to advanced features.
              </p>
            </div>

            {searchQuery ? (
              // Search Results
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">
                  Search Results ({filteredSections.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSections.map((section) => (
                    <div
                      key={section.id}
                      className="glass-card p-6 cursor-pointer transition-all duration-300 hover:shadow-elegant hover:-translate-y-1"
                      onClick={() => handleSectionClick(section.id)}
                    >
                      <h4 className="font-semibold text-foreground mb-2">
                        {section.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {section.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {section.keywords.slice(0, 2).map((keyword) => (
                          <span
                            key={keyword}
                            className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Homepage Content
              <>
                <FeaturedArticles 
                  sections={docsContent} 
                  onSectionClick={handleSectionClick}
                />
                <UserGuides 
                  sections={docsContent} 
                  onSectionClick={handleSectionClick}
                />
              </>
            )}
          </div>
        ) : (
          // Individual Document View
          <DocsLayout>
            <DocsNavigation
              sections={docsContent}
              activeSection={activeSection || ""}
              onSectionChange={handleSectionClick}
              searchQuery=""
              onBackToHome={handleBackToHome}
            />
            
            <main className="flex-1">
              {currentSection && (
                <DocSection 
                  section={currentSection}
                  searchQuery={searchQuery}
                />
              )}
            </main>
          </DocsLayout>
        )}
      </div>
    </div>
  );
}