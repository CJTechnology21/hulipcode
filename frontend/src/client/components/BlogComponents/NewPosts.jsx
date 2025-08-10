import React from "react";

const posts = [
  {
    date: "May 30, 2025",
    author: "Emma Carson",
    title: "10 Simple Habits to Build a More Joyful Life",
    image: "https://thermohouse.ie/wp-content/uploads/2019/04/hero-image.jpg",
  },
  {
    date: "June 10, 2025",
    author: "Emma Carson",
    title: "Avoiding Productivity Loss When Working From Home",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK7a0TCmJr37H6HlkUSLUWzFOWaKimDou_Lg&s",
  },
  {
    date: "May 30, 2025",
    author: "Emma Carson",
    title: "Centered and Strong: Survive the Overload of Modern Life",
    image:
      "https://www.redfin.com/blog/wp-content/uploads/2020/07/3738-Mound-View-Ave-Studio-City-CA-6-4.jpg",
  },
  {
    date: "May 30, 2025",
    author: "Emma Carson",
    title: "Finding Focus World: How to Stay Centered",
    image:
      "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG91c2UlMjBidWlsZGluZ3xlbnwwfHwwfHx8MA%3D%3D",
  },
];

function NewPosts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 m-2">
      {posts.map((post, index) => (
        <div
          key={index}
          className={`flex items-start gap-4 lg:border-r lg:pr-4 ${
            index === posts.length - 1 ? "border-none" : ""
          }`}
        >
          {/* Image */}
          <img
            src={post.image}
            alt={post.title}
            className="w-20 h-20 rounded object-cover flex-shrink-0"
          />

          {/* Content */}
          <div>
            <p className="text-xs uppercase text-gray-500 font-semibold">
              {post.date} <span className="mx-1">/</span> {post.author}
            </p>
            <h3 className="font-semibold text-black text-sm mt-1 line-clamp-2 cursor-pointer hover:underline">
              {post.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NewPosts;
