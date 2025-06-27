


import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';

const reviews = [
  {
    name: 'John Doe',
    time: '2 hours ago',
    text: 'Amazing experience!',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    name: 'Priya Sharma',
    time: '1 day ago',
    text: 'Very professional and responsive.',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    name: 'Leo Martinez',
    time: '3 days ago',
    text: 'Highly recommended!',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    name: 'Ana Li',
    time: '5 days ago',
    text: 'Excellent service.',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
  {
    name: 'Sam Patel',
    time: '6 days ago',
    text: 'Friendly and efficient.',
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
  {
    name: 'Emily Ross',
    time: '1 week ago',
    text: 'Truly impressive!',
    image: 'https://randomuser.me/api/portraits/women/6.jpg',
  },
];

const CARDS_PER_VIEW = 4;

const CustomerReviews = () => {
  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    setStartIndex((prev) => (prev - CARDS_PER_VIEW < 0 ? 0 : prev - CARDS_PER_VIEW));
  };

  const handleNext = () => {
    if (startIndex + CARDS_PER_VIEW < reviews.length) {
      setStartIndex((prev) => prev + CARDS_PER_VIEW);
    }
  };

  const visibleReviews = reviews.slice(startIndex, startIndex + CARDS_PER_VIEW);

  return (
    <div className="bg-white p-4 rounded shadow w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold font-fredoka">Customer Reviews</h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center"
          >
            &lt;
          </button>
          <button
            onClick={handleNext}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Review Cards */}
      <div className="flex gap-4 overflow-hidden transition-all duration-300">
        {visibleReviews.map((review, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded p-4 min-w-[270px] max-w-[270px] flex justify-between shadow-sm"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <FaUserCircle className="text-gray-500 text-xl" />
                <div>
                  <p className="font-semibold text-gray-800 font-fredoka">{review.name}</p>
                  <p className="text-xs text-gray-500 font-fredoka">{review.time}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-700 font-fredoka">"{review.text}"</p>
              <div className="flex text-yellow-400 mt-2 text-sm">
                {[...Array(5)].map((_, i) => (
                  <AiFillStar key={i} />
                ))}
              </div>
            </div>
            <img
              src={review.image}
              alt={review.name}
              className="w-20 h-20 rounded-full object-cover ml-4 self-start"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;
