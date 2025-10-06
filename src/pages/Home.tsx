import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedProperties />
      <About />
      <Testimonials />
    </div>
  );
};

export default Home;
