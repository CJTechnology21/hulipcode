
import { useState } from "react";
import GalleryGrid from "./GalleryGrid";

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

export default function InspirationGallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="py-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Inspiration Gallery</h2>

      {/* Category Tabs */}
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

      {/* Image Grid for Selected Category */}
      <GalleryGrid selectedCategory={selectedCategory} />
    </div>
  );
}