import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import AIChatbot from "@/components/AIChatbot";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Index;
