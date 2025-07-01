// InspirationDetail.jsx
import { useParams } from "react-router-dom";
import { useState } from "react";
const galleryItems = [
  {
    id: 1,
    category: "Bedroom",
    src: "/images/bedroom/bedroom1.jpeg",
    label: "Bedroom Inspiration 1",
  },
  {
    id: 2,
    category: "Bedroom",
    src: "/images/bedroom/bedroom2.jpeg",
    label: "Bedroom Inspiration 2",
  },
  {
    id: 3,
    category: "Bedroom",
    src: "/images/bedroom/bedroom3.jpeg",
    label: "Bedroom Inspiration 3",
  },
  {
    id: 4,
    category: "Kitchen",
    src: "/images/kitchen/kitchen1.jpg",
    label: "Kitchen Inspiration 1",
  },
  {
    id: 5,
    category: "Kitchen",
    src: "/images/kitchen/kitchen2.jpg",
    label: "Kitchen Inspiration 2",
  },
  {
    id: 6,
    category: "Kitchen",
    src: "/images/kitchen/kitchen3.jpg",
    label: "Kitchen Inspiration 3",
  },
  {
    id: 7,
    category: "Bathroom",
    src: "/images/bathroom/bathroom1.jpg",
    label: "Bathroom Inspiration 1",
  },
  {
    id: 8,
    category: "Bathroom",
    src: "/images/bathroom/bathroom2.jpeg",
    label: "Bathroom Inspiration 2",
  },
  {
    id: 9,
    category: "Bathroom",
    src: "/images/bathroom/bathroom3.jpg",
    label: "Bathroom Inspiration 3",
  },
  {
    id: 10,
    category: "TV Unit",
    src: "/images/tvunit/tvunit1.jpeg",
    label: "TV Unit Inspiration 1",
  },
  {
    id: 11,
    category: "TV Unit",
    src: "/images/tvunit/tvunit2.jpg",
    label: "TV Unit Inspiration 2",
  },
  {
    id: 12,
    category: "TV Unit",
    src: "/images/tvunit/tvunit3.jpg",
    label: "TV Unit Inspiration 3",
  },
  {
    id: 13,
    category: "Living Room",
    src: "/images/living/living1.jpeg",
    label: "Living Room Inspiration 1",
  },
  {
    id: 14,
    category: "Living Room",
    src: "/images/living/living2.jpg",
    label: "Living Room Inspiration 2",
  },
  {
    id: 15,
    category: "Living Room",
    src: "/images/living/living3.jpeg",
    label: "Living Room Inspiration 3",
  },
  {
    id: 16,
    category: "Dining",
    src: "/images/dining/dining1.jpg",
    label: "Dining Inspiration 1",
  },
  {
    id: 17,
    category: "Dining",
    src: "/images/dining/dining2.jpg",
    label: "Dining Inspiration 2",
  },
  {
    id: 18,
    category: "Dining",
    src: "/images/dining/dining3.jpg",
    label: "Dining Inspiration 3",
  },
  {
    id: 19,
    category: "Outdoor",
    src: "/images/outdoor/outdoor1.png",
    label: "Outdoor Inspiration 1",
  },
  {
    id: 20,
    category: "Outdoor",
    src: "/images/outdoor/outdoor2.jpeg",
    label: "Outdoor Inspiration 2",
  },
  {
    id: 21,
    category: "Outdoor",
    src: "/images/outdoor/outdoor3.jpeg",
    label: "Outdoor Inspiration 3",
  },
  {
    id: 22,
    category: "Wardrobe",
    src: "/images/wardrobe/wardrobe1.jpeg",
    label: "Wardrobe Inspiration 1",
  },
  {
    id: 23,
    category: "Wardrobe",
    src: "/images/wardrobe/wardrobe2.jpg",
    label: "Wardrobe Inspiration 2",
  },
  {
    id: 24,
    category: "Wardrobe",
    src: "/images/wardrobe/wardrobe3.jpg",
    label: "Wardrobe Inspiration 3",
  },
];

// const galleryItems = [
//   { id: 1, category: "Bedroom", src: "/images/bedroom/bedroom1.jpeg" },
//   { id: 2, category: "Bedroom", src: "/images/bedroom/bedroom2.jpeg" },
//   { id: 3, category: "Bedroom", src: "/images/bedroom/bedroom3.jpeg" },
//   { id: 4, category: "Kitchen", src: "/images/kitchen/kitchen1.jpg" },
//   { id: 5, category: "Kitchen", src: "/images/kitchen/kitchen2.jpg" },
//   { id: 6, category: "Kitchen", src: "/images/kitchen/kitchen3.jpg" },
//   { id: 7, category: "Bathroom", src: "/images/bathroom/bathroom1.jpg" },
//   { id: 8, category: "Bathroom", src: "/images/bathroom/bathroom2.jpeg" },
//   { id: 9, category: "Bathroom", src: "/images/bathroom/bathroom3.jpg" },
//   { id: 10, category: "TV Unit", src: "/images/tvunit/tvunit1.jpeg" },
//   { id: 11, category: "TV Unit", src: "/images/tvunit/tvunit2.jpg" },
//   { id: 12, category: "TV Unit", src: "/images/tvunit/tvunit3.jpg" },
//   { id: 13, category: "Living Room", src: "/images/living/living1.jpeg" },
//   { id: 14, category: "Living Room", src: "/images/living/living2.jpg" },
//   { id: 15, category: "Living Room", src: "/images/living/living3.jpeg" },
//   { id: 16, category: "Dining", src: "/images/dining/dining1.jpg" },
//   { id: 17, category: "Dining", src: "/images/dining/dining2.jpg" },
//   { id: 18, category: "Dining", src: "/images/dining/dining3.jpg" },
//   { id: 19, category: "Outdoor", src: "/images/outdoor/outdoor1.png" },
//   { id: 20, category: "Outdoor", src: "/images/outdoor/outdoor2.jpeg" },
//   { id: 21, category: "Outdoor", src: "/images/outdoor/outdoor3.jpeg" },
//   { id: 22, category: "Wardrobe", src: "/images/wardrobe/wardrobe1.jpeg" },
//   { id: 23, category: "Wardrobe", src: "/images/wardrobe/wardrobe2.jpg" },
//   { id: 24, category: "Wardrobe", src: "/images/wardrobe/wardrobe3.jpg" },
// ];

