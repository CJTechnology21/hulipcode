import React, { useEffect, useState } from "react";
import Header from "../Header";
import SideBar from "../SideBar";
import { useLocation } from "react-router-dom";

function ProjectForm() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const { id } = useParams();
  const location = useLocation();
  // If navigating with state (like from a list), set form data
useEffect(() => {
  if (location.state?.project) {
    setFormData({
      ...location.state.project,
      images: [], // optional: load existing image URLs here
    });
  }
}, [location.state]);

  const [formData, setFormData] = useState({
    projectName: "",
    projectType: "",
    projectDescription: "",
    budget: "",
    location: "",
    buildingYear: "",
    projectDuration: "",
    projectsize: "",
    credit: "",
    images: [], // Allow multiple image uploads
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      setFormData((prev) => ({
        ...prev,
        images: Array.from(files),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
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

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
        <Header
          title="Project"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="p-6 flex-1 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow p-6">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Project Name */}
              <div>
                <label className="text-sm font-medium">Project Name</label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="text-sm font-medium">Project Type</label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="house">House</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              {/* Project Description */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter project description"
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>

              {/* Budget */}
              <div>
                <label className="text-sm font-medium">Budget</label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Enter budget"
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-medium">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Search city, state"
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>

              {/* Building Year */}
              <div>
                <label className="text-sm font-medium">Building Year</label>
                <select
                  name="buildingYear"
                  value={formData.buildingYear}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                >
                  <option value="">Select Year</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>
              </div>

              {/* Project Duration */}
              <div>
                <label className="text-sm font-medium">Project Duration</label>
                <input
                  type="text"
                  name="projectDuration"
                  value={formData.projectDuration}
                  onChange={handleChange}
                  placeholder="e.g. 6m"
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>

              {/* Project Size */}
              <div>
                <label className="text-sm font-medium">Project Size</label>
                <input
                  type="text"
                  name="projectsize"
                  value={formData.projectsize}
                  onChange={handleChange}
                  placeholder="Enter size"
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>

              {/* Credits */}
              <div>
                <label className="text-sm font-medium">Credits</label>
                <input
                  type="text"
                  name="credit"
                  value={formData.credit}
                  onChange={handleChange}
                  placeholder="Enter credits"
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Upload Images</label>
                <input
                  type="file"
                  name="images"
                  multiple
                  onChange={handleChange}
                  className="w-full mt-1 border rounded px-3 py-2"
                  required
                />

                {/* Preview */}
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`preview-${index}`}
                        className="h-32 w-full object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectForm;

// import React, { useState } from "react";
// import Header from "../Header";
// import SideBar from "../SideBar";

// function ProjectForm() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [formData, setFormData] = useState({
//   projectName: "",
//   projectType: "",
//   projectDescription: "",
//   budget: "",
//   location: "",
//   buildingYear: "",
//   projectDuration: "",
//   projectsize: "",
//   credit: "",
//   images: [], // <-- multiple images
// });

//   // const [formData, setFormData] = useState({
//   //   projectName: "",
//   //   projectType: "",
//   //   location: "",
//   //   buildingYear: "",
//   //   fromDate: "",
//   //   toDate: "",
//   //   projectSize: "",
//   //   photoCredit: "",
//   //   image: null,
//   // });
// const handleChange = (e) => {
//   const { name, value, files } = e.target;

//   if (name === "images") {
//     setFormData((prev) => ({
//       ...prev,
//       images: Array.from(files),
//     }));
//   } else {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   }
// };

//   // const handleChange = (e) => {
//   //   const { name, value, files } = e.target;
//   //   setFormData((prev) => ({
//   //     ...prev,
//   //     [name]: files ? files[0] : value,
//   //   }));
//   // };

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

//       {/* Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main content */}
//       <div className="flex flex-col flex-1 overflow-y-auto bg-gray-100">
//         <Header
//           title="Project"
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />

//         <div className="p-6 flex-1 flex flex-col gap-4">
//           <div className="bg-white rounded-xl shadow p-6">
//             <form
//               onSubmit={handleSubmit}
//               className="grid grid-cols-1 md:grid-cols-2 gap-6"
//             >
//               {/* Project Name */}
//               <div>
//                 <label className="text-sm font-medium">Project Name</label>
//                 <input
//                   type="text"
//                   name="projectName"
//                   value={formData.projectName}
//                   onChange={handleChange}
//                   placeholder="Enter project name"
//                   className="w-full border rounded px-3 py-2 mt-1"
//                 />
//               </div>

//               {/* Project Type */}
//               <div>
//                 <label className="text-sm font-medium">Project Type</label>
//                 <select
//                   name="projectType"
//                   value={formData.projectType}
//                   onChange={handleChange}
//                   className="w-full border rounded px-3 py-2 mt-1"
//                 >
//                   <option value="">Select project</option>
//                   <option value="residential">Residential</option>
//                   <option value="commercial">Commercial</option>
//                 </select>
//               </div>

//               {/* Location */}
//               <div>
//                 <label className="text-sm font-medium">Location</label>
//                 <input
//                   type="text"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleChange}
//                   placeholder="Search city, state"
//                   className="w-full border rounded px-3 py-2 mt-1"
//                 />
//               </div>

//               {/* Building Year */}
//               <div>
//                 <label className="text-sm font-medium">Building Year</label>
//                 <select
//                   type="text"
//                   name="buildingYear"
//                   value={formData.buildingYear}
//                   onChange={handleChange}
//                   placeholder="Select year"
//                   className="w-full border rounded px-3 py-2 mt-1"
//                 >
//                   <option value="">Select Building Year</option>
//                   <option value="residential">2024</option>
//                   <option value="commercial">2025</option>
//                 </select>
//               </div>

//               {/* Project Duration */}
//               {/* Project Duration */}
//               <div>
//                 <label className="text-sm font-medium">Project Duration</label>
//                 <div className="flex flex-col md:flex-row gap-2 mt-1">
//                   <input
//                     type="date"
//                     name="fromDate"
//                     value={formData.fromDate}
//                     onChange={handleChange}
//                     required
//                     className="w-full border rounded px-3 py-2"
//                   />
//                   <input
//                     type="date"
//                     name="toDate"
//                     value={formData.toDate}
//                     onChange={handleChange}
//                     required
//                     className="w-full border rounded px-3 py-2"
//                   />
//                 </div>
//               </div>

//               {/* Project Size */}
//               <div>
//                 <label className="text-sm font-medium">Project Size</label>
//                 <input
//                   type="text"
//                   name="projectSize"
//                   value={formData.projectSize}
//                   onChange={handleChange}
//                   placeholder="Enter size"
//                   className="w-full border rounded px-3 py-2 mt-1"
//                 />
//               </div>

//               {/* Photography Credits */}
//               <div>
//                 <label className="text-sm font-medium">
//                   Photography Credits
//                 </label>
//                 <select
//                   name="photoCredit"
//                   value={formData.photoCredit}
//                   onChange={handleChange}
//                   className="w-full border rounded px-3 py-2 mt-1"
//                 >
//                   <option value="">Select</option>
//                   <option value="credit1">Photographer A</option>
//                   <option value="credit2">Photographer B</option>
//                 </select>
//               </div>

//               {/* Image Upload */}
//               <div className="col-span-1 md:col-span-2">
//                 <label className="text-sm font-medium">Upload Image</label>
//                 <input
//                   type="file"
//                   name="image"
//                   onChange={handleChange}
//                   className="w-full mt-1 border rounded px-3 py-2"
//                 />
//               </div>

//               {/* Submit Button */}
//               <div className="col-span-1 md:col-span-2">
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProjectForm;
