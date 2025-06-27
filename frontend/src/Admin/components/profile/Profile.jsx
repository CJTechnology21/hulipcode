import React, { useState } from "react";
import SideBar from "../SideBar";
import Header from "../Header";
import User from "../../images/user.png";
import { FaStar, FaCrown, FaUpload, FaEllipsisH } from "react-icons/fa";

function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Sample portfolio items
  const portfolioItems = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    image:
      "https://dropinblog.net/cdn-cgi/image/fit=scale-down,width=700/34246798/files/featured/Home_Interior__Budget_Friendly_Once_for_Every_Homeowner.png",
    title:
      "Interior Design – Material, Furniture, Lighting and Fixture Selections",
  }));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = portfolioItems.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(portfolioItems.length / itemsPerPage);

  return (
    <div className="flex h-screen overflow-hidden">
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

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Dashboard"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-4 mb-4 border-b border-gray-300">
              <img
                src={User}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold font-fredoka">
                      Steven Smith
                    </h2>
                    <p className="text-sm text-gray-600 font-fredoka">
                      Park Ridge, USA • 10:14 AM local time
                    </p>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium font-fredoka">
                        <FaCrown className="text-[10px] font-fredoka" />
                        100% Job Success
                      </span>
                      <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium font-fredoka">
                        <FaStar className="text-[10px]" />
                        Top Rated
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 sm:items-end">
                    <button className="p-2 rounded-full border text-blue-500 border-blue-500 hover:bg-gray-100">
                      <FaEllipsisH />
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500 font-medium font-fredoka">
                        Top Rated
                      </span>
                      <button className="flex items-center text-sm text-blue-500 px-2 py-1 rounded hover:bg-black hover:text-white transition-colors">
                        <FaUpload className="mr-1 font-fredoka" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main layout */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Stats */}
              <div className="flex flex-col md:w-[320px] space-y-4">
                <div className="flex justify-between gap-4 font-fredoka">
                  {[
                    ["159", "Total Projects"],
                    ["27", "Completed Projects"],
                    ["271", "Total Jobs"],
                  ].map(([value, label], idx) => (
                    <div key={idx} className="text-center min-w-[90px]">
                      <p className="font-semibold font-fredoka">{value}</p>
                      <p className="text-sm text-gray-500 font-fredoka">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
                <hr className="border-gray-300" />

                <div>
                  <p className="text-sm text-gray-500 font-fredoka">
                    Hours per week
                  </p>
                  <p className="font-semibold font-fredoka">
                    As Needed - Open to Offers
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-fredoka">Language</p>
                  <p className="font-semibold font-fredoka">English</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-fredoka">
                    Verifications
                  </p>
                  <p className="font-semibold font-fredoka">ID Verified</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-fredoka">
                    Education
                  </p>
                  <p className="font-semibold font-fredoka">
                    School of Visual Arts
                  </p>
                  <p className="text-sm text-gray-500 font-fredoka">
                    Graphic Design, 2009–2012
                  </p>
                </div>
              </div>

              {/* Separator */}
              <div className="hidden md:block w-px bg-gray-300" />

              {/* Main Content */}
              <div className="flex-1 space-y-6">
                {/* Bio */}
                <div>
                  <h3 className="font-semibold text-lg font-fredoka">
                    Designer
                  </h3>
                  <p className="text-sm text-gray-700 font-fredoka">
                    I have 7 years experience as an interior Designer previously
                    working at both residential and hospitality firms in NYC.
                    I’ve worked on projects small and large from concept mood
                    boards, selecting materials, AutoCAD furniture and layout
                    plans, through purchasing and managing the installation
                    process. I'm efficient, creative, have adaptable style and
                    work within any budget!
                  </p>
                </div>

                {/* Portfolio */}
                <div>
                  <h3 className="font-semibold text-lg font-fredoka">
                    Portfolio
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {paginatedItems.map((item) => (
                      <div key={item.id}>
                        <img
                          src={item.image}
                          alt="Portfolio"
                          className="rounded-lg w-full h-32 object-cover"
                        />
                        <p className="text-sm text-blue-600 mt-2 font-fredoka">
                          {item.title}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-center mt-4">
                    <ul className="inline-flex -space-x-px text-sm">
                      <li>
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          className="px-3 py-1 border rounded-l hover:bg-gray-200"
                        >
                          ‹
                        </button>
                      </li>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <li key={i}>
                          <button
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 border hover:bg-gray-200 ${
                              currentPage === i + 1
                                ? "bg-blue-600 text-white"
                                : ""
                            }`}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          className="px-3 py-1 border rounded-r hover:bg-gray-200"
                        >
                          ›
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div> {/* end main layout */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

// import React, { useState } from "react";
// import SideBar from "../SideBar";
// import Header from "../Header";
// import User from "../../images/user.png";
// import { FaStar, FaCrown, FaUpload, FaEllipsisH } from "react-icons/fa";

// function Profile() {
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

//       {/* Main content */}
//       <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
//         <Header
//           title="Dashboard"
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />

//         <div className="p-4 sm:p-6 overflow-y-auto">
//           <div className="bg-white p-4 sm:p-6 rounded-xl shadow space-y-6">
//             {/* Profile Header */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-4 mb-4 border-b border-gray-300">
//               <img
//                 src={User}
//                 alt="Profile"
//                 className="w-20 h-20 rounded-full object-cover"
//               />
//               <div className="flex-1 w-full">
//                 <div className="flex flex-col sm:flex-row justify-between gap-4">
//                   <div>
//                     <h2 className="text-xl font-semibold font-fredoka">
//                       Steven Smith
//                     </h2>
//                     <p className="text-sm text-gray-600 font-fredoka">
//                       Park Ridge, USA • 10:14 AM local time
//                     </p>
//                     <div className="mt-2 flex gap-2 flex-wrap">
//                       <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium font-fredoka">
//                         <FaCrown className="text-[10px] font-fredoka" />
//                         100% Job Success
//                       </span>
//                       <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium font-fredoka">
//                         <FaStar className="text-[10px]" />
//                         Top Rated
//                       </span>
//                     </div>
//                   </div>
//                   <div className="flex flex-col items-end gap-2 sm:items-end">
//                     <button className="p-2 rounded-full border text-blue-500 border-blue-500 hover:bg-gray-100">
//                       <FaEllipsisH />
//                     </button>
//                     <div className="flex items-center gap-2">
//                       <span className="text-blue-500 font-medium font-fredoka">
//                         Top Rated
//                       </span>
//                       <button className="flex items-center text-sm text-blue-500 px-2 py-1 rounded hover:bg-black hover:text-white transition-colors">
//                         <FaUpload className="mr-1 font-fredoka" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* Main layout */}
//             <div className="flex flex-col md:flex-row gap-6">
//               {/* Stats */}
//               <div className="flex flex-col md:w-[320px] space-y-4">
//                 <div className="flex justify-between gap-4 font-fredoka">
//                   {[
//                     ["159", "Total Projects"],
//                     ["27", "Completed Projects"],
//                     ["271", "Total Jobs"],
//                   ].map(([value, label], idx) => (
//                     <div key={idx} className="text-center min-w-[90px]">
//                       <p className="font-semibold font-fredoka">{value}</p>
//                       <p className="text-sm text-gray-500 font-fredoka">
//                         {label}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//                 <hr className="border-gray-300" />

//                 <div>
//                   <p className="text-sm text-gray-500 font-fredoka">
//                     Hours per week
//                   </p>
//                   <p className="font-semibold font-fredoka">
//                     As Needed - Open to Offers
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 font-fredoka">Language</p>
//                   <p className="font-semibold font-fredoka">English</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 font-fredoka">
//                     Verifications
//                   </p>
//                   <p className="font-semibold font-fredoka">ID Verified</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 font-fredoka">
//                     Education
//                   </p>
//                   <p className="font-semibold font-fredoka">
//                     School of Visual Arts
//                   </p>
//                   <p className="text-sm text-gray-500 font-fredoka">
//                     Graphic Design, 2009–2012
//                   </p>
//                 </div>
//               </div>

//               {/* Separator */}
//               <div className="hidden md:block w-px bg-gray-300" />

//               {/* Main Content */}
//               <div className="flex-1 space-y-6">
//                 {/* Bio */}
//                 <div>
//                   <h3 className="font-semibold text-lg font-fredoka">
//                     Designer
//                   </h3>
//                   <p className="text-sm text-gray-700 font-fredoka">
//                     I have 7 years experience as an interior Designer previously
//                     working at both residential and hospitality firms in NYC.
//                     I’ve worked on projects small and large from concept mood
//                     boards, selecting materials, AutoCAD furniture and layout
//                     plans, through purchasing and managing the installation
//                     process. I'm efficient, creative, have adaptable style and
//                     work within any budget!
//                   </p>
//                 </div>
//                 {/* Portfolio */}
//                 <div>
//                   <h3 className="font-semibold text-lg font-fredoka">
//                     Portfolio
//                   </h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
//                     {Array.from({ length: 4 }).map((_, i) => (
//                       <div key={i}>
//                         <img
//                           src="https://dropinblog.net/cdn-cgi/image/fit=scale-down,width=700/34246798/files/featured/Home_Interior__Budget_Friendly_Once_for_Every_Homeowner.png"
//                           alt="Portfolio"
//                           className="rounded-lg w-full h-32 object-cover"
//                         />
//                         <p className="text-sm text-blue-600 mt-2 font-fredoka">
//                           Interior Design – Material, Furniture, Lighting and
//                           Fixture Selections
//                         </p>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Pagination */}
//                   <div className="flex justify-center mt-4">
//                     <ul className="inline-flex -space-x-px text-sm">
//                       <li>
//                         <button className="px-3 py-1 border rounded-l hover:bg-gray-200">
//                           ‹
//                         </button>
//                       </li>
//                       {[1, 2, 3].map((num) => (
//                         <li key={num}>
//                           <button
//                             className={`px-3 py-1 border hover:bg-gray-200 ${
//                               num === 1 ? "bg-blue-600 text-white" : ""
//                             }`}
//                           >
//                             {num}
//                           </button>
//                         </li>
//                       ))}
//                       <li>
//                         <button className="px-3 py-1 border rounded-r hover:bg-gray-200">
//                           ›
//                         </button>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>{" "}
//             {/* end main layout */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;
