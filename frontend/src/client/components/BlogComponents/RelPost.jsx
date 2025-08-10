import React from "react";

function RelPost() {
  const posts = [
    {
      category: "LIFE STYLE",
      readTime: "2 MIN READ",
      date: "JUNE 9, 2025",
      author: "EMMA CARSON",
      title: "How to Avoid Distractions When Working Remotely",
      image:
        "https://imgd.aeplcdn.com/272x153/n/cw/ec/201293/hunter-350-2025-right-side-view-2.jpeg?isig=0&q=80",
    },
    {
      date: "JUNE 9, 2025",
      author: "EMMA CARSON",
      title: "Top Strategies for Remote Work Success",
    },
    {
      date: "JUNE 9, 2025",
      author: "EMMA CARSON",
      title: "Top Strategies for Remote Work Success",
    },
    {
      date: "JUNE 9, 2025",
      author: "EMMA CARSON",
      title: "Top Strategies for Remote Work Success",
    },
    {
      date: "JUNE 9, 2025",
      author: "EMMA CARSON",
      title: "Top Strategies for Remote Work Success",
    },
    {
      date: "JUNE 9, 2025",
      author: "EMMA CARSON",
      title: "Top Strategies for Remote Work Success",
    },
    {
      date: "JUNE 9, 2025",
      author: "EMMA CARSON",
      title: "Top Strategies for Remote Work Success",
    },
  ];

  const tags = [
    "Adventure",
    "Breaking",
    "Entertainment",
    "Fashion",
    "Life Style",
    "Music",
    "Popular Post",
    "Sports",
    "Technology",
    "Travel List",
    "Trending",
  ];

  return (
    <div className="mt-10">
      <h3 className="font-bold text-lg mb-4">Related Post</h3>

      {/* First post with image */}
      <div className="rounded-xl overflow-hidden mb-6">
        <div className="relative">
          <img
            src={posts[0].image}
            alt={posts[0].title}
            className="w-full h-48 object-cover"
          />
          <span className="absolute top-4 left-4 bg-gray-700 text-white px-3 py-1 rounded text-xs">
            {posts[0].category}
          </span>
          <span className="absolute top-4 right-4 bg-white text-gray-700 px-3 py-1 rounded text-xs">
            {posts[0].readTime}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          {posts[0].date} / POST BY{" "}
          <span className="font-semibold">{posts[0].author}</span>
        </p>
        <h4 className="font-bold mt-1">{posts[0].title}</h4>
      </div>

      {/* Other posts */}
      <div className="space-y-6">
        {posts.slice(1).map((post, index) => (
          <div key={index} className="border-t pt-4">
            <p className="text-xs text-gray-500">
              {post.date} / POST BY{" "}
              <span className="font-semibold">{post.author}</span>
            </p>
            <h4 className="font-bold mt-1">{post.title}</h4>
          </div>
        ))}
      </div>

      {/* Popular Tags */}
      <div className="mt-10 border-t pt-6">
        <h3 className="font-bold text-lg mb-4">Popular Tag</h3>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="border px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RelPost;
