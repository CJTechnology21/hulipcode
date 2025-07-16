import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaApple,
  FaAndroid,

} from "react-icons/fa";

function HomeFooter() {
  return (
    <div>
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6 flex flex-col md:flex-row bg-[#0b1c38] text-white rounded-xl overflow-hidden mb-10">
        <div className="w-full">
          {/* Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <h4 className="font-semibold text-sm mb-2">For Clients</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  {Array.from({ length: 7 }).map((__, j) => (
                    <li key={j} className="hover:text-white cursor-pointer">
                      Lorem Ipsum
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social & App Icons */}
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-600 pt-4 gap-4 font-montreal">
            {/* Social Icons */}
            <div className="flex items-center gap-2 text-xs">
              <span>Follow Us</span>
              <div className="flex gap-2 text-white">
                <IconWrapper icon={<FaFacebookF />} />
                <IconWrapper icon={<FaLinkedinIn />} />
                <IconWrapper icon={<FaTwitter />} />
                <IconWrapper icon={<FaInstagram />} />
                <IconWrapper icon={<FaYoutube />} />
              </div>
            </div>

            {/* Mobile Apps */}
            <div className="flex items-center gap-2 text-xs">
              <span>Mobile Apps</span>
              <IconWrapper icon={<FaApple />} />
              <IconWrapper icon={<FaAndroid />} />
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 mt-4">
            <p className="text-center sm:text-left">
              © 2025{" "}
              <span className="font-semibold text-white">Lorem Ipsum</span> ®
              All Right Reserved.
            </p>
            <div className="flex gap-4 mt-2 sm:mt-0">
              <a href="/lorem" className="hover:text-white">
                Terms of Service
              </a>
              <a href="/lorem" className="hover:text-white">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function IconWrapper({ icon }) {
  return (
    <button className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-800 hover:bg-white hover:text-black transition">
      {icon}
    </button>
  );
}

export default HomeFooter;
