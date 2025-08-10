import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import carouselPosts from "./postsData";
import RelatedPosts from "./RelatedPosts";
import BlogFooter from "./BlogFooter";

function CarouselDetail() {
  const { id } = useParams();
  const post = carouselPosts.find((p) => p.id === Number(id));

  // Scroll to top when page loads or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) return <p>Post not found</p>;

  return (
    <div className="p-4 max-w-9xl mx-auto overflow-x-hidden">
      <Link
        to="/blog"
        className="text-blue-500 underline mb-4 inline-block hover:text-blue-700"
      >
        ← Back To Blog
      </Link>
      <h1 className="text-3xl font-bold mb-2 break-words">{post.title}</h1>
      <p className="text-gray-500 mb-4">
        {post.date} / POST BY {post.author}
      </p>
      <img
        src={post.image}
        alt={post.title}
        className="w-full max-w-full h-96 object-cover rounded-xl mb-6"
      />
      {post.content.map((section, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-xl font-semibold mb-2 break-words">
            {section.heading}
          </h2>
          <p className="text-gray-700 leading-relaxed break-words">
            {section.text}
          </p>
        </div>
      ))}
      <RelatedPosts />
      <BlogFooter />
    </div>
  );
}

export default CarouselDetail;
