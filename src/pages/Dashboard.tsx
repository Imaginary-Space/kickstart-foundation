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
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
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
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
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
        <PhotoGallery />
      </div>

  
    </div>
  );
};

export default Dashboard;