import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "James Morrison",
      role: "CEO, TechCorp",
      rating: 5,
      text: "Exceptional service from start to finish. The Mercedes S-Class was immaculate and the chauffeur was professional and punctual. Will definitely use again for business trips.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Event Planner",
      rating: 5,
      text: "LuxeRide made our wedding day perfect. The Rolls Royce Ghost was stunning and arrived exactly on time. The attention to detail was remarkable.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      role: "Investment Banker",
      rating: 5,
      text: "I travel frequently for work and have used many luxury car services. LuxeRide stands out for their professionalism and fleet quality. The booking process is seamless.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-brand-charcoal/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            What Our Clients <span className="text-brand-white">Say</span>
          </h2>
          <p className="text-xl text-brand-gray max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our discerning clients 
            have to say about their luxury experiences with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="group hover:shadow-luxury transition-all duration-500 border-brand-charcoal hover:border-brand-white/50 bg-gradient-card">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <Quote className="w-8 h-8 text-brand-white opacity-60" />
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-brand-white fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-brand-gray mb-8 leading-relaxed">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-brand-gray">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { number: "500+", label: "Happy Clients" },
            { number: "50+", label: "Premium Vehicles" },
            { number: "24/7", label: "Customer Support" },
            { number: "99.9%", label: "Satisfaction Rate" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-serif font-bold text-brand-white mb-2">
                {stat.number}
              </div>
              <div className="text-brand-gray text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
