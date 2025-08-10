
import React from "react";
import { useParams, Link } from "react-router-dom";
import carouselPosts from "./postsData";
import RelatedPosts from "./RelatedPosts";

function CarouselDetail() {
  const { id } = useParams();
  const post = carouselPosts.find((p) => p.id === Number(id));

  if (!post) return <p>Post not found</p>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <Link to="/" className="text-blue-500 underline mb-4 inline-block">
        ← Back to Carousel
      </Link>

      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 mb-4">
        {post.date} / POST BY {post.author}
      </p>
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-96 object-cover rounded-xl mb-6"
      />

      {post.content.map((section, index) => (
        <div key={index} className="mb-4">
          <h2 className="text-xl font-semibold">{section.heading}</h2>
          <p className="text-gray-700">{section.text}</p>
        </div>
      ))}
      <RelatedPosts/>
    </div>
  );
}

export default CarouselDetail;