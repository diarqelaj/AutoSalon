import Hero from "@/components/Hero";
import ServiceSelector from "@/components/ServiceSelector";
import Fleet from "@/components/Fleet";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export const metadata = {
  title: 'LuxeRide - Luxury Car Rentals',
  description: 'Chauffeured & self-drive luxury cars in major cities, delivered to your door.'
}

export default function Page() {
  return (
    <>
      <Hero />
      <ServiceSelector />
      <Fleet />
      <Testimonials />
      <Contact />
    </>
  )
}

