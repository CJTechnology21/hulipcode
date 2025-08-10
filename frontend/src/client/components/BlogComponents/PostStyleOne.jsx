import React from "react";
import BlogHeader from "./BlogHeader";
import { FaFacebookF, FaPinterestP, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Button from "../../../components/Button";
import RelatedPosts from "./RelatedPosts";
import BlogFooter from "./BlogFooter";

function PostStyleOne() {
  return (
    <div className="font-figtree">
      <BlogHeader />

      {/* Post meta and title */}
      <div className="text-center max-w-3xl mx-auto px-4 mt-8">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
          <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-semibold">
            Fitness
          </span>
          <span>May 30, 2025</span>
          <span className="hidden sm:inline">/</span>
          <span className="uppercase">Post By</span>
          <span className="font-semibold">Emma Carson</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mt-4 leading-snug sm:leading-tight">
          Home Workouts That Actually Work for Busy People Daily
        </h1>

        <div className="flex flex-wrap items-center justify-center mt-4 gap-2 text-gray-500">
          <img
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="Author"
            className="w-8 h-8 rounded-full"
          />
          <span className="uppercase">Post By</span>
          <span className="font-semibold">Emma Carson</span>
        </div>
      </div>

      {/* Featured image */}
      <div className="p-2 sm:p-4">
        <div className="rounded-xl overflow-hidden">
          <img
            src="https://cdna.artstation.com/p/assets/images/images/029/996/332/large/emilio-r-camarena-emkun-paisaje3.jpg?1599263064"
            alt="Random scenic view"
            className="w-full h-60 sm:h-80 md:h-96 object-cover"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 md:flex md:gap-8 mt-8">
        {/* Share buttons */}
        <div className="flex flex-wrap md:flex-col gap-3 justify-center md:justify-start md:w-48 mb-6 md:mb-0">
          {[
            { icon: <FaFacebookF />, label: "facebook" },
            { icon: <FaXTwitter />, label: "twitter" },
            { icon: <FaPinterestP />, label: "pinterest" },
            { icon: <FaInstagram />, label: "instagram" },
          ].map((btn, index) => (
            <button
              key={index}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-semibold text-sm sm:text-base"
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>

        {/* Article content */}
        <div className="prose prose-sm sm:prose-base max-w-none">
          <p>
            In a world that often feels overwhelming, building a joyful and
            fulfilling life doesn’t have to be complicated. Sometimes, it’s the
            small, consistent habits that create the biggest impact...
          </p>

          <h2 className="mt-6 text-black text-xl sm:text-2xl font-bold mb-2">
            1. Start Your Day with Gratitude.
          </h2>
          <p>
            Start your mornings by writing down three things you’re grateful for...
          </p>

          <h2 className="mt-6 text-black text-xl sm:text-2xl font-bold mb-2">
            2. Move Your Body with Joy.
          </h2>
          <p>
            Exercise shouldn’t feel like a chore...
          </p>

          {/* Quote block */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 text-center my-8">
            <div className="w-10 sm:w-12 h-1 bg-black mx-auto mb-4"></div>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold italic">
              “Joy is not found in grand moments, but in the quiet, simple
              habits we nurture every day.”
            </p>
            <p className="mt-4 text-gray-600 font-medium">John Smith</p>
          </div>

          {/* Image block */}
          <div className="rounded-xl overflow-hidden my-4">
            <img
              src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1470&auto=format&fit=crop"
              alt="Calm and nurturing environment"
              className="w-full h-56 sm:h-72 md:h-80 object-cover"
            />
          </div>
        </div>
      </div>

      {/* About the Author */}
      <div className="max-w-6xl mx-auto px-4 mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-t border-gray-200 pt-8">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Author"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
          />
          <div>
            <h3 className="text-lg sm:text-xl font-bold">About The Author</h3>
            <p className="mt-2 text-sm sm:text-base">
              Emma Carson (@Emma_carson) is a writer who draws...
            </p>
            <div className="flex gap-3 sm:gap-4 mt-3 text-lg sm:text-xl text-gray-600">
              <FaFacebookF className="cursor-pointer hover:text-black" />
              <FaXTwitter className="cursor-pointer hover:text-black" />
              <FaPinterestP className="cursor-pointer hover:text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      <div className="max-w-6xl mx-auto px-4 mt-10">
        <h3 className="text-xl sm:text-2xl font-bold mb-6">Leave a Reply</h3>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <textarea
            placeholder="Your Comment"
            rows="5"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
          ></textarea>

          <div className="flex items-start gap-3">
            <input type="checkbox" id="save-info" className="mt-1 w-4 h-4" />
            <label htmlFor="save-info" className="text-sm sm:text-base text-gray-700">
              Save my name, email, and website for the next time I comment.
            </label>
          </div>

          <Button
            variant="custom"
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition text-sm sm:text-base"
          >
            Post Comment
          </Button>
        </form>
      </div>

      <RelatedPosts />
      <BlogFooter />
    </div>
  );
}

export default PostStyleOne;
