import { useState } from "react";
import { Link } from "react-router-dom";
import subcategoriesMap from "./Subcategories";
import { FaChevronDown } from "react-icons/fa";
const categories = [
  {
    name: "Kitchen",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2024/4/411416852/JV/KJ/OE/34739903/u-shaped-modular-kitchen-design.jpg",
  },
  {
    name: "Laminates",
    image: "https://i.ytimg.com/vi/WFZPoa_Pg0w/mqdefault.jpg",
  },
  {
    name: "Wardrobe",
    image:
      "https://shop.gkwretail.com/cdn/shop/products/AlmirahModernWardrobeWith4Shelves.jpg?v=1649064644",
  },
  {
    name: "Flooring",
    image:
      "https://www.mikasafloors.com/blog/wp-content/uploads/2023/08/Redefine-Your-Living-Space-with-Oak-Engineered-Wood-Flooring.jpg",
  },
  {
    name: "LouversandPanels",
    image:
      "https://pareindia.com/wp-content/uploads/2024/12/Louvers-Armani-Grey.jpg",
  },
  {
    name: "Bathroom",
    image:
      "https://images.livspace-cdn.com/w:3840/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/design-ideas-thumbnails-1628773921-7vSz1/amj-2025-1744185110-pMHWe/bathroom-1744827010-dt7rh/new-project-10-1746176231-H1G5h.jpg",
  },
  {
    name: "Wallpaper",
    image: "https://images.wsj.net/im-969775/?width=1278&size=1",
  },
  {
    name: "Outdoor",
    image:
      "https://images.woodenstreet.de/image/data/outdoor-set/milano/set-of-4/12.jpg",
  },
  {
    name: "TVUnit",
    image:
      "https://images.jdmagicbox.com/quickquotes/images_main/tv-unit-2220422994-2ckrvgp2.jpg",
  },
];

