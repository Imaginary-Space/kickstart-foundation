import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Shield } from "lucide-react";
import { FileDropZone as PhotoFileDropZone } from "@/components/PhotoRenamer/FileDropZone";
import { usePhotoRenamer } from "@/hooks/usePhotoRenamer";
import { usePhotoGalleryWithCache } from "@/hooks/usePhotoGalleryWithCache";
import { useFileGallery } from "@/hooks/useFileGallery";
import { useUserRole } from "@/hooks/useUserRole";
import PhotoGallery from "@/components/PhotoGallery";
import FileGallery from "@/components/FileGallery";
import FileDropZone from "@/components/FileDropZone";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { isAdmin, roles, loading: roleLoading } = useUserRole();
  
  const { uploadPhoto, loading: photoLoading } = usePhotoGalleryWithCache();
  const { uploadFile, loading: fileLoading } = useFileGallery();

  const handlePhotoFiles = async (files: File[]) => {
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        await uploadPhoto(file);
      }
    }
  };

  const handleGeneralFiles = async (files: File[]) => {
    for (const file of files) {
      await uploadFile(file);
    }
  };

  const noOpFunction = () => {};

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {!roleLoading && roles.length > 0 && (
                <div className="flex gap-1">
                  {roles.map(role => (
                    <Badge 
                      key={role} 
                      variant={role === 'admin' ? 'destructive' : 'secondary'}
                      className="text-xs capitalize"
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              )}
              
              {isAdmin() && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => navigate('/admin')}
                  className="gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 py-8 space-y-8">
          {/* Upload Section */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-medium">Upload Photos</h2>
              <p className="text-sm text-muted-foreground">Drag and drop your photos to get started</p>
            </div>
            <PhotoFileDropZone
              onFiles={handlePhotoFiles}
              isProcessing={photoLoading}
              progress={0}
              fileCount={0}
              onSelectAll={noOpFunction}
              onDeselectAll={noOpFunction}
              onClearAll={noOpFunction}
              previewMode="grid"
              onPreviewModeChange={noOpFunction}
            />
          </section>

          {/* Gallery Section */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-medium">Your Photos</h2>
              <p className="text-sm text-muted-foreground">Manage and organize your uploaded photos</p>
            </div>
            <PhotoGallery />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;