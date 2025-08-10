import React from "react";
import BlogHeader from "./BlogHeader";
import articles from "./articlesData"; // adjust path if needed
import CategorySidebar from "./CategorySideBar";
import BlogFooter from "./BlogFooter";
import RelPost from "./RelPost";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";

function CategoryOne() {
  const navigate = useNavigate();
  return (
    <div>
      <BlogHeader />

      <div className="max-w-9xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
        {/* LEFT CONTENT (Blog Cards) */}
        <div className="lg:col-span-2 space-y-8">
          {articles.map((article, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200"
            >
              {/* Image */}
              <div className="relative sm:w-1/2 h-64 w-full">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-64 sm:h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {article.category}
                </span>
                <span className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {article.readTime}
                </span>
              </div>

              {/* Text Content */}
              <div className="p-6 flex flex-col justify-center sm:w-1/2">
                <p className="text-sm text-gray-500 font-semibold">
                  {article.date} / POST BY{" "}
                  <span className="font-bold text-gray-700">
                    {article.author}
                  </span>
                </p>
                <h2 className="text-2xl font-bold mt-2">{article.title}</h2>
                <p className="text-gray-600 mt-3">{article.description}</p>
                <Button
                  variant="outlined"
                  className="mt-4 font-semibold text-black hover:underline"
                  onClick={()=>navigate('/poststyleone')}
                >
                  Read More
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-8">
          <CategorySidebar />
          <RelPost />
        </div>
      </div>

      <BlogFooter />
    </div>
  );
}

export default CategoryOne;
