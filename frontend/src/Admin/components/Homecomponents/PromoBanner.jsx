

export default function PromoBanner() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row bg-[#f5efe7] rounded-xl overflow-hidden shadow-md">
        {/* Text Section */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Endless Tiles, Limitless Styles
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-3">
            Shop a Wide Range of Endless Tiles for Luxurious Look
          </p>
          <button className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium w-fit hover:bg-blue-700 transition">
            Shop Now
          </button>
        </div>

        {/* Image Section */}
        <div className="relative flex-1 h-40 sm:h-48">
          <img
            src="https://homebazaar-blog.s3.ap-south-1.amazonaws.com/knowledge/wp-content/uploads/2022/10/31122522/About-Fully-Furnished-Apartment.jpg"
            alt="Furnished Home"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
