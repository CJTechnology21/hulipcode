
import React from "react";
import image_grid from "../images/image_grid.svg";

function ImageGrid() {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-start overflow-hidden relative">
      {/* Top Centered Text */}
      <div className="text-center mt-8 mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 font-poppins">
          Share your setup
        </h2>
      </div>

      {/* Image Grid */}
      <div className="w-full max-w-screen px-2 sm:px-4 flex justify-center">
        <img
          src={image_grid}
          alt="Setup"
          className="w-full h-[80vh] sm:h-[90vh] object-cover rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
}

export default ImageGrid;

// import React from "react";
// import image_grid from "../images/image_grid.svg";

// function ImageGrid() {
//   return (
//     <div className="w-full min-h-screen bg-white flex items-center justify-center overflow-hidden">
//       <div className="w-full max-w-screen overflow-hidden px-6 sm:px-4">
//         <img
//           src={image_grid}
//           alt="Setup"
//           className="w-full h-[80vh] sm:h-[90vh] object-cover rounded-xl shadow-lg"
//         />
//       </div>
//     </div>
//   );
// }

// export default ImageGrid;
