import React from 'react';
import blog1 from '../../images/blog1.jpg'; // Adjust the path if needed

function ImagesSection() {
  return (
    <div className="px-4 py-8 font-figtree bg-white">
      {/* Main Heading */}
      <h2 className="text-xl sm:text-2xl font-semibold text-center mb-8">
        Lorem Ipsum is simply dummy text of the printing
      </h2>

      {/* Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section: Main Image with Text and Background */}
        <div className="lg:w-2/3 w-full bg-gray-100 p-5 rounded-lg space-y-4">
          <img
            src={blog1}
            alt="Main"
            className="w-full h-96 object-cover rounded-md"
          />
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              Lorem Ipsum is simply dummy text of the printing
            </h3>
            <p className="text-sm text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod
              malesuada. Nullam ac urna eu felis dapibus condimentum sit amet a
              augue.
            </p>
          </div>
        </div>

        {/* Right Section: List of Image Cards */}
        <div className="lg:w-1/3 w-full flex flex-col gap-10">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm"
            >
              <img
                src={blog1}
                alt={`Thumbnail ${item}`}
                className="w-20 h-20 object-cover rounded-md mr-4"
              />
              <p className="text-sm font-semibold leading-snug">
                Lorem Ipsum is simply dummy text of the printing
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImagesSection;

// import React from 'react';
// import blog1 from '../../images/blog1.jpg'; // Replace with correct image path

// function ImagesSection() {
//   return (
//     <div className="px-4 py-8 font-figtree bg-white">
//       {/* Heading */}
//       <h2 className="text-xl sm:text-2xl font-semibold text-center mb-8">
//         Lorem Ipsum is simply dummy text of the printing
//       </h2>

//       {/* Layout */}
//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* Left: Main image with caption */}
//         <div className="lg:w-2/3 w-full flex flex-col items-center space-y-4">
//           <img
//             src={blog1}
//             alt="Main"
//             className="w-full h-96 object-cover rounded-lg"
//           />
//           <h3 className="text-lg font-medium text-center">
//             Lorem Ipsum is simply dummy text of the printing
//           </h3>
//         </div>

//         {/* Right: List of cards */}
//         <div className="lg:w-1/3 w-full flex flex-col gap-4">
//           {[1, 2, 3, 4].map((item) => (
//             <div
//               key={item}
//               className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm"
//             >
//               <img
//                 src={blog1}
//                 alt={`Thumbnail ${item}`}
//                 className="w-20 h-20 object-cover rounded-md mr-4"
//               />
//               <p className="text-sm font-semibold">
//                 Lorem Ipsum is simply dummy text of the printing
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ImagesSection;
