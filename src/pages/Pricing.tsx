import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Shield, Clock } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Essential",
      price: "$199",
      period: "per day",
      description: "Perfect for short trips and city driving",
      features: [
        "Economy & Compact Cars",
        "Basic Insurance Coverage",
        "24/7 Customer Support",
        "Free Cancellation (24h)",
        "Unlimited Mileage*"
      ],
      popular: false
    },
    {
      name: "Premium",
      price: "$399",
      period: "per day",
      description: "Luxury vehicles for special occasions",
      features: [
        "Luxury Sedans & SUVs",
        "Comprehensive Insurance",
        "Professional Chauffeur Available",
        "Airport Pickup/Drop-off",
        "Premium Concierge Service",
        "Free Cancellation (48h)"
      ],
      popular: true
    },
    {
      name: "Elite",
      price: "$799",
      period: "per day", 
      description: "Ultimate luxury experience",
      features: [
        "Exotic & Sports Cars",
        "Full Premium Insurance",
        "Dedicated Personal Chauffeur",
        "White-Glove Service",
        "Event Planning Assistance",
        "Helicopter Transfer Option",
        "Free Cancellation (72h)"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
              <span className="bg-gradient-luxury bg-clip-text text-transparent">Pricing</span> Plans
            </h1>
            <p className="text-xl text-brand-gray max-w-2xl mx-auto mb-8">
              Choose the perfect plan for your luxury transportation needs. All plans include our premium service guarantee.
            </p>
            
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-white" />
                <span>Fully Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-white" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-brand-white" />
                <span>Premium Fleet</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <Card key={plan.name} className={`relative bg-card border-brand-charcoal ${plan.popular ? 'ring-2 ring-brand-white shadow-luxury' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-luxury text-brand-dark font-semibold">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-serif">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-brand-white">{plan.price}</span>
                      <span className="text-brand-gray">/{plan.period}</span>
                    </div>
                    <p className="text-brand-gray mt-2">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-brand-white mt-0.5 flex-shrink-0" />
                          <span className="text-brand-gray">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-gradient-luxury text-brand-dark hover:shadow-glow' : 'bg-brand-charcoal text-brand-white hover:bg-brand-gray'}`}
                      size="lg"
                    >
                      Choose {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <p className="text-brand-gray mb-4">*Terms and conditions apply. Contact us for custom packages and long-term rentals.</p>
              <Button variant="outline" className="border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-dark">
                Get Custom Quote
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Pricing;