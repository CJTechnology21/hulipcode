import { useState,useRef,useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
const categories = [
  "Kitchen Tiles",
  "Wallpapers",
  "Cabinetry",
  "Louvers",
  "Wardrobe Finishes",
];

const productsData = {
  "Kitchen Tiles": [
    {
      id: 1,
      title: "Backsplash Tiles",
      subtitle: "300+ Products | From ₹31 / Piece",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    },
    {
      id: 2,
      title: "Moroccan Tiles",
      subtitle: "290+ Products | From ₹44 / Sqft",
      image:
        "https://5.imimg.com/data5/SELLER/Default/2024/7/436986660/UP/MX/IX/115870517/moroccan-designer-tiles-500x500.jpg",
    },
    {
      id: 3,
      title: "Hexagonal Tiles",
      subtitle: "50+ Products | From ₹49 / Sqft",
      image:
        "https://5.imimg.com/data5/SELLER/Default/2024/9/453309638/PK/JS/QR/196415188/imported-hexagonal-tiles-500x500.jpeg",
    },
    {
      id: 4,
      title: "Rustic Matte Tiles",
      subtitle: "350+ Products | From ₹33 / Sqft",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRor2dW9RSzNGLwsaEosJIpMt2s73ddCvXKFQ&s",
    },
    {
      id: 5,
      title: "Marble Look Flooring",
      subtitle: "1400+ Products | From ₹33 / Sqft",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRShajWquLei_AS4irwowkKI6MXYe6IlHXi6w&s",
    },
    {
      id: 6,
      title: "Wood Look Tiles",
      subtitle: "400+ Products | From ₹33 / Sqft",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRedh5X7reezach9q9MqxsUBbe9SBmqdFL0eQ&s",
    },
  ],
  Wallpapers: [
    {
      id: 7,
      title: "Floral Wallpaper",
      subtitle: "100+ Products | From ₹29 / Sqft",
      image: "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg",
    },
    {
      id: 8,
      title: "Geometric Wallpaper",
      subtitle: "150+ Products | From ₹35 / Sqft",
      image: "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg",
    },
    {
      id: 9,
      title: "Textured Wallpaper",
      subtitle: "90+ Products | From ₹40 / Sqft",
      image:
        "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
    },
  ],
  Cabinetry: [
    {
      id: 10,
      title: "Modern Cabinets",
      subtitle: "200+ Products | From ₹99 / Sqft",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRedh5X7reezach9q9MqxsUBbe9SBmqdFL0eQ&s",
    },
    {
      id: 11,
      title: "Classic Wood Cabinets",
      subtitle: "170+ Products | From ₹120 / Sqft",
      image:
        "https://media.designcafe.com/wp-content/uploads/2020/08/08174604/retro-style-wood-designs-for-kitchen-cabinets.jpg",
    },
  ],
  Louvers: [
    {
      id: 12,
      title: "PVC Louvers",
      subtitle: "80+ Products | From ₹59 / Sqft",
      image:
        "https://images.jdmagicbox.com/quickquotes/images_main/pvc-louvers-wall-panel-brown-5-10-mm-2226610789-jl2fa4se.jpg",
    },
    {
      id: 13,
      title: "Wooden Louvers",
      subtitle: "100+ Products | From ₹88 / Sqft",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEfScKnV2LflourR30TE4PLQozz13zZpNFkQ&s",
    },
  ],
  "Wardrobe Finishes": [
    {
      id: 14,
      title: "Glossy Finish",
      subtitle: "200+ Products | From ₹110 / Sqft",
      image:
        "https://s3.ap-south-1.amazonaws.com/mbprodimages/images/interiorDesignerCMS/decorPartner/369/projectImage/simple-wardrobe-design-08.jpg",
    },
    {
      id: 15,
      title: "Matte Finish",
      subtitle: "170+ Products | From ₹99 / Sqft",
      image:
        "https://images.jdmagicbox.com/quickquotes/images_main/wooden-matte-finish-wardrobe-with-locker-2217591510-vclx3yyd.jpg",
    },
  ],
};

export default function EliteSection() {
  const [activeCategory, setActiveCategory] = useState("Kitchen Tiles");

  const activeProducts = productsData[activeCategory] || [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef(null);
  const slideCount = activeProducts.length;

  const startAutoplay = () => {
    stopAutoplay();
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 3000);
  };

  const stopAutoplay = () => {
    if (slideInterval.current) clearInterval(slideInterval.current);
  };

  useEffect(() => {
    if (window.innerWidth < 640) startAutoplay();
    return () => stopAutoplay();
  }, [activeCategory]);

  const goToPrev = () => {
    stopAutoplay();
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const goToNext = () => {
    stopAutoplay();
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-6">
        Elite Selection, Irresistible Prices
      </h2>

      {/* Tabs */}
      <div className="flex justify-center flex-wrap gap-2 mb-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              activeCategory === category
                ? "bg-blue-600 text-white"
                : "text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid */}

      {/* Mobile Carousel */}
      <div className="relative sm:hidden overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {activeProducts.map((product) => (
            <div key={product.id} className="min-w-full px-2 text-center">
              <div className="rounded-xl overflow-hidden shadow">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-44 object-cover"
                />
              </div>
              <h3 className="mt-3 text-base font-semibold text-gray-900">
                {product.title}
              </h3>
              <p className="text-sm text-gray-600">{product.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Icon Buttons */}
        {slideCount > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full"
            >
              <FiChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={goToNext}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full"
            >
              <FiChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </>
        )}
      </div>

      {/* Desktop Grid */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {activeProducts.map((product) => (
          <div key={product.id} className="text-center">
            <div className="rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow duration-300">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-44 object-cover"
              />
            </div>
            <h3 className="mt-3 text-base font-semibold text-gray-900">
              {product.title}
            </h3>
            <p className="text-sm text-gray-600">{product.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
// import { useState } from "react";

// const categories = ["Kitchen Tiles", "Wallpapers", "Cabinetry", "Louvers", "Wardrobe Finishes"];

// const productsData = {
//   "Kitchen Tiles": [
//     {
//       id: 1,
//       title: "Backsplash Tiles",
//       subtitle: "300+ Products | From ₹31 / Piece",
//       image: "/images/kitchen/backsplash.jpg",
//     },
//     {
//       id: 2,
//       title: "Moroccan Tiles",
//       subtitle: "290+ Products | From ₹44 / Sqft",
//       image: "/images/kitchen/moroccan.jpg",
//     },
//     {
//       id: 3,
//       title: "Hexagonal Tiles",
//       subtitle: "50+ Products | From ₹49 / Sqft",
//       image: "/images/kitchen/hexagon.jpg",
//     },
//     {
//       id: 4,
//       title: "Rustic Matte Tiles",
//       subtitle: "350+ Products | From ₹33 / Sqft",
//       image: "/images/kitchen/rustic.jpg",
//     },
//     {
//       id: 5,
//       title: "Marble Look Flooring",
//       subtitle: "1400+ Products | From ₹33 / Sqft",
//       image: "/images/kitchen/marble.jpg",
//     },
//     {
//       id: 6,
//       title: "Wood Look Tiles",
//       subtitle: "400+ Products | From ₹33 / Sqft",
//       image: "/images/kitchen/wood.jpg",
//     },
//   ],
//   Wallpapers: [],
//   Cabinetry: [],
//   Louvers: [],
//   "Wardrobe Finishes": [],
// };

// export default function EliteSection() {
//   const [activeCategory, setActiveCategory] = useState("Kitchen Tiles");

//   const activeProducts = productsData[activeCategory] || [];

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-12">
//       <h2 className="text-3xl font-bold text-center mb-6">
//         Elite Selection, Irresistible Prices
//       </h2>

//       {/* Tabs */}
//       <div className="flex justify-center flex-wrap gap-2 mb-10">
//         {categories.map((category) => (
//           <button
//             key={category}
//             onClick={() => setActiveCategory(category)}
//             className={`px-4 py-2 rounded-md text-sm font-medium border ${
//               activeCategory === category
//                 ? "bg-blue-600 text-white"
//                 : "text-gray-800 border-gray-300 hover:bg-gray-100"
//             }`}
//           >
//             {category}
//           </button>
//         ))}
//       </div>

//       {/* Product Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
//         {activeProducts.map((product) => (
//           <div key={product.id} className="text-center">
//             <div className="rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow duration-300">
//               <img
//                 src={product.image}
//                 alt={product.title}
//                 className="w-full h-44 object-cover"
//               />
//             </div>
//             <h3 className="mt-3 text-base font-semibold text-gray-900">{product.title}</h3>
//             <p className="text-sm text-gray-600">{product.subtitle}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
