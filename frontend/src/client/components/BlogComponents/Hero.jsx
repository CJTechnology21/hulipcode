import React from 'react'
import blog1 from '../../images/blog1.jpg'
function Hero() {
  return (
   <div>
     {/* Top Section */}
      <div className="bg-white py-10 px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2 flex justify-center items-center mt-20">
              Interior Design
            </h2>
            <p className="text-6xl font-bold mb-4 flex justify-center items-center ml-10">
              Lorem Ipsum is simply dummy text of the printing
            </p>
            <p className="text-sm text-gray-600 flex justify-center items-center">
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s.
            </p>
            <p className="text-sm text-gray-600 flex justify-center items-center mt-6">
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s.
            </p>
          </div>
          <div className="flex justify-end">
            <img
              src={blog1}
              alt="blog1"
              className="w-full sm:w-[90%] md:w-[80%] lg:max-w-2xl h-auto rounded-lg object-cover"

            />
          </div>
        </div>
      </div>

      {/* Featured Image Section */}
      <div className="px-6 lg:px-20 my-10">
        <div className="relative max-w-4xl lg:max-w-3xl">
          <img
            src={blog1}
            alt="featured"
            className="w-full h-auto object-cover rounded-xl"
          />{" "}
          <div className="mt-2 ml-10">
            <h2 className="text-xl font-semibold mb-2 mt-2 flex justify-center items-center">
              Interior Design
            </h2>
            <p className="text-4xl font-bold mb-2 flex justify-center items-center">
              Lorem Ipsum is simply dummy text of the printing
            </p>
            <p className="text-sm text-gray-600 flex justify-center items-center">
              Lorem Ipsum has been the industry's standard dummy text.
            </p>
          </div>
        </div>
      </div>

      {/* Centered Image & Text Section */}
      <div className="text-center px-6 lg:px-20 my-10">
        <img
          src={blog1}
          alt="center"
          className="w-full max-w-7xl mx-auto h-[500px] rounded-lg mb-4"
        />
        <h2 className="text-xl font-semibold mb-2">Interior Design</h2>
        <p className="text-lg font-bold mb-2">
          Lorem Ipsum is simply dummy text of the printing
        </p>
        <p className="text-sm text-gray-600">
          Lorem Ipsum has been the industry's standard dummy text.
        </p>
      </div>

      {/* Card Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 lg:px-20 pb-10">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={blog1}
                alt={`card-${index}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-sm text-gray-500">Interior Design</h4>
                <p className="text-md font-semibold">
                  Lorem Ipsum is simply dummy text of the printing
                </p>
              </div>
            </div>
          ))}
      </div>
   </div>
  );
}

export default Hero;