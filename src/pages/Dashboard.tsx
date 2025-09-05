import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Shield } from "lucide-react";
import { FileDropZone as PhotoFileDropZone } from "@/components/PhotoRenamer/FileDropZone";
import { usePhotoRenamer } from "@/hooks/usePhotoRenamer";
import { usePhotoGallery } from "@/hooks/usePhotoGallery";
import { useFileGallery } from "@/hooks/useFileGallery";
import { useUserRole } from "@/hooks/useUserRole";
import PhotoGallery from "@/components/PhotoGallery";
import FileGallery from "@/components/FileGallery";
import FileDropZone from "@/components/FileDropZone";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { isAdmin, roles, loading: roleLoading } = useUserRole();
  
  const { uploadPhoto, loading: photoLoading } = usePhotoGallery();
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
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">Bienvenido, {user?.email}</p>
                  {!roleLoading && roles.length > 0 && (
                    <div className="flex gap-1">
                      {roles.map(role => (
                        <Badge 
                          key={role} 
                          variant={role === 'admin' ? 'destructive' : role === 'moderator' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isAdmin() && (
                <Button 
                  variant="default" 
                  onClick={() => navigate('/admin')}
                  className="glass flex items-center gap-2 hover:bg-background/20"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Button>
              )}
              
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
        </div>

        {/* Photo Upload */}
        <div className="w-full mb-8">
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
        </div>

        {/* Photo Gallery */}
        <PhotoGallery className="glass-card border-0 mb-8" />

        {/* General File Upload */}
        <div className="w-full mb-8">
          <FileDropZone
            onFiles={handleGeneralFiles}
            isProcessing={fileLoading}
          />
        </div>

        {/* File Gallery */}
        <FileGallery className="glass-card border-0" />
      </div>

  
    </div>
  );
};

export default Dashboard;