
import React from 'react';

const LayoutImages = () => {
  const images = [
    'https://picsum.photos/seed/1/400/300',
    'https://picsum.photos/seed/2/400/300',
    'https://picsum.photos/seed/3/400/300',
    'https://picsum.photos/seed/4/400/300',
    'https://picsum.photos/seed/5/400/300',
    'https://picsum.photos/seed/6/400/300',
  ];

  return (
    <div className="px-6 py-6 font-figtree bg-gray-100">
      <h2 className="text-xl sm:text-2xl font-semibold text-center mb-8">
        Lorem Ipsum is simply dummy
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((src, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm text-center"
          >
            <img
              src={src}
              alt={`Random ${index + 1}`}
              className="w-full h-56 object-cover rounded-md mb-3"
            />
            <p className="text-sm font-medium">
              Lorem Ipsum is simply dummy text of the printing
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayoutImages;
