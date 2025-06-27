import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white font-[Poppins] px-6 lg:px-20 pt-10 pb-5 border-t border-gray-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Logo and Address */}
        <div>
          <h2 className="text-xl font-bold mb-4">Logo</h2>
          <p className="text-sm text-gray-500 leading-6">
            400 University Drive Suite 200 Coral Gables,<br />
            FL 33134 USA
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-gray-400 text-sm font-medium mb-4">Links</h3>
          <ul className="space-y-3 text-sm">
            <li className="hover:underline cursor-pointer">Home</li>
            <li className="hover:underline cursor-pointer">Shop</li>
            <li className="hover:underline cursor-pointer">About</li>
            <li className="hover:underline cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-gray-400 text-sm font-medium mb-4">Help</h3>
          <ul className="space-y-3 text-sm">
            <li className="hover:underline cursor-pointer">Payment Options</li>
            <li className="hover:underline cursor-pointer">Returns</li>
            <li className="hover:underline cursor-pointer">Privacy Policies</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-gray-400 text-sm font-medium mb-4">Newsletter</h3>
          <div className="flex items-center border-b border-black">
            <input
              type="email"
              placeholder="Enter Your Email Address"
              className="outline-none flex-1 text-sm py-2 placeholder:text-gray-400 bg-transparent"
            />
            <button className="text-sm font-semibold hover:underline">SUBSCRIBE</button>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-10 text-center text-sm text-gray-600">
        <hr className="my-6" />
        <p>2025 company name All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
