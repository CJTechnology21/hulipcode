
import { FaTrophy, FaShieldAlt, FaTruck, FaHeadset } from "react-icons/fa";

export default function FeatureBanner() {
  return (
    <section className="bg-[#f1f5ff] py-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-gray-800">
        
        {/* Item 1 */}
        <div className="flex flex-col items-center gap-2">
          <FaTrophy className="text-2xl" />
          <h4 className="font-semibold">High Quality</h4>
          <p className="text-xs text-gray-600">crafted from top materials</p>
        </div>

        {/* Item 2 */}
        <div className="flex flex-col items-center gap-2">
          <FaShieldAlt className="text-2xl" />
          <h4 className="font-semibold">Warranty Protection</h4>
          <p className="text-xs text-gray-600">Over 2 years</p>
        </div>

        {/* Item 3 */}
        <div className="flex flex-col items-center gap-2">
          <FaTruck className="text-2xl" />
          <h4 className="font-semibold">Free Shipping</h4>
          <p className="text-xs text-gray-600">Order over 100 $</p>
        </div>

        {/* Item 4 */}
        <div className="flex flex-col items-center gap-2">
          <FaHeadset className="text-2xl" />
          <h4 className="font-semibold">24 / 7 Support</h4>
          <p className="text-xs text-gray-600">Dedicated support</p>
        </div>

      </div>
    </section>
  );
}
// import React from 'react'

// function FeatureBanner() {
//   return (
//     <div>FeatureBanner</div>
//   )
// }

// export default FeatureBanner