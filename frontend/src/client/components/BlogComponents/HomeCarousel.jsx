import React from "react";
import Slider from "react-slick";
import { FaRegEye, FaRegComment } from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Link } from "react-router-dom";
import carouselPosts from "./postsData"; // Import from your single source of truth

// Custom Arrow components
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-white rounded-md w-10 h-10 flex items-center justify-center shadow hover:bg-gray-200"
  >
    <IoChevronForward size={20} />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-white rounded-md w-10 h-10 flex items-center justify-center shadow hover:bg-gray-200"
  >
    <IoChevronBack size={20} />
  </button>
);

function HomeCarousel() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="p-4">
      <Slider {...settings}>
        {carouselPosts.map((post) => (
          <div key={post.id} className="relative">
            <Link to={`/blog/carousel/${post.id}`}>
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-[400px] object-cover rounded-xl cursor-pointer"
              />
            </Link>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl p-6 flex flex-col justify-end">
              <p className="text-xs uppercase font-semibold text-white">
                {post.date} / POST BY {post.author}
              </p>
              <h2 className="text-3xl font-bold text-white">{post.title}</h2>

              {/* Optional: stats placeholder since postsData doesn’t have them */}
              <div className="flex items-center gap-4 mt-2 text-sm font-semibold text-white">
                <span className="flex items-center gap-1">
                  <FaRegEye /> {post.views ?? 0} VIEWS
                </span>
                <span className="flex items-center gap-1">
                  <FaRegComment /> {post.comments ?? 0} COMMENT
                </span>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default HomeCarousel;

// import React from "react";
// import Slider from "react-slick";
// import { FaRegEye, FaRegComment } from "react-icons/fa";
// import { IoChevronBack, IoChevronForward } from "react-icons/io5";
// import { Link } from "react-router-dom";

// // Custom Arrow components
// const NextArrow = ({ onClick }) => (
//   <button
//     onClick={onClick}
//     className="absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-white rounded-md w-10 h-10 flex items-center justify-center shadow hover:bg-gray-200"
//   >
//     <IoChevronForward size={20} />
//   </button>
// );

// const PrevArrow = ({ onClick }) => (
//   <button
//     onClick={onClick}
//     className="absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-white rounded-md w-10 h-10 flex items-center justify-center shadow hover:bg-gray-200"
//   >
//     <IoChevronBack size={20} />
//   </button>
// );

// const slides = [
//   {
//     category: "Life Style",
//     date: "May 30, 2025",
//     author: "Emma Carson",
//     title: "Work From Home Without Losing Productivity",
//     views: 192,
//     comments: 0,
//     readTime: "2 MIN READ",
//     description:
//       "In a world that often feels overwhelming, building a joyful and fulfilling life doesn’t...",
//     image:
//       "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1470",
//   },
//   {
//     category: "Travel",
//     date: "June 10, 2025",
//     author: "Emma Carson",
//     title: "Discover the Beauty of Mountains",
//     views: 350,
//     comments: 5,
//     readTime: "3 MIN READ",
//     description:
//       "Exploring the mountains can bring peace, clarity, and a new perspective...",
//     image:
//       "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1470",
//   },
//   {
//     category: "Food",
//     date: "May 28, 2025",
//     author: "Emma Carson",
//     title: "Healthy Recipes for Busy People",
//     views: 120,
//     comments: 2,
//     readTime: "5 MIN READ",
//     description:
//       "Quick and delicious meals you can prepare in under 30 minutes...",
//     image:
//       "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1470",
//   },
//   {
//     category: "Inspiration",
//     date: "May 15, 2025",
//     author: "Emma Carson",
//     title: "Daily Habits to Boost Your Mood",
//     views: 215,
//     comments: 4,
//     readTime: "4 MIN READ",
//     description:
//       "Small changes in your routine can make a huge difference in your happiness...",
//     image:
//       "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1470",
//   },
// ];

// function HomeCarousel() {
//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//   };

//   return (
//     <div className="p-4">
//       <Slider {...settings}>
//         {slides.map((slide, idx) => (
//           <div key={idx} className="relative">
//             <Link to={`/blog/carousel/${idx}`}>
//               <img
//                 src={slide.image}
//                 alt={slide.title}
//                 className="w-full h-[400px] object-cover rounded-xl cursor-pointer"
//               />
//             </Link>

//             {/* Overlay */}
//             <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl p-6 flex flex-col justify-end">
//               {/* Top labels */}
//               <div className="flex justify-between text-white text-xs mb-2">
//                 <span className="bg-gray-800 px-2 py-1 rounded-full">
//                   {slide.category}
//                 </span>
//                 <span className="bg-gray-800 px-2 py-1 rounded-full">
//                   ⏱ {slide.readTime}
//                 </span>
//               </div>

//               <p className="text-xs uppercase font-semibold">
//                 {slide.date} / POST BY {slide.author}
//               </p>
//               <h2 className="text-3xl font-bold">{slide.title}</h2>
//               <p className="text-sm">{slide.description}</p>

//               {/* Bottom stats */}
//               <div className="flex items-center gap-4 mt-2 text-sm font-semibold">
//                 <span className="flex items-center gap-1">
//                   <FaRegEye /> {slide.views} VIEWS
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <FaRegComment /> {slide.comments} COMMENT
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// }

// export default HomeCarousel;
