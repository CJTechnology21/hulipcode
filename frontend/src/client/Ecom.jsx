import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Browse from "./components/Browse";
import Carousel from "./components/Carousel";
import ImageGrid from "./components/ImageGrid";
import Footer from "./components/Footer";
import CategoryBar from "./components/CategoryBar";
import SuggestionCategory from "../Admin/components/SuggestionCategory";
import EliteSection from "../Admin/components/Homecomponents/EliteSection";
import InspirationGallery from "../Admin/components/Homecomponents/InspirationGallery";
import Reviews from "../Admin/components/Homecomponents/Reviews";

const Ecom = () => {
  return (
    <div className="font-[Poppins] space-y-6">
      {/* Header */}
      <Header />
      
      {/* CategoryBar just below Header */}
           <CategoryBar />
      {/* <div className=" border-2 border-red-600">
        <CategoryBar />
      </div> */}

      <Hero />
      <SuggestionCategory />
      <InspirationGallery />
      <Browse />
      <EliteSection />
      
      <h2 className="text-2xl md:text-3xl font-semibold flex text-center justify-center items-center">
        Our Products
      </h2>
      {/* <Products /> */}
      <Carousel />
      <Reviews />
      <ImageGrid />
      <Footer />
    </div>
  );
};

export default Ecom;

// import React from "react";
// import Header from "./components/Header";
// import Hero from "./components/Hero";
// import Browse from "./components/Browse";
// import Carousel from "./components/Carousel";
// import ImageGrid from "./components/ImageGrid";
// import Footer from "./components/Footer";
// import CategoryBar from "./components/CategoryBar";
// import SuggestionCategory from "../Admin/components/SuggestionCategory";
// import EliteSection from "../Admin/components/Homecomponents/EliteSection";
// import InspirationGallery from "../Admin/components/Homecomponents/InspirationGallery";
// import Reviews from "../Admin/components/Homecomponents/Reviews";
// const Ecom = () => {
//   return (
//     <div className="font-[Poppins] space-y-6">
//       {/* Header */}
//       <Header />
//       <div className="-mb-2">
//         <CategoryBar />
//       </div>
//       <Hero />
//       <SuggestionCategory />
//       <InspirationGallery />
//       <Browse />
//       <EliteSection />
//       <h2 className="text-2xl md:text-3xl font-semibold flex text-center justify-center items-center">
//         Our Products
//       </h2>
//       {/* <Products /> */}
//       <Carousel />
//       <Reviews />
//       <ImageGrid />
//       <Footer />
//     </div>
//   );
// };

// export default Ecom;
