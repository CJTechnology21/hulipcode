import SuggestionCategory from "../Admin/components/SuggestionCategory";
import InspirationGallery from "../Admin/components/Homecomponents/InspirationGallery";
import EliteSection from "../Admin/components/Homecomponents/EliteSection";
import PromoBanner from "../Admin/components/Homecomponents/PromoBanner";
import Reviews from "../Admin/components/Homecomponents/Reviews";
import HeroSection from "./HeroSection";
import HomeReviews from "./HomeReviews";
import HomeLeft from "./HomeLeft";
import HomeClientSection from "./HomeClientSection";
import HomeFeatures from "./HomeFeatures";
import HomeTalentSection from "./HomeTalentSection";
import HomeCards from "./HomeCards";
import HomeSupportBanner from "./HomeSupportBanner";
import HomeTextSection from "./HomeTextSection";
function HomeComponent() {
  return (
    <div>
      <HeroSection />
      {/* Suggestion-section */}
      <SuggestionCategory />
      {/* Review Section */}
      <HomeReviews />
      {/* Inspiration_gallery */}
      <InspirationGallery />
      {/* HomeLeft */}
      <HomeLeft />
      {/* EliteSection */}
      <EliteSection />
      {/* ClientSecion */}
      <HomeClientSection />
      <div className="-mt-10">
        <PromoBanner />
      </div>
      {/* Section 3 - Side-by-side Features */}
      <HomeFeatures />
      {/* section-4 */}
      <HomeTalentSection />
      {/* Cards*/}
      <HomeCards />
      <div className="-mb-16">
        <Reviews />
      </div>
      {/* support banner */}
      <HomeSupportBanner />
      {/* text-section */}
      <HomeTextSection />
    </div>
  );
}

export default HomeComponent;
