import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Shield, Settings } from "lucide-react";
import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FileDropZone as PhotoFileDropZone } from "@/components/PhotoRenamer/FileDropZone";
import { usePhotoRenamer } from "@/hooks/usePhotoRenamer";
import { usePhotoGalleryWithCache } from "@/hooks/usePhotoGalleryWithCache";
import { useFileGallery } from "@/hooks/useFileGallery";
import { useUserRole } from "@/hooks/useUserRole";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import PhotoGallery from "@/components/PhotoGallery";
import FileGallery from "@/components/FileGallery";
import FileDropZone from "@/components/FileDropZone";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { isAdmin, roles, loading: roleLoading } = useUserRole();
  const { subscribed, subscription_tier, subscription_end, loading: subscriptionLoading, openCustomerPortal } = useSubscription();
  const { toast } = useToast();
  
  const { uploadPhoto, loading: photoLoading } = usePhotoGalleryWithCache();
  const { uploadFile, loading: fileLoading } = useFileGallery();

  const handlePhotoFiles = async (files: File[]) => {
    // Check subscription status and apply limits for free users
    if (!subscribed && files.length > 2) {
      toast({
        title: "Upload Limit Reached",
        description: "Free users can only upload 2 photos at a time. Upgrade to a paid plan for unlimited uploads.",
        variant: "destructive",
      });
      return;
    }

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
              
              <Drawer>
                <DrawerTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>User Settings</DrawerTitle>
                    <DrawerDescription>
                      Manage your account preferences and settings
                    </DrawerDescription>
                  </DrawerHeader>
                  
                  <div className="px-4 pb-4 space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Account Information</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>Email: {user?.email}</p>
                        <p>User ID: {user?.id}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Subscription Status</h4>
                      {subscriptionLoading ? (
                        <p className="text-sm text-muted-foreground">Loading subscription...</p>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-sm">
                            <div className="flex items-center gap-2">
                              <span>Status:</span>
                              <Badge variant={subscribed ? "default" : "secondary"}>
                                {subscribed ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            {subscription_tier && (
                              <p className="text-muted-foreground">Plan: {subscription_tier}</p>
                            )}
                            {subscription_end && (
                              <p className="text-muted-foreground">
                                Expires: {new Date(subscription_end).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full justify-start"
                            onClick={openCustomerPortal}
                          >
                            Manage Subscription
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Preferences</h4>
                      <div className="space-y-2">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          Change Password
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          Notification Settings
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          Privacy Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="ghost">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
              
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
              <p className="text-sm text-muted-foreground">
                {subscribed 
                  ? "Drag and drop unlimited photos to get started" 
                  : "Drag and drop your photos to get started (2 photos max for free users)"
                }
              </p>
            </div>
            
            {/* Unlimited Upload Badge for Paid Users */}
            {subscribed && (
              <div className="mb-4">
                <Badge 
                  variant="default" 
                  className="bg-green-100 text-green-700 hover:bg-green-200 border border-green-200 flex items-center gap-2 w-fit"
                >
                  ✨ Unlimited Dropzone Activated
                </Badge>
              </div>
            )}
            
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