import React, { useState } from "react";
import SideBar from "../SideBar";
import Header from "../Header";

const VendorManagementForm = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    firmName: "",
    contractorName: "",
    contractorPhone: "",
    firmEmail: "",
    firmAddress: "",
    firmGST: "",
    firmPincode: "",
    gstFile: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "gstFile" ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

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
          title="Vendor Management"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-7xl mx-auto border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700 mb-8">
              Vendor Management
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Section 1 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Firm Name
                  </label>
                  <input
                    name="firmName"
                    value={formData.firmName}
                    onChange={handleChange}
                    placeholder="Enter name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Firm Email ID
                  </label>
                  <input
                    name="firmEmail"
                    value={formData.firmEmail}
                    onChange={handleChange}
                    placeholder="Enter email"
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Firm Pincode
                  </label>
                  <input
                    name="firmPincode"
                    value={formData.firmPincode}
                    onChange={handleChange}
                    placeholder="Enter pincode"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Section 2 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contractor Name
                  </label>
                  <input
                    name="contractorName"
                    value={formData.contractorName}
                    onChange={handleChange}
                    placeholder="Enter name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Firm Address
                  </label>
                  <input
                    name="firmAddress"
                    value={formData.firmAddress}
                    onChange={handleChange}
                    placeholder="Enter address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GST File Copy
                  </label>
                  <input
                    type="file"
                    name="gstFile"
                    onChange={handleChange}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contractor Phone
                  </label>
                  <input
                    name="contractorPhone"
                    value={formData.contractorPhone}
                    onChange={handleChange}
                    placeholder="Enter number"
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Firm GST Number
                  </label>
                  <input
                    name="firmGST"
                    value={formData.firmGST}
                    onChange={handleChange}
                    placeholder="Enter GST number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Submit button */}
              <div className="col-span-1 md:col-span-3 flex justify-start pt-6">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all shadow-sm"
                >
                  ADD
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorManagementForm;

// import React, { useState } from "react";
// import SideBar from "../SideBar";
// import Header from "../Header";

// const VendorManagementForm = () => {
//   const [formData, setFormData] = useState({
//     firmName: "",
//     contractorName: "",
//     contractorPhone: "",
//     firmEmail: "",
//     firmAddress: "",
//     firmGST: "",
//     firmPincode: "",
//     gstFile: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "gstFile") {
//       setFormData({ ...formData, gstFile: files[0] });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);
//     // Add form validation or API calls here
//   };

//   return (
//     <div className="flex bg-white min-h-screen overflow-hidden">
//       <SideBar />
//       <div className="flex-1 ml-64 bg-gray-100 flex flex-col">
//         <Header />

//         <div className="p-6 flex-1 overflow-y-auto">
//           <div className="bg-white rounded-xl shadow p-6 max-w-6xl mx-auto">
//             <h2 className="text-xl font-semibold mb-6">Vendor Management</h2>

//             <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
//               {/* Section 1 */}
//               <div className="col-span-1 flex flex-col gap-4">
//                 <div>
//                   <label className="block text-sm font-medium">Firm name</label>
//                   <input
//                     name="firmName"
//                     value={formData.firmName}
//                     onChange={handleChange}
//                     placeholder="Enter name"
//                     className="border rounded px-3 py-2 w-full text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium">Firm email id</label>
//                   <input
//                     name="firmEmail"
//                     value={formData.firmEmail}
//                     onChange={handleChange}
//                     placeholder="Enter email"
//                     className="border rounded px-3 py-2 w-full text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium">Firm pincode</label>
//                   <input
//                     name="firmPincode"
//                     value={formData.firmPincode}
//                     onChange={handleChange}
//                     placeholder="Enter pincode"
//                     className="border rounded px-3 py-2 w-full text-sm"
//                   />
//                 </div>
//               </div>

//               {/* Section 2 */}
//               <div className="col-span-1 flex flex-col gap-4">
//                 <div>
//                   <label className="block text-sm font-medium">Contractor name</label>
//                   <input
//                     name="contractorName"
//                     value={formData.contractorName}
//                     onChange={handleChange}
//                     placeholder="Enter name"
//                     className="border rounded px-3 py-2 w-full text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium">Firm address</label>
//                   <input
//                     name="firmAddress"
//                     value={formData.firmAddress}
//                     onChange={handleChange}
//                     placeholder="Enter address"
//                     className="border rounded px-3 py-2 w-full text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium">GST File copy</label>
//                   <input
//                     type="file"
//                     name="gstFile"
//                     onChange={handleChange}
//                     className="border rounded px-3 py-2 w-full text-sm"
//                   />
//                 </div>
//               </div>

//               {/* Section 3 */}
//               <div className="col-span-1 flex flex-col gap-4">
//                 <div>
//                   <label className="block text-sm font-medium">Contractor phone</label>
//                   <input
//                     name="contractorPhone"
//                     value={formData.contractorPhone}
//                     onChange={handleChange}
//                     placeholder="Enter number"
//                     className="border rounded px-3 py-2 w-full text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium">Firm GST number</label>
//                   <input
//                     name="firmGST"
//                     value={formData.firmGST}
//                     onChange={handleChange}
//                     placeholder="Enter GST number"
//                     className="border rounded px-3 py-2 w-full text-sm"
//                   />
//                 </div>
//               </div>

//               {/* Submit button across full width */}
//               <div className="col-span-3 mt-4">
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//                 >
//                   ADD
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VendorManagementForm;
