
import React, { useState } from "react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";

function LeadForm() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    projectName: "",
    address: "",
    floor: "",
    ceilingHeight: "",
    city: "",
    area: "",
    type: "",
    budget: "",
    category: "",
    carpetArea: "",
    totalSpaces: "",
    secondClientName: "",
    secondClientPhone: "",
    secondClientEmail: "",
    status: "",
    source: "",
    assignedTo: "",
    logs: [
      {
        date: "25-04-2025 4:45pm",
        update: "Client ghoomne gya",
        updatedBy: "Pradeep",
      },
      {
        date: "21-04-2025 5:45pm",
        update: "Kal batayega",
        updatedBy: "Ravi",
      },
      {
        date: "30-03-2025 2:05pm",
        update: "Client not responding",
        updatedBy: "Pradeep",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-20 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
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
          title="Lead Detail"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="p-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow p-6 space-y-6"
          >
            {/* Client Detail */}
            <h2 className="text-lg font-bold">Client Detail</h2>
            <div className="grid grid-cols-3 gap-4">
              <input
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Name"
                className="border rounded px-3 py-2"
              />
              <input
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="border rounded px-3 py-2"
              />
              <input
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                placeholder="Email ID"
                className="border rounded px-3 py-2"
              />
            </div>

            {/* Project Detail */}
            <h2 className="text-lg font-bold">Project Detail</h2>
            <div className="grid grid-cols-3 gap-4">
              <input
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="Project Name"
                className="border rounded px-3 py-2"
              />
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="border rounded px-3 py-2"
              />
              <input
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                placeholder="Floor"
                className="border rounded px-3 py-2"
              />
              <input
                name="ceilingHeight"
                value={formData.ceilingHeight}
                onChange={handleChange}
                placeholder="Ceiling Height"
                className="border rounded px-3 py-2"
              />
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="border rounded px-3 py-2"
              />
              <input
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="Area"
                className="border rounded px-3 py-2"
              />
              <input
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Type"
                className="border rounded px-3 py-2"
              />
              <input
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Budget"
                className="border rounded px-3 py-2"
              />
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                className="border rounded px-3 py-2"
              />
              <input
                name="carpetArea"
                value={formData.carpetArea}
                onChange={handleChange}
                placeholder="Carpet Area"
                className="border rounded px-3 py-2"
              />
              <input
                name="totalSpaces"
                value={formData.totalSpaces}
                onChange={handleChange}
                placeholder="Total No of Spaces"
                className="border rounded px-3 py-2"
              />
            </div>

            {/* Client Detail Again */}
            <h2 className="text-lg font-bold">Client Detail</h2>
            <div className="grid grid-cols-3 gap-4">
              <input
                name="secondClientName"
                value={formData.secondClientName}
                onChange={handleChange}
                placeholder="Name"
                className="border rounded px-3 py-2"
              />
              <input
                name="secondClientPhone"
                value={formData.secondClientPhone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="border rounded px-3 py-2"
              />
              <input
                name="secondClientEmail"
                value={formData.secondClientEmail}
                onChange={handleChange}
                placeholder="Email ID"
                className="border rounded px-3 py-2"
              />
            </div>

            {/* Additional Detail */}
            <h2 className="text-lg font-bold">Additional Detail</h2>
            <div className="grid grid-cols-3 gap-4">
              <input
                name="status"
                value={formData.status}
                onChange={handleChange}
                placeholder="Status"
                className="border rounded px-3 py-2"
              />
              <input
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="Source"
                className="border rounded px-3 py-2"
              />
              <input
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="Assigned To"
                className="border rounded px-3 py-2"
              />
            </div>

            {/* Logs */}
            <h2 className="text-lg font-bold">Logs</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead className="bg-gray-200 text-sm">
                  <tr>
                    <th className="border px-4 py-2">Date & Time</th>
                    <th className="border px-4 py-2">Update</th>
                    <th className="border px-4 py-2">Updated by</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.logs.map((log, index) => (
                    <tr key={index} className="text-sm">
                      <td className="border px-4 py-2">{log.date}</td>
                      <td className="border px-4 py-2">{log.update}</td>
                      <td className="border px-4 py-2">{log.updatedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LeadForm;
// import React, { useState } from "react";
// import SideBar from "../../components/SideBar";
// import Header from "../../components/Header";

// function LeadForm() {
//    const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     clientName: "",
//     location: "",
//     projectDetails: "",
//     quote: "",
//     workScope: "",
//     image: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "image") {
//       setFormData({ ...formData, image: files[0] });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(formData);
//   };

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
//           title="Lead Management"
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />
//         <div className="p-6 flex-1 flex flex-col gap-4">
//           <div className="bg-white rounded-xl shadow p-6">
//             <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
//               {/* Row 1 */}
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium mb-1">Client name</label>
//                 <input
//                   type="text"
//                   name="clientName"
//                   placeholder="Enter name"
//                   value={formData.clientName}
//                   onChange={handleChange}
//                   className="border rounded px-3 py-2"
//                   required
//                 />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium mb-1">Location</label>
//                 <input
//                   type="text"
//                   name="location"
//                   placeholder="Enter city, state"
//                   value={formData.location}
//                   onChange={handleChange}
//                   className="border rounded px-3 py-2"
//                   required
//                 />
//               </div>

//               {/* Row 2 */}
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium mb-1">Client Project Details</label>
//                 <input
//                   type="text"
//                   name="projectDetails"
//                   placeholder="Enter Details"
//                   value={formData.projectDetails}
//                   onChange={handleChange}
//                   className="border rounded px-3 py-2"
//                   required
//                 />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium mb-1">Quote</label>
//                 <select
//                   name="quote"
//                   value={formData.quote}
//                   onChange={handleChange}
//                   className="border rounded px-3 py-2"
//                   required
//                 >
//                   <option value="">Select Team member</option>
//                   <option value="john">John</option>
//                   <option value="sara">Sara</option>
//                 </select>
//               </div>

//               {/* Row 3 - Scope Of Work (single full-width row) */}
//               <div className="col-span-2 flex flex-col">
//                 <label className="text-sm font-medium mb-1">Scope Of Work</label>
//                 <select
//                   name="workScope"
//                   value={formData.workScope}
//                   onChange={handleChange}
//                   className="border rounded px-3 py-2"
//                   required
//                 >
//                   <option value="">Select Area</option>
//                   <option value="kitchen">Kitchen</option>
//                   <option value="bedroom">Bedroom</option>
//                 </select>
//               </div>

//               {/* Row 4 - Image upload (larger row) */}
//               <div className="col-span-2 flex flex-col">
//                 <label className="text-sm font-medium mb-1">Image</label>
//                 <div className="relative border rounded px-3 py-10 bg-gray-50">
//                   <span className="text-sm text-gray-500 absolute top-3 left-3">Upload Image</span>
//                   <input
//                     type="file"
//                     name="image"
//                     onChange={handleChange}
//                     className="absolute right-3 top-3 text-sm file:mr-2 file:py-1 file:px-4 file:rounded-full file:border-0 file:bg-gradient-to-b file:from-gray-300 file:to-gray-100 file:text-gray-800"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <div className="col-span-2">
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
// }

// export default LeadForm;
