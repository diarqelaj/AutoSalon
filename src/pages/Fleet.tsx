import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Luggage, Fuel, Star } from "lucide-react";
import luxuryFleet from "@/assets/luxury-fleet.jpg";

const Fleet = () => {
  const cars = [
    {
      id: 1,
      name: "Mercedes S-Class",
      category: "Luxury Sedan",
      price: "From $299/day",
      rating: 4.9,
      specs: { passengers: 4, luggage: 3, transmission: "Automatic", fuel: "Petrol" },
      features: ["Premium Interior", "Chauffeur Available", "Airport Pickup"],
      image: luxuryFleet
    },
    {
      id: 2,
      name: "BMW X7",
      category: "Premium SUV",
      price: "From $399/day",
      rating: 4.8,
      specs: { passengers: 7, luggage: 5, transmission: "Automatic", fuel: "Petrol" },
      features: ["Spacious Interior", "Family Friendly", "All-Terrain"],
      image: luxuryFleet
    },
    {
      id: 3,
      name: "Porsche 911",
      category: "Sports Car",
      price: "From $599/day",
      rating: 5.0,
      specs: { passengers: 2, luggage: 1, transmission: "Manual/Auto", fuel: "Petrol" },
      features: ["High Performance", "Iconic Design", "Track Ready"],
      image: luxuryFleet
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
              Our <span className="bg-gradient-luxury bg-clip-text text-transparent">Fleet</span>
            </h1>
            <p className="text-xl text-brand-gray max-w-2xl mx-auto">
              Discover our collection of premium vehicles, each meticulously maintained and ready for your luxury experience.
            </p>
          </div>
        </section>

        {/* Fleet Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car) => (
                <Card key={car.id} className="bg-card border-brand-charcoal hover:shadow-luxury transition-all">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img 
                      src={car.image} 
                      alt={car.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-brand-white text-brand-dark">
                        {car.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-serif font-semibold">{car.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-brand-white fill-current" />
                          <span className="text-sm text-brand-gray">{car.rating}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-brand-white">{car.price}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-brand-gray">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{car.specs.passengers} Passengers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Luggage className="w-4 h-4" />
                        <span>{car.specs.luggage} Bags</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4" />
                        <span>{car.specs.transmission}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4" />
                        <span>{car.specs.fuel}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {car.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs border-brand-charcoal">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full bg-gradient-luxury text-brand-dark hover:shadow-glow">
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Fleet;