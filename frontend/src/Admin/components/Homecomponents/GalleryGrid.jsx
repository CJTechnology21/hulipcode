import { useNavigate } from "react-router-dom";

export default function GalleryGrid({ selectedCategory }) {
  const navigate = useNavigate();

  const galleryItems = [
    { id: 1, category: "Bedroom", src: "/images/bedroom/bedroom_home.jpeg" },
    { id: 2, category: "Kitchen", src: "/images/kitchen/kitchen_home.jpg" },
    { id: 3, category: "Living Room", src: "/images/living/livingroom_home.jpg" },
    { id: 4, category: "Bathroom", src: "/images/bathroom/bathroom_home.jpeg" },
    { id: 5, category: "Outdoor", src: "/images/outdoor/outdoor_home.jpg" },
    { id: 6, category: "TV Unit", src: "/images/tvunit/tvunit_home.jpeg" },
    { id: 7, category: "Dining", src: "/images/dining/dining_home.jpg" },
    { id: 8, category: "Wardrobe", src: "/images/wardrobe/wardrobe_home.jpeg" },
  ];

  const filteredItems =
    selectedCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {filteredItems.map((item) => (
        <div
          key={item.id}
          onClick={() => navigate(`/inspiration/${item.category}`)}
          className="relative cursor-pointer rounded-lg overflow-hidden shadow hover:shadow-md transition group"
        >
          <img
            src={item.src}
            alt={`${item.category} ${item.id}`}
            className="w-full h-60 object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          {/* Text overlay */}
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white text-center py-2 text-lg font-semibold">
            {item.category}
          </div>
        </div>
      ))}
    </div>
  );
}

// // GalleryGrid.jsx
// import { useNavigate } from "react-router-dom";

// export default function GalleryGrid({ selectedCategory }) {
//   const navigate = useNavigate();

//   const galleryItems = [
//     { id: 1, category: "Bedroom", src: "/images/bedroom/bedroom_home.jpeg" },
//     { id: 2, category: "Kitchen", src: "/images/kitchen/kitchen_home.jpg" },
//     { id: 3, category: "Living Room", src: "/images/living/livingroom_home.jpg" },
//     { id: 4, category: "Bathroom", src: "/images/bathroom/bathroom_home.jpeg" },
//     { id: 5, category: "Outdoor", src: "/images/outdoor/outdoor_home.jpg" },
//     { id: 6, category: "TV Unit", src: "/images/tvunit/tvunit_home.jpeg" },
//     { id: 7, category: "Dining", src: "/images/dining/dining_home.jpg" },
//     { id: 8, category: "Wardrobe", src: "/images/wardrobe/wardrobe_home.jpeg" },
//   ];

//   const filteredItems =
//     selectedCategory === "All"
//       ? galleryItems
//       : galleryItems.filter((item) => item.category === selectedCategory);

//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
//       {filteredItems.map((item) => (
//         <div
//           key={item.id}
//           onClick={() => navigate(`/inspiration/${item.category}`)}
//           className="cursor-pointer rounded-lg overflow-hidden shadow hover:shadow-md transition"
//         >
//           <img
//             src={item.src}
//             alt={`${item.category} ${item.id}`}
//             className="w-full h-60 object-cover"
//           />
//           <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white text-center py-2 text-lg font-semibold">
//             {item.category}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }