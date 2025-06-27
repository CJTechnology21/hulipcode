import { useState } from "react";
import Header from "./Header";
import SideBar from "./SideBar";

const plans = [
  {
    title: "Essential",
    price: "$99",
    period: "/monthly",
    features: [
      "2-3 BHK layer: 1.5 - 15 lakh (5%)",
      "3-4 BHK layer: 20-40 lakh (5%)",
      "Flat 41+: 20-40 lakh (5%)",
      "Designation charges: 50k - 1.5 lakh (10%)",
    ],
  },
  {
    title: "Elegance",
    price: "$99",
    period: "/monthly",
    features: [
      "2-3 BHK layer: 15 - 35 lakh (5%)",
      "3-4 BHK layer: 20-45 lakh (5%)",
      "Flat 41+: 40-60 lakh (5%)",
      "Designation charges: 50k - 1.5 lakh (10%)",
    ],
  },
  {
    title: "Luxury",
    price: "$99",
    period: "/monthly",
    features: [
      "2-3 BHK layer: 15 lakh - 1 crore (5%)",
      "3-4 BHK layer: 15 lakh - 1 crore (5%)",
      "Flat 41+: 15 lakh - 1 crore (5%)",
      "Designation charges: 5 lakh - 15 lakh (10%)",
    ],
  },
  {
    title: "Free",
    price: "$0",
    period: "/monthly",
    features: [
      "No Platform Leads",
      "CRM to manage own platform leads",
      "Can upload only 2 projects in portfolio",
      "Only 1 user",
    ],
  },
  {
    title: "Paid",
    price: "$699",
    period: "/monthly  $599/year",
    features: [
      "Huge In Leads",
      "CRM to manage own platform leads",
      "Can upload unlimited projects in portfolio",
      "Unlimited user",
      "Get money if you close a deal in a year",
    ],
  },
];

function Subscription() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden font-fredoka">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:block`}
      >
        <SideBar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Subscription"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Cards Grid */}
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className="bg-[#f6f8f9] rounded-xl border border-gray-300 shadow-sm p-6 flex flex-col justify-between h-full"
              >
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {plan.title}
                  </h3>
                  <div className="flex items-end mt-1 space-x-1">
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-sm text-gray-500">{plan.period}</span>
                  </div>
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded w-full mb-4">
                  Choose Your Plan →
                </button>

                <div className="bg-[rgba(78,47,218,0.06)] border border-gray-200 rounded-md p-4 text-sm">
                  <p className="font-semibold mb-2 text-gray-700">
                    Service Include:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {plan.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscription;
// import { useState } from "react";
// import Header from "./Header";
// import SideBar from "./SideBar";

// function Subscription() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:relative md:block`}
//       >
//         <SideBar />
//       </div>

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main Content */}
//       <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
//         <Header
//           title="Subscription"
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />
//       </div>
//     </div>
//   );
// }

// export default Subscription;
