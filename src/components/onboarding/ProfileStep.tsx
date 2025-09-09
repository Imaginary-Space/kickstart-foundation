import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const profileSchema = z.object({
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  useCase: z.string().optional()
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileStepProps {
  formData: { jobTitle: string; company: string; useCase: string };
  updateFormData: (data: Partial<{ jobTitle: string; company: string; useCase: string }>) => void;
}

const useCaseOptions = [
  "Personal photo organization",
  "Professional photography",
  "Business asset management", 
  "Family photo collection",
  "Travel documentation",
  "Event photography",
  "Social media content",
  "Other"
];

export default function ProfileStep({ formData, updateFormData }: ProfileStepProps) {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      jobTitle: formData.jobTitle,
      company: formData.company,
      useCase: formData.useCase
    }
  });

  const handleFieldChange = (field: keyof ProfileFormData, value: string) => {
    updateFormData({ [field]: value });
    form.setValue(field, value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Tell us about yourself</h2>
        <p className="text-muted-foreground">
          This helps us personalize your experience (optional)
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Photographer, Marketing Manager"
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange('jobTitle', e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Acme Studios, Freelance"
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange('company', e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="useCase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary use case</FormLabel>
                <Select 
                  value={field.value} 
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleFieldChange('useCase', value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="How do you plan to use PhotoRenamer?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {useCaseOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">
              💡 <span className="font-medium">Pro tip:</span> This information helps us suggest better naming patterns and features for your workflow.
            </p>
          </div>
        </div>
      </Form>
    </div>
  );
}