import React, { useState } from "react";
import SideBar from "../SideBar";
import Header from "../Header";
import User from "../../images/user.png";
import { FaCrown, FaStar } from "react-icons/fa";

function PersonalProfile() {
   const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    projects: "",
    expense: "",
    description: "",
    keywords: "English",
    language: "",
    badge: "",
    teamName: "",
    teamLocation: "",
    qualification: "",
    photo: null,
  });

 

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }


  
  };


  const handleSubmit = (e) => {
    e.preventDefault();
   
    const output = {
      ...formData,
      photo: formData.photo ? formData.photo.name : "No file selected",
    };

    console.log("Form Submitted:", output);
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
          title="Dashboard"
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="p-6 overflow-y-auto">
          <div className="bg-white p-6 rounded-xl shadow space-y-6">
            {/* Profile Header */}
            <div className="flex items-start gap-6 pb-4 border-b">
              <img
                src={User}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold font-fredoka">Steven Smith</h2>
                <p className="text-sm text-gray-600 font-fredoka">
                  Park Ridge, USA • 10:14 AM local time
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium font-fredoka">
                    <FaCrown className="text-[10px] font-fredoka" />
                    100% Job Success
                  </span>
                  <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium font-fredoka">
                    <FaStar className="text-[10px] font-fredoka" />
                    Top Rated
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1 font-fredoka">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Enter name"
                    required
                  />
               
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-1 font-fredoka">Location</label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Search city, state"
                    required
                  />
                  
                </div>

                {/* Projects */}
                <div>
                  <label className="block text-sm font-medium mb-1 font-fredoka">Number of Project</label>
                  <input
                    name="projects"
                    value={formData.projects}
                    onChange={handleChange}
                    type="number"
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Enter number"
                    required
                  />
                
                </div>

                {/* Expense */}
                <div>
                  <label className="block text-sm font-medium mb-1 font-fredoka">Working Expense</label>
                  <input
                    name="expense"
                    value={formData.expense}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Enter working expense"
                    required
                  />
                 
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1 font-fredoka">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Write here"
                    required
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-medium mb-1 font-fredoka">Keywords</label>
                  <input
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                    placeholder="Enter Keywords"
                  />
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium mb-1 font-fredoka">Language</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  >
                    <option value="">Select language</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                 
                </div>

                {/* Badge */}
                <div>
                  <label className="block text-sm font-medium mb-1 font-fredoka">Verification Badge</label>
                  <input
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Badge"
                    required
                  />
                </div>
              </div>

              {/* Team Member */}
              <div className="mt-4">
                <h3 className="text-md font-semibold mb-2 font-fredoka">Team Member</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Team Name */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Enter name"
                      required
                    />
                  
                  </div>

                  {/* Team Location */}
                  <div>
                    <label className="block text-sm font-medium mb-1 font-fredoka">Location</label>
                    <input
                      name="teamLocation"
                      value={formData.teamLocation}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Search city, state"
                      required
                    />
                  </div>

                  {/* Qualification */}
                  <div>
                    <label className="block text-sm font-medium mb-1 font-fredoka">Qualification</label>
                    <select
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    >
                      <option value="">Select Qualification</option>
                      <option value="Bachelor">Bachelor</option>
                      <option value="Masters">Masters</option>
                      <option value="PhD">PhD</option>
                    </select>
                    
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1 font-fredoka">Photo</label>
                  <div className="flex items-center justify-between border px-3 py-6 rounded">
                    <span className="text-gray-400">
                      {formData.photo ? formData.photo.name : "Image"}
                    </span>
                    <input
                      type="file"
                      name="photo"
                      onChange={handleChange}
                      className="hidden"
                      id="upload"
                      required
                    />
                    <label
                      htmlFor="upload"
                      className="bg-gradient-to-r from-gray-300 to-gray-400 text-white px-4 py-2 rounded cursor-pointer font-fredoka"
                    >
                      Browse File
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-fredoka"
              >
                SUBMIT
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalProfile;
