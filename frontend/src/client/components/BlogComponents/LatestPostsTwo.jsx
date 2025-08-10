import React from "react";

const posts = [
  {
    id: 1,
    category: "Home Decor",
    readTime: "4 MIN READ",
    date: "May 30, 2025",
    author: "Emma Carson",
    title: "10 Simple Habits to Build a More Joyful and Fulfilling Life.",
    image:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1470",
    link: "#",
  },
  {
    id: 2,
    category: "Fashion",
    readTime: "4 MIN READ",
    date: "May 30, 2025",
    author: "Emma Carson",
    title: "Mastering Your Mind: Ways to Defeat Distractions Daily",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1470",
    link: "#",
  },
  {
    id: 3,
    category: "Travel",
    readTime: "4 MIN READ",
    date: "May 30, 2025",
    author: "Emma Carson",
    title: "Navigating a Noisy World: How to Stay Focused and Present Daily",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1470",
    link: "#",
  },
];

function LatestPostsTwo() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Grid with image cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.link}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
          >
            <div className="relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 left-4 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">
                {post.category.toUpperCase()}
              </div>
              <div className="absolute top-4 right-4 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <span>⏱</span> {post.readTime}
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500 uppercase leading-tight">
                {post.date} / POST BY{" "}
                <span className="font-semibold">{post.author}</span>
              </p>
              <h3 className="text-lg font-bold hover:text-gray-600 leading-snug">
                {post.title}
              </h3>
              <hr className="border-gray-200 mt-1" />
            </div>
          </a>
        ))}
      </div>

      {/* Compact simple list layout */}
      <div className="mt-10 grid md:grid-cols-3 gap-4">
        {posts.concat(posts).map((post) => (
          <div
            key={`${post.id}-${Math.random()}`}
            className="border-b border-gray-200 pb-1"
          >
            <p className="text-xs text-gray-500 uppercase leading-tight">
              {post.date} / POST BY{" "}
              <span className="font-semibold">{post.author}</span>
            </p>
            <h3 className="text-lg font-bold hover:text-gray-600 leading-snug">
              {post.title}
            </h3>
            <hr className="border-gray-200 mt-1" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default LatestPostsTwo;
