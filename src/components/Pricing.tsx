import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";

const pricingPlans = [
  {
    name: "Free Trial",
    price: "Free",
    originalPrice: null,
    duration: "14 days",
    description: "Perfect for testing the waters",
    features: [
      "50 photos included",
      "Basic AI renaming",
      "Standard support",
      "No credit card required"
    ],
    cta: "Start Free Trial",
    popular: false,
    badge: null
  },
  {
    name: "Personal", 
    price: "$7.99",
    originalPrice: "$15.99",
    duration: "month",
    description: "For photo enthusiasts and families",
    features: [
      "5,000 photos per month",
      "Advanced AI recognition", 
      "Priority support",
      "Bulk folder organization",
      "30-day money-back guarantee"
    ],
    cta: "Start Personal Plan",
    popular: true,
    badge: "Most Popular"
  },
  {
    name: "Pro",
    price: "$19.99", 
    originalPrice: "$39.99",
    duration: "month",
    description: "For professionals and power users",
    features: [
      "Unlimited photos",
      "Advanced AI + custom training",
      "Priority support + phone",
      "Team collaboration tools",
      "API access",
      "30-day money-back guarantee"
    ],
    cta: "Start Pro Plan",
    popular: false,
    badge: "Best Value"
  }
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Special Launch Pricing - 50% Off First 3 Months
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start organizing your photos today. No contracts, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative transition-all duration-300 hover:shadow-elegant animate-slide-up ${
                plan.popular ? 'ring-2 ring-primary shadow-glow scale-105' : 'border-0 bg-card/50 backdrop-blur-sm'
              }`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {plan.badge}
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.duration && (
                      <span className="text-muted-foreground">/{plan.duration}</span>
                    )}
                  </div>
                  {plan.originalPrice && (
                    <div className="text-sm text-muted-foreground">
                      <span className="line-through">{plan.originalPrice}</span>
                      <span className="text-primary font-medium ml-1">Save 50%</span>
                    </div>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.popular ? "default" : "ghost"} 
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center animate-slide-up">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            <span>Cancel anytime</span>
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            <span>No setup fees</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Join 10,000+ satisfied users who have organized over 2 million photos
          </p>
        </div>
      </div>
    </section>
  );
};