function CategoryBar() {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <div className="relative z-40 w-full bg-white border-t border-b top-0 left-0">
      <div
        className="hidden md:block relative"
        onMouseEnter={() => {}}
        onMouseLeave={() => setHoveredCategory(null)}
      >
        {/* DESKTOP NAVBAR */}
        <div className="flex justify-center gap-8 py-3 px-4 text-sm font-medium whitespace-nowrap">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="relative flex items-center gap-1 cursor-pointer"
              onMouseEnter={() => setHoveredCategory(cat.name)}
            >
              <Link
                to={`/category/${cat.name}`}
                className="border-b-4 border-transparent hover:border-blue-500 transition-all flex items-center gap-1"
              >
                {cat.name}
                {subcategoriesMap[cat.name] && (
                  <FaChevronDown className="text-xs mt-[2px]" />
                )}
              </Link>
            </div>
          ))}
        </div>
        {/* <div className="flex justify-center gap-8 py-3 px-4 text-sm font-medium whitespace-nowrap">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="relative"
              onMouseEnter={() => setHoveredCategory(cat.name)}
            >
              <Link
                to={`/category/${cat.name}`}
                className="hover:text-blue-600 transition-colors"
              >
                {cat.name}
              </Link>
            </div>
          ))}
        </div> */}

        {/* DROPDOWN FIXED */}
        {hoveredCategory && subcategoriesMap[hoveredCategory] && (
          <div className="absolute left-0 top-full w-full bg-white shadow-lg border-t border-b z-40 overflow-hidden">
            <div className="max-w-screen-xl mx-auto px-12 py-6 grid grid-cols-4 gap-10">
              {Object.entries(subcategoriesMap[hoveredCategory]).map(
                ([section, items], idx, arr) => (
                  <div
                    key={section}
                    className={`pr-4 ${
                      idx < arr.length - 1 ? "border-r border-gray-200" : ""
                    }`}
                  >
                    <h4 className="text-blue-600 font-semibold mb-2 text-sm">
                      {section}
                    </h4>
                    <ul className="space-y-1 text-gray-800 text-sm">
                      {items.map((item) => {
                        const name =
                          typeof item === "string" ? item : item.name;
                        return (
                          <li key={name}>
                            <Link
                              to={`/${hoveredCategory.toLowerCase()}/${name
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                              className="hover:text-blue-500"
                            >
                              {name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE SCROLLER */}
      <div className="flex md:hidden overflow-x-auto gap-4 px-4 py-2 bg-white">
        {categories.map((cat) => (
          <Link
            to={`/category/${cat.name}`}
            key={cat.name}
            className="flex-shrink-0 text-center w-24"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-24 h-24 rounded-lg object-cover mx-auto shadow-sm"
            />
            <p className="mt-1 text-xs font-medium text-gray-700">{cat.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryBar;

// import React from "react";
// import { Link } from "react-router-dom";

// // Dummy images for now – replace these with real paths
// const categories = [
//   {
//     name: "Kitchen",
//     image:
//       "https://5.imimg.com/data5/SELLER/Default/2024/4/411416852/JV/KJ/OE/34739903/u-shaped-modular-kitchen-design.jpg",
//   },
//   {
//     name: "Living Room",
//     image: "https://i.ytimg.com/vi/WFZPoa_Pg0w/mqdefault.jpg",
//   },
//   {
//     name: "Child Bedroom",
//     image:
//       "https://hips.hearstapps.com/hmg-prod/images/kids-rooms-ideas-hbx040122inspoopener-013-1649366709.jpg?crop=0.835xw:1.00xh;0.0629xw,0&resize=980:*",
//   },
//   {
//     name: "Balcony",
//     image:
//       "https://media.designcafe.com/wp-content/uploads/2020/08/29114351/options-for-seating-in-balcony-interior-design-768x461.jpg",
//   },
//   {
//     name: "Louvers & Panels",
//     image:
//       "https://pareindia.com/wp-content/uploads/2024/12/Louvers-Armani-Grey.jpg",
//   },
//   {
//     name: "Bathroom",
//     image:
//       "https://images.livspace-cdn.com/w:3840/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/design-ideas-thumbnails-1628773921-7vSz1/amj-2025-1744185110-pMHWe/bathroom-1744827010-dt7rh/new-project-10-1746176231-H1G5h.jpg",
//   },
//   {
//     name: "Wallpaper",
//     image: "https://images.wsj.net/im-969775/?width=1278&size=1",
//   },
//   {
//     name: "Outdoor",
//     image:
//       "https://images.woodenstreet.de/image/data/outdoor-set/milano/set-of-4/12.jpg",
//   },
//   {
//     name: "TV Unit",
//     image:
//       "https://images.jdmagicbox.com/quickquotes/images_main/tv-unit-2220422994-2ckrvgp2.jpg",
//   },
// ];

// function CategoryBar() {
//   return (
//     <div className="w-full border-t border-b bg-white py-2">
//       {/* Desktop view – Text links */}
//       <div className="hidden md:flex justify-center gap-6 px-4 text-sm whitespace-nowrap">
//         {categories.map((cat) => (
//           <Link
//             to={`/category/${cat.name}`}
//             key={cat.name}
//             className="hover:text-blue-600 font-medium"
//           >
//             {cat.name}
//           </Link>
//         ))}
//       </div>

//       {/* Mobile view – Image with label */}
//       <div className="flex md:hidden overflow-x-auto gap-4 px-4 py-2">
//         {categories.map((cat) => (
//           <Link
//             to={`/category/${cat.name}`}
//             key={cat.name}
//             className="flex-shrink-0 text-center w-24"
//           >
//             <img
//               src={cat.image}
//               alt={cat.name}
//               className="w-24 h-24 rounded-lg object-cover mx-auto shadow-sm"
//             />
//             <p className="mt-1 text-xs font-medium text-gray-700">{cat.name}</p>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default CategoryBar;
