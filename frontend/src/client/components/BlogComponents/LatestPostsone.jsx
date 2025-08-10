import React from "react";
import { IoTimeOutline, IoPaperPlane } from "react-icons/io5";

const posts = [
  {
    id: 1,
    category: "Life Style",
    time: "2 min read",
    date: "June 9, 2025",
    author: "Emma Carson",
    title: "Work From Home Without Losing Productivity",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1470", // Replace with real
  },
  {
    id: 2,
    category: "Life Style",
    time: "2 min read",
    date: "June 9, 2025",
    author: "Emma Carson",
    title: "Top Strategies for Remote Work Success",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1470", // Replace with real
  },
  {
    id: 3,
    category: "Life Style",
    time: "2 min read",
    date: "June 9, 2025",
    author: "Emma Carson",
    title: "Tips to Stay Focused When Working From Home",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1470", // Replace with real
  },
];

function LatestPostsone() {
  return (
    <div className="px-4 md:px-8 lg:px-16 py-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Latest Posts</h2>
      <div className="grid gap-6 md:grid-cols-4">
        {/* Posts */}
        {posts.map((post) => (
          <div key={post.id} className="flex flex-col">
            <div className="relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-56 object-cover rounded-lg"
              />
              <span className="absolute top-3 left-3 bg-gray-800 text-white text-xs px-3 py-1 rounded-full uppercase">
                {post.category}
              </span>
              <span className="absolute top-3 right-3 bg-gray-800 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <IoTimeOutline className="text-sm" />
                {post.time}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500">
                {post.date} <span className="mx-1">/</span> POST BY{" "}
                <span className="font-semibold">{post.author}</span>
              </p>
              <h3 className="mt-2 text-base md:text-lg font-semibold leading-snug hover:text-blue-600 cursor-pointer">
                {post.title}
              </h3>
            </div>
          </div>
        ))}

        {/* Subscribe box */}
        <div className="bg-gray-50 p-6 rounded-lg flex flex-col justify-between">
          <h3 className="text-xl font-semibold mb-4">
            Subscribe now to stay updated with top news!
          </h3>
          <form className="flex items-center bg-white border rounded-full overflow-hidden mb-3">
            <input
              type="email"
              placeholder="E-mail"
              className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
            />
            <button type="submit" className="bg-black text-white p-3">
              <IoPaperPlane />
            </button>
          </form>
          <div className="flex items-start space-x-2 text-xs text-gray-500">
            <input type="checkbox" className="mt-0.5" />
            <p>
              By clicking the Subscribe button, you acknowledge that you have
              read and agree to our{" "}
              <a href="#" className="font-semibold underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className="font-semibold underline">
                Terms Of Use
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LatestPostsone;
