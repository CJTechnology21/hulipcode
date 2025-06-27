
import React from "react";

function Charges() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4"></div>
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold font-fredoka text-gray-700">
              Designing Charge/Sqft
            </label>
            <input type="text" placeholder="Enter amount" className="input" />
          </div>
          <div>
            <label className="block text-sm font-semibold font-fredoka text-gray-700">
              Turnkey Charge/Sqft
            </label>
            <input
              type="text"
              placeholder="Enter amount"
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold font-fredoka text-gray-700">
              Civil Project Charge/Sqft
            </label>
            <input type="text" placeholder="Enter amount" className="input" />
          </div>
          <div>
            <label className="block text-sm font-semibold font-fredoka text-gray-700">
              Interior Project Charge/ sqft
            </label>
            <input
              type="text"
              placeholder="Enter amount"
              className="input"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold font-fredoka"
          >
            SUBMIT
          </button>
        </div>
      </form>
    </>
  );
}

export default Charges;
// import React from "react";

// function Charges() {
//   return (
//     <>
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center space-x-4"></div>
//       </div>

//       <form className="space-y-4">
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-semibold font-fredoka text-gray-700">
//               Designing Charge/Sqft
//             </label>
//             <input type="text" placeholder="Enter name" className="input" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Tunkey charge/ Sqft
//             </label>
//             <input
//               type="text"
//               placeholder="Search city, state"
//               className="input"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//             Civil Project charger/sqft
//             </label>
//             <input type="text" placeholder="Enter number" className="input" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Interior Project charge
//             </label>
//             <input
//               type="text"
//               placeholder="Enter working expense"
//               className="input"
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 "
//         >
//           SUBMIT
//         </button>
//       </form>
//     </>
//   );
// }

// export default Charges;
