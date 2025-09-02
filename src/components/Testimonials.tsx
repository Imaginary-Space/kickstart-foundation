import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Wedding Photographer", 
    company: "Chen Photography Studio",
    content: "I went from 5,000 unnamed photos to a perfectly organized library in under an hour. This tool has revolutionized my workflow - I can now find any client photo instantly.",
    rating: 5,
    image: "SC",
    metric: "Saved 15+ hours per week"
  },
  {
    name: "Mike Rodriguez",
    role: "Father of 3",
    company: "Family Photo Enthusiast",
    content: "Finally found that family vacation photo from 2019 in seconds instead of scrolling for hours! My wife thinks I'm a tech wizard now. Worth every penny.",
    rating: 5, 
    image: "MR",
    metric: "Organized 8,000+ family photos"
  },
  {
    name: "Alex Thompson",
    role: "Commercial Photographer",
    company: "Thompson Creative",
    content: "My client deliveries are 10x faster now that I can instantly locate any shot. The AI naming is so accurate it's almost scary. Game changer for my business.",
    rating: 5,
    image: "AT", 
    metric: "Increased productivity by 300%"
  },
  {
    name: "Lisa Park",
    role: "Social Media Manager",
    company: "Digital Marketing Pro",
    content: "Managing hundreds of product photos was a nightmare until I found PhotoRename. Now I spend time creating content instead of hunting for images.",
    rating: 5,
    image: "LP",
    metric: "Cut image prep time by 80%"
  }
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Loved by 10,000+ Users Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            See how PhotoRename AI has transformed photo organization for professionals and families alike.
          </p>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-primary text-primary" />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              4.9/5 from 2,847 reviews
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="group hover:shadow-elegant transition-all duration-300 animate-slide-up border-0 bg-card/50 backdrop-blur-sm"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    {testimonial.image}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.company}
                    </p>
                  </div>
                  <Quote className="w-8 h-8 text-primary/20" />
                </div>
                
                <blockquote className="text-muted-foreground mb-4 italic">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {testimonial.metric}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 animate-slide-up">
          <p className="text-sm text-muted-foreground mb-4">
            Join thousands of satisfied users who have organized millions of photos
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>2M+ photos organized</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>99.8% uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};