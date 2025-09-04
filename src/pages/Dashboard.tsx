import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { FileDropZone } from "@/components/PhotoRenamer/FileDropZone";
import { usePhotoRenamer } from "@/hooks/usePhotoRenamer";
import { usePhotoGallery } from "@/hooks/usePhotoGallery";
import PhotoGallery from "@/components/PhotoGallery";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const { uploadPhoto, loading } = usePhotoGallery();

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        await uploadPhoto(file);
      }
    }
  };

  const noOpFunction = () => {};

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 p-6 relative">
      {/* Glass orb background */}
      <div className="orb-background">
        <div className="extra-orb-1"></div>
        <div className="extra-orb-2"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="glass-header rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Bienvenido, {user?.email}</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              className="glass flex items-center gap-2 hover:bg-background/20"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="w-full mb-8">
          <FileDropZone
            onFiles={handleFiles}
            isProcessing={loading}
            progress={0}
            fileCount={0}
            onSelectAll={noOpFunction}
            onDeselectAll={noOpFunction}
            onClearAll={noOpFunction}
            previewMode="grid"
            onPreviewModeChange={noOpFunction}
          />
        </div>

        {/* Photo Gallery */}
        <PhotoGallery className="glass-card border-0" />
      </div>

  
    </div>
  );
};

export default Dashboard;