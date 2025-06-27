import React from "react";
import blog1 from "../../images/blog1.jpg";
export default function Test() {
  return (
    <div>
      <div className="bg-white py-10 px-6 lg:px-20">
        <div className="text-gray-400 text-4xl flex justify-center items-center ">
          LOREM IPSUM
         
        </div>
        <div className="text-black flex justify-center items-center mt-2 text-lg">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta, voluptatum!
        </div>
        <div className="text-white flex justify-center items-center mt-4">
            <button className="bg-blue-600 p-3 rounded-sm hover:cursor-pointer">Read More</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
          <div>
            <h2 className="text-xl font-semibold mb-2 flex justify-center items-center mt-4">
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
    </div>
  );
}
