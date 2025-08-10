import React from "react";

const posts = [
  {
    id: 1,
    category: "Life Style",
    date: "June 10, 2025",
    author: "Emma Carson",
    title: "How to Stay Productive While Working Remotely From Home",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQryv1rqWHKLFXijbCPmwEP0w8MjdcpPdknyQ&s", // replace with actual
  },
  {
    id: 2,
    category: "Life Style",
    date: "June 10, 2025",
    author: "Emma Carson",
    title: "Strategies for Effective and Productive Remote Work",
    image:
      "https://thearchitectsdiary.com/wp-content/uploads/2020/02/pexels-photo-106399-e1563903680874.jpeg", // replace with actual
  },
  {
    id: 3,
    category: "Life Style",
    date: "June 10, 2025",
    author: "Emma Carson",
    title: "Avoiding Productivity Loss When Working From Home",
    image:
      "https://archi-monarch.com/wp-content/uploads/2023/02/RESIDENTIAL-BUILDING-DESIGN-IN-ARCHITECTURE.webp", // replace with actual
  },
  {
    id: 4,
    category: "Life Style",
    date: "June 9, 2025",
    author: "Emma Carson",
    title: "Habits That Help You Stay Productive at Home",
    image:
      "https://fontanarchitecture.com/wp-content/uploads/2017/04/Things-To-Consider-When-Building-a-House.jpg", // replace with actual
  },
];

function RelatedPosts() {
  return (
    <div className="px-4 md:px-8 lg:px-16 py-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Related Post</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex flex-col"
          >
            <div className="relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-56 object-cover rounded-lg"
              />
              <span className="absolute top-3 left-3 bg-gray-800 text-white text-xs px-3 py-1 rounded-full uppercase">
                {post.category}
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
      </div>
    </div>
  );
}

export default RelatedPosts;