const categories = [
  "All",
  "Kitchen",
  "Bedroom",
  "Living Room",
  "Bathroom",
  "Dining",
  "Outdoor",
  "TV Unit",
  "Wardrobe",
];

export default function InspirationDetail() {
  const { category } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(category || "All");

  const filteredItems =
    selectedCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="py-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        {selectedCategory} Inspiration
      </h2>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="rounded-lg overflow-hidden shadow">
            <img
              src={item.src}
              alt={`${item.category} ${item.id}`}
              className="w-full h-60 object-cover"
            />
            <p className="text-center text-sm text-gray-800 font-medium px-2 py-3 border-t">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
// import { useParams } from "react-router-dom";
// import { useState } from "react";

// const galleryItems = [
//   { id: 1, category: "Bedroom", src: "/images/bedroom/bedroom_home.jpeg" },
//   { id: 2, category: "Kitchen", src: "/images/kitchen/kitchen_home.jpg" },
//   { id: 3, category: "Living Room", src: "/images/living/livingroom_home.jpg" },
//   { id: 4, category: "Bathroom", src: "/images/bathroom/bathroom_home.jpeg" },
//   { id: 5, category: "Outdoor", src: "/images/outdoor/outdoor_home.jpg" },
//   { id: 6, category: "Tv Unit", src: "/images/tvunit/tvunit_home.jpeg" },
//   { id: 7, category: "Dining", src: "/images/dining/dining_home.jpg" },
//   { id: 8, category: "Wardrobe", src: "/images/wardrobe/wardrobe_home.jpeg" },
// ];

// const categories = [
//   "All",
//   "Kitchen",
//   "Bedroom",
//   "Living Room",
//   "Bathroom",
//   "Dining",
//   "Outdoor",
//   "Tv Unit",
//   "Wardrobe",
// ];

// export default function InspirationDetail() {
//   const { category } = useParams();
//   const initialCat = category
//     ? category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
//     : "All";
//   const [selectedCategory, setSelectedCategory] = useState(initialCat);

//   const filteredImages =
//     selectedCategory === "All"
//       ? galleryItems
//       : galleryItems.filter((item) => item.category === selectedCategory);

//   return (
//     <div className="px-4 py-10 max-w-7xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6 text-center">{selectedCategory} Inspiration</h2>

//       {/* Filters */}
//       <div className="flex flex-wrap justify-center gap-2 mb-6">
//         {categories.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => setSelectedCategory(cat)}
//             className={`px-4 py-2 rounded-full text-sm font-medium border ${
//               selectedCategory === cat
//                 ? "bg-blue-600 text-white"
//                 : "text-gray-700 border-gray-300 hover:bg-gray-100"
//             }`}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>

//       {/* Image Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
//         <img
//           src={filteredImages[0]?.src}
//           alt="Selected Inspiration"
//           className="w-full rounded-xl shadow"
//         />

//         {/* Matching Products (static placeholder here) */}
//         <div>
//           <h3 className="text-lg font-semibold mb-3">Matching Products</h3>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="border rounded-lg p-2 shadow">
//               <div className="text-xs text-blue-500 mb-1">Sample Available</div>
//               <img src="/images/tiles/tile1.jpg" alt="Tile" className="mb-2 h-24 w-full object-cover" />
//               <div className="text-sm font-medium">Livon 4314 F 300x300 mm</div>
//               <div className="text-xs text-gray-500">Matte Anti Skid</div>
//               <div className="text-green-600 text-sm">₹338 <s className="text-gray-400 text-xs">₹599</s> (44% OFF)</div>
//             </div>

//             <div className="border rounded-lg p-2 shadow">
//               <img src="/images/laminates/laminate1.jpg" alt="Laminate" className="mb-2 h-24 w-full object-cover" />
//               <div className="text-sm font-medium">Suede Finish Laminate</div>
//               <div className="text-xs text-gray-500">1 mm Decorative</div>
//               <div className="text-green-600 text-sm">₹2204 <s className="text-gray-400 text-xs">₹3999</s> (45% OFF)</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
