import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import img1 from "../images/b1.png";
import img2 from "../images/b2.png";
import img3 from "../images/b3.png";

const slides = [
  {
    img: img1,
    title: "Inner Peace",
    category: "Bed Room",
    index: "01",
  },
  {
    img: img2,
    title: "Natural Light",
    category: "Dining",
    index: "02",
  },
  {
    img: img3,
    title: "Earth Tones",
    category: "Living Room",
    index: "03",
  },
];

const Carousel = () => {
  return (
    <section className="w-full px-4 py-12 md:py-16 bg-[#f8f9fb] font-[Poppins]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        {/* Left Text */}
        <div className="md:w-1/2 space-y-4 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-semibold leading-snug">
            50+ Beautiful rooms inspiration
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Our designer already made a lot of beautiful prototype of rooms that inspire you
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 text-sm font-medium rounded hover:bg-blue-700">
            Explore More
          </button>
        </div>

        {/* Right Carousel */}
        <div className="md:w-1/2 w-full">
          <Swiper
            spaceBetween={20}
            slidesPerView={1.2}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Navigation, Pagination, Autoplay]}
            className="rounded-lg"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="relative overflow-hidden rounded-xl shadow-md">
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur">
                    <p className="text-sm text-gray-500">
                      {slide.index} — {slide.category}
                    </p>
                    <h3 className="text-xl font-semibold">{slide.title}</h3>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Carousel;

// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// import img1 from '../images/b1.png';
// import img2 from '../images/b2.png';
// import img3 from '../images/'
// const slides = [
//   {
//     img: img1,
//     title: "Inner Peace",
//     category: "Bed Room",
//     index: "01",
//   },
//   {
//     img: img2,
//     title: "Natural Light",
//     category: "Dining",
//     index: "02",
//   },
//   {
//     img: img3,
//     title: "Earth Tones",
//     category: "Living Room",
//     index: "03",
//   },
// ];

// const Carousel = () => {
//   return (
//     <section className="w-full px-6 py-16 bg-[#f8f9fb] font-[Poppins]">
//       <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
//         {/* Left Text */}
//         <div className="md:w-1/2 space-y-5 text-center md:text-left">
//           <h2 className="text-3xl md:text-4xl font-semibold leading-snug">
//             50+ Beautiful rooms inspiration
//           </h2>
//           <p className="text-gray-600">
//             Our designer already made a lot of beautiful prototype of rooms that inspire you
//           </p>
//           <button className="bg-blue-600 text-white px-6 py-3 text-sm font-medium rounded hover:bg-blue-700">
//             Explore More
//           </button>
//         </div>

//         {/* Right Carousel */}
//         <div className="md:w-1/2 w-full">
//           <Swiper
//             spaceBetween={20}
//             slidesPerView={1.2}
//             pagination={{ clickable: true }}
//             navigation={true}
//             modules={[Navigation, Pagination]}
//             className="rounded-lg"
//           >
//             {slides.map((slide, index) => (
//               <SwiperSlide key={index}>
//                 <div className="relative overflow-hidden rounded-xl shadow-md">
//                   <img
//                     src={slide.img}
//                     alt={slide.title}
//                     className="w-full h-96 object-cover"
//                   />
//                   <div className="absolute bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur">
//                     <p className="text-sm text-gray-500">
//                       {slide.index} — {slide.category}
//                     </p>
//                     <h3 className="text-xl font-semibold">{slide.title}</h3>
//                   </div>
//                   <div className="absolute bottom-4 right-4 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700">
//                     <svg
//                       className="w-4 h-4 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth={2}
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                     </svg>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Carousel;
