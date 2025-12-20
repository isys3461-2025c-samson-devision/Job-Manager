import FeatureSection from "../../components/FeatureSection";
import HeroSection from "../../components/HeroSection";
import NavbarWelcome from "../../components/NavBarWelcome";
import Pricing from "../../components/Pricing";
import Testimonials from "../../components/Testimonials";
import Workflow from "../../components/Workflow";

const WelcomePage = () => {
  return (
    <>
      <NavbarWelcome />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <HeroSection />
        <FeatureSection />
        <Workflow />
        <Pricing />
        <Testimonials />
      </div>
    </>
  );
};

export default WelcomePage;
