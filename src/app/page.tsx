import Hero from "@/components/Hero";
import ServiceSelector from "@/components/ServiceSelector";
import Fleet from "@/components/Fleet";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export const metadata = {
  title: 'AutoSalon RIO - Luxury Car Heaven',
  description: 'From classics to hypercars we have cars for tailored for every customer needs.'
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

