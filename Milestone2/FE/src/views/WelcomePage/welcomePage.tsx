import FeatureSection from "../../components/FeatureSection";
import HeroSection from "../../components/HeroSection";
import NavbarWelcome from "../../components/NavBarWelcome";
import Workflow from "../../components/WorkFlow";

const WelcomePage = () => {
  return (
    <>
      <NavbarWelcome />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <HeroSection />
        <FeatureSection />
        <Workflow />
      </div>
    </>
  );
};

export default WelcomePage;
