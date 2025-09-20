import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Luggage, Fuel, Zap, Star } from "lucide-react";

const fleetImage = '/assets/luxury-fleet.jpg';

const Fleet = () => {
  const vehicles = [
    {
      id: 1,
      name: "Mercedes S-Class",
      category: "Executive Luxury",
      price: "From 029/day",
      image: fleetImage,
      specs: {
        seats: 4,
        luggage: 3,
        transmission: "Automatic",
        fuel: "Hybrid"
      },
      features: ["Massage Seats", "Panoramic Roof", "Premium Sound"],
      available: true,
      rating: 4.9
    },
    {
      id: 2,
      name: "BMW 7 Series",
      category: "Executive Luxury", 
      price: "From 079/day",
      image: fleetImage,
      specs: {
        seats: 4,
        luggage: 3,
        transmission: "Automatic",
        fuel: "Petrol"
      },
      features: ["Executive Lounge", "Gesture Control", "Surround View"],
      available: true,
      rating: 4.8
    },
    {
      id: 3,
      name: "Porsche Panamera",
      category: "Sport Luxury",
      price: "From 099/day",
      image: fleetImage,
      specs: {
        seats: 4,
        luggage: 2,
        transmission: "PDK",
        fuel: "Hybrid"
      },
      features: ["Sport Chrono", "Air Suspension", "Bose Audio"],
      available: false,
      rating: 4.9
    },
    {
      id: 4,
      name: "Rolls Royce Ghost",
      category: "Ultra Luxury",
      price: "From 799/day",
      image: fleetImage,
      specs: {
        seats: 4,
        luggage: 3,
        transmission: "Automatic",
        fuel: "Petrol"
      },
      features: ["Starlight Headliner", "Magic Carpet Ride", "Bespoke Audio"],
      available: true,
      rating: 5.0
    },
    {
      id: 5,
      name: "Range Rover Autobiography",
      category: "Luxury SUV",
      price: "From 349/day",
      image: fleetImage,
      specs: {
        seats: 5,
        luggage: 4,
        transmission: "Automatic",
        fuel: "Hybrid"
      },
      features: ["Terrain Response", "Air Suspension", "Meridian Audio"],
      available: true,
      rating: 4.7
    },
    {
      id: 6,
      name: "Bentley Continental GT",
      category: "Grand Tourer",
      price: "From 599/day",
      image: fleetImage,
      specs: {
        seats: 4,
        luggage: 2,
        transmission: "Automatic",
        fuel: "Petrol"
      },
      features: ["Rotating Display", "Diamond Quilting", "Naim Audio"],
      available: true,
      rating: 4.9
    }
  ];

  return (
    <section id="fleet" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Premium <span className="text-luxury-gold">Fleet</span>
          </h2>
          <p className="text-xl text-luxury-gray max-w-3xl mx-auto">
            Experience the finest collection of luxury vehicles, each meticulously maintained 
            and equipped with premium features for your comfort and style.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {["All Vehicles", "Executive", "Sport", "Ultra Luxury", "SUV"].map((category) => (
            <Button 
              key={category}
              variant={category === "All Vehicles" ? "default" : "outline"}
              className={category === "All Vehicles" 
                ? "bg-gradient-luxury text-luxury-dark" 
                : "border-luxury-charcoal text-luxury-gray hover:border-luxury-gold hover:text-luxury-gold"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="group hover:shadow-luxury transition-all duration-500 border-luxury-charcoal hover:border-luxury-gold/50 bg-gradient-card overflow-hidden">
              <div className="relative">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-luxury-gold text-luxury-dark">
                    {vehicle.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-luxury-gold fill-current" />
                    <span className="text-sm font-medium">{vehicle.rating}</span>
                  </div>
                </div>
                {!vehicle.available && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Badge variant="destructive">Currently Unavailable</Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-serif font-semibold">{vehicle.name}</h3>
                  <span className="text-luxury-gold font-semibold">{vehicle.price}</span>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-luxury-gray" />
                    <span>{vehicle.specs.seats} Seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Luggage className="w-4 h-4 text-luxury-gray" />
                    <span>{vehicle.specs.luggage} Bags</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-luxury-gray" />
                    <span>{vehicle.specs.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-luxury-gray" />
                    <span>{vehicle.specs.fuel}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-6">
                  {vehicle.features.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-luxury-charcoal">
                      {feature}
                    </Badge>
                  ))}
                  {vehicle.features.length > 2 && (
                    <Badge variant="outline" className="text-xs border-luxury-charcoal">
                      +{vehicle.features.length - 2} more
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-gradient-luxury text-luxury-dark hover:shadow-glow transition-all"
                    disabled={!vehicle.available}
                  >
                    {vehicle.available ? "Book Now" : "Notify When Available"}
                  </Button>
                  <Button variant="outline" className="w-full border-luxury-charcoal text-luxury-gray hover:border-luxury-gold hover:text-luxury-gold">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark">
            View Complete Fleet
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Fleet;
