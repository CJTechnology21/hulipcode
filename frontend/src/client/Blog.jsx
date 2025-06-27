import React from "react";
import Header from "./components/Header";
import Hero from "./components/BlogComponents/Hero";
import ImagesSection from "./components/BlogComponents/ImagesSection";
import LayoutImages from "./components/BlogComponents/LayoutImages";
import Test from "./components/BlogComponents/Test";
import Ideas from "./components/BlogComponents/Ideas";
import Suggest from "./components/BlogComponents/Suggest";
import Footer from './components/Footer'
function Blog() {
  return (
    <div className="font-figtree">
      <Header />
      <Hero />
      <ImagesSection />
      <LayoutImages />
      <Test />
      <Ideas />
      <Suggest />
      <LayoutImages />
      <Test />
       <ImagesSection />
       <Footer/>
    </div>
  );
}

export default Blog;
