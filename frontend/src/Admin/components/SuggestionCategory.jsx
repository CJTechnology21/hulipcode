import React from "react";
import { Link } from "react-router-dom";

// Replace with your actual image paths
const premiumServices = [
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

function SuggestionCategory() {
  return (
    <div className="w-full py-8 bg-[#f9fafb]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          Our Premium Services
        </h2>

        {/* Card grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-x-auto md:overflow-visible">
          {premiumServices.map((service) => (
            <Link
              to={`/category/${service.name}`}
              key={service.name}
              className="flex flex-col items-center text-center bg-white rounded-lg shadow hover:shadow-md transition-all"
            >
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-28 sm:h-32 md:h-36 object-cover rounded-t-lg"
              />
              <div className="py-2 px-2">
                <p className="text-sm md:text-base font-medium text-gray-700">{service.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SuggestionCategory;
