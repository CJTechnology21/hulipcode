import React from "react";
import Slider from "react-slick";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { AiOutlineClockCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import postsData from "./postsData"; // Using your main posts data

// Custom Arrows
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 right-0 z-10 -translate-y-1/2 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-gray-800"
  >
    <IoChevronForward size={20} />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 left-0 z-10 -translate-y-1/2 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-gray-800"
  >
    <IoChevronBack size={20} />
  </button>
);

function MorePosts() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="p-4 relative">
      <h2 className="text-2xl font-bold mb-4">Most Popular</h2>
      <Slider {...settings}>
        {postsData.map((post) => (
          <div key={post.id} className="px-2">
            <Link to={`/blog/carousel/${post.id}`}>
              {/* Image with category & read time overlay */}
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="rounded-xl w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-gray-900 text-white text-xs px-3 py-1 rounded-full">
                  {post.category}
                </div>
                <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <AiOutlineClockCircle size={14} /> {post.readTime}
                </div>
              </div>

              {/* Meta Info */}
              <p className="mt-2 text-xs uppercase text-gray-500 font-semibold">
                {post.date} <span className="mx-1">/</span> POST BY {post.author}
              </p>

              {/* Title */}
              <h3 className="font-semibold text-black text-lg mt-1 line-clamp-2 hover:underline">
                {post.title}
              </h3>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default MorePosts;
