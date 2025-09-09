import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface UpgradePricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const pricingPlans = [
  {
    name: "Personal",
    price: "$7.99",
    period: "/month",
    description: "Perfect for individual users",
    features: [
      "Unlimited photo uploads",
      "AI-powered photo analysis",
      "Batch renaming",
      "Priority support",
    ],
    popular: false,
    stripePriceId: "price_1QSVebEihWpNNJmPmh3tqP2n",
  },
  {
    name: "Pro",
    price: "$19.99",
    period: "/month", 
    description: "Best for power users",
    features: [
      "Everything in Personal",
      "Advanced batch operations",
      "Custom naming patterns",
      "API access",
      "Premium support",
    ],
    popular: true,
    stripePriceId: "price_1QSVfREihWpNNJmPO8RvQzQJ",
  },
];

export default function UpgradePricingModal({ isOpen, onClose }: UpgradePricingModalProps) {
  const { user } = useAuth();
  const { subscribed, createCheckout, openCustomerPortal } = useSubscription();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handlePlanAction = async (plan: typeof pricingPlans[0]) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }

    setLoadingPlan(plan.name);

    try {
      if (subscribed) {
        await openCustomerPortal();
      } else {
        await createCheckout(plan.stripePriceId, plan.name);
      }
    } catch (error) {
      console.error("Error with plan action:", error);
      toast({
        title: "Error",
        description: "There was an issue processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl">Upgrade for Unlimited Uploads</DialogTitle>
          <DialogDescription className="text-base">
            Free users can only upload 2 photos at a time. Choose a plan to unlock unlimited uploads and more features.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {pricingPlans.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handlePlanAction(plan)}
                  disabled={loadingPlan === plan.name}
                  className="w-full"
                  variant={plan.popular ? "default" : "ghost"}
                >
                  {loadingPlan === plan.name
                    ? "Processing..."
                    : subscribed
                    ? "Manage Plan"
                    : `Choose ${plan.name}`
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>You can dismiss this modal and upload up to 2 photos with your free account.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}