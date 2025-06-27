import React from "react";
import Header from "./components/Header";
import { FaSlidersH, FaThLarge, FaList } from "react-icons/fa";
import bannerImage from "./images/blured_bg.jpg"; // replace with your actual image path
import Products from "./components/Products";
import FeatureBanner from "./components/FeatureBanner";
import Footer from "./components/Footer";

function Shop() {
  return (
    <>
      <Header />
      <div
        className="h-[250px] w-full bg-center bg-cover flex flex-col justify-center items-center text-center text-black opacity-50"
        style={{
          backgroundImage: `url(${bannerImage})`,
        }}
      >
        <h1 className="text-3xl font-bold text-black">Shop</h1>
        <p className="text-sm mt-2">
          <span className="text-gray-800">Home</span> &gt;{" "}
          <span className="text-gray-900 font-medium">Shop</span>
        </p>
      </div>

      {/* 🧰 Toolbar Section */}
      <div className="bg-[#f8f9fa] w-full border-t border-b py-4 px-4 md:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left side: Filters + View options + Result count */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
          <button className="flex items-center gap-2 font-medium">
            <FaSlidersH />
            Filter
          </button>

          <div className="flex items-center gap-2">
            <button className="p-1 border rounded">
              <FaThLarge />
            </button>
            <button className="p-1 border rounded">
              <FaList />
            </button>
          </div>

          <p className="text-gray-500">Showing 1–16 of 32 results</p>
        </div>

        {/* Right side: Show count and sort dropdown */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <input
              type="number"
              className="w-14 px-2 py-1 border rounded"
              defaultValue={16}
            />
          </div>
          <div className="flex items-center gap-2">
            <span>Short by</span>
            <select className="px-3 py-1 border rounded">
              <option>Default</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>
      </div>
      <Products />
      <div className="mt-[-12rem]">
        <FeatureBanner />
      </div>
      <Footer />
    </>
  );
}

export default Shop;
