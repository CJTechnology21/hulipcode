import React from "react";
import { FaFacebookF, FaPinterestP, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoPaperPlane } from "react-icons/io5";

function BlogFooter() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid gap-8 md:grid-cols-4">
        
        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-bold">DROZY</h2>
          <p className="mt-4 text-gray-600 text-sm leading-relaxed">
            Welcome to your go-to destination for insightful news! Discover carefully 
            selected articles that inform, inspire.
          </p>
          <div className="flex space-x-4 mt-5 text-xl text-gray-700">
            <a href="#" className="hover:text-black"><FaFacebookF /></a>
            <a href="#" className="hover:text-black"><FaXTwitter /></a>
            <a href="#" className="hover:text-black"><FaPinterestP /></a>
            <a href="#" className="hover:text-black"><FaInstagram /></a>
          </div>
        </div>

        {/* Quick Link */}
        <div>
          <h3 className="font-semibold mb-4">Quick Link</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-black">Homepage</a></li>
            <li><a href="#" className="hover:text-black">About Us</a></li>
            <li><a href="#" className="hover:text-black">Contact Us</a></li>
            <li><a href="#" className="hover:text-black">Our Store</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-4">Categories</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-black">Life Style</a></li>
            <li><a href="#" className="hover:text-black">Home Decor</a></li>
            <li><a href="#" className="hover:text-black">Fashion</a></li>
            <li><a href="#" className="hover:text-black">Mindfulness</a></li>
            <li><a href="#" className="hover:text-black">Food</a></li>
          </ul>
        </div>

        {/* Subscribe */}
        <div>
          <h3 className="font-semibold mb-4">Subscribe for all the top news!</h3>
          <form className="flex items-center bg-gray-100 rounded-full overflow-hidden mb-3">
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
              By clicking the Subscribe button, you acknowledge that you have read 
              and agree to our{" "}
              <a href="#" className="font-semibold underline">Privacy Policy</a> and{" "}
              <a href="#" className="font-semibold underline">Terms Of Use</a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between text-xs text-gray-500 space-y-2 md:space-y-0">
          <p>Copyright © 2025 drozy By Themesflat All rights reserved</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-black">Terms Of Services</a>
            <a href="#" className="hover:text-black">Privacy Policy</a>
            <a href="#" className="hover:text-black">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default BlogFooter;

