import React, { useState } from "react";
import Slider from "react-slick";
import { FaRegEye, FaRegComment } from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Link } from "react-router-dom";
import carouselPosts from "./postsData";

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
        {carouselPosts.map((item) => (
          <div key={item.id} className="relative">
            <Link to={`/blog/carousel/${item.id}`}>
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-[400px] object-cover rounded-xl cursor-pointer"
              />
            </Link>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl p-6 flex flex-col justify-end">
              <p className="text-xs uppercase font-semibold text-white">
                {item.date} / POST BY {item.author}
              </p>
              <h2 className="text-3xl font-bold text-white">{item.title}</h2>

              <div className="flex items-center gap-4 mt-2 text-sm font-semibold text-white">
                <span className="flex items-center gap-1">
                  <FaRegEye /> {item.views ?? 0} VIEWS
                </span>
                <span className="flex items-center gap-1">
                  <FaRegComment /> {item.comments ?? 0} COMMENT
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

// import React, { useState } from "react";
// import Slider from "react-slick";
// import { FaRegEye, FaRegComment } from "react-icons/fa";
// import { IoChevronBack, IoChevronForward } from "react-icons/io5";
// import { useNavigate } from "react-router-dom";
// import carouselPosts from "./postsData"; // fixed name

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

// function HomeCarousel() {
//   const navigate = useNavigate();
//   const [dragging, setDragging] = useState(false);

//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     beforeChange: () => setDragging(true),
//     afterChange: () => setDragging(false),
//   };

//   const handleClick = (id) => {
//     if (!dragging) {
//       navigate(`/blog/carousel/${id}`);
//     }
//   };

//   return (
//     <div className="p-4">
//       <Slider {...settings}>
//         {carouselPosts.map((item) => (
//           <div key={item.id} className="relative">
//             <img
//               src={item.image}
//               alt={item.title}
//               className="w-full h-[400px] object-cover rounded-xl cursor-pointer"
//               onClick={() => handleClick(item.id)}
//             />

//             {/* Overlay */}
//             <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl p-6 flex flex-col justify-end">
//               <p className="text-xs uppercase font-semibold text-white">
//                 {item.date} / POST BY {item.author}
//               </p>
//               <h2 className="text-3xl font-bold text-white">{item.title}</h2>

//               <div className="flex items-center gap-4 mt-2 text-sm font-semibold text-white">
//                 <span className="flex items-center gap-1">
//                   <FaRegEye /> {item.views ?? 0} VIEWS
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <FaRegComment /> {item.comments ?? 0} COMMENT
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
