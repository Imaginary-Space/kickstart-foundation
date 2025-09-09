import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Smartphone, Upload, Cloud, HardDrive, Globe } from "lucide-react";

const preferencesSchema = z.object({
  notifications: z.boolean(),
  photoSources: z.array(z.string())
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

interface PreferencesStepProps {
  formData: { notifications: boolean; photoSources: string[] };
  updateFormData: (data: Partial<{ notifications: boolean; photoSources: string[] }>) => void;
}

const photoSourceOptions = [
  { id: "camera", label: "DSLR/Mirrorless Camera", icon: Camera },
  { id: "phone", label: "Smartphone Photos", icon: Smartphone },
  { id: "cloud", label: "Cloud Storage", icon: Cloud },
  { id: "local", label: "Local Computer", icon: HardDrive },
  { id: "web", label: "Web Downloads", icon: Globe },
  { id: "upload", label: "File Uploads", icon: Upload }
];

export default function PreferencesStep({ formData, updateFormData }: PreferencesStepProps) {
  const form = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      notifications: formData.notifications,
      photoSources: formData.photoSources
    }
  });

  const handleNotificationChange = (checked: boolean) => {
    updateFormData({ notifications: checked });
    form.setValue('notifications', checked);
  };

  const handlePhotoSourceChange = (sourceId: string, checked: boolean) => {
    const currentSources = formData.photoSources;
    const newSources = checked 
      ? [...currentSources, sourceId]
      : currentSources.filter(id => id !== sourceId);
    
    updateFormData({ photoSources: newSources });
    form.setValue('photoSources', newSources);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Set your preferences</h2>
        <p className="text-muted-foreground">
          Help us customize PhotoRenamer for your workflow
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-8">
          {/* Notifications */}
          <Card>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="notifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium">
                        Email notifications
                      </FormLabel>
                      <FormDescription>
                        Get notified about batch processing completion and important updates
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          handleNotificationChange(checked);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Photo Sources */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Photo sources</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select where you typically get your photos from (helps us optimize features)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {photoSourceOptions.map((source) => {
                const Icon = source.icon;
                const isChecked = formData.photoSources.includes(source.id);
                
                return (
                  <Card 
                    key={source.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isChecked ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handlePhotoSourceChange(source.id, !isChecked)}
                  >
                    <CardContent className="p-4 flex items-center space-x-3">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => 
                          handlePhotoSourceChange(source.id, checked as boolean)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">{source.label}</span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}