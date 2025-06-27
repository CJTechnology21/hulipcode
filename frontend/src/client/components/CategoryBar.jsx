import React from "react";
import { Link } from "react-router-dom";

// Dummy images for now – replace these with real paths
const categories = [
  {
    name: "Kitchen",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2024/4/411416852/JV/KJ/OE/34739903/u-shaped-modular-kitchen-design.jpg",
  },
  {
    name: "Living Room",
    image: "https://i.ytimg.com/vi/WFZPoa_Pg0w/mqdefault.jpg",
  },
  {
    name: "Child Bedroom",
    image:
      "https://hips.hearstapps.com/hmg-prod/images/kids-rooms-ideas-hbx040122inspoopener-013-1649366709.jpg?crop=0.835xw:1.00xh;0.0629xw,0&resize=980:*",
  },
  {
    name: "Balcony",
    image:
      "https://media.designcafe.com/wp-content/uploads/2020/08/29114351/options-for-seating-in-balcony-interior-design-768x461.jpg",
  },
  {
    name: "Louvers & Panels",
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
    name: "TV Unit",
    image:
      "https://images.jdmagicbox.com/quickquotes/images_main/tv-unit-2220422994-2ckrvgp2.jpg",
  },
];

function CategoryBar() {
  return (
    <div className="w-full border-t border-b bg-white py-2">
      {/* Desktop view – Text links */}
      <div className="hidden md:flex justify-center gap-6 px-4 text-sm whitespace-nowrap">
        {categories.map((cat) => (
          <Link
            to={`/category/${cat.name}`}
            key={cat.name}
            className="hover:text-blue-600 font-medium"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Mobile view – Image with label */}
      <div className="flex md:hidden overflow-x-auto gap-4 px-4 py-2">
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

// // CategoryBar.jsx
// import React from "react";
// import { Link } from "react-router-dom";

// const categories = [
//   "Kitchen",
//   "Living Room",
//   "Child Bedroom",
//   "Balcony",
//   "Louvers & Panels",
//   "Bathroom",
//   "Wallpaper",
//   "Outdoor",
//   "TV Unit",
// ];

// function CategoryBar() {
//   return (
//     <div className="w-full border-t border-b py-2 overflow-x-auto bg-white">
//       <div className="flex justify-center gap-6 px-4 text-sm whitespace-nowrap">
//         {categories.map((cat) => (
//           <Link
//             to={`/category/${cat}`}
//             key={cat}
//             className="hover:text-blue-600 font-medium"
//           >
//             {cat}
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default CategoryBar;
