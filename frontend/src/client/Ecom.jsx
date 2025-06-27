import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Browse from "./components/Browse";
import Products from "./components/Products";
import Carousel from "./components/Carousel";
import ImageGrid from "./components/ImageGrid";
import Footer from "./components/Footer";
const Ecom = () => {
  return (
    <div className="font-[Poppins] space-y-6">
      {/* Header */}
      <Header />
      <Hero />
      <Browse />
      <h2 className="text-2xl md:text-3xl font-semibold flex text-center justify-center items-center">
        Our Products
      </h2>
      <Products />
      <Carousel />
      <ImageGrid />
      <Footer />
    </div>
  );
};

export default Ecom;

// import React, { useState } from 'react';
// import ecom_home from './images/ecom_home.jpg'
// import { FiMenu, FiX, FiUser, FiHeart, FiShoppingCart } from 'react-icons/fi';

// const Ecom = () => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <div className="font-[Poppins]">
//       {/* Header */}
//       <header className="w-full shadow-sm sticky top-0 bg-white z-50">
//         <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
//           <div className="text-xl font-bold">Logo</div>

//           {/* Nav Links */}
//           <nav className="hidden md:flex items-center gap-6 text-sm">
//             <a href="/">Home</a>
//             <a href="/">Shop</a>
//             <a href="/">About</a>
//             {/* <a href="">Contact</a> */}
//           </nav>

//           {/* Icons */}
//           <div className="hidden md:flex items-center gap-4 text-xl">
//             <FiUser />
//             <FiHeart />
//             <FiShoppingCart />
//           </div>

//           {/* Hamburger Menu */}
//           <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-2xl">
//             {menuOpen ? <FiX /> : <FiMenu />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {menuOpen && (
//           <div className="md:hidden px-4 pb-4 space-y-2 text-sm">
//             <a href="/" className="block">Home</a>
//             <a href="/" className="block">Shop</a>
//             <a href="/" className="block">About</a>
//             <a href="/" className="block">Contact</a>
//             <div className="flex gap-4 pt-2 text-xl">
//               <FiUser />
//               <FiHeart />
//               <FiShoppingCart />
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Hero Section */}
//    <section className="w-full font-[Poppins]">
//       <div className="relative w-full">
//         {/* Background image */}
//         <img
//           src={ecom_home}
//           alt="Hero background"
//           className="w-full h-[500px] object-cover"
//         />

//         {/* Floating white card */}
//         <div className="absolute top-1/2 right-6 md:right-20 -translate-y-1/2 bg-white rounded-xl shadow-md p-6 md:p-8 max-w-[600px] w-[90%] h-[350px]">
//           <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">New Arrival</p>
//           <h1 className="text-2xl md:text-3xl font-bold text-[#0070f3] leading-tight mb-3">
//             Discover Our <br /> New Collection
//           </h1>
//           <p className="text-sm text-gray-700 mb-5">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.
//           </p>
//           <button className="bg-[#0070f3] text-white text-sm font-semibold px-6 py-3 rounded hover:bg-blue-700 transition">
//             BUY NOW
//           </button>
//         </div>
//       </div>
//     </section>

//     </div>
//   );
// };

// export default Ecom;
