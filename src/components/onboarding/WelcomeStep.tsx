import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

const welcomeSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name")
});

type WelcomeFormData = z.infer<typeof welcomeSchema>;

interface WelcomeStepProps {
  formData: { fullName: string };
  updateFormData: (data: Partial<{ fullName: string }>) => void;
}

export default function WelcomeStep({ formData, updateFormData }: WelcomeStepProps) {
  const { user } = useAuth();
  
  const form = useForm<WelcomeFormData>({
    resolver: zodResolver(welcomeSchema),
    defaultValues: {
      fullName: formData.fullName
    }
  });

  const onSubmit = (data: WelcomeFormData) => {
    updateFormData(data);
  };

  // Update form data as user types
  const handleChange = (value: string) => {
    updateFormData({ fullName: value });
    form.setValue('fullName', value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-primary">
          Welcome to PhotoRenamer! 👋
        </h1>
        <p className="text-lg text-muted-foreground">
          Let's set up your account to give you the best experience
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  What should we call you?
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your full name"
                    className="text-lg py-3"
                    onChange={(e) => {
                      field.onChange(e);
                      handleChange(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Your email:</span> {user?.email}
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}