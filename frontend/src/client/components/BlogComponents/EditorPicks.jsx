import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineClockCircle } from "react-icons/ai";
import postsData from "./postsData";

function EditorPicks() {
  // Pick first post as main and next three as side posts
  const mainPost = postsData[0];
  const sidePosts = postsData.slice(1, 4);

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Editor picks</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Main Post */}
        <div>
          <Link to={`/blog/carousel/${mainPost.id}`}>
            <div className="relative">
              <img
                src={mainPost.image}
                alt={mainPost.title}
                className="rounded-xl w-full h-96 object-cover"
              />
              {/* Category */}
              <div className="absolute top-3 left-3 bg-white/80 text-black text-xs px-3 py-1 rounded-full font-semibold">
                {mainPost.category}
              </div>
              {/* Read Time */}
              <div className="absolute top-3 right-3 bg-white/80 text-black text-xs px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
                <AiOutlineClockCircle size={14} />
                {mainPost.readTime}
              </div>
            </div>
          </Link>

          {/* Meta info */}
          <p className="mt-4 text-xs uppercase text-gray-500 font-semibold">
            {mainPost.date} <span className="mx-1">/</span> POST BY{" "}
            <span className="text-blue-500">{mainPost.author}</span>
          </p>

          {/* Title */}
          <h3 className="mt-2 text-2xl font-bold hover:underline">
            <Link to={`/blog/carousel/${mainPost.id}`}>{mainPost.title}</Link>
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 mt-2">{mainPost.excerpt}</p>

          {/* Read More */}
          <Link
            to={`/blog/carousel/${mainPost.id}`}
            className="mt-3 inline-block text-sm font-semibold text-black hover:underline"
          >
            Read More
          </Link>
        </div>

        {/* Right - Side Posts */}
        <div className="flex flex-col gap-6">
          {sidePosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/carousel/${post.id}`}
              className="flex gap-4 group"
            >
              {/* Image */}
              <div className="relative min-w-[150px] w-[150px] h-[100px]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="rounded-lg w-full h-full object-cover"
                />
                {/* Category */}
                <div className="absolute top-2 left-2 bg-white/80 text-black text-[10px] px-2 py-1 rounded-full font-semibold">
                  {post.category}
                </div>
                {/* Read Time */}
                <div className="absolute top-2 right-2 bg-white/80 text-black text-[10px] px-2 py-1 rounded-full flex items-center gap-1 font-semibold">
                  <AiOutlineClockCircle size={10} />
                  {post.readTime}
                </div>
              </div>

              {/* Text Info */}
              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold">
                  {post.date} <span className="mx-1">/</span> POST BY {post.author}
                </p>
                <h4 className="font-bold text-black group-hover:underline">
                  {post.title}
                </h4>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EditorPicks;
