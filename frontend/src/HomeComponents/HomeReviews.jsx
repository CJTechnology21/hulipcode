import React from "react";

function HomeReviews() {
  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Lorem Ipsum is simply dummy text
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Looking for work?{" "}
          <a href="/lroem" className="text-blue-600 font-medium">
            Browse jobs
          </a>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg shadow-sm border">
              <h3 className="text-gray-800 font-semibold text-sm mb-2">
                Lorem Ipsum is simply
              </h3>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <span className="text-blue-500 mr-1">★</span>
                {(4 + Math.random()).toFixed(2)}
              </div>
              <p className="text-xs text-gray-400">
                {Math.floor(Math.random() * 1000)} skills
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomeReviews;
